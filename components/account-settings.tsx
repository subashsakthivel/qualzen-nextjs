import { Settings, Bell, Lock, Eye } from "lucide-react"
import { Card } from "@/components/ui/card"

const settings = [
  {
    icon: Bell,
    title: "Email Preferences",
    description: "Manage your notification settings",
  },
  {
    icon: Lock,
    title: "Change Password",
    description: "Update your password for security",
  },
  {
    icon: Eye,
    title: "Privacy Settings",
    description: "Control your data and privacy",
  },
]

export default function AccountSettings() {
  return (
    <Card className="p-6 bg-white dark:bg-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Account Settings</h3>
      </div>

      <div className="space-y-3">
        {settings.map((setting, index) => {
          const Icon = setting.icon
          return (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all"
            >
              <div className="flex items-center gap-3 text-left">
                <Icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{setting.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{setting.description}</p>
                </div>
              </div>
              <div className="text-slate-400 text-xl ml-2">›</div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
