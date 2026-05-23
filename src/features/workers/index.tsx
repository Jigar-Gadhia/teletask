import { type ChangeEvent, useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  SlidersHorizontal,
  ArrowUpAZ,
  ArrowDownAZ,
  HardHat,
} from 'lucide-react'
import { get } from '@/lib/api'
import { Worker, WorkersResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { apps } from './data/apps'

const route = getRouteApi('/_authenticated/workers/')

type WorkerFilter = 'all' | 'connected' | 'notConnected'

const workerFilterText = new Map<WorkerFilter, string>([
  ['all', 'All Workers'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
])

export function Workers() {
  const {
    filter = '',
    type = 'all',
    sort: initSort = 'asc',
  } = route.useSearch()
  const navigate = route.useNavigate()

  const [sort, setSort] = useState(initSort)
  const [workerFilter, setWorkerFilter] = useState<WorkerFilter>(type)
  const [searchTerm, setSearchTerm] = useState(filter)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkers()
  }, [])

  const fetchWorkers = async () => {
    try {
      setLoading(true)

      const response = await get<WorkersResponse>('/workers')

      setWorkers(response.data.workers)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkers: Worker[] = workers
    .sort((a, b) =>
      sort === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    )
    .filter((worker) =>
      workerFilter === 'connected'
        ? worker.isLinked
        : workerFilter === 'notConnected'
          ? !worker.isLinked
          : true
    )
    .filter((worker) =>
      worker.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    navigate({
      search: (prev) => ({
        ...prev,
        filter: e.target.value || undefined,
      }),
    })
  }

  const handleTypeChange = (value: WorkerFilter) => {
    setWorkerFilter(value)
    navigate({
      search: (prev) => ({
        ...prev,
        type: value === 'all' ? undefined : value,
      }),
    })
  }

  const handleSortChange = (sort: 'asc' | 'desc') => {
    setSort(sort)
    navigate({ search: (prev) => ({ ...prev, sort }) })
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Workers</h1>
          <p className='text-muted-foreground'>
            Manage and monitor your workers.
          </p>
        </div>
        <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
          <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
            <Input
              placeholder='Filter workers...'
              className='h-9 w-40 lg:w-62.5'
              value={searchTerm}
              onChange={handleSearch}
            />
            <Select value={workerFilter} onValueChange={handleTypeChange}>
              <SelectTrigger className='w-36'>
                <SelectValue>{workerFilterText.get(workerFilter)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Apps</SelectItem>
                <SelectItem value='connected'>Connected</SelectItem>
                <SelectItem value='notConnected'>Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className='w-16'>
              <SelectValue>
                <SlidersHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align='end'>
              <SelectItem value='asc'>
                <div className='flex items-center gap-4'>
                  <ArrowUpAZ size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value='desc'>
                <div className='flex items-center gap-4'>
                  <ArrowDownAZ size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className='shadow-sm' />
        <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <li key={index} className='rounded-lg border p-4'>
                <div className='mb-8 flex items-center justify-between'>
                  <Skeleton className='size-10 rounded-lg' />

                  <Skeleton className='h-8 w-28' />
                </div>

                <div className='space-y-3'>
                  <Skeleton className='h-5 w-40' />

                  <Skeleton className='h-4 w-32' />

                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-4 w-20' />
                  </div>

                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-28' />
                  </div>
                </div>
              </li>
            ))
          ) : filteredWorkers.length === 0 ? (
            <div className='col-span-full flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center'>
              <HardHat className='mb-4 size-12 text-muted-foreground' />

              <h3 className='text-lg font-semibold'>No workers found</h3>

              <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
                No workers match your current filters or search query.
              </p>
            </div>
          ) : (
            filteredWorkers.map((worker) => (
              <li
                key={worker._id}
                className='rounded-lg border p-4 hover:shadow-md'
              >
                <div className='mb-8 flex items-center justify-between'>
                  <div className='flex size-10 items-center justify-center rounded-lg bg-muted p-2'>
                    <HardHat className='size-5' />
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    className={
                      worker.isLinked
                        ? 'border border-green-300 bg-green-50 hover:bg-green-100 dark:border-green-700 dark:bg-green-950 dark:hover:bg-green-900'
                        : ''
                    }
                  >
                    {worker.isLinked ? 'Connected' : 'Not Connected'}
                  </Button>
                </div>

                <div className='space-y-2'>
                  <h2 className='font-semibold'>{worker.name}</h2>

                  <p className='text-sm text-muted-foreground'>
                    {worker.phone}
                  </p>

                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>State</span>

                    <span className='font-medium'>{worker.state}</span>
                  </div>

                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Invite Code</span>

                    <span className='font-medium'>{worker.inviteCode}</span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </Main>
    </>
  )
}
