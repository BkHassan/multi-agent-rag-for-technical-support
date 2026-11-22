import type { DocumentSource } from '../../../api/types'

/** The backend Writer check's whitespace rule: `" ".join(text.split())`. Case is kept. */
function normalized(text: string): string {
  return text.split(/\s+/).filter(Boolean).join(' ')
}

/**
 * The backend keeps a Writer step only when its text appears, word for word apart from
 * whitespace, in the passage it cites. Searching the returned passages the same way links
 * each step back to its passage. Result order follows `steps`; a step with no match gets [].
 * Overlapping chunks can both contain a step, so a step may match more than one passage.
 */
export function passagesForSteps(
  steps: ReadonlyArray<string>,
  sources: ReadonlyArray<DocumentSource>,
): DocumentSource[][] {
  const texts = sources.map((passage) => (passage.excerpt ? normalized(passage.excerpt) : ''))
  return steps.map((step) => {
    const target = normalized(step)
    if (!target) return []
    return sources.filter((_passage, index) => texts[index].includes(target))
  })
}
