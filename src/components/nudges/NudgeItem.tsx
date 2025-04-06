
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Nudge } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Award, CheckCircle2, AlertCircle, Lightbulb, GiftIcon } from "lucide-react";
import { useState } from "react";

interface NudgeItemProps {
  nudge: Nudge;
}

export function NudgeItem({ nudge }: NudgeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getIcon = () => {
    switch (nudge.type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-secondary" />;
      case 'info':
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case 'tip':
        return <Lightbulb className="h-4 w-4 text-accent" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (nudge.type) {
      case 'warning':
        return "bg-amber-500/10 border-amber-500/20";
      case 'achievement':
        return "bg-secondary/10 border-secondary/20";
      case 'info':
        return "bg-primary/10 border-primary/20";
      case 'tip':
        return "bg-accent/10 border-accent/20";
      default:
        return "bg-muted border-muted-foreground/20";
    }
  };
  
  const getBadgeVariant = () => {
    switch (nudge.type) {
      case 'warning':
        return "warning";
      case 'achievement':
        return "secondary";
      case 'info':
        return "default";
      case 'tip':
        return "outline";
      default:
        return "outline";
    }
  };
  
  return (
    <div 
      className={cn(
        "p-4 border rounded-lg relative transition-all duration-300",
        nudge.read ? "bg-transparent" : getTypeColor(),
        isExpanded ? "scale-102 shadow-md" : ""
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <p className={cn(
            "text-sm",
            nudge.type === 'achievement' ? "font-medium" : ""
          )}>
            {nudge.message}
          </p>
          
          {isExpanded && nudge.type === 'warning' && (
            <div className="mt-3 text-xs text-muted-foreground">
              <p>This insight identifies potential overspending patterns that could impact your financial goals.</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="text-xs h-7">
                  Create Budget
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7">
                  View Related Transactions
                </Button>
              </div>
            </div>
          )}
          
          {isExpanded && nudge.type === 'achievement' && (
            <div className="mt-3 text-xs text-muted-foreground">
              <p>Congratulations on reaching this financial milestone! Keep up the great work.</p>
              <div className="mt-3 flex justify-center">
                <Badge variant={getBadgeVariant() as any} className="animate-pulse flex gap-1">
                  <GiftIcon className="h-3 w-3" /> Achievement Unlocked
                </Badge>
              </div>
            </div>
          )}
          
          {isExpanded && nudge.type === 'tip' && (
            <div className="mt-3 text-xs text-muted-foreground">
              <p>This suggestion could help you reach your financial goals faster if implemented.</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="text-xs h-7">
                  Add to Goals
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7">
                  Dismiss
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">{new Date(nudge.date).toLocaleDateString()}</p>
            {nudge.actionable && (
              <Badge variant={getBadgeVariant() as any} className="text-xs">
                {nudge.type === 'warning' ? 'Action Needed' : 
                 nudge.type === 'tip' ? 'Suggestion' : 'Actionable'}
              </Badge>
            )}
          </div>
        </div>
      </div>
      {!nudge.read && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary"></div>
      )}
    </div>
  );
}
