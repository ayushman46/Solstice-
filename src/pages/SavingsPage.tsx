
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/data";
import { Plus, Pencil, Trophy, Trash2, Award, Flame } from "lucide-react";
import { AddGoalDialog, SavingsGoal } from "@/components/savings/AddGoalDialog";
import { EditGoalDialog } from "@/components/savings/EditGoalDialog";
import { AddFundsDialog } from "@/components/savings/AddFundsDialog";
import { useSavings } from "@/components/savings/SavingsContext";

export default function SavingsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, addFunds } = useSavings();
  
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  
  const handleEditGoal = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsEditDialogOpen(true);
  };

  const handleAddFundsToGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsAddFundsDialogOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground">Track and manage your financial goals</p>
        </div>
        <AddGoalDialog onAddGoal={addGoal} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          
          return (
            <Card key={goal.id} className={goal.completed ? "border-secondary/30 bg-secondary/5" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>{goal.title}</span>
                  {goal.completed && <Trophy className="h-4 w-4 text-secondary" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className={goal.completed ? "bg-secondary/20" : ""} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Current</p>
                    <p className="text-lg font-medium">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="text-lg font-medium">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                {goal.dueDate && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Due date</p>
                    <p className="text-sm">{new Date(goal.dueDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                {goal.streakDays && goal.streakDays > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Flame className="h-4 w-4 text-accent" />
                    <span>{goal.streakDays} day streak</span>
                    {goal.achievement && (
                      <div className="ml-auto achievement-badge">
                        <Award className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                {!goal.completed ? (
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => handleAddFundsToGoal(goal)}
                  >
                    Add Funds
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    disabled
                    className="w-full"
                  >
                    Completed
                  </Button>  
                )}
              </CardFooter>
              <div className="p-3 pt-0 flex justify-end gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => handleEditGoal(goal)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Edit Goal Dialog */}
      <EditGoalDialog 
        goal={editingGoal} 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateGoal={updateGoal}
      />
      
      {/* Add Funds Dialog */}
      <AddFundsDialog
        goal={selectedGoal}
        open={isAddFundsDialogOpen}
        onOpenChange={setIsAddFundsDialogOpen}
        onAddFunds={addFunds}
      />
    </div>
  );
}
