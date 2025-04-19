
import { Job, Notification, Payment, User } from "@/types";
import { generateAvatar } from "./utils";

// Mock user data
export const MOCK_USERS: User[] = [
  {
    id: "e-1",
    email: "employer@example.com",
    role: "employer",
    name: "John Smith",
    avatar_url: generateAvatar("John Smith"),
    wallet_balance: 5000,
    created_at: "2023-01-15T10:30:00Z",
    phone: "9876543210"
  },
  {
    id: "e-2",
    email: "sarah@company.com",
    role: "employer",
    name: "Sarah Johnson",
    avatar_url: generateAvatar("Sarah Johnson"),
    wallet_balance: 12500,
    created_at: "2023-03-22T14:20:00Z",
    phone: "9876543211"
  },
  {
    id: "l-1",
    email: "worker@example.com",
    role: "labourer",
    name: "Ram Kumar",
    avatar_url: generateAvatar("Ram Kumar"),
    wallet_balance: 1500,
    created_at: "2023-02-10T09:15:00Z",
    phone: "8765432109"
  },
  {
    id: "l-2",
    email: "sita@example.com",
    role: "labourer",
    name: "Sita Sharma",
    avatar_url: generateAvatar("Sita Sharma"),
    wallet_balance: 2300,
    created_at: "2023-02-05T11:45:00Z",
    phone: "8765432108"
  },
  {
    id: "l-3",
    email: "ajay@example.com",
    role: "labourer",
    name: "Ajay Singh",
    avatar_url: generateAvatar("Ajay Singh"),
    wallet_balance: 950,
    created_at: "2023-04-18T08:30:00Z",
    phone: "7654321098"
  }
];

// Mock jobs data
export const MOCK_JOBS: Job[] = [
  {
    id: "j-1",
    employer_id: "e-1",
    title: "Construction Site Helper",
    description: "Need 2 helpers for a construction site. Tasks include carrying materials and assisting skilled workers.",
    pay_rate: 600,
    hours: 8,
    total_pay: 4800,
    status: "paid",
    created_at: "2023-04-10T08:00:00Z",
    start_date: "2023-04-12T08:00:00Z",
    end_date: "2023-04-12T16:00:00Z",
    labourer_id: "l-1"
  },
  {
    id: "j-2",
    employer_id: "e-1",
    title: "Garden Maintenance",
    description: "Looking for someone to help with garden maintenance, including trimming hedges and mowing lawns.",
    pay_rate: 500,
    hours: 5,
    total_pay: 2500,
    status: "completed",
    created_at: "2023-04-15T10:00:00Z",
    start_date: "2023-04-17T09:00:00Z",
    end_date: "2023-04-17T14:00:00Z",
    labourer_id: "l-2"
  },
  {
    id: "j-3",
    employer_id: "e-2",
    title: "Moving Assistance",
    description: "Need help with moving furniture and boxes to a new apartment.",
    pay_rate: 700,
    hours: 6,
    total_pay: 4200,
    status: "accepted",
    created_at: "2023-04-18T14:30:00Z",
    start_date: "2023-04-20T10:00:00Z",
    labourer_id: "l-1"
  },
  {
    id: "j-4",
    employer_id: "e-2",
    title: "Painting Work",
    description: "Looking for experienced painter for interior walls of a 2BHK apartment.",
    pay_rate: 800,
    hours: 16,
    total_pay: 12800,
    status: "pending",
    created_at: "2023-04-19T09:45:00Z",
    start_date: "2023-04-25T09:00:00Z"
  },
  {
    id: "j-5",
    employer_id: "e-1",
    title: "Plumbing Assistance",
    description: "Need a helper for a professional plumber. Will involve carrying tools and basic assistance.",
    pay_rate: 550,
    hours: 4,
    total_pay: 2200,
    status: "pending",
    created_at: "2023-04-19T16:20:00Z",
    start_date: "2023-04-22T10:00:00Z"
  }
];

// Mock payments data
export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "p-1",
    job_id: "j-1",
    employer_id: "e-1",
    labourer_id: "l-1",
    amount: 4800,
    status: "paid",
    created_at: "2023-04-12T16:30:00Z",
    updated_at: "2023-04-12T16:35:00Z",
    transaction_id: "TX1234567"
  },
  {
    id: "p-2",
    job_id: "j-2",
    employer_id: "e-1",
    labourer_id: "l-2",
    amount: 2500,
    status: "processing",
    created_at: "2023-04-17T14:15:00Z",
    updated_at: "2023-04-17T14:15:00Z"
  }
];

