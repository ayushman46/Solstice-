
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PiggyBank, LineChart, BadgeDollarSign, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
        <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-6">
            <PiggyBank className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold gradient-heading mb-6">Fin Pal</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-8">
            Your AI-powered financial assistant that helps you manage money smarter,
            save better, and achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Smart Financial Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-primary" />}
              title="Smart Spending Analysis"
              description="Automatically categorize and analyze your spending patterns to identify areas to save."
            />
            <FeatureCard
              icon={<BadgeDollarSign className="h-10 w-10 text-primary" />}
              title="Personalized Nudges"
              description="Get intelligent prompts that help you make better financial decisions day-to-day."
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary" />}
              title="Goal-based Savings"
              description="Set savings goals and track your progress with visual dashboards and milestones."
            />
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StepCard
              number="1"
              title="Connect Your Accounts"
              description="Link your financial accounts securely or manually add transactions."
            />
            <StepCard
              number="2"
              title="Get Personalized Insights"
              description="Our AI analyzes your spending habits and suggests improvements."
            />
            <StepCard
              number="3"
              title="Achieve Your Goals"
              description="Follow personalized plans to reach your financial objectives faster."
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialCard
              quote="Fin Pal has completely changed how I manage my money. The personalized nudges have helped me save an extra $350 each month!"
              author="Sarah T."
            />
            <TestimonialCard
              quote="The AI chat feature is like having a financial advisor in my pocket. I've learned so much about smart money management."
              author="Michael K."
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to take control of your finances?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are achieving their financial goals with Fin Pal.
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6"
            onClick={() => navigate("/login")}
          >
            Get Started Now
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <PiggyBank className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-lg">Fin Pal</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Fin Pal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="text-center">
    <div className="bg-primary/10 dark:bg-primary/20 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl font-bold">{number}</span>
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author }: { quote: string, author: string }) => (
  <div className="bg-card border rounded-xl p-6">
    <div className="text-xl italic mb-4">"{quote}"</div>
    <div className="font-medium">— {author}</div>
  </div>
);

export default Index;
