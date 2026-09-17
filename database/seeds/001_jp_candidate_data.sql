-- JP 样板数据。
-- 重要：这些内容由现有前端资料迁移而来，尚未完成当前版本实机复测。
-- 招式帧数标记为 source_checked，连段标记为 draft，因此不会进入 AI verified 视图。

BEGIN;

INSERT INTO games (slug, name_zh, name_en, publisher)
VALUES ('street-fighter-6', '街头霸王6', 'Street Fighter 6', 'CAPCOM')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sources (source_type, title, url, language, accessed_at, reliability_level, notes)
VALUES
  ('frame_database', 'Frame Search · JP', 'https://frame-search.com/?lang=en-us&character_name=JP', 'en', '2026-09-09', 4, '现有站点帧数快照的主要来源。'),
  ('frame_database', 'Ultimate Frame Data · JP', 'https://ultimateframedata.com/sf6/jp', 'en', '2026-09-09', 4, '用于交叉对照；查询时页面未统一标明补丁号。'),
  ('wiki', '街霸6 Wiki · JP', 'https://www.vi-ko.cn/pages/characters/JP.html', 'zh-CN', '2026-09-09', 3, '现有站点连段候选来源，需实机复测。'),
  ('wiki', 'SF6 Lab · JP Combos', 'https://sf6-lab.net/en/fighters/jp/combo', 'en', '2026-09-16', 3, '扩展连段候选来源，需实机复测。')
ON CONFLICT (url) DO NOTHING;

INSERT INTO game_versions (
  game_id, version_name, is_current, verification_status, source_id, notes
)
SELECT
  g.id,
  '2.0401.010',
  false,
  'source_checked',
  s.id,
  '从资料站标签迁移的历史快照；未确认其为当前版本，禁止自动设为当前版本。'
FROM games g
JOIN sources s ON s.url = 'https://frame-search.com/?lang=en-us&character_name=JP'
WHERE g.slug = 'street-fighter-6'
ON CONFLICT (game_id, version_name) DO NOTHING;

INSERT INTO characters (
  game_id, external_key, slug, name_zh, name_en, archetype, description
)
SELECT
  id,
  'jp',
  'jp',
  'JP',
  'JP',
  '远程控制',
  '使用投射物、地刺与裂隙控制空间的角色。'
FROM games
WHERE slug = 'street-fighter-6'
ON CONFLICT (game_id, external_key) DO NOTHING;

INSERT INTO entity_aliases (entity_type, entity_id, alias, normalized_alias, language)
SELECT 'character', c.id, value.alias, value.normalized_alias, value.language
FROM characters c
CROSS JOIN (VALUES
  ('JP', 'jp', 'en'),
  ('约翰·彼得罗维奇', '约翰彼得罗维奇', 'zh-CN')
) AS value(alias, normalized_alias, language)
WHERE c.external_key = 'jp'
ON CONFLICT (entity_type, entity_id, normalized_alias) DO NOTHING;

INSERT INTO resources (game_id, code, name_zh, unit_name, maximum)
SELECT id, value.code, value.name_zh, value.unit_name, value.maximum
FROM games
CROSS JOIN (VALUES
  ('drive', '斗气', '格', 6::numeric),
  ('super', 'SA量表', '格', 3::numeric)
) AS value(code, name_zh, unit_name, maximum)
WHERE slug = 'street-fighter-6'
ON CONFLICT (game_id, code) DO NOTHING;

INSERT INTO moves (
  character_id, external_key, name_zh, name_en, move_type, category, description
)
SELECT c.id, value.external_key, value.name_zh, value.name_en, value.move_type::move_type,
       value.category, value.description
FROM characters c
CROSS JOIN (VALUES
  ('jp-move-1', '蹲轻拳', 'Crouching Light Punch', 'normal', '近身防守', '近身基础轻攻击，可用于轻攻击确认。'),
  ('jp-move-2', '站重脚', 'Standing Heavy Kick', 'normal', '连段起手', '重攻击起手。'),
  ('jp-move-3', '风神', 'Stribog', 'special', '连段收尾', '按强度产生不同性能的手杖攻击。'),
  ('jp-move-4', '三头神', 'Triglav', 'special', '远程牵制', '按强度改变出现位置的地面攻击。'),
  ('jp-move-5', '离场', 'Departure', 'special', '裂隙设置', '放置裂隙，为后续空间控制创造条件。'),
  ('jp-move-6', '失忆', 'Amnesia', 'special', '反制招式', '针对对手攻击使用的反制动作。'),
  ('jp-move-7', '蹲中拳', 'Crouching Medium Punch', 'normal', '连段起手', '中距离连段组件。'),
  ('jp-move-8', '站重拳', 'Standing Heavy Punch', 'normal', '确反起手', '版中惩罚反击起手。'),
  ('jp-move-9', '前重脚', 'Bylina', 'unique', '浮空组件', '版边浮空连段组件。'),
  ('jp-move-10', '蹲重拳', 'Crouching Heavy Punch', 'normal', '对空', '对空与绿冲连段组件。')
) AS value(external_key, name_zh, name_en, move_type, category, description)
WHERE c.external_key = 'jp'
ON CONFLICT (character_id, external_key) DO NOTHING;

