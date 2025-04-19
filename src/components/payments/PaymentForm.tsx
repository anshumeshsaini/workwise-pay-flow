import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2Icon, Loader2, QrCodeIcon } from "lucide-react";
import { cn, formatCurrency, generatePaymentQRData, generateTransactionId, sleep } from "@/lib/utils";
import { createPayment, updatePaymentStatus } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Job } from "@/types";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Progress } from "@/components/ui/progress";
import { Confetti } from "../ui/confetti";

const formSchema = z.object({
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  job: Job;
  onSuccess?: () => void;
  initialAmount?: number;
}

export function PaymentForm({ job, onSuccess, initialAmount }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "paid" | "failed">("pending");
  const [progress, setProgress] = useState(0);
  const [paymentId, setPaymentId] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: initialAmount || job.total_pay,
      note: `Payment for job: ${job.title}`,
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) return;
    if (!job.labourer_id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No worker assigned to this job.",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payment = await createPayment({
        job_id: job.id,
        employer_id: user.id,
        labourer_id: job.labourer_id,
        amount: values.amount,
      });
      
      setPaymentId(payment.id);
      setShowQRDialog(true);
      
      await simulatePaymentProcess(payment.id);
      
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again.",
      });
      setIsSubmitting(false);
    }
  }
  
  async function simulatePaymentProcess(paymentId: string) {
    setPaymentStatus("pending");
    setProgress(10);
    await sleep(1500);
    
    setPaymentStatus("processing");
    setProgress(50);
    await sleep(2000);
    
    const txId = generateTransactionId();
    await updatePaymentStatus(paymentId, "paid", txId);
    
    setPaymentStatus("paid");
    setProgress(100);
    setShowConfetti(true);
    
    toast({
      title: "Payment Successful",
      description: `Transaction ID: ${txId}`,
    });
  }

  function closeDialog() {
    setShowQRDialog(false);
    setIsSubmitting(false);
    setProgress(0);
    setPaymentStatus("pending");
    setShowConfetti(false);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {job.labourer && (
            <div className="flex items-center space-x-4 p-4 bg-card/30 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={job.labourer.avatar_url} />
                <AvatarFallback>{job.labourer.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{job.labourer.name}</p>
                <p className="text-sm text-muted-foreground">{job.labourer.phone}</p>
              </div>
            </div>
          )}
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Default amount is based on the job's pay rate and hours.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Note (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Add a note or reference for this payment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting || !job.labourer_id}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Make Payment"
            )}
          </Button>
        </form>
      </Form>
      
      <Dialog open={showQRDialog} onOpenChange={paymentStatus === "paid" ? closeDialog : setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{
              paymentStatus === "paid" 
                ? "Payment Successful!" 
                : "Complete Payment"
            }</DialogTitle>
            <DialogDescription>
              {paymentStatus === "paid" 
                ? "The payment has been processed successfully." 
                : "Scan the QR code or click Pay Now to complete the transaction."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center space-y-6 py-4">
            {paymentStatus === "paid" ? (
              <div className="text-center space-y-4">
                <div className="bg-green-500/10 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2Icon className="h-12 w-12 text-green-500" />
                </div>
                <p className="text-xl font-medium">
                  {formatCurrency(form.getValues("amount"))}
                </p>
                <p className="text-sm text-muted-foreground">
                  has been sent to {job.labourer?.name}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <QRCodeSVG
                    value={generatePaymentQRData(
                      form.getValues("amount"),
                      job.labourer?.name || "Worker",
                      paymentId
                    )}
                    size={180}
                    level="H"
                    imageSettings={{
                      src: "/logo.png",
                      height: 30,
                      width: 30,
                      excavate: true,
                    }}
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xl font-medium">
                    {formatCurrency(form.getValues("amount"))}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    to {job.labourer?.name}
                  </p>
                </div>
              </>
            )}
            
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className={cn(
                  paymentStatus === "paid" ? "text-green-500" : "text-muted-foreground",
                  "capitalize"
                )}>
                  {paymentStatus}
                </span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {paymentStatus !== "paid" && (
              <Button 
                className="w-full"
                onClick={async () => {
                  await simulatePaymentProcess(paymentId);
                }}
              >
                <QrCodeIcon className="mr-2 h-4 w-4" /> Pay Now
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {showConfetti && <Confetti />}
    </>
  );
}
