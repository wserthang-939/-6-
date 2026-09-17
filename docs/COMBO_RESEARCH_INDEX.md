# 街霸六角色连段资料研究索引

## 研究结论

“全部连段”不是一张永远不变的固定表。同一角色会因起手、普通命中 / Counter / Punish Counter、站姿或蹲姿、版中或版边、斗气、SA、燃尽、中毒、酒量、烈火槽及补丁版本产生大量分支。网站应收录“能帮助玩家作选择的完整实战路线”，而不是穷举所有理论排列。

本项目后续采用以下口径：

1. 先按当前补丁资料整理，再保留旧攻略作为历史参考；旧路线不能直接标成当前最优。
2. “最优”必须写清目标：最高伤害、最低资源、最大推板、换边、加酒、保留状态或最好起身压制。
3. 一条路线至少记录：角色、版本、起手状态、位置、指令、斗气、SA、角色资源、收尾、用途、失败条件、来源和复测状态。
4. 连段与套路分开：命中后形成的击倒设置关联到收尾；起手被防后形成的帧数陷阱关联到起手，不写成“连段打完继续压”。
5. 当前项目没有逐条进行游戏内复测，因此新增内容只能标“资料整理”或“条件推导”，不能标“实机验证”。

## 当前网站数据快照

- 资料基准：Year 4，按 2026-08-03 调整后的路线页整理。
- 本次查询日期：2026-09-16。
- 当前版本对照：六名角色的 SF6 Lab 连段页；普通招式帧数另以 Ultimate Frame Data 交叉检查。
- 网站已为 72 套连段统一生成难度、起手、斗气 / SA、角色资源、起始位置、结束位置、绿冲类型、压制状态、击倒有利帧与特殊条件等筛选字段。
- 难度是本站依据输入长度、绿冲及超必杀操作量做的统一分级，不是官方等级。尚未逐条实机确认的伤害、结束位置或整套连段帧数显示“待验证”，不从单招表反推。

## 建议覆盖的连段分类

每个角色都应检查下列类别；没有适用路线时明确写“不适用”，不要硬凑数量。

| 类别       | 需要记录的内容                                  |
| ---------- | ----------------------------------------------- |
| 轻攻击确认 | 近距离、远距离、下段起手、被防停止点            |
| 中攻击确认 | 普通命中、Counter、可取消绿冲、最远距离掉连     |
| 重攻击确认 | 单发确认、跳入、对手站姿 / 蹲姿限制             |
| 确反       | 4F、5F、中破绽、大破绽、无敌技落地              |
| 差合 / PC  | 能否自然连接、距离限制、PC 专属崩解或浮空       |
| 绿冲       | 裸绿冲、取消绿冲、循环、避免燃尽的省斗气路线    |
| 版边       | 无资源追击、OD 追击、SA 收尾、换边或保角        |
| DI         | PC、上墙、眩晕、空中命中差异                    |
| 超必杀     | SA1 / SA2 / SA3 / CA，取消点与高度限制          |
| 起身设置   | 实际击倒优势、前冲 / 空挥计时、安全跳、对手受身 |

## 六个角色的资料结构

### JP

