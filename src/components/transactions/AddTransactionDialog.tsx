
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTransactions } from "./TransactionsContext";
import { TransactionCategory, TransactionType } from "@/lib/data";

interface AddTransactionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddTransaction?: (transaction: {
    description: string;
    amount: number;
    category: TransactionCategory;
    type: TransactionType;
  }) => void;
}

export function AddTransactionDialog({ 
  open: controlledOpen, 
  onOpenChange: setControlledOpen,
  onAddTransaction
}: AddTransactionDialogProps = {}) {
  const { addTransaction: contextAddTransaction } = useTransactions();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("food");
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [spendingType, setSpendingType] = useState<"need" | "want">("want");

  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const isDialogOpen = isControlled ? controlledOpen : open;
  const setIsDialogOpen = isControlled ? setControlledOpen : setOpen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Determine final type based on income/expense and need/want selections
    const finalType: TransactionType = transactionType === "income" 
      ? "income" 
      : spendingType;
    
    const newTransaction = {
      description,
      amount: transactionType === "expense" ? -Math.abs(parsedAmount) : Math.abs(parsedAmount),
      category: category,
      type: finalType
    };
    
    if (onAddTransaction) {
      onAddTransaction(newTransaction);
    } else {
      contextAddTransaction(newTransaction);
    }
    
    // Reset form
    setDescription("");
    setAmount("");
    setCategory("food");
    setTransactionType("expense");
    setSpendingType("want");
    setIsDialogOpen(false);
    
    toast.success("Transaction added successfully!");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Groceries" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount" 
              type="number"
              min="0.01"
              step="0.01"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 500" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select 
              value={transactionType} 
              onValueChange={(value) => setTransactionType(value as "income" | "expense")}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {transactionType === "expense" && (
            <div className="space-y-2">
              <Label htmlFor="spendingType">Spending Classification</Label>
              <Select 
                value={spendingType} 
                onValueChange={(value) => setSpendingType(value as "need" | "want")}
              >
                <SelectTrigger id="spendingType">
                  <SelectValue placeholder="Select spending type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="need">Need (Essential)</SelectItem>
                  <SelectItem value="want">Want (Non-essential)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as TransactionCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="housing">Housing</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full mt-4">Add Transaction</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
