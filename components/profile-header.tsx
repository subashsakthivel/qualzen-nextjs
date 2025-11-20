"use client"
import { Mail, Phone, LogOut, Edit2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import { Input } from "./ui/input"
const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
}
export default function ProfileHeader() {

    const [isEdit, setIsEdit] = useState(false)

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 sticky top-4">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src="/customer-profile.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">John Doe</h2>
        <p className="text-slate-500 dark:text-slate-400">Premium Member</p>
      </div>

      {/* User Info */}
      <div className="space-y-3 mb-6 border-t border-slate-200 dark:border-slate-700 pt-6">
        <div className="flex items-center gap-3">
            
          <Mail className="w-5 h-5 text-blue-600" />
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
            {isEdit ? <Input value={user.email} name="email"></Input> : <p className="text-sm font-medium text-slate-900 dark:text-white truncate">john@example.com</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-blue-600" />
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 bg-transparent"
          onClick={() => setIsEdit(true)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
        <Button
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </Card>
  )
}
