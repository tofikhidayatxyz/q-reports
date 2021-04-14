if (process.browser) {
  // dispatch reporter on document loaded
  document.addEventListener('DOMContentLoaded', () => startQueueReporter(true))
  // dispatch report on added new reporter
  document.addEventListener('DispatchReport', () => startQueueReporter())
  // dispatch report when queue done
  document.addEventListener('NextReport', () => startQueueReporter(true))
}