INSERT INTO move_commands (
  move_id, notation, display_command, input_sequence, button_strength, is_od, display_order
)
SELECT m.id, value.notation, value.display_command, value.input_sequence::jsonb,
       value.button_strength, value.is_od, value.display_order
FROM moves m
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('jp-move-1', '2LP', '↓ + LP', '["2","LP"]', 'LP', false, 0),
    ('jp-move-2', '5HK', 'HK', '["5","HK"]', 'HK', false, 0),
    ('jp-move-3', '236LP', '↓↘→ + LP', '["2","3","6","LP"]', 'LP', false, 0),
    ('jp-move-3', '236MP', '↓↘→ + MP', '["2","3","6","MP"]', 'MP', false, 1),
    ('jp-move-3', '236HP', '↓↘→ + HP', '["2","3","6","HP"]', 'HP', false, 2),
    ('jp-move-4', '22LP', '↓↓ + LP', '["2","2","LP"]', 'LP', false, 0),
    ('jp-move-4', '22MP', '↓↓ + MP', '["2","2","MP"]', 'MP', false, 1),
    ('jp-move-4', '22HP', '↓↓ + HP', '["2","2","HP"]', 'HP', false, 2),
    ('jp-move-5', '214LP', '↓↙← + LP', '["2","1","4","LP"]', 'LP', false, 0),
    ('jp-move-5', '214MP', '↓↙← + MP', '["2","1","4","MP"]', 'MP', false, 1),
    ('jp-move-5', '214HP', '↓↙← + HP', '["2","1","4","HP"]', 'HP', false, 2),
    ('jp-move-6', '22K', '↓↓ + K', '["2","2","K"]', 'K', false, 0),
    ('jp-move-6', '22KK', '↓↓ + KK', '["2","2","KK"]', 'KK', true, 1),
    ('jp-move-7', '2MP', '↓ + MP', '["2","MP"]', 'MP', false, 0),
    ('jp-move-8', '5HP', 'HP', '["5","HP"]', 'HP', false, 0),
    ('jp-move-9', '6HK', '→ + HK', '["6","HK"]', 'HK', false, 0),
    ('jp-move-10', '2HP', '↓ + HP', '["2","HP"]', 'HP', false, 0)
  ) AS commands(move_key, notation, display_command, input_sequence, button_strength, is_od, display_order)
  WHERE commands.move_key = m.external_key
) value
WHERE m.character_id = (SELECT id FROM characters WHERE external_key = 'jp')
ON CONFLICT (move_id, notation, control_type) DO NOTHING;

-- 招式帧数：保留来源快照，不填入现有资料没有提供的伤害。
INSERT INTO move_version_stats (
  move_id, move_command_id, version_id, startup_frames, active_frames,
  recovery_frames, total_frames, on_hit, on_hit_result, on_block,
  cancel_options, extra_data, verification_status, updated_at
)
SELECT
  m.id,
  mc.id,
  gv.id,
  value.startup,
  value.active::jsonb,
  value.recovery,
  value.total_frames,
  value.on_hit,
  value.on_hit_result,
  value.on_block,
  value.cancel_options,
  jsonb_build_object('source_scope', value.source_scope),
  'source_checked',
  '2026-09-09'
