import { AuthForm } from "@/components/auth/AuthForm";
import { PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 dark:from-indigo-950/30 dark:to-blue-950/30">
      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 flex items-center gap-2"
        onClick={() => navigate("/")}
      >
        <PiggyBank className="h-5 w-5" />
        <span>Back to Home</span>
      </Button>

      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <PiggyBank className="h-12 w-12 text-primary animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold gradient-heading">Fin Pal</h1>
        <p className="text-muted-foreground mt-2">Your AI financial assistant</p>
      </div>

      <div className="w-full max-w-md px-4">
        <AuthForm />
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Demo login: demo@example.com / password</p>
      </div>
    </div>
  );
}
