
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionCategory, TransactionType } from "@/lib/data";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { Plus, Search } from "lucide-react";
import { useTransactions } from "@/components/transactions/TransactionsContext";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";

export default function TransactionsPage() {
  const { transactions, addTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false);

  const allTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tx.category === categoryFilter;
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const expenses = filteredTransactions.filter((tx) => tx.amount < 0);
  const income = filteredTransactions.filter((tx) => tx.amount > 0);
  const needs = filteredTransactions.filter((tx) => tx.type === 'need');
  const wants = filteredTransactions.filter((tx) => tx.type === 'want');

  const renderTransactionsList = (transactions: typeof allTransactions) => {
    if (transactions.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} detailed />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage your financial activities</p>
        </div>
        <Button onClick={() => setIsAddTransactionDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as TransactionCategory | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="groceries">Groceries</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as TransactionType | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="need">Need</SelectItem>
            <SelectItem value="want">Want</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="needs">Needs</TabsTrigger>
          <TabsTrigger value="wants">Wants</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {renderTransactionsList(filteredTransactions)}
        </TabsContent>
        <TabsContent value="expenses">
          {renderTransactionsList(expenses)}
        </TabsContent>
        <TabsContent value="income">
          {renderTransactionsList(income)}
        </TabsContent>
        <TabsContent value="needs">
          {renderTransactionsList(needs)}
        </TabsContent>
        <TabsContent value="wants">
          {renderTransactionsList(wants)}
        </TabsContent>
      </Tabs>
      
      <AddTransactionDialog 
        open={isAddTransactionDialogOpen}
        onOpenChange={setIsAddTransactionDialogOpen}
        onAddTransaction={addTransaction}
      />
    </div>
  );
}
