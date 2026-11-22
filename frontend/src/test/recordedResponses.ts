// Real AgentResponse bodies recorded from the current backend (coordinator: triage ->
// researcher -> evidence gate -> writer) by the evaluation runner, from
// evaluation/results/perf_after_client_reuse.json (2026-10-26, gemini-3.5-flash-lite). They are
// serialized with model_dump(mode="json"), the same serialization FastAPI uses for the
// response, and keep the full passage text the API returns. Used only as test fixtures.

export const RECORDED_GROUNDED_ANSWER = {
  "ticket_id": "E-REL-001",
  "category": "database",
  "outcome": "grounded_answer",
  "clarifying_questions": [],
  "recommendations": [
    "Verify connection string values against the current environment secrets.",
    "Confirm the database process is running and listening on the expected interface.",
    "Check pool size vs active connections and look for connection leaks.",
    "Review DB server logs for auth failures, TLS errors, and connection limits."
  ],
  "sources": [
    {
      "source": "database_connection_failures.md",
      "doc_id": "database_connection_failures",
      "chunk_index": 0,
      "category": "database",
      "distance": 0.3070564270019531,
      "excerpt": "# Database Connection Failures\n\n## Symptoms\nThe application cannot connect to the database. Logs may show connection refused, authentication failed, timeout, or “too many connections.”\n\n## Common causes\n- Wrong host, port, database name, or credentials in configuration\n- Database server stopped or restarting\n- Network/firewall blocking the DB port (for example 5432 or 3306)\n- Connection pool exhausted under load\n- TLS/SSL mode mismatch between client and server\n- Max connections limit reached on the database\n\n## Troubleshooting steps\n1. Verify connection string values against the current environment secrets.\n2. Test connectivity from the app host with a native client (`psql`, `mysql`, etc.).\n3. Confirm the database process is running and listening on the expected interface.\n4. Check pool size vs active connections and look for connection leaks.\n5. Review DB server logs for auth failures, TLS errors, and connection limits.\n\n## Related notes\nApplication “cannot connect to the database” tickets are often environment or network misconfiguration rather than query bugs."
    }
  ],
  "sufficient_evidence": true,
  "fallback_triggered": false,
  "summary": "The supplied passages from database_connection_failures.md support troubleshooting database connection timeout issues by verifying connection string values, testing connectivity with native clients, confirming the database process is running, checking pool size and connection leaks, and reviewing database server logs. What is still unknown is the exact environment-specific configuration and the current status of network paths or database server resource loads."
}

export const RECORDED_CLARIFICATION_NEEDED = {
  "ticket_id": "E-AMB-003",
  "category": "application",
  "outcome": "clarification_needed",
  "clarifying_questions": [
    "Which system or feature is affected (for example the website, sign-in, VPN, file uploads, or a specific database)?",
    "What exactly happens? Please include the exact error message or code, or describe what you see instead of the expected result.",
    "When did it start, and is it affecting one user, a team, or everyone?"
  ],
  "recommendations": [],
  "sources": [],
  "sufficient_evidence": false,
  "fallback_triggered": false,
  "summary": "More detail is needed before documented troubleshooting steps can be recommended. Please answer the questions below."
}

