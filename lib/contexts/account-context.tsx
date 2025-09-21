'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export interface ClientAccount {
  id: string
  workspace_id: string
  name: string
  slug?: string
  description?: string
  logo_url?: string
  website_url?: string
  brand_colors?: {
    primary: string
    secondary: string
  }
  industry?: string
  timezone: string
  is_internal: boolean
  status: 'active' | 'paused' | 'archived'
  created_at: string
  updated_at: string
}

export interface AccountGroup {
  id: string
  workspace_id: string
  name: string
  description?: string
  color?: string
  icon?: string
  accounts?: ClientAccount[]
}

export interface AccountPermission {
  client_account_id: string
  role: 'owner' | 'admin' | 'manager' | 'editor' | 'contributor' | 'viewer'
  permissions: Record<string, boolean>
}

interface AccountContextType {
  // Current account
  currentAccount: ClientAccount | null
  setCurrentAccount: (account: ClientAccount | null) => void
  
  // All accounts
  accounts: ClientAccount[]
  accountGroups: AccountGroup[]
  
  // Permissions
  permissions: Map<string, AccountPermission>
  hasPermission: (accountId: string, permission: string) => boolean
  
  // Account management
  loadAccounts: () => Promise<void>
  refreshAccounts: () => Promise<void>
  createAccount: (account: Partial<ClientAccount>) => Promise<ClientAccount>
  updateAccount: (id: string, updates: Partial<ClientAccount>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  
  // Quick switching
  switchAccount: (accountId: string) => void
  recentAccounts: ClientAccount[]
  favoriteAccounts: ClientAccount[]
  
  // Loading states
  loading: boolean
  error: string | null
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function useAccount() {
  const context = useContext(AccountContext)
  if (!context) {
    throw new Error('useAccount must be used within AccountProvider')
  }
  return context
}

interface AccountProviderProps {
  children: ReactNode
}

export function AccountProvider({ children }: AccountProviderProps) {
  const [currentAccount, setCurrentAccount] = useState<ClientAccount | null>(null)
  const [accounts, setAccounts] = useState<ClientAccount[]>([])
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([])
  const [permissions, setPermissions] = useState<Map<string, AccountPermission>>(new Map())
  const [recentAccounts, setRecentAccounts] = useState<ClientAccount[]>([])
  const [favoriteAccounts, setFavoriteAccounts] = useState<ClientAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Load accounts and permissions
  const loadAccounts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Load all accounts user has access to
      const { data: accountsData, error: accountsError } = await supabase
        .from('client_accounts')
        .select(`
          *,
          account_permissions!inner(
            role,
            permissions
          )
        `)
        .eq('account_permissions.user_id', user.id)
        .eq('status', 'active')
        .order('name')

      if (accountsError) throw accountsError

      setAccounts(accountsData || [])

      // Load account groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('account_groups')
        .select(`
          *,
          account_group_members(
            account_id
          )
        `)
        .order('sort_order')

      if (groupsError) throw groupsError

      // Map accounts to groups
      const groupsWithAccounts = (groupsData || []).map(group => ({
        ...group,
        accounts: accounts.filter(account => 
          group.account_group_members?.some((m: any) => m.account_id === account.id)
        )
      }))

      setAccountGroups(groupsWithAccounts)

      // Load permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('account_permissions')
        .select('*')
        .eq('user_id', user.id)

      if (permissionsError) throw permissionsError

      const permissionsMap = new Map<string, AccountPermission>()
      permissionsData?.forEach(permission => {
        permissionsMap.set(permission.client_account_id, permission)
      })
      setPermissions(permissionsMap)

      // Load favorites from localStorage
      const savedFavorites = localStorage.getItem('favoriteAccounts')
      if (savedFavorites) {
        const favoriteIds = JSON.parse(savedFavorites)
        setFavoriteAccounts(
          accountsData?.filter(a => favoriteIds.includes(a.id)) || []
        )
      }

      // Load recent accounts from localStorage
      const savedRecent = localStorage.getItem('recentAccounts')
      if (savedRecent) {
        const recentIds = JSON.parse(savedRecent)
        setRecentAccounts(
          accountsData?.filter(a => recentIds.includes(a.id)).slice(0, 5) || []
        )
      }

      // Set current account (from localStorage or first available)
      const savedCurrentId = localStorage.getItem('currentAccountId')
      const currentAcc = savedCurrentId 
        ? accountsData?.find(a => a.id === savedCurrentId)
        : accountsData?.[0]
      
      if (currentAcc) {
        setCurrentAccount(currentAcc)
      }

    } catch (err) {
      console.error('Error loading accounts:', err)
      setError(err instanceof Error ? err.message : 'Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  // Create new account
  const createAccount = async (account: Partial<ClientAccount>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Get user's workspace
    const { data: workspaceMember } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .single()

    if (!workspaceMember) throw new Error('No workspace found')

    const { data, error } = await supabase
      .from('client_accounts')
      .insert({
        ...account,
        workspace_id: workspaceMember.workspace_id,
        slug: account.name?.toLowerCase().replace(/\s+/g, '-')
      })
      .select()
      .single()

    if (error) throw error

    // Add permission for creator
    await supabase
      .from('account_permissions')
      .insert({
        user_id: user.id,
        client_account_id: data.id,
        role: 'owner'
      })

    await loadAccounts()
    return data
  }

  // Update account
  const updateAccount = async (id: string, updates: Partial<ClientAccount>) => {
    const { error } = await supabase
      .from('client_accounts')
      .update(updates)
      .eq('id', id)

    if (error) throw error
    await loadAccounts()
  }

  // Delete account
  const deleteAccount = async (id: string) => {
    const { error } = await supabase
      .from('client_accounts')
      .update({ status: 'archived' })
      .eq('id', id)

    if (error) throw error
    
    if (currentAccount?.id === id) {
      setCurrentAccount(accounts[0] || null)
    }
    
    await loadAccounts()
  }

  // Switch account
  const switchAccount = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId)
    if (account) {
      setCurrentAccount(account)
      localStorage.setItem('currentAccountId', accountId)
      
      // Update recent accounts
      const recentIds = recentAccounts.map(a => a.id).filter(id => id !== accountId)
      recentIds.unshift(accountId)
      const newRecent = recentIds.slice(0, 5)
      localStorage.setItem('recentAccounts', JSON.stringify(newRecent))
      setRecentAccounts(accounts.filter(a => newRecent.includes(a.id)))
    }
  }

  // Check permission
  const hasPermission = (accountId: string, permission: string): boolean => {
    const accountPermission = permissions.get(accountId)
    if (!accountPermission) return false

    // Role-based permissions
    const rolePermissions: Record<string, string[]> = {
      owner: ['all'],
      admin: ['all'],
      manager: ['create', 'edit', 'publish', 'view', 'analytics'],
      editor: ['create', 'edit', 'view'],
      contributor: ['create', 'view'],
      viewer: ['view']
    }

    const allowed = rolePermissions[accountPermission.role] || []
    return allowed.includes('all') || allowed.includes(permission)
  }

  // Load accounts on mount
  useEffect(() => {
    loadAccounts()
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('account-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_accounts'
        },
        () => {
          loadAccounts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const value: AccountContextType = {
    currentAccount,
    setCurrentAccount,
    accounts,
    accountGroups,
    permissions,
    hasPermission,
    loadAccounts,
    refreshAccounts: loadAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    switchAccount,
    recentAccounts,
    favoriteAccounts,
    loading,
    error
  }

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  )
}