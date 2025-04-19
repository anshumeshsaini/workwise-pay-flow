
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEnrichedJobs, getUserJobs, getUserPayments } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CircleDollarSign } from "lucide-react";
import { Job, Payment } from "@/types";
import { RecentJobsList } from "../jobs/RecentJobsList";
import { RecentPaymentsList } from "../payments/RecentPaymentsList";
import { StatusStats } from "./StatusStats";

export function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const isEmployer = user?.role === "employer";

  useEffect(() => {
    if (user) {
      // Fetch user-specific jobs and payments
      const userJobs = getUserJobs(user.id);
      const userPayments = getUserPayments(user.id);
      setJobs(userJobs);
      setPayments(userPayments);

      // Fetch all jobs for the employer view
      setAllJobs(getEnrichedJobs());
    }
  }, [user]);

  // Calculate statistics
  const totalEarned = payments
    .filter(p => p.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = isEmployer
    ? payments
        .filter(p => p.status === "pending" || p.status === "processing")
        .reduce((sum, payment) => sum + payment.amount, 0)
    : jobs
        .filter(j => j.status === "completed" && !payments.some(p => p.job_id === j.id && p.status === "paid"))
        .reduce((sum, job) => sum + job.total_pay, 0);

  const completedJobs = jobs.filter(j => j.status === "completed" || j.status === "paid").length;
  const totalJobs = jobs.length;
  const completionRate = totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0;

  // Chart data
  const getMonthlyData = () => {
    const today = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(month);
    }

    return months.map(month => {
      const monthName = month.toLocaleString('default', { month: 'short' });
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1).toISOString();
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString();
      
      const monthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        return payment.status === "paid" && 
               paymentDate >= new Date(monthStart) &&
               paymentDate <= new Date(monthEnd);
      });
      
      const totalAmount = monthPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      return {
        name: monthName,
        amount: totalAmount,
      };
    });
  };

  const getJobStatusData = () => {
    const statusCounts: Record<string, number> = {
      "pending": 0,
      "accepted": 0,
      "completed": 0,
      "paid": 0,
      "rejected": 0
    };

    jobs.forEach(job => {
      statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
    });

    return Object.keys(statusCounts).map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusCounts[status]
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Use available workers for employer view
  const availableWorkers = allJobs
    .filter(job => job.status === "completed" || job.status === "paid")
    .map(job => job.labourer)
    .filter((labourer, index, self) => 
      labourer && self.findIndex(l => l?.id === labourer.id) === index
    );

  // Recent activities for timeline view
  const recentActivities = [...jobs, ...payments]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of your {isEmployer ? 'workforce' : 'work'} activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {isEmployer ? 'Total Payouts' : 'Total Earnings'}
            </CardTitle>
            <CardDescription>
              {isEmployer ? 'Amount paid to workers' : 'Income from completed jobs'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(totalEarned)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {payments.filter(p => p.status === "paid").length} successful payments
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {isEmployer ? 'Pending Payments' : 'Expected Income'}
            </CardTitle>
            <CardDescription>
              {isEmployer ? 'Payments awaiting processing' : 'From completed jobs'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">
              {formatCurrency(pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {isEmployer ? 
                `${payments.filter(p => p.status === "pending" || p.status === "processing").length} pending transactions` : 
                `${jobs.filter(j => j.status === "completed" && !payments.some(p => p.job_id === j.id && p.status === "paid")).length} completed jobs awaiting payment`
              }
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {isEmployer ? 'Active Jobs' : 'Completion Rate'}
            </CardTitle>
            <CardDescription>
              {isEmployer ? 'Currently in progress' : 'Job success rate'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEmployer ? (
              <>
                <div className="text-3xl font-bold text-accent">
                  {jobs.filter(j => j.status === "accepted").length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {jobs.filter(j => j.status === "pending").length} jobs awaiting acceptance
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl font-bold text-accent">
                  {completionRate.toFixed(0)}%
                </div>
                <Progress value={completionRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {completedJobs} of {totalJobs} jobs completed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle>{isEmployer ? 'Payment History' : 'Earnings Trend'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={getMonthlyData()}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'rgba(22, 22, 26, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary)/0.2)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader>
            <CardTitle>Job Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={getJobStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {getJobStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} jobs`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(22, 22, 26, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Tabs defaultValue="recentJobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recentJobs">Recent Jobs</TabsTrigger>
            <TabsTrigger value="recentPayments">Recent Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="recentJobs">
            <Card className="glass border-none">
              <CardHeader>
                <CardTitle>Recent Jobs</CardTitle>
                <CardDescription>
                  Your most recent job activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentJobsList jobs={jobs.slice(0, 5)} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/jobs">View All Jobs</a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="recentPayments">
            <Card className="glass border-none">
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                  Your most recent payment activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPaymentsList payments={payments.slice(0, 5)} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/payments">View All Payments</a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {isEmployer ? (
          <Card className="glass">
            <CardHeader>
              <CardTitle>Top Workers</CardTitle>
              <CardDescription>Workers with successfully completed jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableWorkers.slice(0, 5).map(worker => (
                  worker && (
                    <div key={worker.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={worker.avatar_url} />
                          <AvatarFallback>{worker.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">{worker.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{
                          jobs.filter(job => 
                            job.labourer_id === worker.id && 
                            (job.status === "completed" || job.status === "paid")
                          ).length
                        } jobs</Badge>
                      </div>
                    </div>
                  )
                ))}
                
                {availableWorkers.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No workers with completed jobs yet
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/workers">View All Workers</a>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="glass">
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent activities on your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l border-border space-y-6">
                {recentActivities.map((activity, index) => {
                  const isJob = 'title' in activity;
                  return (
                    <div key={index} className="relative -left-3">
                      <div className="absolute -left-3 mt-1.5 h-6 w-6 rounded-full flex items-center justify-center border border-border bg-card text-foreground">
                        {isJob ? (
                          <CalendarIcon className="h-3 w-3" />
                        ) : (
                          <CircleDollarSign className="h-3 w-3" />
                        )}
                      </div>
                      <div className="ml-6">
                        <p className="font-medium">
                          {isJob ? (activity as Job).title : `Payment ${(activity as Payment).status}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isJob 
                            ? `Status: ${(activity as Job).status}`
                            : `Amount: ${formatCurrency((activity as Payment).amount)}`
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {recentActivities.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground ml-4">
                    No recent activities
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <StatusStats jobs={jobs} payments={payments} />
    </div>
  );
}