// Mock notifications data
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n-1",
    user_id: "l-1",
    title: "New Job Assigned",
    message: "You have been assigned a new job: Construction Site Helper",
    type: "job",
    read: false,
    created_at: "2023-04-10T08:05:00Z",
    related_id: "j-1"
  },
  {
    id: "n-2",
    user_id: "l-1",
    title: "Payment Received",
    message: "You have received a payment of ₹4,800 for Construction Site Helper",
    type: "payment",
    read: true,
    created_at: "2023-04-12T16:35:00Z",
    related_id: "p-1"
  },
  {
    id: "n-3",
    user_id: "e-1",
    title: "Job Completed",
    message: "Ram Kumar has completed the Construction Site Helper job",
    type: "job",
    read: false,
    created_at: "2023-04-12T16:00:00Z",
    related_id: "j-1"
  },
  {
    id: "n-4",
    user_id: "l-2",
    title: "New Job Assigned",
    message: "You have been assigned a new job: Garden Maintenance",
    type: "job",
    read: false,
    created_at: "2023-04-15T10:05:00Z",
    related_id: "j-2"
  },
  {
    id: "n-5",
    user_id: "l-1",
    title: "New Job Assigned",
    message: "You have been assigned a new job: Moving Assistance",
    type: "job",
    read: false,
    created_at: "2023-04-18T14:35:00Z",
    related_id: "j-3"
  }
];

// Enrich data with relationships
export function getEnrichedJobs(): Job[] {
  return MOCK_JOBS.map(job => {
    const employer = MOCK_USERS.find(user => user.id === job.employer_id);
    const labourer = job.labourer_id ? MOCK_USERS.find(user => user.id === job.labourer_id) : undefined;
    
    return {
      ...job,
      employer,
      labourer
    };
  });
}

export function getEnrichedPayments(): Payment[] {
  return MOCK_PAYMENTS.map(payment => {
    const job = MOCK_JOBS.find(job => job.id === payment.job_id);
    const employer = MOCK_USERS.find(user => user.id === payment.employer_id);
    const labourer = MOCK_USERS.find(user => user.id === payment.labourer_id);
    
    return {
      ...payment,
      job,
      employer,
      labourer
    };
  });
}

// Get user-specific data
export function getUserJobs(userId: string): Job[] {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return [];
  
  const enrichedJobs = getEnrichedJobs();
  
  if (user.role === 'employer') {
    return enrichedJobs.filter(job => job.employer_id === userId);
  } else {
    return enrichedJobs.filter(job => job.labourer_id === userId);
  }
}

export function getUserPayments(userId: string): Payment[] {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return [];
  
  const enrichedPayments = getEnrichedPayments();
  
  if (user.role === 'employer') {
    return enrichedPayments.filter(payment => payment.employer_id === userId);
  } else {
    return enrichedPayments.filter(payment => payment.labourer_id === userId);
  }
}

export function getUserNotifications(userId: string): Notification[] {
  return MOCK_NOTIFICATIONS.filter(notification => notification.user_id === userId);
}

// Data manipulation functions (simulating API calls)
export async function createJob(jobData: Partial<Job>): Promise<Job> {
  const newJob: Job = {
    id: `j-${MOCK_JOBS.length + 1}`,
    employer_id: jobData.employer_id!,
    title: jobData.title!,
    description: jobData.description!,
    pay_rate: jobData.pay_rate!,
    hours: jobData.hours!,
    total_pay: jobData.pay_rate! * jobData.hours!,
    status: "pending",
    created_at: new Date().toISOString(),
    start_date: jobData.start_date!,
    end_date: jobData.end_date,
    labourer_id: jobData.labourer_id,
  };
  
  MOCK_JOBS.push(newJob);
  
  if (jobData.labourer_id) {
    const notification: Notification = {
      id: `n-${MOCK_NOTIFICATIONS.length + 1}`,
      user_id: jobData.labourer_id,
      title: "New Job Assigned",
      message: `You have been assigned a new job: ${jobData.title}`,
      type: "job",
      read: false,
      created_at: new Date().toISOString(),
      related_id: newJob.id,
    };
    MOCK_NOTIFICATIONS.push(notification);
  }
  
  return newJob;
}

