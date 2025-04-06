
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SavingsProvider } from "@/components/savings/SavingsContext";
import { TransactionsProvider } from "@/components/transactions/TransactionsContext";
import { useEffect } from "react";
import { toast } from "sonner";

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import SavingsPage from "./pages/SavingsPage";
import InsightsPage from "./pages/InsightsPage";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./components/auth/UserContext";

const queryClient = new QueryClient();

const App = () => {
  // Handle Supabase authentication events
  useEffect(() => {
    // Check for login status or auth token existence
    const authToken = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (authToken && user) {
      toast.success("Welcome back to Fin Pal!");
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Index />} />
                <Route element={
                  <TransactionsProvider>
                    <SavingsProvider>
                      <AppLayout />
                    </SavingsProvider>
                  </TransactionsProvider>
                }>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="savings" element={<SavingsPage />} />
                  <Route path="insights" element={<InsightsPage />} />
                  <Route path="chat" element={<ChatPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
