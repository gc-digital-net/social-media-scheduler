# Multi-Account Database Schema Design

## Core Architecture Changes

### 1. Account Hierarchy
```
Organization (Company/Agency)
    ↓
Workspace (Team/Department)
    ↓
Client Accounts (Clients/Brands)
    ↓
Social Connections (Platform Accounts)
    ↓
Posts & Content
```

## Database Schema Updates

### New Tables

```sql
-- Client/Brand Accounts (Multiple per workspace)
CREATE TABLE client_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    brand_colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff"}',
    industry VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_internal BOOLEAN DEFAULT FALSE, -- For agency's own accounts
    status VARCHAR(50) DEFAULT 'active', -- active, paused, archived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Account Groups/Folders for Organization
CREATE TABLE account_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color
    sort_order INTEGER DEFAULT 0,
    parent_group_id UUID REFERENCES account_groups(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many: Accounts can be in multiple groups
CREATE TABLE account_group_members (
    account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
    group_id UUID REFERENCES account_groups(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (account_id, group_id)
);

-- Social connections per client account
CREATE TABLE account_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    platform_connection_id UUID NOT NULL REFERENCES platform_connections(id) ON DELETE CASCADE,
    custom_name VARCHAR(255), -- e.g., "Main Facebook Page", "Support Twitter"
    is_primary BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}', -- Platform-specific settings
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_account_id, platform_connection_id)
);

-- User permissions per client account
CREATE TABLE account_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- owner, admin, editor, viewer, contributor
    permissions JSONB DEFAULT '{}', -- Granular permissions
    granted_by UUID REFERENCES profiles(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- For temporary access
    UNIQUE(user_id, client_account_id)
);

-- Account-specific team members (for client access)
CREATE TABLE account_external_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'client', -- client, reviewer, approver
    access_token UUID DEFAULT uuid_generate_v4(),
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Modified Tables

```sql
-- Update posts table to include client account
ALTER TABLE posts ADD COLUMN client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE;
ALTER TABLE posts ADD COLUMN approval_status VARCHAR(50) DEFAULT 'draft'; -- draft, pending_review, approved, rejected
ALTER TABLE posts ADD COLUMN approved_by UUID REFERENCES profiles(id);
ALTER TABLE posts ADD COLUMN approved_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN approval_notes TEXT;

-- Update analytics to be account-specific
ALTER TABLE analytics ADD COLUMN client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE;

-- Update media_library for account-specific assets
ALTER TABLE media_library ADD COLUMN client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE;

-- Update templates to be shareable across accounts
ALTER TABLE templates ADD COLUMN client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE;
ALTER TABLE templates ADD COLUMN is_global BOOLEAN DEFAULT FALSE; -- Available to all accounts

-- Add account context to other tables
ALTER TABLE hashtag_groups ADD COLUMN client_account_id UUID REFERENCES client_accounts(id);
ALTER TABLE competitors ADD COLUMN client_account_id UUID REFERENCES client_accounts(id);
ALTER TABLE bio_links ADD COLUMN client_account_id UUID REFERENCES client_accounts(id);
```

### Approval Workflow Tables

```sql
-- Approval workflow configuration
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL, -- Array of approval steps
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval requests and history
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES approval_workflows(id),
    current_step INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, expired
    requested_by UUID REFERENCES profiles(id),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- Individual approval actions
CREATE TABLE approval_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    approver_id UUID REFERENCES profiles(id),
    external_approver_id UUID REFERENCES account_external_users(id),
    action VARCHAR(50) NOT NULL, -- approve, reject, request_changes
    comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Content Discovery Tables

```sql
-- Trending content by platform
CREATE TABLE trending_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL,
    content_type VARCHAR(50), -- hashtag, topic, sound, effect
    content_data JSONB NOT NULL,
    trend_score DECIMAL(10,2),
    region VARCHAR(10),
    category VARCHAR(100),
    discovered_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Top creators/influencers database
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    display_name VARCHAR(255),
    bio TEXT,
    follower_count BIGINT,
    engagement_rate DECIMAL(5,2),
    categories TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    data JSONB, -- Additional platform-specific data
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(platform, platform_user_id)
);

-- Saved inspiration content
CREATE TABLE inspiration_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    client_account_id UUID REFERENCES client_accounts(id) ON DELETE CASCADE,
    source_url TEXT,
    platform VARCHAR(50),
    content_type VARCHAR(50),
    content_data JSONB,
    tags TEXT[],
    notes TEXT,
    saved_by UUID REFERENCES profiles(id),
    saved_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Smart Scheduling Tables

```sql
-- Optimal posting times analysis
CREATE TABLE posting_time_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    day_of_week INTEGER, -- 0-6
    hour INTEGER, -- 0-23
    timezone VARCHAR(50),
    avg_engagement_rate DECIMAL(10,2),
    avg_reach BIGINT,
    sample_size INTEGER,
    confidence_score DECIMAL(3,2), -- 0-1
    last_calculated TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_account_id, platform, day_of_week, hour, timezone)
);

