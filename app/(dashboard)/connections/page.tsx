'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PLATFORMS, Platform } from '@/lib/constants/platforms'
import { CheckCircle, Plus, AlertCircle, Link2, Loader2, X, RefreshCw, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface SocialAccount {
  id: string;
  client_account_id: string;
  platform: Platform;
  account_name: string;
  account_handle?: string;
  account_id?: string;
  is_active: boolean;
  created_at: string;
  metadata?: any;
  client_accounts?: {
    id: string;
    name: string;
  };
}

export default function ConnectionsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<Platform | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch accounts for all client accounts the user has access to
      const { data, error } = await supabase
        .from('social_accounts')
        .select(`
          *,
          client_accounts!inner(
            id,
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching accounts:', error)
        toast.error('Failed to load connected accounts')
      } else {
        setAccounts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (platform: Platform) => {
    setConnecting(platform)
    
    // TODO: Implement OAuth flow for each platform
    // For now, mock the connection
    setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get the current client account from context or URL params
        // For now, we'll get the first client account
        const { data: clientAccounts } = await supabase
          .from('client_accounts')
          .select('id')
          .limit(1)
          .single()

        if (!clientAccounts) {
          toast.error('Please create a client account first')
          setConnecting(null)
          return
        }

        // Count existing accounts for this platform to create unique names
        const existingCount = accountCountByPlatform[platform] || 0
        const accountNumber = existingCount + 1

        const mockAccount = {
          client_account_id: clientAccounts.id,
          platform,
          account_name: accountNumber > 1 
            ? `${PLATFORMS[platform].name} Account ${accountNumber}`
            : `Main ${PLATFORMS[platform].name}`,
          account_handle: `@${platform}_user${accountNumber > 1 ? accountNumber : ''}`,
          is_active: true,
          metadata: {
            followers: Math.floor(Math.random() * 10000),
            avatar: `https://ui-avatars.com/api/?name=${platform}${accountNumber}&background=random`,
          }
        }

        const { data, error } = await supabase
          .from('social_accounts')
          .insert(mockAccount)
          .select()
          .single()

        if (error) {
          throw error
        }

        setAccounts([...accounts, data])
        toast.success(`${PLATFORMS[platform].name} account ${accountNumber > 1 ? accountNumber : ''} connected successfully!`)
      } catch (error) {
        console.error('Error connecting account:', error)
        toast.error(`Failed to connect ${PLATFORMS[platform].name}`)
      } finally {
        setConnecting(null)
      }
    }, 2000)
  }

  const handleDisconnect = async (accountId: string, platform: Platform) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId)

      if (error) throw error

      setAccounts(accounts.filter(a => a.id !== accountId))
      toast.success(`${PLATFORMS[platform].name} account disconnected`)
    } catch (error) {
      console.error('Error disconnecting account:', error)
      toast.error('Failed to disconnect account')
    }
  }

  const handleReconnect = async (account: SocialAccount) => {
    toast.info(`Reconnecting ${PLATFORMS[account.platform].name}...`)
    // TODO: Implement reconnection logic
  }

  // Allow multiple accounts per platform - don't filter out connected platforms
  const availablePlatforms = Object.keys(PLATFORMS) as Platform[]
  const accountCountByPlatform = accounts.reduce((acc, account) => {
    acc[account.platform] = (acc[account.platform] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connected Accounts</h1>
        <p className="text-muted-foreground">
          Manage your social media account connections
        </p>
      </div>

      {/* Connection Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accounts.filter(a => a.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to post
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Available Platforms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availablePlatforms.length}</div>
            <p className="text-xs text-muted-foreground">
              Not yet connected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Your linked social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accounts.map((account) => {
              const platform = PLATFORMS[account.platform]
              
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: platform.color }}
                    >
                      <span className="text-lg">{platform.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{platform.name}</p>
                        {account.is_active ? (
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.account_name} {account.account_handle && `• ${account.account_handle}`}
                      </p>
                      {(account as any).client_accounts?.name && (
                        <p className="text-xs text-muted-foreground">
                          Client: {(account as any).client_accounts.name}
                        </p>
                      )}
                      {account.metadata?.followers && (
                        <p className="text-xs text-muted-foreground">
                          {account.metadata.followers.toLocaleString()} followers
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReconnect(account)}
                      title="Reconnect"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Settings"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDisconnect(account.id, account.platform)}
                      title="Disconnect"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Available Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Connect Social Accounts</CardTitle>
          <CardDescription>
            Connect multiple accounts per platform to manage all your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availablePlatforms.map((platformKey) => {
              const platform = PLATFORMS[platformKey]
              const isConnecting = connecting === platformKey
              const connectedCount = accountCountByPlatform[platformKey] || 0
              
              return (
                <Card key={platformKey} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: platform.color }}
                      >
                        <span className="text-xl">{platform.icon}</span>
                      </div>
                      {connectedCount > 0 ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          {connectedCount} connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not connected</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-4">{platform.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {connectedCount > 0 
                        ? `Add another ${platform.name} account`
                        : `Connect your ${platform.name} account`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      onClick={() => handleConnect(platformKey)}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          {connectedCount > 0 ? 'Add Another Account' : `Connect ${platform.name}`}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> You'll be redirected to each platform to authorize OmniPost. 
          We only request the minimum permissions needed to post on your behalf.
        </AlertDescription>
      </Alert>
    </div>
  )
}