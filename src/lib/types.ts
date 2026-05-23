export interface Tenant {
  _id: string
  companyName: string
  email: string
  plan: string
  subscriptionStatus: string
  trialEndsAt: string
  promoFreeEndsAt: string | null
  isFreeForever: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface LoginResponse {
  data: {
    token: string
    tenant: Tenant
  }
}

export interface TaskWorker {
  _id: string
  name: string
  phone: string
  chatId: string
}

export interface Task {
  _id: string
  title: string
  instructions: string
  priority: 'low' | 'medium' | 'high'
  location: string
  deadline: string
  assignedTo: string
  workerId: TaskWorker
  tenantId: string
  status: 'sent' | 'accepted' | 'in_progress' | 'completed' | 'rejected'

  reminderSent: boolean
  helpRequests: unknown[]
  createdAt: string
  updatedAt: string
  __v: number

  // Optional fields
  delayReason?: string
  newDeadline?: string
  completedAt?: string
}

export interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export interface TasksResponse {
  data: {
    tasks: Task[]
    pagination: Pagination
  }
}

export interface Worker {
  _id: string
  name: string
  phone: string
  inviteCode: string
  isLinked: boolean
  state: 'IDLE' | 'BUSY' | 'OFFLINE'
  isActive: boolean
  tenantId: string
  createdAt: string
  updatedAt: string
  __v: number
  chatId: string
  botLink: string | null
}

export interface WorkersPagination {
  total: number
  page: number
  limit: number
  pages: number
}

export interface WorkersResponse {
  data: {
    workers: Worker[]
    pagination: WorkersPagination
  }
}
