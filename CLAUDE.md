# Social Media Scheduler SaaS - Project Documentation

## CRITICAL DEPLOYMENT INSTRUCTIONS

### VPS Resource Constraints
**Server Specs:** 2 CPU cores, 1.9GB RAM
**Important:** This application is deployed on a low-resource VPS. Always optimize for CPU and memory efficiency.

### Production Deployment Commands
```bash
# Build for production (optimized for low resources)
npm run build

# Start with PM2 (resource-limited)
pm2 start ecosystem.config.js

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart social-media-scheduler

# View logs
pm2 logs
```

### Key Optimizations Required
1. **Middleware:** Only run on specific auth routes, NOT on every request (causes high CPU)
2. **Next.js Config:** Use `output: 'standalone'` for efficient deployment
3. **Memory:** Limit Node.js heap size to 512MB
4. **Processes:** Use single PM2 instance for 2-core VPS
5. **Supabase Client:** Minimize client creation to reduce CPU overhead

## Project Overview
**Name:** OmniPost (Working Title)
**Type:** All-in-One Social Media Management SaaS
**Stack:** Next.js 14+, TypeScript, Tailwind CSS, Supabase, Cloudflare
**Infrastructure:** Cloudflare (CDN/Protection) → Coolify (VPS) → Self-hosted Supabase
**Target Market:** Content creators, small businesses, agencies, and enterprise teams
**Unique Value:** Most affordable yet feature-rich scheduler with AI, supporting 15+ platforms

## Supported Platforms (15+)

### Tier 1 - Major Platforms
1. **Facebook** - Pages, profiles, groups, stories
2. **Instagram** - Feed, Stories, Reels, IGTV, carousels
3. **Twitter/X** - Tweets, threads, polls, spaces announcements
4. **LinkedIn** - Personal, company pages, newsletters, events
5. **YouTube** - Community posts, Shorts, premieres, video descriptions

### Tier 2 - Emerging Platforms
6. **TikTok** - Videos, sounds, effects tracking
7. **Threads** - Posts, replies, quotes
8. **Bluesky** - Posts, threads, custom feeds
9. **Mastodon** - Toots, boosts, instance selection

### Tier 3 - Business & Niche
10. **Google Business Profile** - Posts, updates, offers, events
11. **Pinterest** - Pins, idea pins, boards, shopping
12. **Reddit** - Posts, comments, scheduled AMAs
13. **Discord** - Server announcements via webhooks
14. **Telegram** - Channel posts, scheduled messages
15. **WhatsApp Business** - Status, broadcast lists

### Bonus Platforms
16. **Snapchat** - Stories, spotlight
17. **Tumblr** - Posts, reblogs, queues
18. **Medium** - Articles, publications
19. **WordPress** - Blog posts, pages
20. **Shopify** - Social posts for products

## Core Features (Inspired by Competitors)

### 1. Smart Scheduling & Publishing

#### Basic Scheduling
- **Visual Calendar** - Drag-and-drop interface with month/week/day views
- **Optimal Time Slots** - AI-powered best time to post for each platform
- **Bulk Scheduling** - Upload 500+ posts via CSV/Excel
- **Queue Management** - Smart queue with priority levels
- **Time Zone Management** - Post in audience's local time

#### Advanced Scheduling (From Publer)
- **AutoSchedule** - Automatically fill time slots
- **Recurring Posts** - Daily/weekly/monthly recurring content
- **Post Recycling** - Automatically repost evergreen content
- **RSS Auto-posting** - Auto-post from RSS feeds
- **Expiring Posts** - Set posts to auto-delete after X hours

#### From Post-Bridge
- **Cross-posting Made Easy** - One click to adapt content for all platforms
- **Background Video Processing** - 4K video processing while you work
- **Instant + Scheduled Hybrid** - Mix of immediate and scheduled posts

### 2. Content Creation Suite

#### AI-Powered Tools (From Publer)
- **AI Caption Writer** - Generate captions with emojis
- **AI Image Generator** - Create images from prompts
- **AI Hashtag Suggestions** - Platform-specific hashtags
- **AI Content Ideas** - Topic and trend suggestions
- **AI Rewriter** - Adapt content for different platforms

#### Design Integration
- **Built-in Canva** - Design without leaving the app
- **VistaCreate Integration** - Alternative design tool
- **Stock Media Library** - Free images/videos via Unsplash/Pexels
- **Cloud Storage** - Google Drive, Dropbox, OneDrive integration
- **Media Library** - Organize and tag all uploaded content

#### Content Enhancement (From Post-Bridge)
- **Viral Templates** - Proven templates for each platform
- **Drag-Drop Video Maker** - Simple video creation
- **Auto-Cropping** - Smart crop for platform requirements
- **Watermark/Signature** - Add branding to all content
- **Link Shortener** - Built-in bit.ly alternative

### 3. Analytics & Insights

