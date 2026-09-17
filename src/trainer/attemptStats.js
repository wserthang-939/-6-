export function summarizeCompletedAttempts(attempts) {
  const completed = attempts.filter((attempt) => attempt.completed === true)
  if (!completed.length) return { total: 0, success: 0, rate: 0, best: null, average: null }
  const successes = completed.filter((attempt) => attempt.success)
  return {
    total: completed.length,
    success: successes.length,
    rate: Math.round((successes.length / completed.length) * 100),
    best: successes.length ? Math.min(...successes.map((attempt) => attempt.frames)) : null,
    average: successes.length
      ? Math.round(successes.reduce((sum, attempt) => sum + attempt.frames, 0) / successes.length)
      : null,
  }
}
