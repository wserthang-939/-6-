# 2026-09-09 内容扩充

新增 24 条核心招式、24 条连段和 12 条关联套路。每角色现在有 10 招、8 套连段、7 条套路。保留原 ID 和收藏。

## 连段选择

选择常用、可说明条件的路线，不声称当前版本全角色全资源的绝对最高伤害。以版中/版边、资源、稳定性、起攻、酒量或烈火槽区分目标，不引用未复测的旧伤害数字。

- [JP 连段表](https://www.vi-ko.cn/pages/characters/JP.html)：PC 重拳、绿冲蹲重拳、版边 OD 延展、裸绿冲下段；地刺后布置另留 2 格。
- [阿鬼连段表](https://www.vi-ko.cn/pages/characters/agui.html)：绿冲中脚、毒发中鞭前冲轻脚、版边毒发延展、轻拳 CH。毒发安全跳只关联指定路线。
- [隆连段表](https://www.vi-ko.cn/pages/characters/long.html)：下中脚绿冲、版边重驴踢追升龙、重脚 PC、轻驴踢版边安全跳。
- [肯连段表](https://www.vi-ko.cn/pages/characters/ken.html)：重拳疾跑、版边迅雷追击、中拳 PC、轻拳目押轻龙卷。选简化追击，不把它标成极限最优。
- [杰米连段表](https://www.vi-ko.cn/pages/characters/jiemi.html)：0/1/2 酒中拳分支、重脚 PC 崩解。该页部分拳脚表与 UFD 明显不符，不能用于新增拳脚数值。
- [舞连段表](https://www.vi-ko.cn/pages/characters/wu.html)：无火重龙炎舞追升龙、版边星孔雀、有火中龙炎舞、绿冲强制站立。

## 新增帧数

`expandedFrames.json` 记录查询时 UFD 数据，保留独立来源标签，不冒用旧快照的补丁号。UFD 的 activeframes 是持续帧数，旧快照 active 是动作内判定区间，界面分别标注。

来源：[JP](https://ultimateframedata.com/sf6/jp)、[阿鬼](https://ultimateframedata.com/sf6/aki)、[隆](https://ultimateframedata.com/sf6/ryu)、[肯](https://ultimateframedata.com/sf6/ken)、[杰米](https://ultimateframedata.com/sf6/jamie)、[舞](https://ultimateframedata.com/sf6/mai)。

肯蹲中拳 UFD 记载 2026-08 更新后命中 +5；杰米站重拳发生 5/7/12F，第二击可取消，不能用旧中文表的 10F 单段描述。舞后重脚普通被防 −1，绿冲后才是 +3。

## 陷阱与验证范围

帧数陷阱的时间推导只针对指定的 4F 普通抢招、立即输入且够得到的情况，不覆盖无敌技、招架、推远挥空。连段起手被防分支与击倒后设置分开标注。

肯 +25F 击倒→19F 前冲→5F/4F 持续的站中拳压起身，是限定实际帧数和距离后的推导，不是所有升龙收尾固定可用。安全跳要求指定收尾与接触、落地防御及反击测试；本站没有进行游戏内逐条验证。
