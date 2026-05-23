import { toast } from 'sonner'
import { del } from '@/lib/api'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './tasks-import-dialog'
import { TasksMutateDrawer } from './tasks-mutate-drawer'
import { useTasks } from './tasks-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, refreshTasks } = useTasks()
  return (
    <>
      <TasksMutateDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`task-update-${currentRow._id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')

              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={async () => {
              try {
                const ids = currentRow ? [currentRow._id] : []

                if (!ids.length) return

                await del('/tasks', {
                  data: {
                    taskIds: ids,
                  },
                })

                toast.success(
                  ids.length > 1
                    ? 'Tasks deleted successfully'
                    : 'Task deleted successfully'
                )

                await refreshTasks()

                setOpen(null)

                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              } catch (error) {
                console.error(error)
              }
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow._id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow._id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
