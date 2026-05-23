import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { get, patch, post } from '@/lib/api'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { TasksResponse, Worker, WorkersResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { type Task } from '../data/schema'
import { useTasks } from './tasks-provider'

type TaskMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  instructions: z.string().min(1, 'Instructions are required.'),
  priority: z.enum(['low', 'medium', 'high']),
  location: z.string().min(1, 'Location is required.'),
  deadline: z.string().min(1, 'Deadline is required.'),
  workerId: z.string().min(1, 'Worker is required.'),
})
type TaskForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: TaskMutateDrawerProps) {
  const isUpdate = !!currentRow
  const [workers, setWorkers] = useState<Worker[]>([])
  const { refreshTasks } = useTasks()

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      const response = await get<WorkersResponse>('/workers')

      setWorkers(response.data.workers)
    } catch (error) {
      console.error(error)
    }
  }

  const form = useForm<TaskForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      instructions: '',
      priority: 'medium',
      location: '',
      deadline: '',
      workerId: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        title: currentRow.title,
        instructions: currentRow.instructions,
        priority: currentRow.priority,
        location: currentRow.location,

        deadline: currentRow.deadline
          ? new Date(currentRow.deadline).toISOString().slice(0, 16)
          : '',

        workerId: currentRow.workerId._id,
      })
    } else {
      form.reset({
        title: '',
        instructions: '',
        priority: 'medium',
        location: '',
        deadline: '',
        workerId: '',
      })
    }
  }, [currentRow, form])

  const onSubmit = async (data: TaskForm) => {
    try {
      if (isUpdate && currentRow) {
        const updatePayload = {
          title: data.title,
          instructions: data.instructions,
          priority: data.priority,
          location: data.location,
          deadline: new Date(data.deadline).toISOString(),
        }

        await patch(`/tasks/${currentRow._id}`, updatePayload)

        toast.success('Task updated successfully')
      } else {
        const createPayload = {
          ...data,
          deadline: new Date(data.deadline).toISOString(),
        }

        await post('/tasks', createPayload)

        toast.success('Task created successfully')
      }

      await refreshTasks()

      onOpenChange(false)

      form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='instructions'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter instructions' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter location' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='deadline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type='datetime-local' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='workerId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Worker</FormLabel>

                  <SelectDropdown
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select worker'
                    items={workers.map((worker) => ({
                      label: worker.name,
                      value: worker._id,
                    }))}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              render={({ field }) => (
                <FormItem className='relative'>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='flex flex-col space-y-1'
                    >
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='high' />
                        </FormControl>
                        <FormLabel className='font-normal'>High</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='medium' />
                        </FormControl>
                        <FormLabel className='font-normal'>Medium</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center'>
                        <FormControl>
                          <RadioGroupItem value='low' />
                        </FormControl>
                        <FormLabel className='font-normal'>Low</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
