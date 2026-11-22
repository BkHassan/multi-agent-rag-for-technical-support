import type { AgentResponse, DocumentSource } from '../../../api/types'
import { cx } from '../../../lib/cx'
import { EvidenceList } from './EvidenceList'
import { OutcomeHeader } from './OutcomeHeader'
import { SectionHeader } from './SectionHeader'
import { passagesForSteps } from './stepSources'
import styles from './results.module.css'

/** "db.md, passage 3"; matches the passage numbers in the evidence list. */
function originLabel(passage: DocumentSource): string {
  return passage.chunk_index !== null ? `${passage.source}, passage ${passage.chunk_index + 1}` : passage.source
}

export function GroundedAnswerView({ response }: { response: AgentResponse }) {
  const origins = passagesForSteps(response.recommendations, response.sources)

  return (
    <>
      <OutcomeHeader outcome="grounded_answer" title="Documented troubleshooting steps">
        The Writer copied these steps from documentation passages that passed the evidence gate.
      </OutcomeHeader>

      {response.summary ? (
        <section className={styles.section}>
          <SectionHeader title="Summary" provenance="generated" />
          <p className={styles.prose}>{response.summary}</p>
        </section>
      ) : null}

      <section className={styles.section}>
        <SectionHeader title="Recommended steps" provenance="generated" />
        {response.recommendations.length > 0 ? (
          <ol className={styles.steps}>
            {response.recommendations.map((step, index) => {
              const labels = [...new Set(origins[index].map(originLabel))]
              return (
                <li key={index}>
                  {step}
                  {labels.length > 0 ? <span className={styles.stepSource}>From {labels.join('; ')}</span> : null}
                </li>
              )
            })}
          </ol>
        ) : (
          <p className={styles.muted}>The backend returned no steps for this ticket.</p>
        )}
      </section>

      <section className={cx(styles.section, styles.sourcesPanel)}>
        <SectionHeader title="Evidence" provenance="retrieved" />
        {response.sources.length > 0 ? (
          <>
            <p className={styles.note}>
              Passages accepted by the evidence gate and cited by the Writer. Each step above is copied word for word
              from one of them.
            </p>
            <EvidenceList sources={response.sources} />
          </>
        ) : (
          <p className={styles.muted}>The backend returned no source passages for this answer.</p>
        )}
      </section>
    </>
  )
}
