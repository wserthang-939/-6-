# 帧数资料口径

整理日期：2026-09-09。本站没有进行游戏内逐条实测，不把资料整理标为“实机验证”。

## 基础表

`src/data/frameReference.json` 保留 90 条与当前内容相关的数值记录，来自 [SF6 Frame Data Search](https://frame-search.com/?lang=en-us)。取得方式为网站提供的 CSV 导出；页面标注版本为 **Ver.2.0401.010**。该版本是来源的标签，不是本站独立验证的最新游戏版本。

- [JP](https://frame-search.com/?lang=en-us&character_name=JP)
- [A.K.I.](https://frame-search.com/?lang=en-us&character_name=A.K.I)
- [隆](https://frame-search.com/?lang=en-us&character_name=Ryu)
- [肯](https://frame-search.com/?lang=en-us&character_name=Ken)
- [杰米](https://frame-search.com/?lang=en-us&character_name=Jamie)
- [不知火舞](https://frame-search.com/?lang=en-us&character_name=Mai)

Capcom 官网帧数页此次返回 403，无法直接读取。基础数值采用上述可访问资料表，并以 Ultimate Frame Data 交叉检查常用招式；两者不一致时不宣称一致。

## 收尾参考

单招击倒优势来自 Ultimate Frame Data 的各角色页面。查询时未给出统一补丁号；部分条目含 2026 年调整说明，不代表每条数据均已逐一更新。

| 角色                                              | 当前连段终点的单招参考                                |
| ------------------------------------------------- | ----------------------------------------------------- |
| [JP](https://ultimateframedata.com/sf6/jp)        | 轻风神 +38F；中风神 +42F；地刺 +44F                   |
| [A.K.I.](https://ultimateframedata.com/sf6/aki)   | 无毒重蛇头鞭 +44F；毒发 / 浮空追击不直接套用          |
| [隆](https://ultimateframedata.com/sf6/ryu)       | 重升龙 +37F 起；中龙卷 +23F 起；SA3 +14F              |
| [肯](https://ultimateframedata.com/sf6/ken)       | 重升龙、疾跑升龙各 +25F；目标连段浮空终点仍需考虑高度 |
| [杰米](https://ultimateframedata.com/sf6/jamie)   | 轻张弓腿 +42F；0–3 酒流酔拳第一段不击倒、普通命中 −1F |
| [不知火舞](https://ultimateframedata.com/sf6/mai) | 无烈火轻忍蜂 +27～+43F；SA3 +19F、CA +20F             |

上述是单招参考而非 24 条连段的实测结论。前冲后的时间差是基于该参考的减法示例，不证明距离、重叠时机、安全跳或打投一定成立。前冲全程来自基础表：JP 22F，阿鬼 / 隆 / 肯 / 杰米 19F，舞 18F。

## 已知差异与特殊值

- 杰米轻张弓腿被防：基础表 −45F，UFD −44F。基础表展示采用 −45F，正文说明差异；未自行裁定游戏内哪一个正确。
- 肯站中拳普通命中：基础表 +4F，UFD +3F。本轮的肯拳脚第二条是目标连段第二击，不冒充站中拳数据；连接说明如涉及站中拳发生，采用两表一致的 5F。
- 阿鬼部分收招口径不同：基础表站中拳 14F，并备注被防 / 挥空额外 2F；UFD 显示 16F。本站不混合字段拼出一条伪统一数据。
- 判定区间如 6–9F 不是“持续 6–9 帧”；发生、收招、全程与落地硬直不能混用。
- D 表示击倒，不是数值 0；非攻击动作的命中 / 被防值为“不适用”。飞行判定、毒池持续和反击受理在动作说明中单独解释。
- 只展示所列强度与状态：不把无烈火、无电刃、0–3 酒或无毒状态外推到强化状态。

更新时应同步数值快照、来源日期、状态说明与测试。不要仅改页面日期来表示数据已经更新。
