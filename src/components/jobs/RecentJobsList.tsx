
import { Job } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileTextIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface RecentJobsListProps {
  jobs: Job[];
}

export function RecentJobsList({ jobs }: RecentJobsListProps) {
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";
  
  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="status-pending">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-300 border-amber-500/30">Completed</Badge>;
      case "paid":
        return <Badge variant="outline" className="status-paid">Paid</Badge>;
      case "rejected":
        return <Badge variant="outline" className="status-declined">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No jobs found. {isEmployer ? "Create your first job to get started." : "Apply for jobs to get started."}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="flex items-start justify-between p-4 rounded-lg bg-card/30 hover:bg-card/60 transition-colors">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileTextIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{job.title}</p>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <CalendarIcon className="h-3 w-3 mr-1" />
                <span>{formatDate(job.start_date)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-medium">{formatCurrency(job.total_pay)}</div>
            <div className="mt-1">{getStatusBadge(job.status)}</div>
            {isEmployer && job.labourer && (
              <div className="mt-2 flex items-center">
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={job.labourer.avatar_url} />
                  <AvatarFallback>{job.labourer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="text-xs">{job.labourer.name}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
