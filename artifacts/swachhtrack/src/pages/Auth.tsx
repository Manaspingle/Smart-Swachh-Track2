import { useState } from "react";
import { Link, useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leaf, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { login as apiLogin, signup as apiSignup } from "@workspace/api-client-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  city: z.string().min(1, "Please select a city"),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", city: "" },
  });

  const onLoginSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const result = await apiLogin({ email: data.email, password: data.password });
      login(result.user, result.token);
      toast({
        title: "Welcome back!",
        description: "Successfully logged into SwachhTrack.",
      });
      setLocation("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const result = await apiSignup({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        city: data.city,
      });
      login(result.user, result.token);
      toast({
        title: "Account created!",
        description: "Welcome to SwachhTrack. Let's start recycling.",
      });
      setLocation("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-background">
      {/* Visual Column */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
            alt="Eco city" 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        </div>
        
        <Link href="/" className="relative z-10 flex items-center gap-2 text-primary-foreground hover:opacity-80 transition-opacity w-fit">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">SwachhTrack</span>
        </Link>

        <div className="relative z-10 text-primary-foreground max-w-md">
          <h2 className="text-4xl font-display font-bold leading-tight mb-4">Every piece of waste has a place.</h2>
          <p className="text-primary-foreground/80 text-lg">Join thousands of citizens making their cities cleaner while earning rewards for proper segregation.</p>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-white flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-primary-foreground/90">Join 45,000+ active users</p>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <Link href="/" className="absolute top-6 left-6 md:hidden flex items-center gap-2 text-primary">
          <Leaf className="w-5 h-5" />
          <span className="font-display font-bold">SwachhTrack</span>
        </Link>

        <div className="w-full max-w-[400px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-accent/50 p-1">
              <TabsTrigger value="login" className="rounded-md text-base">Log In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-md text-base">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl font-display font-bold">Welcome back</CardTitle>
                  <CardDescription className="text-base">Enter your email to sign in to your account.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input 
                        id="login-email" 
                        placeholder="m/example@domain.com" 
                        className="h-12 rounded-xl bg-card border-border/50"
                        {...loginForm.register("email")}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <a href="#" className="text-sm text-primary hover:underline font-medium">Forgot password?</a>
                      </div>
                      <Input 
                        id="login-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-12 rounded-xl bg-card border-border/50"
                        {...loginForm.register("password")}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold rounded-xl mt-2 group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-3xl font-display font-bold">Create an account</CardTitle>
                  <CardDescription className="text-base">Start your sustainable journey today.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input 
                        id="signup-name" 
                        placeholder="Priya Sharma" 
                        className="h-11 rounded-xl bg-card border-border/50"
                        {...signupForm.register("name")}
                      />
                      {signupForm.formState.errors.name && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.name.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        placeholder="m/example@domain.com" 
                        className="h-11 rounded-xl bg-card border-border/50"
                        {...signupForm.register("email")}
                      />
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone</Label>
                        <Input 
                          id="signup-phone" 
                          placeholder="98765 43210" 
                          className="h-11 rounded-xl bg-card border-border/50"
                          {...signupForm.register("phone")}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-city">City</Label>
                        <Select onValueChange={(val) => signupForm.setValue("city", val)}>
                          <SelectTrigger className="h-11 rounded-xl bg-card border-border/50">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                            <SelectItem value="Bangalore">Bangalore</SelectItem>
                            <SelectItem value="Chennai">Chennai</SelectItem>
                            <SelectItem value="Pune">Pune</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {signupForm.formState.errors.phone && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.phone.message}</p>
                    )}
                    {signupForm.formState.errors.city && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.city.message}</p>
                    )}

                    <div className="space-y-2 pb-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-11 rounded-xl bg-card border-border/50"
                        {...signupForm.register("password")}
                      />
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold rounded-xl group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                      {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
