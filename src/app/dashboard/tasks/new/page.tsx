import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { taskCategories } from '@/lib/data';

export default function NewTaskPage() {
  return (
    <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/dashboard">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap font-headline text-xl font-semibold tracking-tight sm:grow-0">
          Post a New Task
        </h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Fill out the form below to find a helper for your task. The more details you provide, the better offers you&apos;ll get.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                type="text"
                className="w-full"
                placeholder='e.g., "Deep Clean My Kitchen"'
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what needs to be done. Include any important details like size of the area, specific instructions, or if you will provide supplies."
                className="min-h-32"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                 <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                    <SelectTrigger id="category" aria-label="Select category">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {taskCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-3">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        type="text"
                        placeholder="e.g., Masaki, Dar es Salaam"
                    />
                </div>
            </div>
            <div className="grid gap-3">
                <Label>Budget Range (TZS)</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="min-budget" className="text-sm text-muted-foreground">Minimum</Label>
                        <Input id="min-budget" type="number" placeholder="e.g., 20,000" />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="max-budget" className="text-sm text-muted-foreground">Maximum</Label>
                        <Input id="max-budget" type="number" placeholder="e.g., 30,000" />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button className="ml-auto">Post Task</Button>
                <Button variant="outline">Save Draft</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
