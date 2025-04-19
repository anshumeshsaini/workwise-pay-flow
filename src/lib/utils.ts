
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency values
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date in a readable format
export function formatDate(date: string | Date): string {
  return format(new Date(date), "PP");
}

// Format time in a readable format
export function formatTime(date: string | Date): string {
  return format(new Date(date), "p");
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "PPp");
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Generate a random color based on a string
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

// Generate a random avatar URL based on name
export function generateAvatar(name: string): string {
  // In a real app, this would use a proper avatar service
  // For this demo, we'll use a placeholder
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" class="${randomColor}" viewBox="0 0 100 100"><text y="50%" x="50%" dominant-baseline="middle" text-anchor="middle" font-size="50">${getInitials(name)}</text></svg>`;
}

// Create a unique transaction ID
export function generateTransactionId(): string {
  return `TX${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

// Sleep function for simulating async operations
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

// Format phone number
export function formatPhone(phone: string): string {
  if (!phone) return "";
  if (phone.length === 10) {
    return `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;
  }
  return phone;
}

// Generate QR code data for payment
export function generatePaymentQRData(
  amount: number,
  to: string,
  paymentId: string
): string {
  // In a real app, this would generate proper UPI deep link
  return JSON.stringify({
    upi: true,
    payeeVPA: "workwise@upi",
    payeeName: to,
    amount,
    transactionRef: paymentId,
    transactionNote: `Payment to ${to}`,
  });
}
