import { CircleCheck, MessageCircleQuestionMark, SearchX, type LucideIcon } from 'lucide-react'
import type { AgentOutcome } from '../../api/types'
import type { Tone } from '../../components/ui'

export type OutcomeTone = Extract<Tone, 'success' | 'warning' | 'neutral'>

export const OUTCOME_META: Record<AgentOutcome, { label: string; tone: OutcomeTone; icon: LucideIcon; description: string }> = {
  grounded_answer: {
    label: 'Grounded answer',
    tone: 'success',
    icon: CircleCheck,
    description: 'Troubleshooting steps written from relevant documentation, shown with the passages used.',
  },
  clarification_needed: {
    label: 'Clarification needed',
    tone: 'warning',
    icon: MessageCircleQuestionMark,
    description: 'Questions for the reporter when the ticket names no specific symptom.',
  },
  fallback: {
    label: 'Fallback',
    tone: 'neutral',
    icon: SearchX,
    description: 'No step could be backed by the documentation, so none are suggested and the ticket needs manual review.',
  },
}
