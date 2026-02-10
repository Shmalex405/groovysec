import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy"; // ✅ new
import Government from "@/pages/government";
import AcademicIntegrity from "@/pages/academic-integrity";
import SecurityWhitepaper from "@/pages/security-whitepaper";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} /> {/* ✅ new */}
      <Route path="/government" component={Government} />
      <Route path="/academic-integrity" component={AcademicIntegrity} />
      <Route path="/security-whitepaper" component={SecurityWhitepaper} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;