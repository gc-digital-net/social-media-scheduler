-- Migration: Add multi-account support for agencies
-- This adds client account management capabilities

-- 1. Client/Brand Accounts (Multiple per workspace)
CREATE TABLE IF NOT EXISTS client_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    brand_colors JSONB DEFAULT '{"primary": "#22c55e", "secondary": "#10b981"}',
    industry VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_internal BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Account Groups/Folders for Organization
CREATE TABLE IF NOT EXISTS account_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    parent_group_id UUID REFERENCES account_groups(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Many-to-many: Accounts can be in multiple groups
CREATE TABLE IF NOT EXISTS account_group_members (
    account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
    group_id UUID REFERENCES account_groups(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (account_id, group_id)
);

-- 4. Social connections per client account
CREATE TABLE IF NOT EXISTS account_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    platform_connection_id UUID NOT NULL REFERENCES platform_connections(id) ON DELETE CASCADE,
    custom_name VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_account_id, platform_connection_id)
);

-- 5. User permissions per client account
CREATE TABLE IF NOT EXISTS account_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'editor', 'contributor', 'viewer')),
    permissions JSONB DEFAULT '{}',
    granted_by UUID REFERENCES profiles(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, client_account_id)
);

-- 6. Account-specific external users (for client access)
CREATE TABLE IF NOT EXISTS account_external_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'reviewer', 'approver')),
    access_token UUID DEFAULT uuid_generate_v4(),
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_account_id, email)
);

-- 7. Approval workflow configuration
CREATE TABLE IF NOT EXISTS approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL DEFAULT '[]',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Approval requests and history
CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES approval_workflows(id),
    current_step INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'cancelled')),
    requested_by UUID REFERENCES profiles(id),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Individual approval actions
CREATE TABLE IF NOT EXISTS approval_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES profiles(id),
    external_approver_id UUID REFERENCES account_external_users(id),
    action VARCHAR(50) NOT NULL CHECK (action IN ('approve', 'reject', 'request_changes')),
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Update existing tables to support client accounts
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending_review', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approval_notes TEXT;

ALTER TABLE analytics 
ADD COLUMN IF NOT EXISTS client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE;

ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE;

ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_global BOOLEAN DEFAULT FALSE;

ALTER TABLE hashtag_groups 
ADD COLUMN IF NOT EXISTS client_account_id UUID REFERENCES client_accounts(id);

ALTER TABLE competitors 
ADD COLUMN IF NOT EXISTS client_account_id UUID REFERENCES client_accounts(id);

-- 11. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_accounts_workspace ON client_accounts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_client_accounts_status ON client_accounts(status);
CREATE INDEX IF NOT EXISTS idx_account_groups_workspace ON account_groups(workspace_id);
CREATE INDEX IF NOT EXISTS idx_account_connections_client ON account_connections(client_account_id);
CREATE INDEX IF NOT EXISTS idx_account_permissions_user ON account_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_account_permissions_client ON account_permissions(client_account_id);
CREATE INDEX IF NOT EXISTS idx_posts_client_account ON posts(client_account_id);
CREATE INDEX IF NOT EXISTS idx_posts_approval_status ON posts(client_account_id, approval_status);
CREATE INDEX IF NOT EXISTS idx_analytics_client_account ON analytics(client_account_id);
CREATE INDEX IF NOT EXISTS idx_media_library_client ON media_library(client_account_id);

-- 12. Row Level Security Policies

-- Enable RLS on new tables
ALTER TABLE client_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_external_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_actions ENABLE ROW LEVEL SECURITY;

