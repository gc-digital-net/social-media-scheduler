import { DashboardNav } from '@/components/layout/dashboard-nav'
import { UserNav } from '@/components/layout/user-nav'
import { MobileNav } from '@/components/layout/mobile-nav'
import { AccountSwitcher } from '@/components/account/account-switcher'
import { AccountProvider } from '@/lib/contexts/account-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccountProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop Navigation */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          <DashboardNav />
        </div>

        {/* Mobile Navigation */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
          <MobileNav />
          <div className="ml-auto">
            <AccountSwitcher />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:pl-64">
          <header className="sticky top-0 z-40 hidden h-16 items-center gap-4 border-b bg-background px-6 md:flex">
            <div className="flex items-center gap-4">
              <AccountSwitcher />
            </div>
            <div className="ml-auto flex items-center gap-4">
              <UserNav />
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AccountProvider>
  )
}