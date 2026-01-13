"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronLeft } from "lucide-react"
import { GeoPoint, Timestamp, collection, serverTimestamp } from "firebase/firestore"

import { useUser, useFirestore } from "@/firebase"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import { taskCategories } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { useUserRole } from "@/context/user-role-context"

const LocationPicker = dynamic(() => import('@/components/ui/location-picker'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const taskFormSchema = z
  .object({
    title: z.string().min(5, { message: "Title must be at least 5 characters." }),
    description: z.string().min(20, { message: "Description must be at least 20 characters." }),
    category: z.string({ required_error: "Please select a category." }),
    location: z.instanceof(GeoPoint, { message: "Please select a location on the map." }),
    area: z.string().min(3, "Please provide a general area name."),
    budget: z.object({
      min: z.coerce.number().nonnegative({ message: "Minimum budget must be 0 or more." }),
      max: z.coerce.number().positive({ message: "Maximum budget must be greater than 0." }),
    }),
    effort: z.enum(["light", "medium", "heavy"], {
      required_error: "Please estimate the effort level.",
    }),
    toolsRequired: z.string().optional(),
    dueDate: z.date({ required_error: "Please select a due date and time." }),
  })
  .refine((v) => v.budget.max >= v.budget.min, {
    message: "Maximum budget must be greater than or equal to minimum.",
    path: ["budget", "max"],
  })
  .refine((v) => v.dueDate.getTime() > Date.now(), {
    message: "Due date must be in the future.",
    path: ["dueDate"],
  })

type TaskFormValues = z.infer<typeof taskFormSchema>

export default function NewTaskPage() {
  const { user } = useUser()
  const firestore = useFirestore()
  const router = useRouter()
  const { toast } = useToast()
  const { role } = useUserRole()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      location: undefined,
      area: "",
      effort: undefined,
      budget: {
        min: 0,
        max: 20000,
      },
      toolsRequired: "",
      dueDate: undefined as unknown as Date,
    },
    mode: "onSubmit",
  })

  if (role && role !== "customer") {
    return (
      <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This page is only available to customers. Please switch to your customer profile to post a task.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const onSubmit = async (data: TaskFormValues) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to post a task.",
      })
      return
    }

    const tools =
      data.toolsRequired
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) ?? []

    const taskData = {
      customerId: user.uid,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      area: data.area.trim(),
      location: data.location,
      budget: {
        min: data.budget.min,
        max: data.budget.max,
      },
      effort: data.effort,
      toolsRequired: tools,
      dueDate: Timestamp.fromDate(data.dueDate),
      timeWindow: 'Flexible',
      status: "OPEN" as const,
      createdAt: serverTimestamp(),
    }

    try {
      const tasksCollection = collection(firestore, "tasks")
      await addDocumentNonBlocking(tasksCollection, taskData)
      toast({ title: "Task Posted!", description: "Your task is now live for helpers to see." })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error posting task:", error)
      toast({
        variant: "destructive",
        title: "Failed to Post Task",
        description: error?.message ?? "Something went wrong.",
      })
    }
  }

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., "Deep Clean My Kitchen"' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what needs to be done. Include any important details like size of the area, specific instructions, or if you will provide supplies."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Task Location</FormLabel>
                        <FormControl>
                            <LocationPicker
                                onLocationChange={(lat, lng) => {
                                    field.onChange(new GeoPoint(lat, lng));
                                }}
                            />
                        </FormControl>
                        <FormDescription>Drag the marker to the exact task location.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>General Area Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Masaki, Dar es Salaam" {...field} />
                    </FormControl>
                    <FormDescription>This helps helpers quickly identify tasks in their zone.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {taskCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose the best category for your task.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="effort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effort Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select estimated effort" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light (1–2 hours, simple task)</SelectItem>
                          <SelectItem value="medium">Medium (2–4 hours, standard task)</SelectItem>
                          <SelectItem value="heavy">Heavy (4+ hours, demanding task)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>This helps helpers estimate the time and effort involved.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                  control={form.control}
                  name="toolsRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tools Expected (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bucket, soap, iron" {...field} />
                      </FormControl>
                      <FormDescription>List tools separated by commas.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date & Time</FormLabel>
                    <DateTimePicker date={field.value} setDate={field.onChange} />
                    <FormDescription>When does this task need to be completed by?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-3">
                <Label>Budget Range (TZS)</Label>
                <FormDescription>Provide a fair price range to attract the right helpers.</FormDescription>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget.min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">Minimum</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 20000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">Maximum</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 30000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Posting..." : "Post Task"}
                </Button>
                <Button type="button" variant="outline">
                  Save Draft
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
