
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Payment } from "@/types";
import { getUserPayments } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CircleDollarSign, Download, FileTextIcon } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Payments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  const isEmployer = user?.role === "employer";

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);
  
  useEffect(() => {
    if (payments.length > 0) {
      applyFilters();
    }
  }, [payments, filter, search]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const userPayments = getUserPayments(user?.id || "");
      setPayments(userPayments);
      setFilteredPayments(userPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let result = [...payments];
    
    // Apply status filter
    if (filter !== "all") {
      result = result.filter((payment) => payment.status === filter);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((payment) => 
        payment.job?.title?.toLowerCase().includes(searchLower) || 
        payment.transaction_id?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredPayments(result);
  };
  
  const renderStatusBadge = (status: Payment["status"]) => {
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
  
  const generatePaymentReceipt = (payment: Payment) => {
    // In a real app, this would generate a PDF receipt
    // For this demo, we'll create a simple text receipt and download it
    
    const receiptContent = `
PAYMENT RECEIPT
--------------
Transaction ID: ${payment.transaction_id || "N/A"}
Date: ${formatDateTime(payment.created_at)}
Status: ${payment.status.toUpperCase()}

FROM: ${payment.employer?.name || "Employer"}
TO: ${payment.labourer?.name || "Worker"}

Job: ${payment.job?.title || "N/A"}
Amount: ${formatCurrency(payment.amount)}

Thank you for using WorkWise Pay!
    `;
    
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate summary stats
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter(payment => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const pendingAmount = payments
    .filter(payment => payment.status === "pending" || payment.status === "processing")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            {isEmployer
              ? "Track payments made to your workers"
              : "View your earnings from completed jobs"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Total {isEmployer ? "Spent" : "Earned"}
              </CardTitle>
              <CardDescription>
                All time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {payments.length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                {isEmployer ? "Paid" : "Received"}
              </CardTitle>
              <CardDescription>
                Completed payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {formatCurrency(paidAmount)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {payments.filter(p => p.status === "paid").length} successful payments
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Pending
              </CardTitle>
              <CardDescription>
                In progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">
                {formatCurrency(pendingAmount)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {payments.filter(p => p.status === "pending" || p.status === "processing").length} pending transactions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-auto">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Input
              placeholder="Search payments..."
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
              <p className="mt-4 text-muted-foreground">Loading payments...</p>
            </div>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <CircleDollarSign className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No payments found</h3>
            <p className="text-muted-foreground">
              {search || filter !== "all"
                ? "Try changing your filters"
                : isEmployer
                ? "You haven't made any payments yet"
                : "You haven't received any payments yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="list">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              <TabsContent value="list" className="pt-6">
                <Card className="glass">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 p-4 text-sm font-medium">
                      <div className="col-span-2">Job / Transaction</div>
                      <div>Date</div>
                      <div>Amount</div>
                      <div className="text-center">Status</div>
                      <div className="text-right">Action</div>
                    </div>
                    
                    <div className="divide-y">
                      {filteredPayments.map((payment) => (
                        <div key={payment.id} className="grid grid-cols-6 p-4 text-sm items-center">
                          <div className="col-span-2 flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage 
                                src={isEmployer ? payment.labourer?.avatar_url : payment.employer?.avatar_url}
                              />
                              <AvatarFallback>
                                {isEmployer
                                  ? payment.labourer?.name?.substring(0, 2) || "W"
                                  : payment.employer?.name?.substring(0, 2) || "E"
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{payment.job?.title || "Payment"}</p>
                              <p className="text-xs text-muted-foreground">
                                {payment.transaction_id ? `#${payment.transaction_id}` : "No transaction ID"}
                              </p>
                            </div>
                          </div>
                          <div>{formatDateTime(payment.created_at)}</div>
                          <div className="font-medium">{formatCurrency(payment.amount)}</div>
                          <div className="text-center">{renderStatusBadge(payment.status)}</div>
                          <div className="text-right">
                            {payment.status === "paid" && (
                              <Button variant="ghost" size="sm" onClick={() => generatePaymentReceipt(payment)}>
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download Receipt</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="grid" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPayments.map((payment) => (
                    <Card key={payment.id} className="glass hover-scale">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>
                              {payment.job?.title || "Payment"}
                            </CardTitle>
                            <CardDescription>
                              {payment.transaction_id 
                                ? `#${payment.transaction_id}`
                                : formatDateTime(payment.created_at)
                              }
                            </CardDescription>
                          </div>
                          {renderStatusBadge(payment.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-bold text-lg">{formatCurrency(payment.amount)}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date</span>
                            <span>{formatDateTime(payment.created_at)}</span>
                          </div>
                          
                          <div className="flex items-center p-3 bg-card/50 rounded-lg">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage 
                                src={isEmployer ? payment.labourer?.avatar_url : payment.employer?.avatar_url}
                              />
                              <AvatarFallback>
                                {isEmployer 
                                  ? payment.labourer?.name?.substring(0, 2) || "W"
                                  : payment.employer?.name?.substring(0, 2) || "E"
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {isEmployer ? payment.labourer?.name : payment.employer?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {isEmployer ? "Worker" : "Employer"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      {payment.status === "paid" && (
                        <div className="px-6 pb-6">
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => generatePaymentReceipt(payment)}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download Receipt
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Payments;
