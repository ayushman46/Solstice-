
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SavingsGoal } from "./AddGoalDialog";

type EditGoalDialogProps = {
  goal: SavingsGoal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateGoal: (id: string, goal: Partial<SavingsGoal>) => void;
};

export function EditGoalDialog({ goal, open, onOpenChange, onUpdateGoal }: EditGoalDialogProps) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTargetAmount(goal.targetAmount.toString());
      setCurrentAmount(goal.currentAmount.toString());
      setDueDate(goal.dueDate || "");
    }
  }, [goal]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal) return;
    
    if (!title || !targetAmount) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const parsedTarget = parseFloat(targetAmount);
    const parsedCurrent = parseFloat(currentAmount);
    
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }
    
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      toast.error("Please enter a valid current amount");
      return;
    }
    
    onUpdateGoal(goal.id, {
      title,
      targetAmount: parsedTarget,
      currentAmount: parsedCurrent,
      dueDate: dueDate || undefined,
      completed: parsedCurrent >= parsedTarget,
    });
    
    onOpenChange(false);
    toast.success("Goal updated successfully!");
  };

  if (!goal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Savings Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Goal Name</Label>
            <Input 
              id="edit-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-targetAmount">Target Amount</Label>
            <Input 
              id="edit-targetAmount" 
              type="number"
              min="0"
              step="0.01"
              value={targetAmount} 
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-currentAmount">Current Amount</Label>
            <Input 
              id="edit-currentAmount" 
              type="number"
              min="0"
              step="0.01"
              value={currentAmount} 
              onChange={(e) => setCurrentAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-dueDate">Target Date (Optional)</Label>
            <Input 
              id="edit-dueDate" 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
