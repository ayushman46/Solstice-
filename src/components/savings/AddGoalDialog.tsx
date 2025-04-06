
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export type SavingsGoal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  dueDate?: string;
  completed: boolean;
  streakDays?: number;
  achievement?: string;
  achievementLevel?: number;
};

type AddGoalDialogProps = {
  onAddGoal: (goal: Omit<SavingsGoal, "id" | "completed">) => void;
};

export function AddGoalDialog({ onAddGoal }: AddGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetAmount) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const parsedTarget = parseFloat(targetAmount);
    const parsedCurrent = currentAmount ? parseFloat(currentAmount) : 0;
    
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }
    
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      toast.error("Please enter a valid current amount");
      return;
    }
    
    onAddGoal({
      title,
      targetAmount: parsedTarget,
      currentAmount: parsedCurrent,
      dueDate: dueDate || undefined,
      streakDays: 0,
      achievement: "Just Started",
      achievementLevel: 1,
    });
    
    // Reset form
    setTitle("");
    setTargetAmount("");
    setCurrentAmount("");
    setDueDate("");
    setOpen(false);
    
    toast.success("Goal added successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Savings Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Name</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., New Laptop" 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount</Label>
            <Input 
              id="targetAmount" 
              type="number"
              min="0"
              step="0.01"
              value={targetAmount} 
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="e.g., 1000" 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Amount (Optional)</Label>
            <Input 
              id="currentAmount" 
              type="number"
              min="0"
              step="0.01"
              value={currentAmount} 
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="e.g., 200" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Target Date (Optional)</Label>
            <Input 
              id="dueDate" 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
