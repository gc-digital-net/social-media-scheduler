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
  platform: Platform;
  account_name: string;
  account_id?: string;
  is_active: boolean;
  created_at: string;
  profile_data?: any;
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

      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('user_id', user.id)
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

        const mockAccount = {
          user_id: user.id,
          platform,
          account_name: `@${platform}_user`,
          is_active: true,
          profile_data: {
            followers: Math.floor(Math.random() * 10000),
            avatar: `https://ui-avatars.com/api/?name=${platform}&background=random`,
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
        toast.success(`${PLATFORMS[platform].name} account connected successfully!`)
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

  const connectedPlatforms = accounts.map(a => a.platform)
  const availablePlatforms = Object.keys(PLATFORMS).filter(
    p => !connectedPlatforms.includes(p as Platform)
  ) as Platform[]

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
                        {account.account_name}
                      </p>
                      {account.profile_data?.followers && (
                        <p className="text-xs text-muted-foreground">
                          {account.profile_data.followers.toLocaleString()} followers
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
          <CardTitle>Available Platforms</CardTitle>
          <CardDescription>
            Connect more social media accounts to expand your reach
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availablePlatforms.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                You've connected all available platforms! Great job!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {availablePlatforms.map((platformKey) => {
                const platform = PLATFORMS[platformKey]
                const isConnecting = connecting === platformKey
                
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
                        <Badge variant="outline">Not connected</Badge>
                      </div>
                      <CardTitle className="text-lg mt-4">{platform.name}</CardTitle>
                      <CardDescription className="text-sm">
                        Post to {platform.name} directly from OmniPost
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
                            <Link2 className="h-4 w-4 mr-2" />
                            Connect {platform.name}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
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