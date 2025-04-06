import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/data";
import { MessageSquare, Plus, TrendingDown, TrendingUp, Bell, Award } from "lucide-react";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { NudgeItem } from "@/components/nudges/NudgeItem";
import { useNavigate } from "react-router-dom";
import { useSavings } from "@/components/savings/SavingsContext";
import { useTransactions } from "@/components/transactions/TransactionsContext";
import { useState, useEffect } from "react";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { goals } = useSavings();
  const { transactions, addTransaction, getTotalSpendingByType, getTotalBalance, generateNudges } = useTransactions();
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false);
  const [nudges, setNudges] = useState<any[]>([]);
  
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  const totalNeeds = getTotalSpendingByType('need');
  const totalWants = getTotalSpendingByType('want');
  const totalBalance = getTotalBalance();
  
  const topGoals = goals.slice(0, 3);

  useEffect(() => {
    const storedNudges = localStorage.getItem('nudges');
    if (storedNudges) {
      setNudges(JSON.parse(storedNudges));
    } else {
      generateNudges();
      setTimeout(() => {
        const freshNudges = localStorage.getItem('nudges');
        if (freshNudges) {
          setNudges(JSON.parse(freshNudges));
        }
      }, 1000);
    }
  }, [generateNudges]);

  const refreshNudges = () => {
    generateNudges();
    setTimeout(() => {
      const freshNudges = localStorage.getItem('nudges');
      if (freshNudges) {
        setNudges(JSON.parse(freshNudges));
      }
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-4 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg">
        <div>
          <h1 className="text-4xl font-bold animate__animated animate__fadeIn">Dashboard</h1>
          <p className="text-sm opacity-75 animate__animated animate__fadeIn animate__delay-1s">Welcome to your personalized financial dashboard!</p>
        </div>
        <div className="flex gap-4">
          <Button className="bg-primary text-white hover:bg-primary-dark transition-transform transform hover:scale-105" onClick={() => setIsAddTransactionDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
          <Button className="bg-purple-700 text-white hover:bg-purple-800 transition-transform transform hover:scale-105" onClick={() => navigate('/chat')}>
            <MessageSquare className="mr-2 h-4 w-4" /> Chat with AI
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
        <Card className="transition-all duration-500 bg-primary/10 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 hover:bg-primary/20 transform hover:translate-y-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-600">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-sm text-muted-foreground">Last updated today</p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-500 bg-red-100 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 hover:bg-red-200 transform hover:translate-y-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black">Needs Spending</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(totalNeeds)}</div>
            <div className="mt-2 h-2 rounded-full bg-gray-200">
              <div 
                className="h-full bg-red-600 transition-all" 
                style={{ width: `${(totalNeeds / (totalNeeds + totalWants || 1)) * 100}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Essential expenses ({Math.round((totalNeeds / (totalNeeds + totalWants || 1)) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all duration-500 bg-yellow-200 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 hover:bg-yellow-300 transform hover:translate-y-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-black">Wants Spending</CardTitle>
            <TrendingUp className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{formatCurrency(totalWants)}</div>
            <div className="mt-2 h-2 rounded-full bg-gray-200">
              <div 
                className="h-full bg-yellow-600 transition-all" 
                style={{ width: `${(totalWants / (totalNeeds + totalWants || 1)) * 100}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Non-essential expenses ({Math.round((totalWants / (totalNeeds + totalWants || 1)) * 100)}%)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
        <Card className="md:col-span-2 lg:col-span-2 transition-all duration-500 hover:shadow-xl rounded-lg transform hover:translate-y-1">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransactions.map(transaction => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
            {recentTransactions.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No transactions yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 transition-all duration-500 hover:shadow-xl rounded-lg transform hover:translate-y-1">
          <CardHeader>
            <div>
              <CardTitle>Smart Nudges</CardTitle>
              <p className="text-xs text-muted-foreground">AI-powered financial insights</p>
            </div>
            <Button variant="outline" size="sm" onClick={refreshNudges} className="hover:bg-gray-200">
              <Bell className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nudges.slice(0, 3).map((nudge: any) => (
                <NudgeItem key={nudge.id} nudge={nudge} />
              ))}
              {nudges.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No nudges yet. Add some transactions to get personalized insights!</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => navigate('/insights')}
              >
                View All Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4 px-4">
          <h2 className="text-xl font-semibold">Savings Goals</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/savings')}>
            <Plus className="h-4 w-4 mr-1" /> New Goal
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-4">
          {topGoals.map(goal => {
            const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            
            return (
              <Card key={goal.id} className="transition-all duration-500 hover:shadow-xl rounded-lg transform hover:translate-y-1">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md font-semibold">{goal.title}</CardTitle>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2 rounded-full bg-gray-200" />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span className="text-muted-foreground">{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  {goal.dueDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Due by {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {goal.streakDays && goal.streakDays > 0 && (
                    <div className="flex items-center mt-2 gap-1 text-xs text-accent">
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span>{goal.streakDays} day streak</span>
                      </div>
                      {goal.achievement && (
                        <div className="ml-auto achievement-badge">
                          <Award className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )})}
          {goals.length === 0 && (
            <Card className="col-span-full p-6 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any savings goals yet</p>
              <Button onClick={() => navigate('/savings')}>
                <Plus className="h-4 w-4 mr-2" /> Create Your First Goal
              </Button>
            </Card>
          )}
        </div>
      </div>

      <AddTransactionDialog
        open={isAddTransactionDialogOpen}
        onOpenChange={setIsAddTransactionDialogOpen}
        onAddTransaction={addTransaction}
      />
    </div>
  );
}