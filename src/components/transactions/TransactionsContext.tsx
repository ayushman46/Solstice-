
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions, Transaction, TransactionCategory, TransactionType } from '@/lib/data';
import { toast } from 'sonner';

type TransactionsContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: {
    description: string;
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
  }) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTotalSpendingByType: (type: TransactionType) => number;
  getTotalBalance: () => number;
  generateNudges: () => void;
  getCategorySpending: (category: TransactionCategory) => number;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : mockTransactions;
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Get category spending
  const getCategorySpending = (category: TransactionCategory): number => {
    return transactions
      .filter(tx => tx.category === category && tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  };

  // Generate personalized nudges based on transactions
  const generateNudges = () => {
    const nudges = localStorage.getItem('nudges') ? JSON.parse(localStorage.getItem('nudges')!) : [];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    // Get recent transactions (last 7 days)
    const recentTransactions = transactions.filter(tx => 
      new Date(tx.date) >= oneWeekAgo && new Date(tx.date) <= now
    );

    // Get spending by category for recent transactions
    const categorySpending: Record<string, number> = {};
    recentTransactions.forEach(tx => {
      if (tx.amount < 0) { // Only consider expenses
        const category = tx.category;
        categorySpending[category] = (categorySpending[category] || 0) + Math.abs(tx.amount);
      }
    });

    // Find the top spending category
    let topCategory = '';
    let topAmount = 0;
    Object.entries(categorySpending).forEach(([category, amount]) => {
      if (amount > topAmount) {
        topCategory = category;
        topAmount = amount;
      }
    });

    // Create nudges based on insights
    const newNudges = [];

    // Top spending category nudge
    if (topCategory && topAmount > 50) {
      newNudges.push({
        id: `nudge-${Date.now()}-1`,
        message: `You've spent ₹${topAmount.toFixed(0)} on ${topCategory} in the past week. Consider setting a budget for this category.`,
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        actionable: true
      });
    }

    // Food delivery spending nudge with alert
    const foodDeliveryTransactions = recentTransactions.filter(tx => 
      tx.category === 'food' && tx.description.toLowerCase().includes('delivery')
    );
    const foodDeliverySpending = foodDeliveryTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    if (foodDeliverySpending > 30) {
      newNudges.push({
        id: `nudge-${Date.now()}-2`,
        message: `Alert! You've spent ₹${foodDeliverySpending.toFixed(0)} on food delivery this week. Cooking at home could save you money.`,
        type: 'warning',
        date: new Date().toISOString(),
        read: false,
        actionable: true
      });
      
      // Show alert toast
      if (foodDeliverySpending > 100) {
        toast.warning(`You've spent ₹${foodDeliverySpending.toFixed(0)} on food delivery this week!`, {
          description: "This is higher than your usual spending.",
          duration: 5000,
        });
      }
    }

    // Spending trend nudge
    if (recentTransactions.length > 3) {
      const totalSpending = recentTransactions
        .filter(tx => tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
      if (totalSpending > 200) {
        newNudges.push({
          id: `nudge-${Date.now()}-3`,
          message: `Your spending is trending higher than usual. You've spent ₹${totalSpending.toFixed(0)} in the past week.`,
          type: 'info',
          date: new Date().toISOString(),
          read: false,
          actionable: false
        });
      }
    }

    // Achievement nudge for saving
    const incomeTransactions = recentTransactions.filter(tx => tx.amount > 0);
    const expenseTransactions = recentTransactions.filter(tx => tx.amount < 0);
    
    const totalIncome = incomeTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    if (totalIncome > totalExpenses && totalIncome > 0) {
      newNudges.push({
        id: `nudge-${Date.now()}-4`,
        message: `Great job! You've spent less than you earned this week. Keep it up!`,
        type: 'achievement',
        date: new Date().toISOString(),
        read: false,
        actionable: false
      });
    }
    
    // Gamified savings challenge
    const weeklyGoal = 100;
    const savingsGoals = JSON.parse(localStorage.getItem('savingsGoals') || '[]');
    const totalSaved = savingsGoals.reduce((sum: number, goal: any) => sum + goal.currentAmount, 0);
    const previousTotal = parseFloat(localStorage.getItem('previousSavingsTotal') || '0');
    const weeklyProgress = totalSaved - previousTotal;
    
    if (weeklyProgress < weeklyGoal) {
      const remaining = weeklyGoal - weeklyProgress;
      newNudges.push({
        id: `nudge-${Date.now()}-5`,
        message: `🎮 Savings Challenge: Save ₹${remaining.toFixed(0)} more this week to unlock the 'Weekly Saver' badge!`,
        type: 'tip',
        date: new Date().toISOString(),
        read: false,
        actionable: true
      });
    } else if (weeklyProgress >= weeklyGoal) {
      newNudges.push({
        id: `nudge-${Date.now()}-6`,
        message: `🏆 Challenge Complete! You've saved ₹${weeklyProgress.toFixed(0)} this week and unlocked the 'Weekly Saver' badge!`,
        type: 'achievement',
        date: new Date().toISOString(),
        read: false,
        actionable: false
      });
      
      // Show achievement toast
      toast.success("🎮 Weekly Savings Challenge Completed!", {
        description: "You've saved enough to earn the Weekly Saver badge!",
        duration: 5000,
      });
    }
    
    // Update previous total for next week's comparison
    localStorage.setItem('previousSavingsTotal', totalSaved.toString());
    
    // Category spending alerts
    const categories: TransactionCategory[] = ['food', 'shopping', 'entertainment', 'transport'];
    categories.forEach(category => {
      const spending = getCategorySpending(category);
      const threshold = category === 'food' ? 200 : category === 'shopping' ? 500 : 100;
      
      if (spending > threshold) {
        newNudges.push({
          id: `nudge-${Date.now()}-${category}`,
          message: `⚠️ Spending Alert: You've spent ₹${spending.toFixed(0)} on ${category} recently. This is higher than recommended.`,
          type: 'warning',
          date: new Date().toISOString(),
          read: false,
          actionable: true
        });
      }
    });

    // If we have new nudges, add them to storage
    if (newNudges.length > 0) {
      const updatedNudges = [...newNudges, ...nudges].slice(0, 10); // Keep only the 10 most recent nudges
      localStorage.setItem('nudges', JSON.stringify(updatedNudges));
      
      // Show toast for the newest nudge
      toast.info("New financial insight available", {
        description: newNudges[0].message.substring(0, 60) + "...",
        duration: 5000,
      });
    }
  };

  const addTransaction = (transaction: {
    description: string;
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
  }) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: new Date().toISOString(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Generate new nudges when a transaction is added
    setTimeout(() => generateNudges(), 500);
  };

  const updateTransaction = (id: string, updatedTransactionData: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id ? { ...transaction, ...updatedTransactionData } : transaction
      )
    );
    
    // Generate new nudges when a transaction is updated
    setTimeout(() => generateNudges(), 500);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    toast.success("Transaction deleted successfully");
    
    // Generate new nudges when a transaction is deleted
    setTimeout(() => generateNudges(), 500);
  };
  
  // Helper functions to calculate spending by type
  const getTotalSpendingByType = (type: TransactionType): number => {
    return transactions
      .filter(tx => tx.type === type)
      .reduce((sum, tx) => tx.amount < 0 ? sum + Math.abs(tx.amount) : sum, 0);
  };
  
  // Calculate total balance
  const getTotalBalance = (): number => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  };

  // Generate nudges on initial load
  useEffect(() => {
    generateNudges();
  }, []);

  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      getTotalSpendingByType,
      getTotalBalance,
      generateNudges,
      getCategorySpending
    }}>
      {children}
    </TransactionsContext.Provider>
  );
};