FROM (VALUES
  ('jp-move-1', '2LP', 4, '[{"from":4,"to":5}]', 11, NULL, 4, NULL, -1, ARRAY['special'], '普通命中'),
  ('jp-move-2', '5HK', 12, '[{"from":12,"to":15}]', 17, NULL, 7, NULL, 2, ARRAY[]::text[], '首个有效帧接触'),
  ('jp-move-3', '236LP', 16, '[{"from":16,"to":21}]', NULL, 49, NULL, 'knockdown', -10, ARRAY['SA3'], '轻版'),
  ('jp-move-3', '236MP', 20, '[{"from":20,"to":22},{"from":24,"to":26}]', NULL, 53, NULL, 'knockdown', -8, ARRAY['SA3'], '中版'),
  ('jp-move-3', '236HP', 28, '[{"from":28,"to":30},{"from":40,"to":42}]', NULL, 61, NULL, 'knockdown', 4, ARRAY['SA3'], '重版'),
  ('jp-move-4', '22LP', 22, '[{"from":22,"to":31}]', NULL, 55, NULL, 'knockdown', -2, ARRAY['SA3'], '近距离落点'),
  ('jp-move-4', '22MP', 22, '[{"from":22,"to":31}]', NULL, 55, NULL, 'knockdown', -2, ARRAY['SA3'], '中距离落点'),
  ('jp-move-4', '22HP', 22, '[{"from":22,"to":31}]', NULL, 55, NULL, 'knockdown', -2, ARRAY['SA3'], '远距离落点'),
  ('jp-move-6', '22K', 3, '[{"from":3,"to":20}]', 35, NULL, NULL, 'counter_stance', NULL, ARRAY[]::text[], '普通版'),
  ('jp-move-6', '22KK', 1, '[{"from":1,"to":20}]', 35, NULL, NULL, 'counter_stance', NULL, ARRAY[]::text[], 'OD版'),
  ('jp-move-7', '2MP', 7, '[{"duration":4}]', 14, NULL, 6, NULL, -2, ARRAY['special','super'], '普通状态'),
  ('jp-move-8', '5HP', 12, '[{"duration":2}]', 22, NULL, 3, NULL, -3, ARRAY['special','super'], '普通状态'),
  ('jp-move-9', '6HK', 11, '[{"duration":6}]', 24, NULL, NULL, 'knockdown', -5, ARRAY['second_hit_special','second_hit_super'], '击倒优势候选 +38F，需单独实测'),
  ('jp-move-10', '2HP', 9, '[{"duration":6}]', 20, NULL, 1, NULL, -6, ARRAY[]::text[], '普通状态')
) AS value(move_key, notation, startup, active, recovery, total_frames, on_hit,
           on_hit_result, on_block, cancel_options, source_scope)
JOIN moves m ON m.external_key = value.move_key
JOIN move_commands mc ON mc.move_id = m.id AND mc.notation = value.notation
JOIN characters c ON c.id = m.character_id AND c.external_key = 'jp'
JOIN game_versions gv ON gv.game_id = c.game_id AND gv.version_name = '2.0401.010'
ON CONFLICT (move_id, move_command_id, version_id) DO NOTHING;

INSERT INTO fact_sources (entity_type, entity_id, source_id, notes)
SELECT 'move_stat', mvs.id, s.id, '由现有站点资料快照迁移；发布为 verified 前必须复核版本并实机测试。'
FROM move_version_stats mvs
JOIN moves m ON m.id = mvs.move_id
JOIN characters c ON c.id = m.character_id AND c.external_key = 'jp'
JOIN sources s ON s.url = 'https://frame-search.com/?lang=en-us&character_name=JP'
ON CONFLICT (entity_type, entity_id, field_name, source_id) DO NOTHING;

INSERT INTO combos (
  character_id, external_key, name, notation, position, side_switch,
  difficulty, difficulty_score, starter_types, purpose, conditions, description
)
SELECT c.id, value.external_key, value.name, value.notation,
       value.position::stage_position, value.side_switch,
       value.difficulty::difficulty_level, value.score, value.starters::starter_type[],
       value.purpose, value.conditions, value.description
FROM characters c
CROSS JOIN (VALUES
  ('jp-combo-2', '重攻击确认 · 基础确反', '5HK, 2MP > 236MP', 'anywhere', false, 'beginner', 2, ARRAY['heavy','normal_hit'], '基础确反', '站重脚后蹲中拳可触及', '站重脚命中后目押蹲中拳，取消中风神。'),
  ('jp-combo-4', '版边浮空 · 地刺收尾', '6HK > 236HP, 5HP > 22LP', 'corner', false, 'intermediate', 3, ARRAY['heavy'], '版边浮空', '对手在版边；6HK 完整命中', '前重脚浮空后接重风神，再用站重拳和近地刺收尾。'),
  ('jp-combo-6', '版中绿冲 · 打远再牵制', '2MP > DRC 2HP > 236HP, 236MK, 22HP', 'midscreen', false, 'intermediate', 3, ARRAY['medium'], '拉开距离', '蹲中拳够得到；绿冲蹲重拳命中', '中拳命中后使用绿冲转成击倒。'),
  ('jp-combo-8', '裸绿冲下段 · 中拳接风神', 'DR 2MK, 2MP > 236MP', 'midscreen', false, 'intermediate', 3, ARRAY['low','medium'], '下段起手', '裸绿冲蹲中脚；后续蹲中拳够得到', '用绿冲下段抓站防，命中后接中风神。')
) AS value(external_key, name, notation, position, side_switch, difficulty, score,
           starters, purpose, conditions, description)
WHERE c.external_key = 'jp'
ON CONFLICT (character_id, external_key) DO NOTHING;

