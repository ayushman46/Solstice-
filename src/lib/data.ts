// Mock data and services for the financial app

// User profile type
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  premium?: boolean;
  phone?: string;
  bio?: string;
}

// Transaction types
export type TransactionCategory = 
  | 'food' 
  | 'shopping' 
  | 'transport' 
  | 'entertainment' 
  | 'utilities' 
  | 'rent' 
  | 'groceries'
  | 'health'
  | 'education'
  | 'other'
  | 'salary'
  | 'investment'
  | 'personal'
  | 'travel'
  | 'transportation'
  | 'housing'
  | 'healthcare';

export type TransactionType = 'need' | 'want' | 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: TransactionCategory;
  type: TransactionType;
}

// Savings goals definition
export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  dueDate?: string;
  category?: string;
  completed: boolean;
  streakDays?: number;
  achievement?: string;
  achievementLevel?: number;
}

// Nudge definition
export interface Nudge {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'achievement' | 'tip';
  date: string;
  read: boolean;
  actionable: boolean;
}

// Updated ChatMessage to include status property
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

// Mock user data
export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?img=11'
};

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    amount: -25.99,
    description: 'Food delivery - Zomato',
    date: '2025-04-04',
    category: 'food',
    type: 'want'
  },
  {
    id: 'tx-2',
    amount: -12.50,
    description: 'Coffee shop',
    date: '2025-04-03',
    category: 'food',
    type: 'want'
  },
  {
    id: 'tx-3',
    amount: -45.00,
    description: 'Grocery store',
    date: '2025-04-02',
    category: 'groceries',
    type: 'need'
  },
  {
    id: 'tx-4',
    amount: -35.20,
    description: 'Amazon purchase',
    date: '2025-04-01',
    category: 'shopping',
    type: 'want'
  },
  {
    id: 'tx-5',
    amount: -50.00,
    description: 'Phone bill',
    date: '2025-03-30',
    category: 'utilities',
    type: 'need'
  },
  {
    id: 'tx-6',
    amount: -15.75,
    description: 'Movie tickets',
    date: '2025-03-28',
    category: 'entertainment',
    type: 'want'
  },
  {
    id: 'tx-7',
    amount: -8.50,
    description: 'Transport',
    date: '2025-03-27',
    category: 'transport',
    type: 'need'
  },
  {
    id: 'tx-8',
    amount: -500.00,
    description: 'Rent payment',
    date: '2025-03-25',
    category: 'rent',
    type: 'need'
  },
  {
    id: 'tx-9',
    amount: 950.00,
    description: 'Salary deposit',
    date: '2025-03-25',
    category: 'other',
    type: 'need'
  },
  {
    id: 'tx-10',
    amount: -22.50,
    description: 'Restaurant dinner',
    date: '2025-03-23',
    category: 'food',
    type: 'want'
  }
];

// Mock savings goals
export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 2500,
    category: 'savings',
    completed: false
  },
  {
    id: 'goal-2',
    title: 'Vacation',
    targetAmount: 1200,
    currentAmount: 400,
    dueDate: '2025-08-15',
    category: 'travel',
    completed: false
  },
  {
    id: 'goal-3',
    title: 'New Laptop',
    targetAmount: 1000,
    currentAmount: 1000,
    category: 'tech',
    completed: true
  }
];

// Mock nudges
export const mockNudges: Nudge[] = [
  {
    id: 'nudge-1',
    message: "You've spent ₹38.49 on food delivery this week. That's 15% more than last week!",
    type: 'warning',
    date: '2025-04-04',
    read: false,
    actionable: true
  },
  {
    id: 'nudge-2',
    message: 'Save ₹100 more this week to reach your vacation savings goal!',
    type: 'tip',
    date: '2025-04-03',
    read: true,
    actionable: true
  },
  {
    id: 'nudge-3',
    message: 'Congratulations! You spent less on entertainment this month.',
    type: 'achievement',
    date: '2025-04-01',
    read: true,
    actionable: false
  }
];

// Mock chat history
export const mockChatHistory: ChatMessage[] = [
  {
    id: 'msg-1',
    content: 'Hi there! How can I help with your finances today?',
    sender: 'ai',
    timestamp: '2025-04-05T09:30:00'
  },
  {
    id: 'msg-2',
    content: 'How much did I spend on food this week?',
    sender: 'user',
    timestamp: '2025-04-05T09:31:00'
  },
  {
    id: 'msg-3',
    content: "You've spent ₹38.49 on food this week. Most of it was on food delivery services.",
    sender: 'ai',
    timestamp: '2025-04-05T09:31:10'
  }
];

// Helper functions for data manipulation
export function getCategorySpending(transactions: Transaction[], category: TransactionCategory): number {
  return transactions
    .filter(tx => tx.category === category && tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}

export function getTotalSpendingByType(transactions: Transaction[], type: TransactionType): number {
  return transactions
    .filter(tx => tx.type === type && tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}

export function getRecentTransactions(transactions: Transaction[], count: number): Transaction[] {
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Math.abs(amount));
}

export function getSavingsProgress(goal: SavingsGoal): number {
  return Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
}

// Mock authentication service
export const authService = {
  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Get registered users from local storage
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Find the user with matching credentials
      const foundUser = registeredUsers.find((user: any) => 
        user.email === email && user.password === password
      );
      
      // Special case for demo account
      if (email === 'demo@example.com' && password === 'password') {
        const userData = {
          ...mockUser,
          email: email,
          name: 'Demo User',
        };
        setTimeout(() => resolve(userData), 800);
        return;
      }
      
      if (foundUser) {
        // Remove password before returning user data
        const { password, ...userData } = foundUser;
        setTimeout(() => resolve(userData), 800);
      } else {
        setTimeout(() => reject(new Error('Invalid email or password')), 800);
      }
    });
  },
  
  register: (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Get existing registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      if (registeredUsers.some((user: any) => user.email === email)) {
        reject(new Error('User with this email already exists'));
        return;
      }
      
      // Create a new user
      const newUser = {
        id: 'user-' + Date.now(),
        name,
        email,
        password, // In a real app, this would be hashed
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        premium: false,
        phone: '',
        bio: ''
      };
      
      // Add the new user to the registered users
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Create a copy of the user without the password for the return value
      const { password: _, ...userData } = newUser;
      
      setTimeout(() => resolve(userData), 800);
    });
  },
  
  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      // Clear auth token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setTimeout(resolve, 300);
    });
  }
};
