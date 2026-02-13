import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import CompanyHome from "@/pages/company-home";
import WhiteoutAI from "@/pages/whiteout-ai";
import Maestro from "@/pages/maestro";
import About from "@/pages/about";
import WhiteoutGovernment from "@/pages/whiteout-ai/government";
import WhiteoutAcademicIntegrity from "@/pages/whiteout-ai/academic-integrity";
import WhiteoutSecurityWhitepaper from "@/pages/whiteout-ai/security-whitepaper";
import NotFound from "@/pages/not-found";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import Demo from "@/pages/demo";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={CompanyHome} />
        <Route path="/demo" component={Demo} />
        <Route path="/whiteout-ai" component={WhiteoutAI} />
        <Route path="/maestro" component={Maestro} />
        <Route path="/about" component={About} />
        <Route path="/whiteout-ai/government" component={WhiteoutGovernment} />
        <Route path="/whiteout-ai/academic-integrity" component={WhiteoutAcademicIntegrity} />
        <Route path="/whiteout-ai/security-whitepaper" component={WhiteoutSecurityWhitepaper} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
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