INSERT INTO combo_steps (combo_id, step_order, move_id, move_command_id, raw_notation, link_type, notes)
SELECT c.id, value.step_order, m.id, mc.id, value.raw_notation,
       value.link_type::link_type, value.notes
FROM combos c
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('jp-combo-2', 1, 'jp-move-2', '5HK', '5HK', 'link', NULL),
    ('jp-combo-2', 2, 'jp-move-7', '2MP', '2MP', 'link', NULL),
    ('jp-combo-2', 3, 'jp-move-3', '236MP', '236MP', 'cancel', NULL),
    ('jp-combo-4', 1, 'jp-move-9', '6HK', '6HK', 'juggle', '需要完整命中'),
    ('jp-combo-4', 2, 'jp-move-3', '236HP', '236HP', 'cancel', NULL),
    ('jp-combo-4', 3, 'jp-move-8', '5HP', '5HP', 'juggle', NULL),
    ('jp-combo-4', 4, 'jp-move-4', '22LP', '22LP', 'cancel', NULL),
    ('jp-combo-6', 1, 'jp-move-7', '2MP', '2MP', 'link', NULL),
    ('jp-combo-6', 2, 'jp-move-10', '2HP', 'DRC 2HP', 'drive_rush', '连段中取消绿冲'),
    ('jp-combo-6', 3, 'jp-move-3', '236HP', '236HP', 'cancel', NULL),
    ('jp-combo-6', 4, NULL, NULL, '236MK', 'juggle', '对应招式尚待结构化录入'),
    ('jp-combo-6', 5, 'jp-move-4', '22HP', '22HP', 'juggle', NULL),
    ('jp-combo-8', 1, NULL, NULL, 'DR 2MK', 'drive_rush', '裸绿冲起手；2MK尚待结构化录入'),
    ('jp-combo-8', 2, 'jp-move-7', '2MP', '2MP', 'link', NULL),
    ('jp-combo-8', 3, 'jp-move-3', '236MP', '236MP', 'cancel', NULL)
  ) AS steps(combo_key, step_order, move_key, command_notation, raw_notation, link_type, notes)
  WHERE steps.combo_key = c.external_key
) value
LEFT JOIN moves m ON m.external_key = value.move_key AND m.character_id = c.character_id
LEFT JOIN move_commands mc ON mc.move_id = m.id AND mc.notation = value.command_notation
WHERE c.character_id = (SELECT id FROM characters WHERE external_key = 'jp')
ON CONFLICT (combo_id, step_order) DO NOTHING;

INSERT INTO combo_version_stats (
  combo_id, version_id, works_midscreen, works_corner, extra_data, verification_status
)
SELECT c.id, gv.id,
       value.works_midscreen, value.works_corner,
       jsonb_build_object('migration_note', '伤害与压制帧数未在现有资料中得到可靠验证，保持 NULL。'),
       'draft'
FROM (VALUES
  ('jp-combo-2', true, true),
  ('jp-combo-4', false, true),
  ('jp-combo-6', true, false),
  ('jp-combo-8', true, false)
) AS value(combo_key, works_midscreen, works_corner)
JOIN combos c ON c.external_key = value.combo_key
JOIN characters ch ON ch.id = c.character_id AND ch.external_key = 'jp'
JOIN game_versions gv ON gv.game_id = ch.game_id AND gv.version_name = '2.0401.010'
ON CONFLICT (combo_id, version_id) DO NOTHING;

INSERT INTO combo_resource_changes (combo_stat_id, resource_id, change_type, amount, condition)
SELECT cvs.id, r.id, 'cost', value.amount, '现有连段元数据标注；待实机复核'
FROM (VALUES
  ('jp-combo-6', 'drive', 3::numeric),
  ('jp-combo-8', 'drive', 1::numeric)
) AS value(combo_key, resource_code, amount)
JOIN combos c ON c.external_key = value.combo_key
JOIN combo_version_stats cvs ON cvs.combo_id = c.id
JOIN characters ch ON ch.id = c.character_id
JOIN resources r ON r.game_id = ch.game_id AND r.code = value.resource_code
ON CONFLICT (combo_stat_id, resource_id, change_type, condition) DO NOTHING;

INSERT INTO fact_sources (entity_type, entity_id, source_id, notes)
SELECT 'combo', c.id, s.id, '连段候选来源；未通过实机测试，不能用于 AI 精确回答。'
FROM combos c
JOIN characters ch ON ch.id = c.character_id AND ch.external_key = 'jp'
JOIN sources s ON s.url = 'https://www.vi-ko.cn/pages/characters/JP.html'
ON CONFLICT (entity_type, entity_id, field_name, source_id) DO NOTHING;

COMMIT;
