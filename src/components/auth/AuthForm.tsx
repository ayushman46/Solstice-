
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "@/lib/data";
import { useUser } from "./UserContext";

type AuthMode = "login" | "register";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "demo@example.com", // Prefill demo credentials
    password: "password",      // Prefill demo password
  });

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    // Reset form errors when toggling modes
    setErrors({
      email: "",
      password: "",
      name: "",
      general: "",
    });
  };

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
    general: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      name: "",
      general: "",
    };

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Name validation (only for registration)
    if (mode === "register" && !formData.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user types
    setErrors(prev => ({
      ...prev,
      [name]: "",
      general: ""
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      let userData;
      
      if (mode === "login") {
        userData = await authService.login(formData.email, formData.password);
        
        if (userData) {
          // Update user context with login details
          updateUser(userData);
          
          // Store auth token
          localStorage.setItem('authToken', 'demo-token-' + Date.now());
          toast.success("Login successful!");
          navigate("/dashboard");
        }
      } else {
        userData = await authService.register(formData.name, formData.email, formData.password);
        
        if (userData) {
          // Update user context with login details
          updateUser(userData);
          
          // Store auth token
          localStorage.setItem('authToken', 'demo-token-' + Date.now());
          toast.success("Account created successfully!");
          navigate("/dashboard");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      setErrors(prev => ({ ...prev, general: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Welcome back" : "Create an account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your account"
            : "Fill in your details to create a new account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="hello@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          {errors.general && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {errors.general}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={toggleMode}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
