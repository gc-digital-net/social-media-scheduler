-- Add title field to posts table if it doesn't exist
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Create post_platforms table for many-to-many relationship
CREATE TABLE IF NOT EXISTS post_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, platform)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for ON posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_workspace_id ON posts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_post_platforms_post_id ON post_platforms(post_id);

-- Enable RLS
ALTER TABLE post_platforms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for post_platforms
CREATE POLICY "Users can view post platforms for posts they can see" 
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

CREATE POLICY "Users can manage post platforms for posts they own"
  ON post_platforms FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      WHERE p.id = post_platforms.post_id
      AND p.created_by = auth.uid()
    )
  );