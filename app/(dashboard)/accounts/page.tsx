'use client'

import { useState, useEffect } from 'react'
import { useAccount } from '@/lib/contexts/account-context'
import { AccountCard } from '@/components/account/account-card'
import { AccountsOverview } from '@/components/account/accounts-overview'
import { CreateAccountDialog } from '@/components/account/create-account-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Plus, 
  Search, 
  Grid3x3, 
  List, 
  BarChart,
  Filter,
  Download,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewMode = 'grid' | 'list' | 'comparison'

export default function AccountsPage() {
  const { accounts, accountGroups, loading, refreshAccounts } = useAccount()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'posts' | 'engagement'>('name')
  const [filteredAccounts, setFilteredAccounts] = useState(accounts)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Filter accounts based on search and group
  useEffect(() => {
    let filtered = [...accounts]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Group filter
    if (selectedGroup !== 'all') {
      const group = accountGroups.find(g => g.id === selectedGroup)
      if (group) {
        filtered = filtered.filter(account =>
          group.accounts?.some(a => a.id === account.id)
        )
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'posts':
          // Would use real metrics here
          return 0
        case 'engagement':
          // Would use real metrics here
          return 0
        default:
          return 0
      }
    })

    setFilteredAccounts(filtered)
  }, [searchQuery, selectedGroup, sortBy, accounts, accountGroups])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading accounts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Client Accounts</h1>
          <p className="text-muted-foreground">
            Manage all your client accounts in one place
          </p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Client Account
        </Button>
      </div>

      {/* Overview Stats */}
      <AccountsOverview accounts={filteredAccounts} />

      {/* Filters and Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card rounded-lg p-4">
        <div className="flex flex-1 gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Group Filter */}
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {accountGroups.map(group => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="posts">Posts</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'comparison' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('comparison')}
          >
            <BarChart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Accounts Display */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsContent value="grid" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAccounts.map(account => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No accounts found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="space-y-4">
            {filteredAccounts.map(account => (
              <AccountListItem key={account.id} account={account} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <AccountComparison accounts={filteredAccounts.slice(0, 4)} />
        </TabsContent>
      </Tabs>

      {/* Create Account Dialog */}
      <CreateAccountDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onAccountCreated={() => {
          refreshAccounts()
          setShowCreateDialog(false)
        }}
      />
    </div>
  )
}

// List view component
function AccountListItem({ account }: { account: any }) {
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
      <div className="flex items-center gap-4">
        {account.logo_url ? (
          <img 
            src={account.logo_url} 
            alt={account.name}
            className="h-10 w-10 rounded"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
            <span className="text-sm font-semibold">
              {account.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-semibold">{account.name}</h3>
          <p className="text-sm text-muted-foreground">{account.industry}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground">Scheduled</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">0%</p>
          <p className="text-xs text-muted-foreground">Engagement</p>
        </div>
        <Button size="sm">View</Button>
      </div>
    </div>
  )
}

// Comparison view component
function AccountComparison({ accounts }: { accounts: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Account</th>
            <th className="text-center p-4">Followers</th>
            <th className="text-center p-4">Posts</th>
            <th className="text-center p-4">Engagement</th>
            <th className="text-center p-4">Growth</th>
            <th className="text-center p-4">Best Platform</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id} className="border-b">
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {account.logo_url ? (
                    <img 
                      src={account.logo_url} 
                      alt={account.name}
                      className="h-8 w-8 rounded"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-muted" />
                  )}
                  <span className="font-medium">{account.name}</span>
                </div>
              </td>
              <td className="text-center p-4">0</td>
              <td className="text-center p-4">0</td>
              <td className="text-center p-4">0%</td>
              <td className="text-center p-4">
                <span className="text-green-600">+0%</span>
              </td>
              <td className="text-center p-4">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}