export function createComboFlow(rule) {
  return { rule, index: 0, recognized: [], status: 'in-progress', reason: '' }
}

export function advanceComboFlow(flow, recognition, frame) {
  if (flow.status !== 'in-progress') return flow
  if (!recognition.valid) {
    flow.status = 'failed'
    flow.reason = recognition.reason
    return flow
  }
  const step = flow.rule.steps[flow.index]
  const previous = flow.recognized.at(-1)
  if (previous && step.linkWindowFrames != null && frame - previous.frame > step.linkWindowFrames) {
    flow.status = 'failed'
    flow.reason = `衔接超过 ${step.linkWindowFrames}F`
    return flow
  }
  flow.recognized.push({ stepId: step.id, frame, recognition })
  flow.index += 1
  if (flow.index === flow.rule.steps.length) {
    flow.status = 'input-valid'
    flow.reason = flow.rule.gameplayVerified
      ? '完整连段输入有效'
      : '完整指令序列有效；网页未模拟命中与硬直，不能确认游戏内连段成立'
  }
  return flow
}

export const comboProgress = (flow) => ({ completed: flow.index, total: flow.rule.steps.length })