export async function updateJobStatus(
  jobId: string, 
  status: Job["status"],
  userId: string
): Promise<Job> {
  const jobIndex = MOCK_JOBS.findIndex(job => job.id === jobId);
  if (jobIndex === -1) throw new Error("Job not found");
  
  const job = MOCK_JOBS[jobIndex];
  const updatedJob = { ...job, status };
  MOCK_JOBS[jobIndex] = updatedJob;
  
  if (status === "accepted" && job.employer_id) {
    const notification: Notification = {
      id: `n-${MOCK_NOTIFICATIONS.length + 1}`,
      user_id: job.employer_id,
      title: "Job Accepted",
      message: `Your job '${job.title}' has been accepted by a worker`,
      type: "job",
      read: false,
      created_at: new Date().toISOString(),
      related_id: jobId,
    };
    MOCK_NOTIFICATIONS.push(notification);
  }
  
  if (status === "rejected" && job.employer_id) {
    const notification: Notification = {
      id: `n-${MOCK_NOTIFICATIONS.length + 1}`,
      user_id: job.employer_id,
      title: "Job Rejected",
      message: `Your job '${job.title}' has been rejected by the worker`,
      type: "job",
      read: false,
      created_at: new Date().toISOString(),
      related_id: jobId,
    };
    MOCK_NOTIFICATIONS.push(notification);
  }
  
  if (status === "completed" && job.employer_id) {
    const notification: Notification = {
      id: `n-${MOCK_NOTIFICATIONS.length + 1}`,
      user_id: job.employer_id,
      title: "Job Completed",
      message: `The job '${job.title}' has been marked as completed by the worker`,
      type: "job",
      read: false,
      created_at: new Date().toISOString(),
      related_id: jobId,
    };
    MOCK_NOTIFICATIONS.push(notification);
  }
  
  return updatedJob;
}

export async function createPayment(paymentData: Partial<Payment>): Promise<Payment> {
  const newPayment: Payment = {
    id: `p-${MOCK_PAYMENTS.length + 1}`,
    job_id: paymentData.job_id!,
    employer_id: paymentData.employer_id!,
    labourer_id: paymentData.labourer_id!,
    amount: paymentData.amount!,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  MOCK_PAYMENTS.push(newPayment);
  
  return newPayment;
}

export async function updatePaymentStatus(
  paymentId: string, 
  status: Payment["status"],
  transactionId?: string
): Promise<Payment> {
  const paymentIndex = MOCK_PAYMENTS.findIndex(payment => payment.id === paymentId);
  if (paymentIndex === -1) throw new Error("Payment not found");
  
  const payment = MOCK_PAYMENTS[paymentIndex];
  const updatedPayment = { 
    ...payment, 
    status, 
    updated_at: new Date().toISOString(),
    transaction_id: transactionId || payment.transaction_id
  };
  
  MOCK_PAYMENTS[paymentIndex] = updatedPayment;
  
  if (status === "paid" && payment.labourer_id) {
    // Update user wallet balance
    const labourerIndex = MOCK_USERS.findIndex(user => user.id === payment.labourer_id);
    if (labourerIndex !== -1) {
      MOCK_USERS[labourerIndex].wallet_balance += payment.amount;
    }
    
    // Create notification
    const notification: Notification = {
      id: `n-${MOCK_NOTIFICATIONS.length + 1}`,
      user_id: payment.labourer_id,
      title: "Payment Received",
      message: `You have received a payment of ₹${payment.amount} for job completion`,
      type: "payment",
      read: false,
      created_at: new Date().toISOString(),
      related_id: paymentId,
    };
    MOCK_NOTIFICATIONS.push(notification);
    
    // Also update the job status to paid
    const jobIndex = MOCK_JOBS.findIndex(job => job.id === payment.job_id);
    if (jobIndex !== -1) {
      MOCK_JOBS[jobIndex].status = "paid";
    }
  }
  
  return updatedPayment;
}

export async function assignLabourerToJob(
  jobId: string,
  labourerId: string
): Promise<Job> {
  const jobIndex = MOCK_JOBS.findIndex(job => job.id === jobId);
  if (jobIndex === -1) throw new Error("Job not found");
  
  const job = MOCK_JOBS[jobIndex];
  const updatedJob = { ...job, labourer_id: labourerId };
  MOCK_JOBS[jobIndex] = updatedJob;
  
  // Create notification for the labourer
  const notification: Notification = {
    id: `n-${MOCK_NOTIFICATIONS.length + 1}`,
    user_id: labourerId,
    title: "New Job Assigned",
    message: `You have been assigned to a new job: ${job.title}`,
    type: "job",
    read: false,
    created_at: new Date().toISOString(),
    related_id: jobId,
  };
  MOCK_NOTIFICATIONS.push(notification);
  
  return updatedJob;
}

export async function markNotificationsAsRead(
  userId: string,
  notificationIds?: string[]
): Promise<void> {
  if (notificationIds && notificationIds.length > 0) {
    notificationIds.forEach(id => {
      const notificationIndex = MOCK_NOTIFICATIONS.findIndex(
        n => n.id === id && n.user_id === userId
      );
      if (notificationIndex !== -1) {
        MOCK_NOTIFICATIONS[notificationIndex].read = true;
      }
    });
  } else {
    MOCK_NOTIFICATIONS.forEach((notification, index) => {
      if (notification.user_id === userId) {
        MOCK_NOTIFICATIONS[index].read = true;
      }
    });
  }
}
