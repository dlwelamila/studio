'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUserRole } from '@/context/user-role-context';
import { users } from '@/lib/data';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, MapPin, Calendar, BadgeCheckIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { role } = useUserRole();
  const currentUser = role === 'customer' ? users[0] : users[1];

  return (
    <div>
      <h1 className="font-headline text-2xl font-bold mb-6">Your Profile</h1>
      <Card>
        <CardHeader>
            <div className="flex items-center gap-6">
                <Image
                    src={currentUser.avatarUrl}
                    width={96}
                    height={96}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                />
                <div>
                    <CardTitle className="font-headline text-3xl">{currentUser.name}</CardTitle>
                    <CardDescription className="text-base">{currentUser.email}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-semibold">{currentUser.location}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="text-muted-foreground">Member Since</p>
                    <p className="font-semibold">{format(currentUser.memberSince, 'MMMM yyyy')}</p>
                </div>
            </div>
             {currentUser.role === 'helper' && (
                <>
                     <div className="flex items-center gap-3">
                        <BadgeCheckIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Verification</p>
                            <p className="font-semibold">
                                {currentUser.verified ? (
                                    <Badge variant="secondary">Verified</Badge>
                                ) : (
                                    <Badge variant="destructive">Not Verified</Badge>
                                )}
                            </p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Rating</p>
                            <p className="font-semibold">{currentUser.rating} / 5.0</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Completed Gigs</p>
                            <p className="font-semibold">{currentUser.completedTasks}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {currentUser.skills?.map(skill => <Badge key={skill} variant="outline">{skill}</Badge>)}
                            </div>
                        </div>
                    </div>
                </>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
