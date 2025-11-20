import { MapPin, Plus, Edit2, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const addresses = [
  {
    id: 1,
    type: "Home",
    address: "123 Main St",
    city: "San Francisco, CA 94102",
    default: true,
  },
  {
    id: 2,
    type: "Office",
    address: "456 Market St",
    city: "San Francisco, CA 94105",
    default: false,
  },
]

export default function SavedAddresses() {
  return (
    <Card className="p-6 bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Saved Addresses</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 bg-transparent"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`p-4 border rounded-lg ${
              address.default
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            } transition-colors`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{address.type}</p>
                {address.default && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Default</span>
                )}
              </div>
              <div className="flex gap-1">
                <button className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{address.address}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{address.city}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