// Fallback after the evidence gate rejected the closest passages.
export const RECORDED_FALLBACK = {
  "ticket_id": "E-IRR-004",
  "category": "database",
  "outcome": "fallback",
  "clarifying_questions": [],
  "recommendations": [
    "Insufficient supporting documentation was found to provide reliable troubleshooting recommendations. Please review the ticket manually."
  ],
  "sources": [
    {
      "source": "database_timeouts_and_locks.md",
      "doc_id": "database_timeouts_and_locks",
      "chunk_index": 0,
      "category": "database",
      "distance": 0.4131416082382202,
      "excerpt": "# Database Timeouts and Lock Contention\n\n## Symptoms\nRequests hang or fail with query timeouts. Database CPU may look moderate while wait events show lock waits.\n\n## Common causes\n- Long-running transactions holding row or table locks\n- Missing indexes causing full scans under concurrency\n- Deadlocks between competing transactions\n- Statement or idle-in-transaction timeouts set too low for batch jobs\n- Blocking migrations running during peak traffic\n\n## Troubleshooting steps\n1. Identify blocking sessions and the statements they hold.\n2. Kill or roll back stuck transactions when safe.\n3. Add or verify indexes for hot query paths.\n4. Split large transactions into smaller units of work.\n5. Align application statement timeouts with expected query latency.\n\n## Related notes\nTimeouts at the application layer often appear as HTTP 504s when a proxy waits on a blocked request."
    },
    {
      "source": "http_503_service_unavailable.md",
      "doc_id": "http_503_service_unavailable",
      "chunk_index": 0,
      "category": "web",
      "distance": 0.4384467601776123,
      "excerpt": "# HTTP 503 Service Unavailable\n\n## Symptoms\nUsers intermittently or consistently receive **503 Service Unavailable**. Maintenance pages or retry-after headers may appear.\n\n## Common causes\n- Application intentionally marked unavailable during maintenance\n- Autoscaling lag under sudden load\n- Upstream capacity exhausted (worker/thread/connection pools)\n- Circuit breakers opened after repeated failures\n- Dependency outage causing the service to refuse new work\n\n## Troubleshooting steps\n1. Check whether a maintenance flag or drain mode is enabled.\n2. Review CPU, memory, and request queue depth on the service.\n3. Inspect circuit-breaker / rate-limiter metrics.\n4. Confirm dependent services (cache, DB, auth) are healthy.\n5. Scale out or shed load if saturation is confirmed.\n\n## Related notes\nUnlike 504, a 503 often means the service knowingly cannot accept the request right now."
    },
    {
      "source": "http_502_bad_gateway.md",
      "doc_id": "http_502_bad_gateway",
      "chunk_index": 0,
      "category": "web",
      "distance": 0.4414089322090149,
      "excerpt": "# HTTP 502 Bad Gateway\n\n## Symptoms\nClients see **502 Bad Gateway**. The edge proxy could talk to something, but the upstream response was invalid or the connection was reset.\n\n## Common causes\n- Upstream process crashed mid-request\n- Upstream returned an empty or malformed response\n- Protocol mismatch (HTTP vs HTTPS) between proxy and origin\n- Keep-alive / idle connection reuse hitting a closed socket\n- Container or pod not ready despite being in the load-balancer pool\n\n## Troubleshooting steps\n1. Check upstream process status and recent crash logs.\n2. Verify proxy upstream URL, scheme, and port.\n3. Disable connection reuse briefly to test stale keep-alive issues.\n4. Confirm readiness probes before traffic is routed to new instances.\n5. Capture proxy error logs that often include the upstream reset reason.\n\n## Related notes\nFrequent 502 spikes after deploys usually point to readiness or startup timing problems."
    },
    {
      "source": "database_connection_failures.md",
      "doc_id": "database_connection_failures",
      "chunk_index": 0,
      "category": "database",
      "distance": 0.4456247091293335,
      "excerpt": "# Database Connection Failures\n\n## Symptoms\nThe application cannot connect to the database. Logs may show connection refused, authentication failed, timeout, or “too many connections.”\n\n## Common causes\n- Wrong host, port, database name, or credentials in configuration\n- Database server stopped or restarting\n- Network/firewall blocking the DB port (for example 5432 or 3306)\n- Connection pool exhausted under load\n- TLS/SSL mode mismatch between client and server\n- Max connections limit reached on the database\n\n## Troubleshooting steps\n1. Verify connection string values against the current environment secrets.\n2. Test connectivity from the app host with a native client (`psql`, `mysql`, etc.).\n3. Confirm the database process is running and listening on the expected interface.\n4. Check pool size vs active connections and look for connection leaks.\n5. Review DB server logs for auth failures, TLS errors, and connection limits.\n\n## Related notes\nApplication “cannot connect to the database” tickets are often environment or network misconfiguration rather than query bugs."
    },
    {
      "source": "http_504_gateway_timeout.md",
      "doc_id": "http_504_gateway_timeout",
      "chunk_index": 0,
      "category": "web",
      "distance": 0.45062804222106934,
      "excerpt": "# HTTP 504 Gateway Timeout\n\n## Symptoms\nUsers receive a **504 Gateway Timeout** when calling an API or loading a web page. Reverse proxies, load balancers, or CDNs typically generate this status.\n\n## What 504 means\nA gateway or proxy did not receive a timely response from an upstream server. The client reached the edge, but the backend did not answer within the configured timeout.\n\n## Common causes\n- Upstream application hung, overloaded, or deadlocked\n- Backend took longer than the proxy timeout (common with slow DB queries)\n- Upstream process crashed or is restarting\n- Network path between proxy and origin is degraded\n- Incorrect upstream host/port so the proxy waits until timeout\n\n## Troubleshooting steps\n1. Confirm whether the origin responds directly when bypassing the proxy.\n2. Check application and proxy access logs for matching request IDs and latency.\n3. Inspect upstream health checks and recent deployments.\n4. Look for slow database queries, lock contention, or thread pool exhaustion.\n5. Temporarily increase proxy timeouts only after identifying a legitimate long-running operation.\n\n## Related notes\nA 504 is different from a 502 (bad gateway / invalid upstream response) and from a 503 (service unavailable / overloaded or intentionally offline)."
    }
  ],
  "sufficient_evidence": false,
  "fallback_triggered": true,
  "summary": "Insufficient supporting documentation was found to provide reliable troubleshooting recommendations. Please review the ticket manually."
}

// Fallback for a ticket that is not a problem report: no search runs, so no sources.
export const RECORDED_FALLBACK_NOT_A_PROBLEM = {
  "ticket_id": "E-NRT-002",
  "category": "other",
  "outcome": "fallback",
  "clarifying_questions": [],
  "recommendations": [
    "Insufficient supporting documentation was found to provide reliable troubleshooting recommendations. Please review the ticket manually."
  ],
  "sources": [],
  "sufficient_evidence": false,
  "fallback_triggered": true,
  "summary": "Insufficient supporting documentation was found to provide reliable troubleshooting recommendations. Please review the ticket manually."
}
