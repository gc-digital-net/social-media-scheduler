'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Building2, 
  Plus, 
  X, 
  Loader2,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Link2,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialAccount {
  id?: string
  platform: string
  account_name: string
  account_handle: string
  is_active: boolean
}

interface CreateAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAccountCreated?: () => void
}

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Education',
  'Marketing',
  'Real Estate',
  'Manufacturing',
  'Entertainment',
  'Non-profit',
  'Other',
]

export function CreateAccountDialog({ 
  open, 
  onOpenChange,
  onAccountCreated 
}: CreateAccountDialogProps) {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [accountData, setAccountData] = useState({
    name: '',
    industry: '',
    website: '',
    description: '',
    brand_colors: {
      primary: '#22c55e',
      secondary: '#3b82f6'
    },
    timezone: 'America/New_York',
  })
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([])
  const [newSocialAccount, setNewSocialAccount] = useState<SocialAccount>({
    platform: '',
    account_name: '',
    account_handle: '',
    is_active: true,
  })

  const supabase = createClient()

  const addSocialAccount = () => {
    if (!newSocialAccount.platform || !newSocialAccount.account_name) {
      toast.error('Please fill in platform and account name')
      return
    }

    setSocialAccounts([...socialAccounts, { ...newSocialAccount, id: Date.now().toString() }])
    setNewSocialAccount({
      platform: '',
      account_name: '',
      account_handle: '',
      is_active: true,
    })
  }

  const removeSocialAccount = (id: string) => {
    setSocialAccounts(socialAccounts.filter(acc => acc.id !== id))
  }

  const handleCreate = async () => {
    if (!accountData.name || !accountData.industry) {
      toast.error('Please fill in required fields')
      return
    }

    if (socialAccounts.length === 0) {
      toast.error('Please add at least one social account')
      return
    }

    setLoading(true)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('User not authenticated')

      // Get workspace
      const { data: workspace, error: wsError } = await supabase
        .from('workspaces')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (wsError || !workspace) {
        // Create workspace if doesn't exist
        const { data: newWorkspace, error: createWsError } = await supabase
          .from('workspaces')
          .insert({
            name: `${user.email}'s Workspace`,
            owner_id: user.id,
            settings: {}
          })
          .select()
          .single()

        if (createWsError) throw createWsError
        workspace.id = newWorkspace.id
      }

      // Create client account
      const { data: clientAccount, error: accountError } = await supabase
        .from('client_accounts')
        .insert({
          workspace_id: workspace.id,
          name: accountData.name,
          industry: accountData.industry,
          website: accountData.website,
          description: accountData.description,
          brand_colors: accountData.brand_colors,
          timezone: accountData.timezone,
          status: 'active',
        })
        .select()
        .single()

      if (accountError) throw accountError

      // Create account permission for the user
      const { error: permError } = await supabase
        .from('account_permissions')
        .insert({
          client_account_id: clientAccount.id,
          user_id: user.id,
          permission_level: 'owner',
          granted_by: user.id,
        })

      if (permError) throw permError

      // Create social accounts
      const socialAccountsData = socialAccounts.map(sa => ({
        client_account_id: clientAccount.id,
        platform: sa.platform,
        account_name: sa.account_name,
        account_handle: sa.account_handle,
        is_active: sa.is_active,
        metadata: {}
      }))

      const { error: socialError } = await supabase
        .from('social_accounts')
        .insert(socialAccountsData)

      if (socialError) throw socialError

      toast.success('Client account created successfully!')
      onAccountCreated?.()
      onOpenChange(false)
      
      // Reset form
      setAccountData({
        name: '',
        industry: '',
        website: '',
        description: '',
        brand_colors: { primary: '#22c55e', secondary: '#3b82f6' },
        timezone: 'America/New_York',
      })
      setSocialAccounts([])
      setStep(1)
    } catch (error: any) {
      console.error('Error creating account:', error)
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Client Account</DialogTitle>
          <DialogDescription>
            Set up a new client account with multiple social media profiles
          </DialogDescription>
        </DialogHeader>

        <Tabs value={step.toString()} onValueChange={(v) => setStep(parseInt(v))}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="1">Account Details</TabsTrigger>
            <TabsTrigger value="2">Social Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="1" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account Name *</Label>
              <Input
                id="name"
                placeholder="e.g., TechCorp Solutions"
                value={accountData.name}
                onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={accountData.industry}
                onValueChange={(value) => setAccountData({ ...accountData, industry: value })}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={accountData.website}
                onChange={(e) => setAccountData({ ...accountData, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the client..."
                value={accountData.description}
                onChange={(e) => setAccountData({ ...accountData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Brand Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={accountData.brand_colors.primary}
                    onChange={(e) => setAccountData({ 
                      ...accountData, 
                      brand_colors: { ...accountData.brand_colors, primary: e.target.value }
                    })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={accountData.brand_colors.primary}
                    onChange={(e) => setAccountData({ 
                      ...accountData, 
                      brand_colors: { ...accountData.brand_colors, primary: e.target.value }
                    })}
                    placeholder="#22c55e"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={accountData.timezone}
                  onValueChange={(value) => setAccountData({ ...accountData, timezone: value })}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>
                Next: Add Social Accounts
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add Social Media Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={newSocialAccount.platform}
                      onValueChange={(value) => setNewSocialAccount({ ...newSocialAccount, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitter">Twitter/X</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input
                      placeholder="e.g., Main Account"
                      value={newSocialAccount.account_name}
                      onChange={(e) => setNewSocialAccount({ ...newSocialAccount, account_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Handle/Username</Label>
                  <Input
                    placeholder="@username"
                    value={newSocialAccount.account_handle}
                    onChange={(e) => setNewSocialAccount({ ...newSocialAccount, account_handle: e.target.value })}
                  />
                </div>

                <Button 
                  type="button"
                  variant="outline" 
                  onClick={addSocialAccount}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Account
                </Button>
              </CardContent>
            </Card>

            {socialAccounts.length > 0 && (
              <div className="space-y-2">
                <Label>Connected Accounts ({socialAccounts.length})</Label>
                <div className="space-y-2">
                  {socialAccounts.map((account) => {
                    const Icon = platformIcons[account.platform as keyof typeof platformIcons] || Link2
                    return (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{account.account_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {account.account_handle} • {account.platform}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSocialAccount(account.id!)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {socialAccounts.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Add at least one social account to continue
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === 2 && (
            <Button 
              onClick={handleCreate} 
              disabled={loading || socialAccounts.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}