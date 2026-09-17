BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE verification_status AS ENUM (
  'draft', 'source_checked', 'tested', 'verified', 'disputed', 'outdated'
);
CREATE TYPE source_type AS ENUM (
  'official_patch', 'official_guide', 'in_game_test', 'frame_database',
  'wiki', 'video', 'community', 'internal'
);
CREATE TYPE move_type AS ENUM (
  'normal', 'unique', 'target_combo', 'special', 'super', 'throw', 'system'
);
CREATE TYPE stage_position AS ENUM ('anywhere', 'midscreen', 'near_corner', 'corner');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE starter_type AS ENUM (
  'normal_hit', 'counter_hit', 'punish_counter', 'light', 'medium', 'heavy',
  'low', 'overhead', 'jump_in', 'drive_impact', 'wall_splat', 'stun', 'setup_specific'
);
CREATE TYPE link_type AS ENUM (
  'link', 'cancel', 'target_combo', 'drive_rush', 'juggle', 'manual_timing', 'other'
);
CREATE TYPE resource_change_type AS ENUM ('cost', 'gain');
CREATE TYPE document_type AS ENUM ('guide', 'mechanic', 'patch_note', 'test_note', 'faq');

CREATE TABLE games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_zh text NOT NULL,
  name_en text,
  publisher text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type source_type NOT NULL,
  title text NOT NULL,
  url text NOT NULL UNIQUE,
  author text,
  language text NOT NULL DEFAULT 'zh-CN',
  published_at timestamptz,
  accessed_at timestamptz NOT NULL,
  reliability_level smallint NOT NULL DEFAULT 3 CHECK (reliability_level BETWEEN 1 AND 5),
  archived_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE game_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  version_name text NOT NULL,
  patch_date date,
  effective_from timestamptz,
  effective_to timestamptz,
  is_current boolean NOT NULL DEFAULT false,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  source_id uuid REFERENCES sources(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (game_id, version_name),
  CHECK (effective_to IS NULL OR effective_from IS NULL OR effective_to > effective_from)
);
CREATE UNIQUE INDEX one_current_version_per_game
  ON game_versions (game_id) WHERE is_current;

CREATE TABLE characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  external_key text NOT NULL,
  slug text NOT NULL,
  name_zh text NOT NULL,
  name_en text,
  name_ja text,
  archetype text,
  description text,
  released_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (game_id, external_key),
  UNIQUE (game_id, slug)
);

CREATE TABLE entity_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('character', 'move', 'mechanic')),
  entity_id uuid NOT NULL,
  alias text NOT NULL,
  normalized_alias text NOT NULL,
  language text NOT NULL DEFAULT 'zh-CN',
  UNIQUE (entity_type, entity_id, normalized_alias)
);
CREATE INDEX entity_alias_lookup ON entity_aliases (normalized_alias);

CREATE TABLE moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  external_key text NOT NULL,
  parent_move_id uuid REFERENCES moves(id),
  name_zh text NOT NULL,
  name_en text,
  move_type move_type NOT NULL,
  category text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (character_id, external_key)
);

CREATE TABLE move_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  move_id uuid NOT NULL REFERENCES moves(id) ON DELETE CASCADE,
  notation text NOT NULL,
  display_command text,
  input_sequence jsonb NOT NULL DEFAULT '[]'::jsonb,
  button_strength text,
  control_type text NOT NULL DEFAULT 'classic' CHECK (control_type IN ('classic', 'modern', 'dynamic')),
  side_relative boolean NOT NULL DEFAULT true,
  is_od boolean NOT NULL DEFAULT false,
  display_order smallint NOT NULL DEFAULT 0,
  UNIQUE (move_id, notation, control_type)
);

CREATE TABLE charge_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  move_command_id uuid NOT NULL REFERENCES move_commands(id) ON DELETE CASCADE,
  version_id uuid NOT NULL REFERENCES game_versions(id) ON DELETE CASCADE,
  charge_direction text NOT NULL,
  minimum_frames smallint CHECK (minimum_frames >= 0),
  release_direction text,
  retention_frames smallint CHECK (retention_frames >= 0),
  partition_allowed boolean,
  notes text,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  verified_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (move_command_id, version_id)
);

CREATE TABLE move_version_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  move_id uuid NOT NULL REFERENCES moves(id) ON DELETE CASCADE,
  move_command_id uuid REFERENCES move_commands(id) ON DELETE CASCADE,
  version_id uuid NOT NULL REFERENCES game_versions(id) ON DELETE CASCADE,
  startup_frames smallint CHECK (startup_frames >= 0),
  active_frames jsonb,
  recovery_frames smallint CHECK (recovery_frames >= 0),
  total_frames smallint CHECK (total_frames >= 0),
  on_hit integer,
  on_hit_result text,
  on_block integer,
  on_counter_hit integer,
  damage integer CHECK (damage >= 0),
  chip_damage integer CHECK (chip_damage >= 0),
  hit_level text,
  cancel_options text[] NOT NULL DEFAULT '{}',
  knockdown_type text,
  extra_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  verified_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE NULLS NOT DISTINCT (move_id, move_command_id, version_id)
);

CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  code text NOT NULL,
  name_zh text NOT NULL,
  unit_name text NOT NULL,
  maximum numeric,
  UNIQUE (game_id, code)
);

