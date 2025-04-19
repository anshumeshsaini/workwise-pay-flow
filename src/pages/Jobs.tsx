
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Job } from "@/types";
import { getUserJobs } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckIcon,
  CircleDollarSign,
  FileTextIcon,
  Loader2,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { JobForm } from "@/components/jobs/JobForm";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { formatCurrency, formatDate, formatDateTime, getInitials } from "@/lib/utils";
import { updateJobStatus } from "@/lib/mock-data";
import { useToast } from "@/components/ui/toast";

const Jobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const isEmployer = user?.role === "employer";

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);
  
  useEffect(() => {
    if (jobs.length > 0) {
      applyFilters();
    }
  }, [jobs, filter, search]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const userJobs = getUserJobs(user?.id || "");
      setJobs(userJobs);
      setFilteredJobs(userJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let result = [...jobs];
    
    // Apply status filter
    if (filter !== "all") {
      result = result.filter((job) => job.status === filter);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((job) => 
        job.title.toLowerCase().includes(searchLower) || 
        job.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredJobs(result);
  };

  const handleJobAction = async (jobId: string, status: Job["status"]) => {
    setActionLoading(true);
    try {
      await updateJobStatus(jobId, status, user?.id || "");
      toast({
        title: "Job Updated",
        description: `Job status changed to ${status}`,
      });
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update job status",
      });
    } finally {
      setActionLoading(false);
    }
  };
  
  const handlePaymentInitiation = (job: Job) => {
    setSelectedJob(job);
    setShowPaymentForm(true);
  };
  
  const renderJobActions = (job: Job) => {
    if (isEmployer) {
      // Employer actions
      if (job.status === "completed") {
        return (
          <Button 
            className="w-full" 
            onClick={() => handlePaymentInitiation(job)}
          >
            <CircleDollarSign className="mr-2 h-4 w-4" /> Pay Now
          </Button>
        );
      }
      
      return null;
    } else {
      // Worker actions
      if (job.status === "pending") {
        return (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleJobAction(job.id, "accepted")}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
              Accept
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleJobAction(job.id, "rejected")}
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XIcon className="mr-2 h-4 w-4" />}
              Decline
            </Button>
          </div>
        );
      }
      
      if (job.status === "accepted") {
        return (
          <Button 
            className="w-full" 
            onClick={() => handleJobAction(job.id, "completed")}
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckIcon className="mr-2 h-4 w-4" />}
            Mark Complete
          </Button>
        );
      }
    }
    
    return null;
  };
  
  const getStatusBadge = (status: Job["status"]) => {
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
            <p className="text-muted-foreground">
              {isEmployer
                ? "Manage your job listings and worker assignments"
                : "Browse available jobs and track your work"}
            </p>
          </div>
          
          {isEmployer && (
            <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" /> New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Job</DialogTitle>
                  <DialogDescription>
                    Post a new job for workers to apply
                  </DialogDescription>
                </DialogHeader>
                <JobForm onSuccess={() => {
                  setShowJobForm(false);
                  fetchJobs();
                }} />
              </DialogContent>
            </Dialog>
          )}
          
          {/* Payment Form Dialog */}
          <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Make Payment</DialogTitle>
                <DialogDescription>
                  Pay the worker for completing the job
                </DialogDescription>
              </DialogHeader>
              {selectedJob && (
                <PaymentForm 
                  job={selectedJob}
                  onSuccess={() => {
                    setShowPaymentForm(false);
                    fetchJobs();
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-auto">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading jobs...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <FileTextIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
            <p className="text-muted-foreground">
              {isEmployer
                ? search || filter !== "all"
                  ? "Try changing your filters"
                  : "Create your first job to get started"
                : "No jobs available with the current filters"}
            </p>
            {isEmployer && !search && filter === "all" && (
              <Button className="mt-4" onClick={() => setShowJobForm(true)}>
                <PlusIcon className="mr-2 h-4 w-4" /> Post a Job
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="glass hover-scale">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription>Posted on {formatDate(job.created_at)}</CardDescription>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{job.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="text-muted-foreground">Pay Rate</p>
                        <p className="font-medium">{formatCurrency(job.pay_rate)}/hr</p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="text-muted-foreground">Hours</p>
                        <p className="font-medium">{job.hours}</p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium">{formatDate(job.start_date)}</p>
                      </div>
                      <div className="rounded-md bg-muted/50 p-2">
                        <p className="text-muted-foreground">Total Pay</p>
                        <p className="font-medium">{formatCurrency(job.total_pay)}</p>
                      </div>
                    </div>
                    
                    {(isEmployer ? job.labourer : job.employer) && (
                      <div className="flex items-center p-3 bg-card/50 rounded-lg">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage 
                            src={isEmployer ? job.labourer?.avatar_url : job.employer?.avatar_url} 
                          />
                          <AvatarFallback>
                            {getInitials(isEmployer 
                              ? job.labourer?.name || "W" 
                              : job.employer?.name || "E"
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {isEmployer ? job.labourer?.name : job.employer?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {isEmployer ? "Worker" : "Employer"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  {renderJobActions(job)}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jobs;