-- Client accounts policies
CREATE POLICY "Users can view accounts in their workspace or with permission"
    ON client_accounts FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
        OR 
        id IN (
            SELECT client_account_id FROM account_permissions 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Workspace admins can manage client accounts"
    ON client_accounts FOR ALL
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- Account permissions policies
CREATE POLICY "Users can view their own permissions"
    ON account_permissions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Account admins can manage permissions"
    ON account_permissions FOR ALL
    USING (
        client_account_id IN (
            SELECT client_account_id FROM account_permissions
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- Posts policies update for client accounts
DROP POLICY IF EXISTS "Workspace members can view posts" ON posts;
CREATE POLICY "Users can view posts for their accounts"
    ON posts FOR SELECT
    USING (
        client_account_id IN (
            SELECT id FROM client_accounts
            WHERE workspace_id IN (
                SELECT workspace_id FROM workspace_members 
                WHERE user_id = auth.uid()
            )
        )
        OR
        client_account_id IN (
            SELECT client_account_id FROM account_permissions 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin', 'manager', 'editor', 'viewer')
        )
    );

DROP POLICY IF EXISTS "Workspace members can create posts" ON posts;
CREATE POLICY "Editors and above can create posts"
    ON posts FOR INSERT
    WITH CHECK (
        client_account_id IN (
            SELECT client_account_id FROM account_permissions 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin', 'manager', 'editor', 'contributor')
        )
    );

DROP POLICY IF EXISTS "Workspace members can update their posts" ON posts;
CREATE POLICY "Users can update posts based on role"
    ON posts FOR UPDATE
    USING (
        client_account_id IN (
            SELECT client_account_id FROM account_permissions 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin', 'manager', 'editor')
        )
        OR
        (
            created_by = auth.uid() 
            AND client_account_id IN (
                SELECT client_account_id FROM account_permissions 
                WHERE user_id = auth.uid() 
                AND role = 'contributor'
            )
        )
    );

DROP POLICY IF EXISTS "Workspace members can delete their posts" ON posts;
CREATE POLICY "Only admins can delete posts"
    ON posts FOR DELETE
    USING (
        client_account_id IN (
            SELECT client_account_id FROM account_permissions 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );

-- 13. Functions for common operations

-- Function to create default client account for workspace
CREATE OR REPLACE FUNCTION create_default_client_account(workspace_id UUID)
RETURNS UUID AS $$
DECLARE
    account_id UUID;
    workspace_name TEXT;
BEGIN
    SELECT name INTO workspace_name FROM workspaces WHERE id = workspace_id;
    
    INSERT INTO client_accounts (workspace_id, name, is_internal, status)
    VALUES (workspace_id, workspace_name || ' Main Account', TRUE, 'active')
    RETURNING id INTO account_id;
    
    -- Give all workspace members access to default account
    INSERT INTO account_permissions (user_id, client_account_id, role)
    SELECT user_id, account_id, 
           CASE 
               WHEN wm.role = 'owner' THEN 'owner'
               WHEN wm.role = 'admin' THEN 'admin'
               WHEN wm.role = 'member' THEN 'editor'
               ELSE 'viewer'
           END
    FROM workspace_members wm
    WHERE wm.workspace_id = workspace_id;
    
    RETURN account_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Migrate existing data to support client accounts

-- Create default client account for existing workspaces
DO $$
DECLARE
    ws RECORD;
    default_account_id UUID;
BEGIN
    FOR ws IN SELECT id FROM workspaces LOOP
        -- Create default account
        default_account_id := create_default_client_account(ws.id);
        
        -- Update existing posts
        UPDATE posts 
        SET client_account_id = default_account_id 
        WHERE workspace_id = ws.id 
        AND client_account_id IS NULL;
        
        -- Update existing analytics
        UPDATE analytics 
        SET client_account_id = default_account_id 
        WHERE post_id IN (
            SELECT id FROM posts WHERE workspace_id = ws.id
        )
        AND client_account_id IS NULL;
        
        -- Update existing media
        UPDATE media_library 
        SET client_account_id = default_account_id 
        WHERE workspace_id = ws.id 
        AND client_account_id IS NULL;
    END LOOP;
END $$;

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_accounts_updated_at BEFORE UPDATE ON client_accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_account_groups_updated_at BEFORE UPDATE ON account_groups
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_account_permissions_updated_at BEFORE UPDATE ON account_permissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();