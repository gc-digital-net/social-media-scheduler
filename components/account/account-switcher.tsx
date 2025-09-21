'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from '@/lib/contexts/account-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChevronDown,
  Search,
  Plus,
  Settings,
  Building2,
  Star,
  Clock,
  Folder,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function AccountSwitcher() {
  const {
    currentAccount,
    accounts,
    accountGroups,
    switchAccount,
    recentAccounts,
    favoriteAccounts,
    loading
  } = useAccount()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredAccounts, setFilteredAccounts] = useState(accounts)

  // Filter accounts based on search
  useEffect(() => {
    if (search) {
      const filtered = accounts.filter(account =>
        account.name.toLowerCase().includes(search.toLowerCase()) ||
        account.industry?.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredAccounts(filtered)
    } else {
      setFilteredAccounts(accounts)
    }
  }, [search, accounts])

  // Keyboard shortcut for quick switch (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAccountSwitch = (accountId: string) => {
    switchAccount(accountId)
    setOpen(false)
    setSearch('')
  }

  // Mock data for pending items (replace with real data)
  const getPendingCount = (accountId: string) => {
    // This would be fetched from your API
    const mockPending: Record<string, number> = {
      'account-1': 3,
      'account-2': 1,
      'account-3': 0,
    }
    return mockPending[accountId] || 0
  }

  if (loading) {
    return (
      <Button variant="outline" className="w-[240px] justify-between" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[240px] justify-between"
          aria-label="Switch account"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">
              {currentAccount?.name || 'Select Account'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[320px]" align="start">
        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
              onKeyDown={(e) => {
                e.stopPropagation()
              }}
            />
          </div>
        </div>

        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {/* Favorites */}
          {favoriteAccounts.length > 0 && !search && (
            <>
              <DropdownMenuLabel className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Favorites
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {favoriteAccounts.map(account => {
                  const pendingCount = getPendingCount(account.id)
                  return (
                    <DropdownMenuItem
                      key={account.id}
                      onClick={() => handleAccountSwitch(account.id)}
                      className="justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {account.logo_url ? (
                          <img 
                            src={account.logo_url} 
                            alt={account.name}
                            className="h-5 w-5 rounded"
                          />
                        ) : (
                          <Building2 className="h-4 w-4" />
                        )}
                        <span className={cn(
                          "truncate",
                          currentAccount?.id === account.id && "font-semibold"
                        )}>
                          {account.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {pendingCount > 0 && (
                          <Badge variant="destructive" className="h-5 px-1.5">
                            {pendingCount}
                          </Badge>
                        )}
                        {currentAccount?.id === account.id && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Recent */}
          {recentAccounts.length > 0 && !search && (
            <>
              <DropdownMenuLabel className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Recent
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {recentAccounts.slice(0, 3).map(account => {
                  const pendingCount = getPendingCount(account.id)
                  return (
                    <DropdownMenuItem
                      key={account.id}
                      onClick={() => handleAccountSwitch(account.id)}
                      className="justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className={cn(
                          "truncate",
                          currentAccount?.id === account.id && "font-semibold"
                        )}>
                          {account.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {pendingCount > 0 && (
                          <Badge variant="destructive" className="h-5 px-1.5">
                            {pendingCount}
                          </Badge>
                        )}
                        {currentAccount?.id === account.id && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Account Groups */}
          {accountGroups.length > 0 && !search ? (
            accountGroups.map(group => (
              <div key={group.id}>
                <DropdownMenuLabel className="flex items-center gap-1">
                  <Folder className="h-3 w-3" />
                  {group.name}
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {group.accounts?.map(account => {
                    const pendingCount = getPendingCount(account.id)
                    return (
                      <DropdownMenuItem
                        key={account.id}
                        onClick={() => handleAccountSwitch(account.id)}
                        className="justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span className={cn(
                            "truncate",
                            currentAccount?.id === account.id && "font-semibold"
                          )}>
                            {account.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {account.status === 'paused' && (
                            <Badge variant="secondary">Paused</Badge>
                          )}
                          {pendingCount > 0 && (
                            <Badge variant="destructive" className="h-5 px-1.5">
                              {pendingCount}
                            </Badge>
                          )}
                          {currentAccount?.id === account.id && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>
              </div>
            ))
          ) : (
            /* All Accounts (filtered) */
            <>
              <DropdownMenuLabel>
                {search ? 'Search Results' : 'All Accounts'}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {filteredAccounts.map(account => {
                  const pendingCount = getPendingCount(account.id)
                  return (
                    <DropdownMenuItem
                      key={account.id}
                      onClick={() => handleAccountSwitch(account.id)}
                      className="justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className={cn(
                          "truncate",
                          currentAccount?.id === account.id && "font-semibold"
                        )}>
                          {account.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.status === 'paused' && (
                          <Badge variant="secondary">Paused</Badge>
                        )}
                        {pendingCount > 0 && (
                          <Badge variant="destructive" className="h-5 px-1.5">
                            {pendingCount}
                          </Badge>
                        )}
                        {currentAccount?.id === account.id && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />

        {/* Actions */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setOpen(false)
              // Navigate to add account page
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Client Account
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpen(false)
              // Navigate to manage accounts page
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Accounts
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}