-- Create social_accounts table to allow multiple accounts per platform
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_handle VARCHAR(255),
  account_id VARCHAR(255), -- Platform-specific ID
  profile_image_url TEXT,
  access_token TEXT, -- Encrypted in production
  refresh_token TEXT, -- Encrypted in production
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_social_accounts_client ON social_accounts(client_account_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_active ON social_accounts(is_active);

-- Update posts table to reference social_accounts instead of just platform
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS social_account_id UUID REFERENCES social_accounts(id);

-- Create social_account_metrics table for tracking performance
CREATE TABLE IF NOT EXISTS social_account_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  social_account_id UUID NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  new_followers INTEGER DEFAULT 0,
  unfollowers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(social_account_id, date)
);

-- Create index for metrics queries
CREATE INDEX idx_social_metrics_account_date ON social_account_metrics(social_account_id, date DESC);

-- RLS Policies
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_account_metrics ENABLE ROW LEVEL SECURITY;

-- Policy for social_accounts
CREATE POLICY "Users can view social accounts for their client accounts" ON social_accounts
  FOR SELECT USING (
    client_account_id IN (
      SELECT ca.id FROM client_accounts ca
      JOIN account_permissions ap ON ca.id = ap.client_account_id
      WHERE ap.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create social accounts for their client accounts" ON social_accounts
  FOR INSERT WITH CHECK (
    client_account_id IN (
      SELECT ca.id FROM client_accounts ca
      JOIN account_permissions ap ON ca.id = ap.client_account_id
      WHERE ap.user_id = auth.uid() AND ap.permission_level IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can update social accounts they manage" ON social_accounts
  FOR UPDATE USING (
    client_account_id IN (
      SELECT ca.id FROM client_accounts ca
      JOIN account_permissions ap ON ca.id = ap.client_account_id
      WHERE ap.user_id = auth.uid() AND ap.permission_level IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Users can delete social accounts they own" ON social_accounts
  FOR DELETE USING (
    client_account_id IN (
      SELECT ca.id FROM client_accounts ca
      JOIN account_permissions ap ON ca.id = ap.client_account_id
      WHERE ap.user_id = auth.uid() AND ap.permission_level IN ('owner', 'admin')
    )
  );

-- Policy for social_account_metrics
CREATE POLICY "Users can view metrics for their social accounts" ON social_account_metrics
  FOR SELECT USING (
    social_account_id IN (
      SELECT sa.id FROM social_accounts sa
      JOIN client_accounts ca ON sa.client_account_id = ca.id
      JOIN account_permissions ap ON ca.id = ap.client_account_id
      WHERE ap.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_social_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_social_accounts_updated_at
BEFORE UPDATE ON social_accounts
FOR EACH ROW
EXECUTE FUNCTION update_social_accounts_updated_at();