-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- PROFILES
-- Users can read their own profile
CREATE POLICY "Users read own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger usually)
CREATE POLICY "Users insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- WORKSPACES
-- =====================================================

-- Workspace owners can do everything
CREATE POLICY "Owners have full workspace access" 
  ON workspaces FOR ALL 
  USING (owner_id = auth.uid());

-- Workspace members can view workspace
CREATE POLICY "Members can view workspace" 
  ON workspaces FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = workspaces.id 
      AND user_id = auth.uid()
    )
  );

-- Workspace admins can update workspace
CREATE POLICY "Admins can update workspace" 
  ON workspaces FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = workspaces.id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    )
  );

-- =====================================================
-- WORKSPACE MEMBERS
-- =====================================================

-- Members can view other members in their workspace
CREATE POLICY "Members can view workspace members" 
  ON workspace_members FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm 
      WHERE wm.workspace_id = workspace_members.workspace_id 
      AND wm.user_id = auth.uid()
    )
  );

-- Workspace owners and admins can manage members
CREATE POLICY "Owners and admins can manage members" 
  ON workspace_members FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM workspaces 
      WHERE id = workspace_members.workspace_id 
      AND owner_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM workspace_members wm 
      WHERE wm.workspace_id = workspace_members.workspace_id 
      AND wm.user_id = auth.uid() 
      AND wm.role = 'admin'
    )
  );

-- =====================================================
-- PLATFORM CONNECTIONS
-- =====================================================

-- Workspace members can view platform connections
CREATE POLICY "Members can view platform connections" 
  ON platform_connections FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = platform_connections.workspace_id 
      AND user_id = auth.uid()
    )
  );

-- Only admins and owners can manage platform connections
CREATE POLICY "Admins manage platform connections" 
  ON platform_connections FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = platform_connections.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    ) OR EXISTS (
      SELECT 1 FROM workspaces 
      WHERE id = platform_connections.workspace_id 
      AND owner_id = auth.uid()
    )
  );

-- =====================================================
-- POSTS
-- =====================================================

-- Workspace members can view posts
CREATE POLICY "Members can view posts" 
  ON posts FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = posts.workspace_id 
      AND user_id = auth.uid()
    )
  );

-- Editors, admins, and owners can create posts
CREATE POLICY "Editors can create posts" 
  ON posts FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = posts.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('editor', 'admin', 'owner')
    ) OR EXISTS (
      SELECT 1 FROM workspaces 
      WHERE id = posts.workspace_id 
      AND owner_id = auth.uid()
    )
  );

-- Post creators and admins can update posts
CREATE POLICY "Creators and admins can update posts" 
  ON posts FOR UPDATE 
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = posts.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    ) OR EXISTS (
      SELECT 1 FROM workspaces 
      WHERE id = posts.workspace_id 
      AND owner_id = auth.uid()
    )
  );

-- Post creators and admins can delete posts
CREATE POLICY "Creators and admins can delete posts" 
  ON posts FOR DELETE 
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = posts.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    ) OR EXISTS (
      SELECT 1 FROM workspaces 
      WHERE id = posts.workspace_id 
      AND owner_id = auth.uid()
    )
  );

-- =====================================================
-- POST QUEUE
-- =====================================================

-- Workspace members can view queue items
CREATE POLICY "Members can view queue" 
  ON post_queue FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = post_queue.post_id 
      AND wm.user_id = auth.uid()
    )
  );

-- System and admins can manage queue
CREATE POLICY "Admins manage queue" 
  ON post_queue FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = post_queue.post_id 
      AND wm.user_id = auth.uid()
      AND wm.role IN ('admin', 'owner')
    )
  );

-- =====================================================
-- MEDIA LIBRARY
-- =====================================================

-- Workspace members can view media
CREATE POLICY "Members can view media" 
  ON media_library FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = media_library.workspace_id 
      AND user_id = auth.uid()
    )
  );

-- Editors can upload media
CREATE POLICY "Editors can upload media" 
  ON media_library FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = media_library.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('editor', 'admin', 'owner')
    )
  );