重点不是只收“伤害最高”，而是区分击退后远程牵制、地刺或裂隙设置、版边追击、OD 失忆反制、SA2 延展和 SA3 斩杀。现有中文连段表已经覆盖基础、斗气、绿冲、DI、眩晕、确反、SA2 与失忆分支；2026 年资料索引还列出按起手、资源和收尾整理的专题页。后续应优先补齐：轻攻击转绿冲、PC 重拳不同距离、近板边 OD 离场、DI 上墙、SA2 换边及 OD 失忆对应投 / DI 的不同回报。([街霸6 Wiki：JP](https://www.vi-ko.cn/pages/characters/JP.html)，[JP 2026 攻略索引](https://sf6-ingrid.com/character/jp/category/combo))

### A.K.I.（阿鬼）

必须把未中毒、中毒、毒发、毒池和 Year 4 新路线分开。当前 Year 4 页面明确对应 2026-08-03 调整，目录包括 10 条核心连段、中 / 重 / OD 蛇头鞭、DR 中拳、无敌技确反、版边、收尾帧数及多类 setplay。后续资料表应单独记录：未中毒稳定收尾、236MP / 236HP 毒发、毒发后安全跳、版边猛毒牙、紫泡与毒池设置、投后路线、SA2 毒池及 SA3。([SF6 Lab：A.K.I. Year 4 连段与起攻](https://sf6-lab.net/en/fighters/aki/combo)，[街霸6 Wiki：阿鬼](https://www.vi-ko.cn/pages/characters/agui.html))

### 隆

当前 Year 4 页面对应 2026-08-03 调整，已明确给出重升龙 +37F、前冲后 +18F、前重拳压起身，以及轻 / 中龙卷不同起攻。连段资料不能只分有无电刃，还要覆盖轻确认、中拳目押、下中脚取消绿冲、贴身后重拳、跳入、PC 重脚、版边重驴踢追升龙、DI、SA 和电刃波掌击。重升龙后前冲投并非严格压起身，必须和前重拳压起身、裸绿冲打投分开写。([SF6 Lab：隆 Year 4 连段与起攻](https://sf6-lab.net/en/fighters/ryu/combo)，[街霸6 Wiki：隆](https://www.vi-ko.cn/pages/characters/long.html)，[Capcom 隆角色指南 PDF](https://static.capcom.com/streetfighter/downloads/04P_sf_Ryu.pdf))

### 肯

当前 Year 4 页面也明确对应 2026-08-03 调整。肯的资料必须按“伤害、搬角、换边、保角和起攻”拆开，因为疾跑、迅雷脚、龙卷与升龙收尾的目的不同。后续应覆盖：近 / 远轻确认、5MP~HP 目标连段、轻龙卷浮空、疾跑升龙、迅雷各派生、下中脚绿冲、PC 确反、版边循环、换边、DI、SA 与燃尽路线。所有需要延迟的迅雷派生应单独标注，不应把简单替代路线也称作绝对最高伤害。([SF6 Lab：肯 Year 4 连段与起攻](https://sf6-lab.net/fighters/ken/combo)，[街霸6 Wiki：肯](https://www.vi-ko.cn/pages/characters/ken.html))

### 杰米

杰米不能只做一张通用连段表，最低应按 0、1、2、3、4 酒分组。每级酒会改变可用目标连段或必杀技，部分动作还会改变伤害与帧数；2026 年 UFD 资料也记载了多项当年调整。后续应覆盖：每级酒的轻 / 中 / 重起手、流酔拳拳派生与饮酒派生、轻 / 中 / 重张弓腿、爆廻、俯冲、指令投、满酒目标连段、重脚 PC、版边安全跳、DI、SA1、SA2 满酒时间与 SA3。旧中文表的部分拳脚数字与当前 UFD 有明显差异，路线可作线索，帧数不能直接混用。([街霸6 Wiki：杰米](https://www.vi-ko.cn/pages/characters/jiemi.html)，[Ultimate Frame Data：Jamie](https://ultimateframedata.com/sf6/jamie))

### 不知火舞

舞至少要按 0 / 1 / 2 / 3+ 烈火槽、站姿限定、版中 / 版边和是否消耗 OD 分类。核心分支包括：轻确认接忍蜂、轻攻击目标连段、重拳确认、重龙炎舞强制站姿、绿冲后重脚强制站立、星孔雀版边追击、强化花蝶扇 / 龙炎舞、不同 SA 及 +42F 安全跳。2026-08 更新页明确提醒 Year 4 变化后的部分具体连段仍需确认，因此不能把旧路线直接标为当前“最优”。([街霸6 Wiki：不知火舞](https://www.vi-ko.cn/pages/characters/wu.html)，[舞 2026 攻略索引](https://sf6-genten.com/character/mai/category/combo)，[Ultimate Frame Data：Mai](https://ultimateframedata.com/sf6/mai))

## 来源优先级

1. 当前补丁的游戏内训练模式与官方调整公告：用于最终确认路线、伤害和帧数。
2. 明确写出版本日期的 Year 4 路线页：用于建立当前路线骨架。
3. Ultimate Frame Data：用于单招发生、命中 / 被防和补丁变化；不能代替整条连段实测。
4. 角色专项 Wiki 和攻略：用于发现起手、资源选择、起身设置与替代路线。
5. 视频与玩家讨论：用于发现新思路；必须回训练模式复现，不能只凭标题或评论录入。

## 已确认的风险

- 资料页使用的“PC”有时被中文表写作“确反”，实际上页面可能指 Punish Counter；网站应继续写“惩罚康（PC）”，并把能否确反另行判断。
- UFD 的 active frames 是持续帧数，项目旧快照的 active 是动作内判定区间，两者不能混成同一列。
- 安全跳必须固定击倒路线、位置和跳攻击触及距离，并测试具体无敌技；看到 +42F 不能自动推导所有角色、所有位置都能安全跳。
- “最优伤害”会随资源、补正、角色状态和版本变化。对大学作业网站而言，优先保存稳定且能解释用途的实战路线，再额外标注高难路线。
- 网站当前已经收录 72 套连段，覆盖两批实用路线；这仍不代表穷举了补丁、资源和距离变化下的所有理论排列。

## 后续录入顺序

下一批补角色专属资源分支：JP 失忆和 SA2；阿鬼毒池；隆电刃；肯换边；杰米各酒量的 SA 路线；舞各烈火槽的版边路线。

之后再补同一起手的“省资源 / 高伤 / 搬角”横向对照，并记录训练模式测试项。只有用户或项目维护者在当前版本复现后，才把状态从“资料整理”改为“实机验证”。

## Sources

1. SF6 Lab. [JP](https://sf6-lab.net/en/fighters/jp/combo), [A.K.I.](https://sf6-lab.net/en/fighters/aki/combo), [Ryu](https://sf6-lab.net/en/fighters/ryu/combo), [Ken](https://sf6-lab.net/fighters/ken/combo), [Jamie](https://sf6-lab.net/en/fighters/jamie/combo), [Mai](https://sf6-lab.net/en/fighters/mai/combo). Year 4 current-version route pages; accessed 2026-09-16. JP / A.K.I. / Ryu / Ken pages identify the 2026-08-03 balance-update baseline and an update date of 2026-08-31.
2. 街霸6 Wiki. [JP](https://www.vi-ko.cn/pages/characters/JP.html), [阿鬼](https://www.vi-ko.cn/pages/characters/agui.html), [隆](https://www.vi-ko.cn/pages/characters/long.html), [肯](https://www.vi-ko.cn/pages/characters/ken.html), [杰米](https://www.vi-ko.cn/pages/characters/jiemi.html), [不知火舞](https://www.vi-ko.cn/pages/characters/wu.html). Accessed 2026-09-09.
3. Ultimate Frame Data. [JP](https://ultimateframedata.com/sf6/jp), [A.K.I.](https://ultimateframedata.com/sf6/aki), [Ryu](https://ultimateframedata.com/sf6/ryu), [Ken](https://ultimateframedata.com/sf6/ken), [Jamie](https://ultimateframedata.com/sf6/jamie), [Mai](https://ultimateframedata.com/sf6/mai). Accessed 2026-09-09.
4. Capcom. [Ryu Character Guide PDF](https://static.capcom.com/streetfighter/downloads/04P_sf_Ryu.pdf).
5. スト6原典. [JP combo index](https://sf6-ingrid.com/character/jp/category/combo). Updated entries through 2026.
6. スト6原典. [Mai combo index](https://sf6-genten.com/character/mai/category/combo). Updated 2026-08-25; includes an explicit Year 4 recipe limitation.
