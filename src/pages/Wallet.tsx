
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, generateTransactionId } from "@/lib/utils";
import { CircleDollarSign, Loader2, Plus, QrCodeIcon } from "lucide-react";
import { getUserPayments } from "@/lib/mock-data";
import { Payment } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { QRCode } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Wallet = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [recentTransactions, setRecentTransactions] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [ad1dingFunds, setAddingFunds] = useState(false);
  const [amount, setAmount] = useState("");
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);
  
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const payments = getUserPayments(user?.id || "");
      setRecentTransactions(payments.slice(0, 5));
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddFunds = async () => {
    if (!amount) return;
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount",
      });
      return;
    }
    
    setAddingFunds(true);
    setShowQRDialog(true);
    
    // Simulate processing
    setProgress(25);
    await new Promise(r => setTimeout(r, 1500));
    setProgress(75);
    await new Promise(r => setTimeout(r, 1000));
    setProgress(100);
    
    // Update user wallet balance
    if (user) {
      const newBalance = (user.wallet_balance || 0) + amountValue;
      await updateUser({ wallet_balance: newBalance });
      
      toast({
        title: "Funds added",
        description: `${formatCurrency(amountValue)} has been added to your wallet`,
      });
    }
    
    setAmount("");
    setAddingFunds(false);
    setShowQRDialog(false);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your funds and transactions
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass lg:col-span-2">
            <CardHeader>
              <CardTitle>Balance</CardTitle>
              <CardDescription>Your current wallet balance</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-4xl font-bold text-primary">
                    {formatCurrency(user?.wallet_balance || 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Available for payments</p>
                </div>
                <div className="flex gap-2">
                  <Button className="w-32" onClick={() => setShowQRDialog(true)}>
                    <QrCodeIcon className="mr-2 h-4 w-4" /> Request
                  </Button>
                  <Button className="w-32">
                    <Plus className="mr-2 h-4 w-4" /> Add Funds
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardHeader>
              <CardTitle>Add Funds</CardTitle>
              <CardDescription>Top up your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {[500, 1000, 2000].map((value) => (
                      <Button 
                        key={value} 
                        variant="outline" 
                        onClick={() => setAmount(value.toString())}
                      >
                        {formatCurrency(value)}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button 
                      onClick={handleAddFunds}
                      disabled={ad1dingFunds || !amount}
                    >
                      {ad1dingFunds ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                        </>
                      ) : (
                        "Add"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No recent transactions
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-card/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transaction.job?.title || "Payment"}
                          {transaction.transaction_id && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              #{transaction.transaction_id}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`font-medium ${
                        user?.role === "employer" ? "text-red-400" : "text-green-400"
                      }`}>
                        {user?.role === "employer" ? "-" : "+"}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/payments">View All Transactions</a>
            </Button>
          </CardFooter>
        </Card>
        
        <Tabs defaultValue="methods">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="methods" className="space-y-4 pt-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Default Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card/30">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-lg mr-4">
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-muted-foreground">Default payment method</p>
                      </div>
                    </div>
                    <Button variant="ghost">Edit</Button>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4 pt-4">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-accept payments</p>
                      <p className="text-sm text-muted-foreground">Automatically accept incoming payments</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Transaction notifications</p>
                      <p className="text-sm text-muted-foreground">Get alerts for all wallet transactions</p>
                    </div>
                    <Button>Enabled</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {ad1dingFunds ? "Add Funds" : "Request Payment"}
            </DialogTitle>
            <DialogDescription>
              {ad1dingFunds 
                ? "Scan this QR code or click Add to fund your wallet" 
                : "Share this QR code to receive payment"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            <div className="bg-white p-6 rounded-lg">
              <QRCode
                value={JSON.stringify({
                  type: ad1dingFunds ? "add-funds" : "request",
                  amount: parseFloat(amount) || 0,
                  user: user?.name,
                  id: generateTransactionId()
                })}
                size={180}
                level="H"
                renderAs="svg"
              />
            </div>
            
            <div className="text-center">
              <p className="text-xl font-medium">
                {formatCurrency(parseFloat(amount) || 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                {ad1dingFunds ? "Add to your wallet" : "Request from anyone"}
              </p>
            </div>
            
            {ad1dingFunds && (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-muted-foreground">Processing</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Wallet;
