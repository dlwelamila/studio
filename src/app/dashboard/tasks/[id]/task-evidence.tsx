'use client';

import { Camera, FileUp } from 'lucide-react';
import type { Task } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

type TaskEvidenceProps = {
  task: Task;
};

export function TaskEvidence({ task }: TaskEvidenceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Task Evidence</CardTitle>
        <CardDescription>
          Upload photos before you start and after you finish to ensure clarity and protect yourself.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <EvidenceSection title="Before Photo" description="A photo of the area before you begin work." />
        <EvidenceSection title="After Photo" description="A photo of the area after you have completed the task." />
      </CardContent>
    </Card>
  );
}

type EvidenceSectionProps = {
  title: string;
  description: string;
};

function EvidenceSection({ title, description }: EvidenceSectionProps) {
    return (
        <div className="p-4 rounded-lg border bg-background/50 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">{title}</h3>
            <p className="text-xs text-muted-foreground mb-4">{description}</p>
            <UploadPhotoDialog />
        </div>
    )
}

function UploadPhotoDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleUpload = () => {
    // This is a simulation. In a real app, this would handle the file upload process.
    toast({
        title: "Upload Simulated",
        description: "In a real app, your photo would now be uploaded."
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Photo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Evidence Photo</DialogTitle>
          <DialogDescription>
            Select a photo from your device to upload. Clear photos are best for documentation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-8 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-muted-foreground/50 rounded-lg">
            <FileUp className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag and drop a file or</p>
            <Button variant="secondary">Browse Files</Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpload}>Upload Photo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
