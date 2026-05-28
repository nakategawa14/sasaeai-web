"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, Mail } from "lucide-react"

interface VerificationCardProps {
  email: string
  status: "pending" | "approved" | "rejected"
}

export default function VerificationCard({ email, status }: VerificationCardProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "approved":
        return <CheckCircle className="text-green-500" size={24} />
      case "rejected":
        return <XCircle className="text-red-500" size={24} />
      default:
        return <Mail className="text-yellow-500" size={24} />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "approved":
        return "承認済み"
      case "rejected":
        return "却下"
      default:
        return "確認中"
    }
  }

  return (
    <Card className="p-4 flex items-center justify-between">
      <div>
        <p className="font-medium">{email}</p>
        <p className="text-sm text-gray-500">{getStatusText()}</p>
      </div>
      {getStatusIcon()}
    </Card>
  )
}
