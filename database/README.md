# 游戏资料与 AI 知识库

本目录是网站 AI 的可信资料层。现有 Vue 前端数据不会自动被视为已验证事实。

## 当前阶段

- `migrations/001_game_knowledge_schema.sql`：PostgreSQL + pgvector 数据结构。
- `seeds/001_jp_candidate_data.sql`：JP 第一批候选资料。
- 候选招式帧数为 `source_checked`，候选连段为 `draft`。
- `ai_verified_move_facts` 和 `ai_verified_combo_facts` 只返回 `verified` 数据。
- JP 种子不会出现在上述 AI 视图中，直到人工复核并更新验证状态。

## 数据库要求

- PostgreSQL 15 或更高版本。
- `pgcrypto` 扩展。
- `pgvector` 扩展。
- `knowledge_chunks.embedding` 当前为 `vector(1536)`；选择嵌入模型后，应确认维度是否一致。

## 执行顺序

```text
database/migrations/001_game_knowledge_schema.sql
database/seeds/001_jp_candidate_data.sql
```

迁移和种子都使用事务；种子采用稳定的 `external_key` 与冲突保护，可以重复执行。

## 数据发布规则

1. 新数据一律以 `draft` 写入。
2. 核对原始来源后可改为 `source_checked`。
3. 完成指定游戏版本的实机测试后改为 `tested`。
4. 第二人复核版本、数值、来源和适用条件后才可改为 `verified`。
5. 来源冲突的数据改为 `disputed`，不得对 AI 发布。
6. 新版本替代的数据改为 `outdated`，不要覆盖或删除历史记录。

## JP 样板尚缺资料

- 当前补丁的官方版本号与生效日期。
- 所有招式的伤害、资源变化和完整特殊规则。
- 现有四条样板连段的实测总伤害。
- 连段收尾后的压制帧数及测量方式。
- `236MK`、`2MK` 等尚未结构化的招式。
- 版中、版边、换边和距离条件的逐条复核。
- 官方公告、攻略和机制说明的知识库文档。

未知值必须保持 `NULL`，不能使用 `0` 或模型推测值代替。

## AI 查询约束

AI 后端只应通过受控查询接口读取资料：

- 精确数值：只查询 `ai_verified_move_facts` 和 `ai_verified_combo_facts`。
- 连段步骤：先确认对应 `combo_version_stats` 为 `verified`，再查询 `combo_steps`。
- 攻略解释：只检索关联文档为 `verified` 且版本匹配的 `knowledge_chunks`。
- 查询结果为空时，回答“当前资料库没有该版本下经过验证的数据”。
- 答案中的每个精确数字都必须能够通过 `fact_sources` 追溯来源。

## 下一步

先为 JP 建立一份人工复核清单，确认当前游戏版本，再逐项补齐招式伤害与四条样板连段的伤害、资源和压制帧数。完成后才开始导入攻略文档与生成向量。
