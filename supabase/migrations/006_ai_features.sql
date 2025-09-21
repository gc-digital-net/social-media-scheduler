-- Create AI usage tracking table
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  parameters JSONB,
  response JSONB,
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10, 4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content templates table
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  platform VARCHAR(50),
  category VARCHAR(100),
  variables JSONB DEFAULT '[]',
  hashtags TEXT[],
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create content ideas table
CREATE TABLE IF NOT EXISTS content_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  idea TEXT NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  source VARCHAR(100),
  trending_score DECIMAL(3, 2) DEFAULT 0,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create optimal timing table
CREATE TABLE IF NOT EXISTS optimal_timing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  hour INTEGER CHECK (hour >= 0 AND hour <= 23),
  engagement_score DECIMAL(5, 2),
  post_count INTEGER DEFAULT 0,
  avg_likes DECIMAL(10, 2),
  avg_comments DECIMAL(10, 2),
  avg_shares DECIMAL(10, 2),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, platform, day_of_week, hour)
);

-- Create hashtag performance table
CREATE TABLE IF NOT EXISTS hashtag_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  hashtag VARCHAR(100) NOT NULL,
  platform VARCHAR(50),
  usage_count INTEGER DEFAULT 0,
  avg_engagement DECIMAL(10, 2),
  trending_score DECIMAL(3, 2),
  last_used TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, hashtag, platform)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_templates_workspace_id ON content_templates(workspace_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_platform ON content_templates(platform);
CREATE INDEX IF NOT EXISTS idx_content_ideas_workspace_id ON content_ideas(workspace_id);
CREATE INDEX IF NOT EXISTS idx_content_ideas_status ON content_ideas(status);
CREATE INDEX IF NOT EXISTS idx_optimal_timing_workspace_platform ON optimal_timing(workspace_id, platform);
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_hashtag ON hashtag_performance(hashtag);
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_trending ON hashtag_performance(trending_score DESC);

-- Enable RLS
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimal_timing ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_performance ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_usage
CREATE POLICY "Users can view their own AI usage"
  ON ai_usage FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create AI usage records"
  ON ai_usage FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- RLS policies for content_templates
CREATE POLICY "Users can view templates in their workspace"
  ON content_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = content_templates.workspace_id
      AND wm.user_id = auth.uid()
    ) OR is_public = true
  );

CREATE POLICY "Users can manage templates they created"
  ON content_templates FOR ALL
  USING (created_by = auth.uid());

-- RLS policies for content_ideas
CREATE POLICY "Users can view ideas in their workspace"
  ON content_ideas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = content_ideas.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage ideas in their workspace"
  ON content_ideas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = content_ideas.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'member')
    )
  );

-- RLS policies for optimal_timing
CREATE POLICY "Users can view timing data for their workspace"
  ON optimal_timing FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = optimal_timing.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

-- RLS policies for hashtag_performance
CREATE POLICY "Users can view hashtag data for their workspace"
  ON hashtag_performance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = hashtag_performance.workspace_id
      AND wm.user_id = auth.uid()
    )
  );

-- Functions for analytics
CREATE OR REPLACE FUNCTION calculate_optimal_timing(p_workspace_id UUID, p_platform VARCHAR)
RETURNS TABLE(
  day_name VARCHAR,
  hour_24 INTEGER,
  score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE 
      WHEN ot.day_of_week = 0 THEN 'Sunday'
      WHEN ot.day_of_week = 1 THEN 'Monday'
      WHEN ot.day_of_week = 2 THEN 'Tuesday'
      WHEN ot.day_of_week = 3 THEN 'Wednesday'
      WHEN ot.day_of_week = 4 THEN 'Thursday'
      WHEN ot.day_of_week = 5 THEN 'Friday'
      WHEN ot.day_of_week = 6 THEN 'Saturday'
    END AS day_name,
    ot.hour AS hour_24,
    ot.engagement_score AS score
  FROM optimal_timing ot
  WHERE ot.workspace_id = p_workspace_id
    AND ot.platform = p_platform
  ORDER BY ot.engagement_score DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Function to get trending hashtags
CREATE OR REPLACE FUNCTION get_trending_hashtags(p_workspace_id UUID, p_platform VARCHAR DEFAULT NULL)
RETURNS TABLE(
  hashtag VARCHAR,
  score DECIMAL,
  usage_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    hp.hashtag,
    hp.trending_score AS score,
    hp.usage_count
  FROM hashtag_performance hp
  WHERE hp.workspace_id = p_workspace_id
    AND (p_platform IS NULL OR hp.platform = p_platform)
    AND hp.trending_score > 0
  ORDER BY hp.trending_score DESC, hp.usage_count DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;