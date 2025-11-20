import { ChevronRight, Package } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const orders = [
  {
    id: "ORD-2025-001",
    date: "Nov 15, 2025",
    total: "$124.99",
    status: "Delivered",
    items: 3,
    tracking: true,
  },
  {
    id: "ORD-2025-002",
    date: "Nov 10, 2025",
    total: "$89.50",
    status: "In Transit",
    items: 2,
    tracking: true,
  },
  {
    id: "ORD-2025-003",
    date: "Nov 5, 2025",
    total: "$256.00",
    status: "Delivered",
    items: 5,
    tracking: true,
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles = {
    Delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "In Transit": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles["Processing"]}`}
    >
      {status}
    </span>
  )
}

export default function OrderHistory() {
  return (
    <Card className="p-6 bg-white dark:bg-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order History</h3>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">{order.id}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {order.date} • {order.items} items
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-slate-900 dark:text-white">{order.total}</p>
                <StatusBadge status={order.status} />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-slate-600"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 bg-transparent"
      >
        View All Orders
      </Button>
    </Card>
  )
}
