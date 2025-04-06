
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/components/auth/UserContext";

export default function ProfilePage() {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    updateUser(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl">{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            
            <Badge variant="outline" className="border-primary text-primary">
              {user.premium ? "Premium Member" : "Free Account"}
            </Badge>
            
            <div className="w-full space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Savings Goals</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transactions</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Member Since</span>
                <span className="font-medium">Mar 2023</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="Your phone number"
                  value={formData.phone || ""}
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input 
                  id="avatar" 
                  name="avatar" 
                  type="url" 
                  value={formData.avatar} 
                  onChange={handleChange} 
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input 
                id="bio" 
                name="bio" 
                placeholder="A brief description about yourself" 
                value={formData.bio || ""}
                onChange={handleChange}
              />
            </div>
            
            <Button onClick={handleSave}>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