-- Uploaders and admins can delete media
CREATE POLICY "Uploaders and admins can delete media" 
  ON media_library FOR DELETE 
  USING (
    uploaded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = media_library.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    )
  );

-- =====================================================
-- TEMPLATES
-- =====================================================

-- Workspace members can view templates
CREATE POLICY "Members can view templates" 
  ON templates FOR SELECT 
  USING (
    is_public = true OR
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = templates.workspace_id 
      AND user_id = auth.uid()
    )
  );

-- Editors can create templates
CREATE POLICY "Editors can create templates" 
  ON templates FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = templates.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('editor', 'admin', 'owner')
    )
  );

-- Template creators and admins can update templates
CREATE POLICY "Creators and admins can update templates" 
  ON templates FOR UPDATE 
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = templates.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('admin', 'owner')
    )
  );

-- =====================================================
-- ANALYTICS
-- =====================================================

-- Workspace members can view analytics
CREATE POLICY "Members can view analytics" 
  ON analytics FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM posts p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = analytics.post_id 
      AND wm.user_id = auth.uid()
    )
  );

-- System can insert analytics (via service role)
-- No RLS policy needed for INSERT as it will use service role

-- =====================================================
-- BIO LINKS
-- =====================================================

-- Public can view published bio links
CREATE POLICY "Public can view published bio links" 
  ON bio_links FOR SELECT 
  USING (is_active = true);

-- Workspace members can manage bio links
CREATE POLICY "Members manage bio links" 
  ON bio_links FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = bio_links.workspace_id 
      AND user_id = auth.uid() 
      AND role IN ('editor', 'admin', 'owner')
    )
  );

-- =====================================================
-- BIO LINK ITEMS
-- =====================================================

-- Public can view active bio link items
CREATE POLICY "Public can view bio link items" 
  ON bio_link_items FOR SELECT 
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM bio_links 
      WHERE id = bio_link_items.bio_link_id 
      AND is_active = true
    )
  );

-- Workspace members can manage bio link items
CREATE POLICY "Members manage bio link items" 
  ON bio_link_items FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM bio_links bl
      JOIN workspace_members wm ON wm.workspace_id = bl.workspace_id
      WHERE bl.id = bio_link_items.bio_link_id 
      AND wm.user_id = auth.uid() 
      AND wm.role IN ('editor', 'admin', 'owner')
    )
  );

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users view own notifications" 
  ON notifications FOR SELECT 
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users update own notifications" 
  ON notifications FOR UPDATE 
  USING (user_id = auth.uid());

-- =====================================================
-- ACTIVITY LOGS
-- =====================================================

-- Workspace members can view activity logs
CREATE POLICY "Members can view activity logs" 
  ON activity_logs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_id = activity_logs.workspace_id 
      AND user_id = auth.uid()
    )
  );

-- System can insert activity logs
-- No RLS policy needed for INSERT as it will use service role

-- =====================================================
-- AI GENERATIONS
-- =====================================================

-- Users can view their own AI generations
CREATE POLICY "Users view own AI generations" 
  ON ai_generations FOR SELECT 
  USING (user_id = auth.uid());

-- Users can create AI generations
CREATE POLICY "Users create AI generations" 
  ON ai_generations FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- ADDITIONAL HELPER FUNCTIONS
-- =====================================================

-- Function to check if user is workspace member
CREATE OR REPLACE FUNCTION is_workspace_member(workspace_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members 
    WHERE workspace_id = workspace_uuid 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user role in workspace
CREATE OR REPLACE FUNCTION get_user_workspace_role(workspace_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if owner first
  SELECT 'owner' INTO user_role
  FROM workspaces 
  WHERE id = workspace_uuid AND owner_id = auth.uid();
  
  IF user_role IS NOT NULL THEN
    RETURN user_role;
  END IF;
  
  -- Check member role
  SELECT role::TEXT INTO user_role
  FROM workspace_members 
  WHERE workspace_id = workspace_uuid AND user_id = auth.uid();
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;