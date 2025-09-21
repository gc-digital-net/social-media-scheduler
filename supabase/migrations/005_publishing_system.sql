-- Create post_platforms table for many-to-many relationship with social accounts
CREATE TABLE IF NOT EXISTS post_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  social_account_id UUID REFERENCES social_accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, platform, social_account_id)
);

-- Create post_analytics table for tracking post performance
CREATE TABLE IF NOT EXISTS post_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_post_id VARCHAR(255),
  published_at TIMESTAMPTZ,
  initial_metrics JSONB DEFAULT '{}',
  latest_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cron_logs table for tracking scheduled job executions
CREATE TABLE IF NOT EXISTS cron_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_name VARCHAR(100) NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  status VARCHAR(50),
  details JSONB,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_platforms_post_id ON post_platforms(post_id);
CREATE INDEX IF NOT EXISTS idx_post_platforms_social_account_id ON post_platforms(social_account_id);
CREATE INDEX IF NOT EXISTS idx_post_analytics_post_id ON post_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_post_analytics_platform ON post_analytics(platform);
CREATE INDEX IF NOT EXISTS idx_cron_logs_job_name ON cron_logs(job_name);
CREATE INDEX IF NOT EXISTS idx_cron_logs_executed_at ON cron_logs(executed_at);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for_status ON posts(scheduled_for, status);

-- Enable RLS
ALTER TABLE post_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cron_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_platforms
CREATE POLICY "Users can view post platforms for their posts" 
  ON post_platforms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_platforms.post_id
      AND (
        p.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM workspace_members wm
          WHERE wm.workspace_id = p.workspace_id
          AND wm.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can manage post platforms for their posts"
  ON post_platforms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_platforms.post_id
      AND p.created_by = auth.uid()
    )
  );

-- RLS policies for post_analytics
CREATE POLICY "Users can view analytics for their posts" 
  ON post_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_analytics.post_id
      AND (
        p.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM workspace_members wm
          WHERE wm.workspace_id = p.workspace_id
          AND wm.user_id = auth.uid()
        )
      )
    )
  );

-- RLS policies for cron_logs (admin only)
CREATE POLICY "Only service role can access cron logs"
  ON cron_logs FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for post_analytics
CREATE TRIGGER update_post_analytics_updated_at
  BEFORE UPDATE ON post_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();