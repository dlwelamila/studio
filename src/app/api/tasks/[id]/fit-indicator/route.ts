
// /src/app/api/tasks/[id]/fit-indicator/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, GeoPoint } from 'firebase/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeAdminApp } from '@/firebase/admin';
import type { Task, Helper } from '@/lib/data';
import { initializeFirebase } from '@/firebase';

// Initialize Firebase Admin SDK for server-side auth
initializeAdminApp();
// Initialize Firebase client SDK to use Firestore on the server
const { firestore: db } = initializeFirebase();

type FitLevel = 'High' | 'Medium' | 'Low' | 'Unknown';

/**
 * Calculates the Haversine distance between two points on the earth.
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers.
 */
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}


// A3: Fit Algorithms
const getSkillFit = (task: Task, helper: Helper) => {
  if (!task.category || !helper.serviceCategories) {
    return { level: 'Unknown' as FitLevel, reason: "Category or skills missing." };
  }
  const isMatch = helper.serviceCategories.includes(task.category);
  if (isMatch) {
    return { level: 'High' as FitLevel, score: 1, reason: "You specialize in this task's category." };
  }
  // A more advanced version could check for related skills
  return { level: 'Low' as FitLevel, score: 0, reason: "This task is outside your primary service categories." };
};

const getDistanceFit = (task: Task, helperGeo?: { lat: number; lng: number }) => {
  if (!helperGeo || !task.location) {
    return { level: 'Unknown' as FitLevel, reason: "Location data unavailable." };
  }
  
  const taskGeo = task.location as GeoPoint;
  const distanceKm = getHaversineDistance(taskGeo.latitude, taskGeo.longitude, helperGeo.lat, helperGeo.lng);
  
  const thresholds = { near: 3, moderate: 8 };

  if (distanceKm <= thresholds.near) {
    return { level: 'High' as FitLevel, km: parseFloat(distanceKm.toFixed(1)), reason: "Task is very close to you." };
  }
  if (distanceKm <= thresholds.moderate) {
    return { level: 'Medium' as FitLevel, km: parseFloat(distanceKm.toFixed(1)), reason: "Task is a short drive away." };
  }
  return { level: 'Low' as FitLevel, km: parseFloat(distanceKm.toFixed(1)), reason: "Task is far from your location." };
};

const getTimeFit = (task: Task) => {
    // This is a simplified placeholder as we haven't implemented helper availability blocks yet.
    if (task.timeWindow?.toLowerCase() === 'flexible') {
        return { level: 'High' as FitLevel, reason: 'Task has a flexible schedule.' };
    }
    if(task.timeWindow){
        return { level: 'Medium' as FitLevel, reason: 'Task has a specific time window.' };
    }
    return { level: 'Unknown' as FitLevel, reason: 'Time preference not specified.' };
};


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // A5: Security / Authorization
  const authToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let decodedToken;
  try {
    decodedToken = await getAuth().verifyIdToken(authToken);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid auth token' }, { status: 403 });
  }
  
  const helperUid = decodedToken.uid;
  const taskId = params.id;
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const helperGeo = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined;

  try {
    // A4: Fetch in parallel
    const [taskDoc, helperDoc] = await Promise.all([
      getDoc(doc(db, 'tasks', taskId)),
      getDoc(doc(db, 'helpers', helperUid))
    ]);

    if (!taskDoc.exists()) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    if (!helperDoc.exists()) {
      // NOTE: In a real app, you might want to check for a custom claim 'role:worker' first.
      return NextResponse.json({ error: 'Helper profile not found' }, { status: 404 });
    }

    const task = taskDoc.data() as Task;
    const helper = helperDoc.data() as Helper;
    
    // A5: Check if helper is allowed to view
    if (task.status !== 'OPEN') {
        // Even if they could see it on the list, if it's not open, they can't bid.
        // Return a generic fit for closed tasks.
        return NextResponse.json({
            taskId,
            skillMatch: { level: 'Unknown', reason: 'Task is not open for offers.' },
            distance: { level: 'Unknown', reason: 'Task is not open for offers.' },
            timeFit: { level: 'Unknown', reason: 'Task is not open for offers.' },
            effort: task.effort,
            requiredTools: task.toolsRequired || []
        });
    }

    const fitData = {
      taskId,
      skillMatch: getSkillFit(task, helper),
      distance: getDistanceFit(task, helperGeo),
      timeFit: getTimeFit(task),
      effort: task.effort,
      requiredTools: task.toolsRequired || []
    };

    return NextResponse.json(fitData);
  } catch (error) {
    console.error('Error fetching fit indicator data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
