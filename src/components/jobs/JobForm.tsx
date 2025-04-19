
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createJob } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  pay_rate: z.coerce.number().positive({
    message: "Pay rate must be a positive number.",
  }),
  hours: z.coerce.number().positive({
    message: "Hours must be a positive number.",
  }),
  start_date: z.date({
    required_error: "Please select a start date.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  onSuccess?: () => void;
}

export function JobForm({ onSuccess }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      pay_rate: 500,
      hours: 8,
      start_date: new Date(),
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await createJob({
        employer_id: user.id,
        title: values.title,
        description: values.description,
        pay_rate: values.pay_rate,
        hours: values.hours,
        start_date: values.start_date.toISOString(),
        total_pay: values.pay_rate * values.hours,
      });
      
      toast({
        title: "Job created",
        description: "Your job has been created successfully.",
      });
      
      form.reset();
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create job. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Construction Site Helper" {...field} />
              </FormControl>
              <FormDescription>
                A clear title describing the job.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the job details, requirements, and any specific instructions..." 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pay_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Pay Rate (₹)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Amount paid per hour in rupees.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Working Hours</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Total number of hours for this job.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date when work will begin.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center">
          {form.watch('pay_rate') && form.watch('hours') && (
            <p className="text-muted-foreground mr-auto">
              Total Job Cost: <span className="font-bold text-primary">
                ₹{(form.watch('pay_rate') * form.watch('hours')).toLocaleString()}
              </span>
            </p>
          )}
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Job"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