CREATE TABLE move_resource_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  move_stat_id uuid NOT NULL REFERENCES move_version_stats(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  change_type resource_change_type NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  condition text,
  UNIQUE (move_stat_id, resource_id, change_type, condition)
);

CREATE TABLE combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id uuid NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  external_key text NOT NULL,
  name text NOT NULL,
  notation text NOT NULL,
  position stage_position NOT NULL DEFAULT 'anywhere',
  side_switch boolean,
  difficulty difficulty_level NOT NULL,
  difficulty_score smallint CHECK (difficulty_score BETWEEN 1 AND 5),
  starter_types starter_type[] NOT NULL DEFAULT '{}',
  purpose text,
  conditions text,
  description text,
  control_type text NOT NULL DEFAULT 'classic' CHECK (control_type IN ('classic', 'modern', 'dynamic')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (character_id, external_key)
);

CREATE TABLE combo_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id uuid NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  step_order smallint NOT NULL CHECK (step_order > 0),
  move_id uuid REFERENCES moves(id),
  move_command_id uuid REFERENCES move_commands(id),
  raw_notation text NOT NULL,
  link_type link_type NOT NULL DEFAULT 'other',
  delay_frames smallint CHECK (delay_frames >= 0),
  optional_group text,
  notes text,
  UNIQUE (combo_id, step_order)
);

CREATE TABLE combo_version_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id uuid NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  version_id uuid NOT NULL REFERENCES game_versions(id) ON DELETE CASCADE,
  total_damage integer CHECK (total_damage >= 0),
  oki_advantage integer,
  oki_measurement text,
  works_midscreen boolean,
  works_corner boolean,
  side_switch_result text,
  extra_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  verified_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (combo_id, version_id)
);

CREATE TABLE combo_resource_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_stat_id uuid NOT NULL REFERENCES combo_version_stats(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  change_type resource_change_type NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  condition text,
  UNIQUE (combo_stat_id, resource_id, change_type, condition)
);

CREATE TABLE fact_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (
    entity_type IN ('game_version', 'move_stat', 'charge_rule', 'combo', 'combo_stat', 'knowledge_document')
  ),
  entity_id uuid NOT NULL,
  field_name text,
  source_id uuid NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
  evidence_quote text,
  video_timestamp_seconds integer CHECK (video_timestamp_seconds >= 0),
  verified_by text,
  verified_at timestamptz,
  notes text,
  UNIQUE NULLS NOT DISTINCT (entity_type, entity_id, field_name, source_id)
);
CREATE INDEX fact_sources_entity ON fact_sources (entity_type, entity_id);

CREATE TABLE knowledge_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  version_id uuid REFERENCES game_versions(id),
  character_id uuid REFERENCES characters(id),
  document_type document_type NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  source_id uuid NOT NULL REFERENCES sources(id),
  valid_from timestamptz,
  valid_to timestamptz,
  verification_status verification_status NOT NULL DEFAULT 'draft',
  content_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, content_hash),
  CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to > valid_from)
);

CREATE TABLE knowledge_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL CHECK (chunk_index >= 0),
  heading_path text[] NOT NULL DEFAULT '{}',
  content text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  move_ids uuid[] NOT NULL DEFAULT '{}',
  token_count integer CHECK (token_count >= 0),
  embedding_model text,
  embedding vector(1536),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(array_to_string(heading_path, ' '), '') || ' ' || content)
  ) STORED,
  UNIQUE (document_id, chunk_index)
);
CREATE INDEX knowledge_chunks_text_search ON knowledge_chunks USING gin (search_vector);
CREATE INDEX knowledge_chunks_embedding ON knowledge_chunks
  USING hnsw (embedding vector_cosine_ops) WHERE embedding IS NOT NULL;

CREATE TABLE change_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('insert', 'update', 'verify', 'deprecate')),
  old_value jsonb,
  new_value jsonb,
  reason text NOT NULL,
  changed_by text NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX change_log_entity ON change_log (entity_type, entity_id, changed_at DESC);

CREATE VIEW ai_verified_move_facts AS
SELECT
  m.id AS move_id,
  m.external_key,
  m.name_zh,
  m.name_en,
  mc.notation,
  gv.version_name,
  s.startup_frames,
  s.active_frames,
  s.recovery_frames,
  s.total_frames,
  s.on_hit,
  s.on_hit_result,
  s.on_block,
  s.damage,
  s.cancel_options,
  s.updated_at
FROM move_version_stats s
JOIN moves m ON m.id = s.move_id
LEFT JOIN move_commands mc ON mc.id = s.move_command_id
JOIN game_versions gv ON gv.id = s.version_id
WHERE s.verification_status = 'verified';

CREATE VIEW ai_verified_combo_facts AS
SELECT
  c.id AS combo_id,
  c.external_key,
  c.name,
  c.notation,
  c.position,
  c.side_switch,
  c.difficulty,
  c.starter_types,
  c.conditions,
  gv.version_name,
  s.total_damage,
  s.oki_advantage,
  s.oki_measurement,
  s.works_midscreen,
  s.works_corner,
  s.updated_at
FROM combo_version_stats s
JOIN combos c ON c.id = s.combo_id
JOIN game_versions gv ON gv.id = s.version_id
WHERE s.verification_status = 'verified';

COMMIT;
