import { apiUrl } from './config'
import { ApiError, errorFromResponse, withRequestId } from './errors'
import { parseAgentResponse } from './parseAgentResponse'
import type { AgentResponse, SupportTicket } from './types'

/**
 * The last evaluation run measured a 3.2 s median, 48.7 s p95, and 66 s maximum. The backend
 * bounds each stage (triage 45 s, research 65 s, writer 45 s), so a run that succeeds can take
 * up to about 155 s; the client waits slightly longer. Keep nginx's proxy_read_timeout above this.
 */
export const ANALYZE_TIMEOUT_MS = 160_000

interface AnalyzeOptions {
  /** Aborting rejects with the original AbortError so callers can ignore it. */
  signal?: AbortSignal
  timeoutMs?: number
  fetchImpl?: typeof fetch
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text) as unknown
  } catch {
    return undefined
  }
}

/** POST /tickets/analyze. Resolves with a validated AgentResponse or rejects with ApiError. */
export async function analyzeTicket(ticket: SupportTicket, options: AnalyzeOptions = {}): Promise<AgentResponse> {
  const { signal, timeoutMs = ANALYZE_TIMEOUT_MS, fetchImpl = fetch } = options
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const forwardAbort = () => controller.abort()
  if (signal?.aborted) controller.abort()
  signal?.addEventListener('abort', forwardAbort, { once: true })

  try {
    let response: Response
    let body: unknown
    try {
      response = await fetchImpl(apiUrl('/tickets/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ticket_id: ticket.ticket_id, description: ticket.description }),
        signal: controller.signal,
      })
      body = await readJson(response)
    } catch (error) {
      if (timedOut) {
        throw new ApiError({
          kind: 'timeout',
          message: `No response after ${Math.round(timeoutMs / 1000)} seconds. The backend may still be working; try again.`,
        })
      }
      if (signal?.aborted) throw error
      throw new ApiError({
        kind: 'network',
        message: 'Could not reach the backend. Check that the FastAPI server is running and NEXT_PUBLIC_API_BASE_URL is correct.',
      })
    }

    const requestId = response.headers.get('X-Request-ID')
    if (!response.ok) throw withRequestId(errorFromResponse(response.status, body), requestId)
    try {
      return parseAgentResponse(body)
    } catch (error) {
      throw error instanceof ApiError ? withRequestId(error, requestId) : error
    }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', forwardAbort)
  }
}
