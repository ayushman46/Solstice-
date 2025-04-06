
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/data";
import { NudgeItem } from "@/components/nudges/NudgeItem";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { useTransactions } from "@/components/transactions/TransactionsContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Award, Bell, GiftIcon, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { useSavings } from "@/components/savings/SavingsContext";
import { toast } from "sonner";

export default function InsightsPage() {
  const { transactions, getTotalSpendingByType, getTotalBalance, getCategorySpending, generateNudges } = useTransactions();
  const { goals } = useSavings();
  const [nudges, setNudges] = useState<any[]>([]);
  
  // Get live data for the insights
  const needsAmount = getTotalSpendingByType('need');
  const wantsAmount = getTotalSpendingByType('want');
  const currentBalance = getTotalBalance();
  
  // Calculate category-wise spending for charts
  const categories = ['food', 'shopping', 'transport', 'entertainment', 'utilities', 'groceries', 'rent', 'other'];
  const categoryData = categories.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: getCategorySpending(cat as any)
  })).filter(item => item.value > 0);

  // Calculate spending breakdown by type
  const spendingTypeData = [
    { name: "Needs", value: needsAmount },
    { name: "Wants", value: wantsAmount }
  ];
  
  // Get spending over time (last 7 days)
  const getDailySpending = () => {
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      const daySpending = transactions
        .filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getDate() === date.getDate() && 
                 txDate.getMonth() === date.getMonth() && 
                 txDate.getFullYear() === date.getFullYear() &&
                 tx.amount < 0;
        })
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      
      result.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        spending: daySpending
      });
    }
    
    return result;
  };
  
  const dailySpendingData = getDailySpending();

  // Colors for charts
  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280'];
  
  // Load nudges from localStorage
  useEffect(() => {
    const storedNudges = localStorage.getItem('nudges');
    if (storedNudges) {
      setNudges(JSON.parse(storedNudges));
    }
  }, []);
  
  // Refresh nudges
  const refreshNudges = () => {
    generateNudges();
    const storedNudges = localStorage.getItem('nudges');
    if (storedNudges) {
      setNudges(JSON.parse(storedNudges));
      toast.success("Insights refreshed with your latest data!");
    }
  };
  
  // Calculate savings progress
  const totalSavingsTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSavingsCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const savingsProgress = totalSavingsTarget > 0 ? (totalSavingsCurrent / totalSavingsTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">Understand your spending patterns and receive personalized advice</p>
        </div>
        <Button onClick={refreshNudges}>
          <Bell className="mr-2 h-4 w-4" /> Refresh Insights
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(currentBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on all your transactions
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingDown className="h-4 w-4 mr-2 text-destructive" />
              Needs Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(needsAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((needsAmount / (needsAmount + wantsAmount || 1)) * 100)}% of your total spending
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-amber-500" />
              Wants Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {formatCurrency(wantsAmount)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((wantsAmount / (needsAmount + wantsAmount || 1)) * 100)}% of your total spending
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="spending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="nudges">Smart Nudges</TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>How your expenses are distributed across categories</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Needs vs. Wants</CardTitle>
                <CardDescription>Breakdown of essential vs. non-essential spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={spendingTypeData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar 
                        dataKey="value" 
                        fill="#6366F1" 
                        barSize={40}
                        radius={[4, 4, 4, 4]}
                        label={{
                          position: 'right',
                          formatter: (value: number) => formatCurrency(value)
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mr-2" /> Needs
                    </span>
                    <span>{formatCurrency(needsAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-primary/60 mr-2" /> Wants
                    </span>
                    <span>{formatCurrency(wantsAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Spending Trend</CardTitle>
              <CardDescription>Your spending pattern over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailySpendingData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Line 
                      type="monotone" 
                      dataKey="spending" 
                      stroke="#6366F1" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Spending Insights</CardTitle>
              <CardDescription>Key observations about your financial behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg bg-primary/5">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-primary" />
                    Needs vs. Wants Ratio
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {Math.round((needsAmount / (needsAmount + wantsAmount || 1)) * 100)}% of your spending is on essential needs. Aim for a 70/30 ratio for better financial health.
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-amber-500/5">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-amber-500" />
                    Savings Progress
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    You've saved {formatCurrency(totalSavingsCurrent)} out of your {formatCurrency(totalSavingsTarget)} goal ({Math.round(savingsProgress)}% progress).
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-secondary/5">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Award className="h-5 w-5 text-secondary" />
                    Achievement Potential
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Reduce your non-essential spending by 10% to earn the "Smart Spender" badge and unlock new features!
                  </p>
                </div>
                <div className="p-4 border rounded-lg bg-destructive/5">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-destructive" />
                    Top Spending Category
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    {categoryData.length > 0 ? 
                      `Your highest spending category is ${categoryData[0].name} at ${formatCurrency(categoryData[0].value)}.` : 
                      "No spending data available yet."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nudges" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personalized Nudges</CardTitle>
                <CardDescription>Smart recommendations to improve your financial health</CardDescription>
              </div>
              <Button variant="outline" onClick={refreshNudges} className="animate-pulse">
                <Bell className="mr-2 h-4 w-4" /> Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nudges.map((nudge: any) => (
                  <NudgeItem key={nudge.id} nudge={nudge} />
                ))}
                {nudges.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    <p>No nudges available yet. Add some transactions to get personalized insights!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
            
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GiftIcon className="h-5 w-5 text-primary" />
                Savings Challenges
              </CardTitle>
              <CardDescription>Complete these challenges to earn rewards and improve your finances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-primary/5">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Weekly Saver Challenge</h3>
                  <Award className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-muted-foreground mt-1">
                  Save ₹100 more this week to unlock the "Weekly Saver" badge!
                </p>
                <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalSavingsCurrent % 100))}%` }} 
                  />
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-amber-500/5">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Needs vs. Wants Balance</h3>
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-muted-foreground mt-1">
                  Keep your wants spending under 30% of your total to earn the "Budget Master" badge!
                </p>
                <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                  {needsAmount + wantsAmount > 0 ? (
                    <div 
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, 100 - ((wantsAmount / (needsAmount + wantsAmount)) * 100))}%` 
                      }} 
                    />
                  ) : (
                    <div className="h-full bg-amber-500/30 w-0" />
                  )}
                </div>
              </div>
              <div className="p-4 border rounded-lg bg-destructive/5">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Food Spending Control</h3>
                  <Award className="h-5 w-5 text-destructive" />
                </div>
                <p className="text-muted-foreground mt-1">
                  Keep your monthly food spending below ₹300 to earn the "Frugal Foodie" badge!
                </p>
                <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-destructive transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (getCategorySpending('food') / 300) * 100)}%` 
                    }} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
