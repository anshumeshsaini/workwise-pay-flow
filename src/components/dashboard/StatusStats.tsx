
import { Job, Payment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StatusStatsProps {
  jobs: Job[];
  payments: Payment[];
}

export function StatusStats({ jobs, payments }: StatusStatsProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  const jobStatuses = ["pending", "accepted", "completed", "paid", "rejected"];
  const paymentStatuses = ["pending", "processing", "paid", "failed"];
  
  const getJobsCount = (status: string): number => {
    return jobs.filter(job => job.status === status).length;
  };
  
  const getPaymentsCount = (status: string): number => {
    return payments.filter(payment => payment.status === status).length;
  };
  
  const getJobsAmount = (status: string): number => {
    return jobs
      .filter(job => job.status === status)
      .reduce((total, job) => total + job.total_pay, 0);
  };
  
  const getPaymentsAmount = (status: string): number => {
    return payments
      .filter(payment => payment.status === status)
      .reduce((total, payment) => total + payment.amount, 0);
  };
  
  const renderStatusBadge = (status: string): React.ReactNode => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="status-pending">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">Accepted</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">Completed</Badge>;
      case "paid":
        return <Badge variant="outline" className="status-paid">Paid</Badge>;
      case "rejected":
        return <Badge variant="outline" className="status-declined">Rejected</Badge>;
      case "processing":
        return <Badge variant="outline" className="status-processing">Processing</Badge>;
      case "failed":
        return <Badge variant="outline" className="status-declined">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Jobs & Payments Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Jobs by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-4">
                <Badge
                  variant={selectedStatus === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => setSelectedStatus(null)}
                >
                  All
                </Badge>
                {jobStatuses.map(status => (
                  <Badge
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 capitalize"
                    onClick={() => setSelectedStatus(status === selectedStatus ? null : status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {jobStatuses
                .filter(status => selectedStatus === null || status === selectedStatus)
                .map(status => (
                  <div key={status} className="bg-card/40 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      {renderStatusBadge(status)}
                    </div>
                    <div className="text-2xl font-bold">{getJobsCount(status)}</div>
                    <div className="text-sm text-muted-foreground mt-1 capitalize">
                      {status} jobs
                    </div>
                    <div className="text-xs font-medium text-primary mt-2">
                      {formatCurrency(getJobsAmount(status))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payments by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="flex gap-2 pb-4">
                <Badge
                  variant={selectedStatus === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => setSelectedStatus(null)}
                >
                  All
                </Badge>
                {paymentStatuses.map(status => (
                  <Badge
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 capitalize"
                    onClick={() => setSelectedStatus(status === selectedStatus ? null : status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {paymentStatuses
                .filter(status => selectedStatus === null || status === selectedStatus)
                .map(status => (
                  <div key={status} className="bg-card/40 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      {renderStatusBadge(status)}
                    </div>
                    <div className="text-2xl font-bold">{getPaymentsCount(status)}</div>
                    <div className="text-sm text-muted-foreground mt-1 capitalize">
                      {status} payments
                    </div>
                    <div className="text-xs font-medium text-primary mt-2">
                      {formatCurrency(getPaymentsAmount(status))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
