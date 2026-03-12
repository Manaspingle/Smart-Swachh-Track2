import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import CitizenDashboard from "@/pages/CitizenDashboard";
import Classify from "@/pages/Classify";
import Guide from "@/pages/Guide";
import Rewards from "@/pages/Rewards";
import Municipal from "@/pages/Municipal";
import Reports from "@/pages/Reports";
import Centers from "@/pages/Centers";
import Schedule from "@/pages/Schedule";
import Impact from "@/pages/Impact";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={CitizenDashboard} />
      <Route path="/classify" component={Classify} />
      <Route path="/guide" component={Guide} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/municipal" component={Municipal} />
      <Route path="/reports" component={Reports} />
      <Route path="/centers" component={Centers} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/impact" component={Impact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
