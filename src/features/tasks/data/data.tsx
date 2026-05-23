import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
  Send,
} from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    label: 'Sent',
    value: 'sent' as const,
    icon: Send,
  },
  {
    label: 'Accepted',
    value: 'accepted' as const,
    icon: Circle,
  },
  {
    label: 'In Progress',
    value: 'in_progress' as const,
    icon: Timer,
  },
  {
    label: 'Completed',
    value: 'completed' as const,
    icon: CheckCircle,
  },
  {
    label: 'Rejected',
    value: 'rejected' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: 'Critical',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]
