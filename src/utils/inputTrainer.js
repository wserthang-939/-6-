const FRAME_MS = 1000 / 60

export const ATTACK_KEY_MAP = Object.freeze({
  u: 'LP',
  i: 'MP',
  o: 'HP',
  j: 'LK',
  k: 'MK',
  l: 'HK',
})

const ATTACK_ORDER = ['LP', 'MP', 'HP', 'LK', 'MK', 'HK']

export function framesBetween(start, end) {
  return Math.max(0, Math.round((end - start) / FRAME_MS))
}

export function directionFromKeys(keys) {
  const x =
    (keys.has('d') || keys.has('arrowright') ? 1 : 0) -
    (keys.has('a') || keys.has('arrowleft') ? 1 : 0)
  const y =
    (keys.has('s') || keys.has('arrowdown') ? 1 : 0) -
    (keys.has('w') || keys.has('arrowup') ? 1 : 0)
  return (
    {
      '-1,-1': '7',
      '0,-1': '8',
      '1,-1': '9',
      '-1,0': '4',
      '1,0': '6',
      '-1,1': '1',
      '0,1': '2',
      '1,1': '3',
    }[`${x},${y}`] || '5'
  )
}

export function attackChordToken(tokens) {
  const unique = [...new Set(tokens)].sort(
    (left, right) => ATTACK_ORDER.indexOf(left) - ATTACK_ORDER.indexOf(right),
  )
  return unique.length ? unique.join('+') : ''
}

export function parseSequence(value) {
  const normalized = String(value)
    .toUpperCase()
    .replace(/DRC/g, 'MP+MK')
    .replace(/\bDR\b/g, '66')
  return (
    normalized.match(
      /LP\+MP\+HP|LK\+MK\+HK|HP\+HK|MP\+MK|LP\+MP|MK\+HK|PP|KK|LP|MP|HP|LK|MK|HK|[1-9]/g,
    ) || []
  )
}

export function tokenMatches(expected, actual) {
  if (expected === actual) return true
  const chord = actual.split('+')
  if (expected === 'PP') return chord.length >= 2 && chord.every((token) => token.endsWith('P'))
  if (expected === 'KK') return chord.length >= 2 && chord.every((token) => token.endsWith('K'))
  return false
}

export function evaluateSequence(inputs, sequence) {
  const tokens = inputs.map((entry) => (typeof entry === 'string' ? entry : entry.token))
  const compared = Math.min(tokens.length, sequence.length)
  let progress = 0
  while (progress < compared && tokenMatches(sequence[progress], tokens[progress])) progress += 1

  if (progress < tokens.length || tokens.length > sequence.length)
    return {
      status: 'error',
      progress,
      expected: sequence[progress] || null,
      actual: tokens[progress] || tokens.at(-1) || null,
    }
  if (tokens.length === sequence.length && sequence.length)
    return { status: 'complete', progress, expected: null, actual: null }
  return {
    status: 'in-progress',
    progress,
    expected: sequence[progress] || null,
    actual: null,
  }
}

export function matchesSequence(inputs, sequence) {
  return evaluateSequence(inputs, sequence).status === 'complete'
}

export function summarizeAttempts(attempts) {
  const completed = attempts.filter((attempt) => attempt.completed !== false)
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
