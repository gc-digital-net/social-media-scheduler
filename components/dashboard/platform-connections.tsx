'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLATFORMS, Platform } from '@/lib/constants/platforms'
import { CheckCircle, Plus, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Connection {
  platform: Platform;
  isConnected: boolean;
  accountName?: string;
  accountId?: string;
  expiresAt?: Date;
}

export function PlatformConnections() {
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch real connections from API
    // Mock data for now
    const mockConnections: Connection[] = [
      {
        platform: 'twitter',
        isConnected: true,
        accountName: '@johndoe',
        accountId: '123456',
      },
      {
        platform: 'facebook',
        isConnected: true,
        accountName: 'John Doe Business',
        accountId: '789012',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      {
        platform: 'linkedin',
        isConnected: false,
      },
      {
        platform: 'instagram',
        isConnected: false,
      },
    ]
    setConnections(mockConnections)
    setLoading(false)
  }, [])

  const handleConnect = (platform: Platform) => {
    router.push(`/connections?platform=${platform}`)
  }

  const handleReconnect = (platform: Platform) => {
    toast.info(`Reconnecting ${PLATFORMS[platform].name}...`)
    // TODO: Implement reconnection
  }

  const connectedCount = connections.filter(c => c.isConnected).length
  const totalPlatforms = Object.keys(PLATFORMS).length

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Connected Accounts</CardTitle>
          <Badge variant="secondary">
            {connectedCount}/{totalPlatforms}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {connections.map((connection) => {
          const platform = PLATFORMS[connection.platform]
          
          return (
            <div
              key={connection.platform}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  <span className="text-sm">{platform.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{platform.name}</p>
                  {connection.isConnected && connection.accountName && (
                    <p className="text-xs text-muted-foreground">
                      {connection.accountName}
                    </p>
                  )}
                </div>
              </div>
              
              {connection.isConnected ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {connection.expiresAt && 
                    new Date(connection.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReconnect(connection.platform)}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleConnect(connection.platform)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              )}
            </div>
          )
        })}
        
        {connections.filter(c => !c.isConnected).length > 0 && (
          <div className="pt-2 border-t">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => router.push('/connections')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add More Accounts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}