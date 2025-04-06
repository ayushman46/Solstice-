
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SavingsGoal } from './AddGoalDialog';
import { mockSavingsGoals } from '@/lib/data';
import { toast } from 'sonner';

type SavingsContextType = {
  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, "id" | "completed">) => void;
  updateGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  addFunds: (id: string, amount: number, isRazorpay?: boolean) => void;
};

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (!context) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
};

export const SavingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const savedGoals = localStorage.getItem('savingsGoals');
    return savedGoals ? JSON.parse(savedGoals) : mockSavingsGoals;
  });

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals));
  }, [goals]);

  const addGoal = (goal: Omit<SavingsGoal, "id" | "completed">) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
      completed: goal.currentAmount >= goal.targetAmount,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updatedGoalData: Partial<SavingsGoal>) => {
    setGoals(prev => 
      prev.map(goal => {
        if (goal.id === id) {
          const updatedGoal = { ...goal, ...updatedGoalData };
          
          // Check if the goal should be marked as completed
          if (updatedGoal.currentAmount >= updatedGoal.targetAmount && !goal.completed) {
            updatedGoal.completed = true;
            
            // Show celebration toast when goal is newly completed
            setTimeout(() => {
              toast.success("🎉 Goal achieved! Great job saving money!", {
                duration: 5000,
              });
            }, 300);
          }
          
          return updatedGoal;
        }
        return goal;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const addFunds = (id: string, amount: number, isRazorpay: boolean = false) => {
    setGoals(prev => 
      prev.map(goal => {
        if (goal.id === id) {
          const newAmount = goal.currentAmount + amount;
          const justCompleted = newAmount >= goal.targetAmount && !goal.completed;
          
          // Update streak if adding funds
          let newStreak = goal.streakDays || 0;
          let achievement = goal.achievement || "Just Started";
          let achievementLevel = goal.achievementLevel || 1;
          
          if (amount > 0) {
            newStreak += 1;
            
            // Update achievement level based on streak
            if (newStreak >= 30) {
              achievement = "Savings Master";
              achievementLevel = 5;
            } else if (newStreak >= 21) {
              achievement = "Savings Expert";
              achievementLevel = 4;
            } else if (newStreak >= 14) {
              achievement = "Savings Pro";
              achievementLevel = 3;
            } else if (newStreak >=  7) {
              achievement = "Consistent Saver";
              achievementLevel = 2;
            }
          }
          
          // Show achievement notification if level upgraded
          if (achievementLevel > (goal.achievementLevel || 1)) {
            setTimeout(() => {
              toast.success(`🏆 Achievement Unlocked: ${achievement}!`, {
                duration: 5000,
              });
            }, 600);
          }
          
          // Show celebration toast when goal is completed
          if (justCompleted) {
            setTimeout(() => {
              toast.success("🎉 Goal achieved! Congratulations!", {
                duration: 5000,
              });
            }, 300);
          }
          
          // Handle transaction recording and balance update
          try {
            // Create a record of the savings transaction in localStorage
            const savingsTransactions = JSON.parse(localStorage.getItem('savingsTransactions') || '[]');
            savingsTransactions.push({
              id: Date.now().toString(),
              goalId: id,
              goalName: goal.title,
              amount: amount,
              date: new Date().toISOString()
            });
            localStorage.setItem('savingsTransactions', JSON.stringify(savingsTransactions));
            
            // If this is not a Razorpay payment, deduct from current balance by creating a transaction
            if (!isRazorpay) {
              // Get current transactions
              const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
              
              // Add transaction for funds moved to savings goal
              transactions.unshift({
                id: `savings-${Date.now()}`,
                description: `Funds added to "${goal.title}" savings goal`,
                amount: -amount,  // Negative amount as it's deducted from balance
                category: 'personal',
                type: 'need',  // Saving is considered a need
                date: new Date().toISOString()
              });
              
              // Save updated transactions
              localStorage.setItem('transactions', JSON.stringify(transactions));
            }
          } catch (error) {
            console.error('Error recording savings transaction:', error);
          }
          
          return { 
            ...goal, 
            currentAmount: newAmount,
            completed: newAmount >= goal.targetAmount,
            streakDays: newStreak,
            achievement,
            achievementLevel
          };
        }
        return goal;
      })
    );
  };

  return (
    <SavingsContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, addFunds }}>
      {children}
    </SavingsContext.Provider>
  );
};
