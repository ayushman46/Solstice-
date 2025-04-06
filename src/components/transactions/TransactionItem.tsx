
import { formatCurrency, Transaction } from "@/lib/data";
import { cn } from "@/lib/utils";
import { 
  Coffee, 
  ShoppingBag, 
  Utensils, 
  Car, 
  Film, 
  Home, 
  ShoppingCart, 
  Activity, 
  GraduationCap, 
  ListMinus 
} from "lucide-react";

interface TransactionItemProps {
  transaction: Transaction;
  detailed?: boolean;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  food: Utensils,
  shopping: ShoppingBag,
  transport: Car,
  entertainment: Film,
  utilities: Activity,
  rent: Home,
  groceries: ShoppingCart,
  health: Activity,
  education: GraduationCap,
  other: ListMinus
};

export function TransactionItem({ transaction, detailed = false }: TransactionItemProps) {
  const Icon = categoryIcons[transaction.category] || ListMinus;
  const isPositive = transaction.amount > 0;

  return (
    <div className={cn(
      "flex items-center justify-between p-2 rounded-lg",
      detailed ? "border mb-2 hover:bg-muted/50 transition-colors" : "hover:bg-muted/30 transition-colors"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center",
          isPositive ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{transaction.description}</p>
          {detailed && (
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
              <span>•</span>
              <span className="capitalize">{transaction.category}</span>
              <span>•</span>
              <span className="capitalize">{transaction.type}</span>
            </div>
          )}
          {!detailed && (
            <p className="text-xs text-muted-foreground capitalize">{transaction.category}</p>
          )}
        </div>
      </div>
      <div className={cn(
        "font-medium",
        isPositive ? "money-positive" : "money-negative"
      )}>
        {isPositive ? "+" : ""}{formatCurrency(transaction.amount)}
      </div>
    </div>
  );
}