#### Performance Analytics
- **Unified Dashboard** - All platforms in one view
- **Engagement Metrics** - Likes, comments, shares, saves
- **Reach & Impressions** - Platform-specific metrics
- **Follower Growth** - Track audience growth
- **Best Performing Content** - Identify viral posts

#### Advanced Analytics (From Publer)
- **Competitor Analysis** - Track competitor performance
- **Hashtag Performance** - Which tags drive engagement
- **Downloadable Reports** - PDF/Excel export
- **Custom Date Ranges** - Flexible reporting periods
- **ROI Tracking** - Link clicks and conversions

#### AI Insights
- **Content Recommendations** - What to post next
- **Trend Predictions** - Upcoming viral topics
- **Audience Insights** - Demographics and behavior
- **Sentiment Analysis** - Comment tone analysis

### 4. Team Collaboration

#### User Management
- **Workspaces** - Separate brand environments
- **Role-Based Access** - Admin, editor, viewer roles
- **Client Access** - Limited view for approval
- **Activity Log** - Track all team actions

#### Workflow Features
- **Approval Workflows** - Multi-step approval process
- **Internal Notes** - Team comments on posts
- **Draft Collaboration** - Real-time editing
- **Content Calendar Sharing** - Public calendar links
- **Task Assignment** - Assign posts to team members

### 5. Special Features

#### Link in Bio (From Both)
- **Custom Landing Pages** - Mobile-optimized bio links
- **Multiple Links** - Unlimited links per page
- **Analytics** - Track link clicks
- **QR Codes** - Generate for offline promotion
- **Custom Domains** - Use your own domain

#### Automation Features
- **IFTTT Integration** - Connect with 1000+ apps
- **Zapier Support** - Advanced automation
- **Webhook Support** - Custom integrations
- **API Access** - Build custom tools
- **Browser Extension** - Schedule from anywhere

#### Customer Engagement
- **Unified Inbox** - All messages in one place
- **Auto-Responses** - Set up chatbot replies
- **Comment Management** - Reply from dashboard
- **Review Management** - Google/Facebook reviews
- **Social Listening** - Track brand mentions

### 6. Pricing Strategy (Competitive Analysis)

Based on Post-Bridge (simple pricing) and Publer (feature-based tiers):

#### Free Forever Plan
- 3 social accounts
- 10 scheduled posts per month
- Basic analytics
- 1 user
- Link in bio

#### Starter Plan - $9/month
- 10 social accounts
- Unlimited posts
- AI: 50 generations/month
- 1 workspace
- 2 team members
- All platforms

#### Professional Plan - $19/month
- 25 social accounts
- Everything in Starter
- AI: 500 generations/month
- 3 workspaces
- 5 team members
- Advanced analytics
- White-label reports
- Priority support

#### Business Plan - $49/month
- 100 social accounts
- Everything in Professional
- AI: Unlimited
- Unlimited workspaces
- 20 team members
- Approval workflows
- API access
- Custom integrations

#### Enterprise - Custom Pricing
- Unlimited everything
- Dedicated server
- Custom features
- SLA guarantee
- Dedicated support

### 7. Technical Implementation

#### Frontend Architecture
```typescript
// Key Components Structure
/components
  /composer
    PostComposer.tsx      // Main composer with platform tabs
    MediaUploader.tsx     // Drag-drop media handler
    AIAssistant.tsx       // AI suggestions panel
    PlatformPreview.tsx   // Live preview per platform
  /calendar
    CalendarView.tsx      // Full calendar interface
    TimeSlotPicker.tsx    // Optimal time selector
    BulkScheduler.tsx     // CSV upload handler
  /analytics
    UnifiedDashboard.tsx  // All metrics view
    PlatformCard.tsx      // Per-platform stats
    CompetitorTracker.tsx // Competition analysis
  /team
    ApprovalFlow.tsx      // Content approval UI
    WorkspaceSelector.tsx // Multi-workspace nav
```

#### Database Schema Additions
```sql
-- AI Generation tracking
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT, -- 'caption', 'image', 'hashtag'
  prompt TEXT,
  result TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link in Bio
CREATE TABLE bio_links (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  slug TEXT UNIQUE,
  title TEXT,
  links JSONB,
  theme JSONB,
  analytics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitor tracking
CREATE TABLE competitors (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  platform TEXT,
  handle TEXT,
  metrics JSONB,
  last_checked TIMESTAMPTZ
);

-- Approval workflows
CREATE TABLE approvals (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  requested_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  status TEXT, -- 'pending', 'approved', 'rejected'
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates library
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  category TEXT,
  content JSONB,
  platforms TEXT[],
  is_public BOOLEAN DEFAULT false,
  uses_count INTEGER DEFAULT 0
);
```

