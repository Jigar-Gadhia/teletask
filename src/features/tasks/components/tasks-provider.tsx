import React, { useState } from 'react'
import { get } from '@/lib/api'
import { TasksResponse } from '@/lib/types'
import useDialogState from '@/hooks/use-dialog-state'
import { type Task } from '../data/schema'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void

  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>

  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>

  refreshTasks: () => Promise<void>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  const refreshTasks = async () => {
    try {
      const response = await get<TasksResponse>('/tasks')

      setTasks(response.data.tasks)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <TasksContext
      value={{
        open,
        setOpen,

        currentRow,
        setCurrentRow,

        tasks,
        setTasks,

        refreshTasks,
      }}
    >
      {children}
    </TasksContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
