import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns'; // Import the format function from date-fns



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: number): string => {
  const formattedPrice = price.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  return `${formattedPrice} TND`;
};


export const formatDate = (date: Date): string => {
  return format(date, 'dd MMM yyyy'); 
};

//    // Format as currency
//    const formattedTotalGain = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD', // You might want to make this dynamic based on the store's currency
// }).format(totalGain);

export const formatCurrency = (amount: number): string => {
  const formattedNumber = new Intl.NumberFormat('en-US').format(amount);
  return `${formattedNumber} TND`;
};