#### API Endpoints Structure
```typescript
// API Routes
/api
  /auth
    /[...supabase]  // Supabase auth handler
  /posts
    /schedule       // POST - Schedule new post
    /bulk          // POST - Bulk upload
    /[id]          // GET, PUT, DELETE
  /ai
    /generate      // POST - Generate content
    /analyze       // POST - Analyze performance
    /suggest       // GET - Get suggestions
  /platforms
    /connect       // POST - OAuth flow
    /disconnect    // DELETE - Remove account
    /refresh       // POST - Refresh tokens
  /analytics
    /overview      // GET - Dashboard data
    /platform/[platform] // GET - Platform specific
    /export        // GET - Generate report
  /team
    /invite        // POST - Invite member
    /workspace     // GET, POST - Manage workspaces
    /approval      // POST, PUT - Approval flow
```

### 8. Unique Selling Points (USP)

Based on competitor analysis, our USPs:

1. **Most Platforms Supported** - 15+ platforms (more than most)
2. **Self-Hosted Option** - Data sovereignty with Supabase
3. **Fairest Pricing** - No per-platform charges
4. **No Reach Penalty** - Proven same reach as manual posting
5. **Unlimited AI** - No caps on AI usage (Professional+)
6. **True Cross-Platform** - One-click adapt to all platforms
7. **4K Video Support** - Background processing
8. **No Lock-in** - Export all data anytime
9. **White-Label Ready** - For agencies (Professional+)
10. **Open API** - Build custom integrations

### 9. Performance & Scaling

#### Cloudflare Optimization
- **Smart Routing** - Argo for 30% faster loads
- **Image Optimization** - Polish + WebP
- **Video Delivery** - Stream for smooth playback
- **Cache Everything** - Aggressive caching rules
- **Workers KV** - Session storage at edge

#### Database Optimization
```sql
-- Indexes for performance
CREATE INDEX idx_posts_user_scheduled ON posts(user_id, scheduled_for);
CREATE INDEX idx_posts_status_platform ON posts(status, platforms);
CREATE INDEX idx_queue_process_after ON post_queue(process_after, status);
CREATE INDEX idx_analytics_post_platform ON analytics(post_id, platform);

-- Partitioning for scale
CREATE TABLE posts_2024_01 PARTITION OF posts
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 10. Security & Compliance

#### Data Protection
- **Encryption at Rest** - All sensitive data encrypted
- **Encryption in Transit** - TLS 1.3 everywhere
- **Token Vault** - Supabase Vault for OAuth tokens
- **PII Handling** - GDPR/CCPA compliant
- **Data Retention** - Configurable per account

#### Platform Compliance
- **Rate Limiting** - Respect platform limits
- **Terms Compliance** - Follow each platform's ToS
- **Content Moderation** - Flag potentially violating content
- **Audit Trail** - Log all actions for compliance

### 11. Migration Strategy

Help users migrate from competitors:

#### Import Tools
- **Publer Import** - Direct API import
- **Buffer Import** - CSV export/import
- **Hootsuite Import** - Bulk migration tool
- **Later Import** - Calendar sync
- **Generic CSV** - Universal format

#### Onboarding Flow
1. Platform connection wizard
2. Import existing content
3. AI-powered first post
4. Optimal schedule setup
5. Team invitation

### 12. Mobile Strategy

#### Progressive Web App (PWA)
- Installable on mobile
- Offline draft creation
- Push notifications
- Camera integration
- Share target API

#### Mobile-First Features
- Story creator
- Quick post templates
- Voice-to-text posts
- Mobile video editing
- Location-based posting

### 13. Monitoring & Analytics

#### Application Monitoring
- **Sentry** - Error tracking
- **Cloudflare Analytics** - Performance metrics
- **Custom Dashboards** - Business metrics
- **Uptime Monitoring** - 99.9% SLA tracking

#### User Analytics (Privacy-First)
- **Plausible Analytics** - GDPR compliant
- **Feature Usage** - Track popular features
- **Conversion Funnel** - Optimize onboarding
- **Churn Analysis** - Identify pain points

### 14. Launch Strategy

#### MVP (Month 1-2)
- 5 core platforms (FB, IG, Twitter, LinkedIn, Google)
- Basic scheduling
- Simple analytics
- Supabase auth
- Cloudflare setup

#### Beta (Month 3)
- 10 platforms
- AI features
- Team collaboration
- Import tools
- Mobile PWA

#### Launch (Month 4)
- All 15+ platforms
- Full feature set
- Marketing campaign
- Affiliate program
- AppSumo deal

### 15. Future Roadmap

#### Phase 1 (Post-Launch)
- Chrome/Firefox extension
- Slack/Teams integration
- Advanced automation
- Video templates
- Influencer tools

#### Phase 2 (6 months)
- Native mobile apps
- Enterprise features
- Custom branding
- Reseller program
- International expansion

#### Phase 3 (1 year)
- AI video generation
- Live streaming scheduler
- Podcast distribution
- Newsletter integration
- E-commerce features

## Summary

This comprehensive plan combines the best of Post-Bridge (simplicity, fair pricing, cross-posting) and Publer (AI features, advanced scheduling, team collaboration) while adding our unique features like self-hosting, more platform support, and Cloudflare integration. The goal is to create the most complete yet affordable social media management platform on the market.