
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockChatHistory, ChatMessage, mockUser } from "@/lib/data";
import { SendHorizontal, Bot, Check, CheckCheck, DollarSign, ShoppingCart, Banknote, PiggyBank, Home, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/components/auth/UserContext";
import { useTransactions } from "@/components/transactions/TransactionsContext";
import { useSavings } from "@/components/savings/SavingsContext";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : mockChatHistory;
  });
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useUser();
  const { transactions, getTotalSpendingByType, getTotalBalance } = useTransactions();
  const { goals } = useSavings();
  const [showSuggestions, setShowSuggestions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate financial metrics
  const totalIncome = transactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpenses = transactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
  const totalBalance = getTotalBalance();
  const needsSpending = getTotalSpendingByType('need');
  const wantsSpending = getTotalSpendingByType('want');

  // Get top categories with amounts
  const getTopSpendingCategories = () => {
    const categorySpending = transactions
      .filter(tx => tx.amount < 0)
      .reduce((acc, tx) => {
        const category = tx.category;
        acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
        return acc;
      }, {} as Record<string, number>);
    
    return Object.entries(categorySpending)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));
  };

  const topCategories = getTopSpendingCategories();

  const handleSendMessage = (messageText: string = input) => {
    if (!messageText.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);
    
    // Update the message to "delivered" after a short delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? {...msg, status: "delivered"} : msg
        )
      );
    }, 300);
    
    // Update to "read" after another delay
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? {...msg, status: "read"} : msg
        )
      );
    }, 600);
    
    // Generate AI response
    setTimeout(() => {
      const lowerInput = messageText.toLowerCase();
      let aiResponse = "";
      
      // Enhanced responses with financial data
      if (
        lowerInput.includes("balance") || 
        lowerInput.includes("how much") || 
        lowerInput.includes("money") ||
        lowerInput.includes("total")
      ) {
        aiResponse = `Your current balance is ${formatCurrency(totalBalance)}. You've earned ${formatCurrency(totalIncome)} and spent ${formatCurrency(totalExpenses)} in total.`;
      } 
      else if (
        lowerInput.includes("needs") || 
        lowerInput.includes("necessities") ||
        lowerInput.includes("essential")
      ) {
        const needsPercent = totalExpenses > 0 ? Math.round((needsSpending / totalExpenses) * 100) : 0;
        aiResponse = `You've spent ${formatCurrency(needsSpending)} on essential needs (${needsPercent}% of your expenses). This includes groceries, rent, utilities, and other necessities.`;
      } 
      else if (
        lowerInput.includes("wants") || 
        lowerInput.includes("discretionary") ||
        lowerInput.includes("non-essential")
      ) {
        const wantsPercent = totalExpenses > 0 ? Math.round((wantsSpending / totalExpenses) * 100) : 0;
        aiResponse = `You've spent ${formatCurrency(wantsSpending)} on wants (${wantsPercent}% of your expenses). This includes dining out, entertainment, shopping, and other non-essential items.`;
      } 
      else if (lowerInput.includes("budget") || lowerInput.includes("spending")) {
        const needsPercent = totalExpenses > 0 ? Math.round((needsSpending / totalExpenses) * 100) : 0;
        const wantsPercent = totalExpenses > 0 ? Math.round((wantsSpending / totalExpenses) * 100) : 0;
        
        aiResponse = `Based on your recent transactions, you've spent ${formatCurrency(totalExpenses)}. That's split between ${formatCurrency(needsSpending)} (${needsPercent}%) for needs and ${formatCurrency(wantsSpending)} (${wantsPercent}%) for wants. I recommend keeping wants under 30% of your total spending.`;
        
        if (wantsPercent > 30) {
          aiResponse += ` Currently, your wants spending is above the recommended level. Consider reducing discretionary expenses to improve your financial health.`;
        } else {
          aiResponse += ` Great job keeping your wants spending in check!`;
        }
      } 
      else if (lowerInput.includes("saving") || lowerInput.includes("goals")) {
        if (goals.length > 0) {
          const completedGoals = goals.filter(goal => goal.completed).length;
          const topGoal = goals.filter(goal => !goal.completed)[0];
          
          aiResponse = `You have ${goals.length} savings goals, with ${completedGoals} already completed. `;
          
          if (topGoal) {
            const progress = Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100);
            aiResponse += `Your "${topGoal.title}" goal is currently at ${progress}% completion (${formatCurrency(topGoal.currentAmount)} of ${formatCurrency(topGoal.targetAmount)}).`;
          }
        } else {
          aiResponse = `You don't have any savings goals set up yet. Would you like to create one?`;
        }
      }
      else if (lowerInput.includes("top") || lowerInput.includes("category") || lowerInput.includes("categories") || lowerInput.includes("expense") || lowerInput.includes("cost")) {
        if (topCategories.length > 0) {
          const topCategoriesList = topCategories
            .map(cat => `${cat.category}: ${formatCurrency(cat.amount)}`)
            .join(", ");
          
          aiResponse = `Your top spending categories are: ${topCategoriesList}. Would you like to see a detailed breakdown of all your expenses?`;
        } else {
          aiResponse = `You don't have any recorded expenses yet. Try adding some transactions first!`;
        }
      } 
      else if (lowerInput.includes("income") || lowerInput.includes("salary") || lowerInput.includes("earn")) {
        aiResponse = `Your total income is ${formatCurrency(totalIncome)}. This represents all your incoming cash flow.`;
      } 
      else if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey") || lowerInput.includes("start")) {
        aiResponse = `Hello ${user.name}! I'm your financial assistant. Here's a quick overview of your finances:
        
• Current balance: ${formatCurrency(totalBalance)}
• Total income: ${formatCurrency(totalIncome)}
• Total expenses: ${formatCurrency(totalExpenses)}
• Needs spending: ${formatCurrency(needsSpending)}
• Wants spending: ${formatCurrency(wantsSpending)}

How can I help you today? You can ask about your balance, spending details, budgeting advice, or savings goals.`;
      }
      else if (lowerInput.includes("thank")) {
        aiResponse = `You're welcome, ${user.name}! Is there anything else I can help you with?`;
      }
      else if (lowerInput.includes("advice") || lowerInput.includes("tip") || lowerInput.includes("help")) {
        // Calculate needs-to-wants ratio
        const needsToWantsRatio = wantsSpending > 0 ? needsSpending / wantsSpending : 0;
        
        if (needsToWantsRatio < 1) {
          aiResponse = `I notice you're spending more on wants (${formatCurrency(wantsSpending)}) than needs (${formatCurrency(needsSpending)}). Financial experts typically recommend following the 50/30/20 rule: 50% on needs, 30% on wants, and 20% on savings. Try to prioritize essential expenses and cut back on discretionary spending.`;
        } else if (totalExpenses > totalIncome) {
          aiResponse = `You're currently spending more (${formatCurrency(totalExpenses)}) than you earn (${formatCurrency(totalIncome)}). To avoid going into debt, consider reducing expenses, particularly in non-essential categories like entertainment and dining out, or look for ways to increase your income.`;
        } else if (goals.length === 0) {
          aiResponse = `You're doing well with your spending, but I don't see any savings goals set up. Setting specific financial goals can help you stay motivated and track your progress. Would you like to create a savings goal?`;
        } else {
          aiResponse = `Based on your financial profile, you're managing your money well! To optimize further, consider automating your savings, setting up an emergency fund (if you haven't already), and exploring investment options for any extra cash. Is there a specific area where you'd like more detailed advice?`;
        }
      } else {
        // Default response with financial summary
        aiResponse = `Thanks for your message, ${user.name}! Here's your current financial snapshot:

• Balance: ${formatCurrency(totalBalance)}
• Recent spending on needs: ${formatCurrency(needsSpending)} 
• Recent spending on wants: ${formatCurrency(wantsSpending)}

What aspect of your finances would you like to discuss? I can help with budget analysis, savings planning, or spending insights.`;
      }
      
      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setTimeout(() => setShowSuggestions(true), 800);
    }, 1200);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessageContent = (content: string) => {
    // Format currency amounts and bullet points
    return content
      .replace(/(₹\d+(?:,\d+)?(?:\.\d+)?)/g, '<span class="font-semibold text-primary">$1</span>')
      .replace(/^• (.+)$/gm, '<div class="flex gap-2"><span class="text-primary">•</span><span>$1</span></div>')
      .replace(/\n\n/g, '<br/><br/>');
  };

  const getStatusIcon = (status?: string) => {
    switch(status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const getFormattedTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const quickSuggestions = [
    { text: "What's my current balance?", icon: <DollarSign className="h-4 w-4" /> },
    { text: "How much am I spending on needs vs wants?", icon: <Calculator className="h-4 w-4" /> },
    { text: "What are my top spending categories?", icon: <ShoppingCart className="h-4 w-4" /> },
    { text: "How are my savings goals doing?", icon: <PiggyBank className="h-4 w-4" /> },
    { text: "Give me some financial advice", icon: <Banknote className="h-4 w-4" /> },
    { text: "What's my total income?", icon: <Home className="h-4 w-4" /> }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Financial Assistant</h1>
        <p className="text-muted-foreground">
          Chat with Fin Pal about your finances, spending habits, or savings goals
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 rounded-lg border bg-muted/30 space-y-4 mb-4 bg-[#0f1921]">
        <div className="sticky top-0 bg-gradient-to-b from-[#0f1921] to-transparent py-2 mb-2 text-center text-sm text-muted-foreground">
          Today
        </div>
        
        {/* Financial Summary Card */}
        <Card className="mb-4 bg-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Needs</span>
                  <span>{formatCurrency(needsSpending)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Wants</span>
                  <span>{formatCurrency(wantsSpending)}</span>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Income</span>
                  <span className="text-green-500">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Expenses</span>
                  <span className="text-red-500">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className="flex gap-1 max-w-[80%]">
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "p-3 rounded-lg",
                  message.sender === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-none" 
                    : "bg-muted text-muted-foreground rounded-bl-none"
                )}
              >
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: renderMessageContent(message.content) 
                  }} 
                  className="whitespace-pre-wrap"
                />
                <div className={cn(
                  "text-xs flex items-center gap-1 mt-1",
                  message.sender === "user" ? "justify-end" : "justify-start",
                  message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground/70"
                )}>
                  {getFormattedTime(message.timestamp)}
                  {message.sender === "user" && getStatusIcon(message.status)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1 max-w-[80%]">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="px-4 py-2 bg-muted rounded-lg rounded-bl-none flex gap-1 items-center h-8">
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-foreground/70 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestion chips */}
      {showSuggestions && !isTyping && (
        <div className="flex flex-wrap gap-2 mb-3">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center gap-2 text-sm py-1 px-3 h-auto"
              onClick={() => handleSendMessage(suggestion.text)}
            >
              {suggestion.icon}
              {suggestion.text}
            </Button>
          ))}
        </div>
      )}

      <div className="relative bg-muted p-2 rounded-lg">
        <Textarea
          placeholder="Ask about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[60px] resize-none pr-12 bg-background border-none focus-visible:ring-0"
        />
        <Button
          size="icon"
          className="absolute bottom-4 right-4"
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isTyping}
        >
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
