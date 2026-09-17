export const SF6_INPUT_RULESET = Object.freeze({
  id: 'sf6-year4-input-research-2026-09-16',
  gameVersion: 'Year 4 · 2026-08-03 调整后资料基准',
  checkedAt: '2026-09-16',
  verificationStatus: '社区逆向参考 · 待当前版本训练模式逐帧复测',
  frameRate: 60,
  browserCapture: {
    attemptTimeoutMs: 1500,
    directionChordMs: 28,
    attackChordMs: 45,
    note: '网页键盘事件归组参数，不等同于游戏内部判定帧数',
  },
  simultaneousWindowFrames: 1,
  motionWindows: {
    qcf: 11,
    qcb: 11,
    dp: 7,
    doubleQcf: 10,
    halfCircle: 12,
    dash: 8,
  },
  charge: {
    back: {
      requiredFrames: 45,
      retentionFrames: 10,
      accumulateAcrossGap: true,
      verificationStatus: '待验证',
    },
    down: {
      requiredFrames: 45,
      retentionFrames: 12,
      accumulateAcrossGap: true,
      verificationStatus: '待验证',
    },
    facingChangePolicy: '按当前朝向逐帧重解释；残留期内允许换向续蓄',
  },
  sources: [
    {
      title: '《街头霸王6》官方操作手册',
      url: 'https://game.capcom.com/manual/SF6',
      scope: '经典六键布局、基础操作；未公开底层容错帧数',
    },
    {
      title: 'Street Fighter 6 - Input Engine Details',
      url: 'https://rentry.co/35ch3',
      scope: '2024-05 社区逆向：方向容错、输入保持与优先级；待当前版本复测',
    },
    {
      title: 'SuperCombo Wiki',
      url: 'https://wiki.supercombo.gg/w/Street_Fighter_6',
      scope: '角色招式与蓄力要求交叉参考',
    },
  ],
})

export const getChargeRule = (direction, ruleset = SF6_INPUT_RULESET) => ruleset.charge[direction]