-- Content performance predictions
CREATE TABLE performance_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    predicted_reach BIGINT,
    predicted_engagement_rate DECIMAL(10,2),
    confidence_score DECIMAL(3,2),
    factors JSONB, -- What influenced the prediction
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enhanced Analytics Tables

```sql
-- Account-level aggregated metrics
CREATE TABLE account_metrics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    platform VARCHAR(50),
    metrics JSONB NOT NULL, -- All metrics in JSON
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_account_id, date, platform)
);

-- Campaign tracking
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_account_id UUID NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    goals JSONB,
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link campaign to posts
CREATE TABLE campaign_posts (
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY (campaign_id, post_id)
);
```

## Row Level Security Policies

```sql
-- Client accounts RLS
CREATE POLICY "Users can view accounts they have permission to"
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

-- Posts RLS with account context
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
            AND role IN ('owner', 'admin', 'editor', 'viewer')
        )
    );

-- Granular permissions for different roles
CREATE POLICY "Only editors and above can create posts"
    ON posts FOR INSERT
    USING (
        client_account_id IN (
            SELECT client_account_id FROM account_permissions 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin', 'editor', 'contributor')
        )
    );

CREATE POLICY "Only admins can delete posts"
    ON posts FOR DELETE
    USING (
        client_account_id IN (
            SELECT client_account_id FROM account_permissions 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin')
        )
    );
```

## Indexes for Performance

```sql
-- Multi-account queries
CREATE INDEX idx_posts_client_account ON posts(client_account_id);
CREATE INDEX idx_posts_account_status ON posts(client_account_id, status);
CREATE INDEX idx_posts_account_scheduled ON posts(client_account_id, scheduled_for);

-- Analytics queries
CREATE INDEX idx_analytics_account_date ON analytics(client_account_id, created_at);
CREATE INDEX idx_account_metrics_lookup ON account_metrics_daily(client_account_id, date, platform);

-- Permission lookups
CREATE INDEX idx_account_permissions_user ON account_permissions(user_id);
CREATE INDEX idx_account_permissions_account ON account_permissions(client_account_id);

-- Trending content
CREATE INDEX idx_trending_platform_score ON trending_content(platform, trend_score DESC);
CREATE INDEX idx_trending_expires ON trending_content(expires_at);

-- Optimal times
CREATE INDEX idx_posting_times_lookup ON posting_time_analysis(client_account_id, platform);
```

## Migration Strategy

### Phase 1: Add new tables without breaking changes
```sql
-- Create all new tables
-- Add client_account_id to existing tables with nullable
-- Create default client account for each workspace
```

### Phase 2: Migrate existing data
```sql
-- Copy existing connections to account_connections
-- Set client_account_id on all existing posts
-- Migrate existing permissions to account_permissions
```

### Phase 3: Enforce constraints
```sql
-- Make client_account_id NOT NULL where needed
-- Add foreign key constraints
-- Enable RLS policies
```

## API Changes Required

### New Endpoints
```typescript
// Account management
GET    /api/accounts                    // List all accounts
POST   /api/accounts                    // Create new account
GET    /api/accounts/:id                // Get account details
PUT    /api/accounts/:id                // Update account
DELETE /api/accounts/:id                // Delete account

// Account-scoped operations
GET    /api/accounts/:id/posts          // Get posts for account
POST   /api/accounts/:id/posts          // Create post for account
GET    /api/accounts/:id/analytics      // Get analytics for account
GET    /api/accounts/:id/connections    // Get social connections
GET    /api/accounts/:id/calendar       // Get calendar for account

// Bulk operations
POST   /api/bulk/posts                  // Create posts for multiple accounts
GET    /api/bulk/analytics              // Get analytics for multiple accounts

// Discovery
GET    /api/discovery/trending/:platform
GET    /api/discovery/creators/:niche
GET    /api/discovery/optimal-times/:accountId

// Approvals
GET    /api/approvals/pending           // Get pending approvals
POST   /api/approvals/:id/approve       // Approve content
POST   /api/approvals/:id/reject        // Reject content
```

### Modified Endpoints
All existing endpoints need to support optional `accountId` parameter:
```typescript
// Before
GET /api/posts

// After
GET /api/posts?accountId=xxx  // Filter by account
GET /api/posts                 // All accounts user has access to
```

## State Management Updates

```typescript
// Frontend state structure
interface AppState {
  currentAccount: ClientAccount | null;
  accounts: ClientAccount[];
  accountPermissions: Map<string, Permission>;
  
  // Scoped data
  posts: {
    byAccount: Map<string, Post[]>;
    selected: Post | null;
  };
  
  analytics: {
    byAccount: Map<string, Analytics>;
    comparison: ComparisonData | null;
  };
  
  calendar: {
    accountFilter: string[];
    viewMode: 'single' | 'multi';
  };
}
```

---

This schema provides a robust foundation for multi-account management while maintaining backward compatibility and allowing for gradual migration.