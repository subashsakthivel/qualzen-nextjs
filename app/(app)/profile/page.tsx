import ProfileHeader from "@/components/profile-header"
import OrderHistory from "@/components/order-history"
import SavedAddresses from "@/components/saved-addresses"
import AccountSettings from "@/components/account-settings"

export default function CustomerProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Account</h1>
          <p className="text-blue-100">Manage your profile, orders, and preferences</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileHeader />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <OrderHistory />
            <SavedAddresses />
            <AccountSettings />
          </div>
        </div>
      </main>
    </div>
  )
}
