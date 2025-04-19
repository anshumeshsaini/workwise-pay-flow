
import { Payment } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface RecentPaymentsListProps {
  payments: Payment[];
}

export function RecentPaymentsList({ payments }: RecentPaymentsListProps) {
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";
  
  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="status-pending">Pending</Badge>;
      case "processing":
        return <Badge variant="outline" className="status-processing">Processing</Badge>;
      case "paid":
        return <Badge variant="outline" className="status-paid">Paid</Badge>;
      case "failed":
        return <Badge variant="outline" className="status-declined">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (payments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No payments found. {isEmployer ? "Complete jobs to see payments here." : "Complete jobs to receive payments."}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-start justify-between p-4 rounded-lg bg-card/30 hover:bg-card/60 transition-colors">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <CircleDollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">
                {payment.job?.title || "Payment"}
                {payment.transaction_id && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    #{payment.transaction_id}
                  </span>
                )}
              </p>
              <div className="text-sm text-muted-foreground mt-1">
                {formatDateTime(payment.created_at)}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-medium">{formatCurrency(payment.amount)}</div>
            <div className="mt-1">{getStatusBadge(payment.status)}</div>
            {isEmployer && payment.labourer ? (
              <div className="mt-2 flex items-center">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={payment.labourer.avatar_url} />
                  <AvatarFallback>{payment.labourer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{payment.labourer.name}</span>
              </div>
            ) : payment.employer ? (
              <div className="mt-2 flex items-center">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={payment.employer.avatar_url} />
                  <AvatarFallback>{payment.employer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{payment.employer.name}</span>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
