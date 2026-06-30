import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, MotionConfig } from "framer-motion";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}
import WhiteoutAI from "@/pages/whiteout-ai";
import SolutionPage from "@/pages/solutions/solution-page";
import Maestro from "@/pages/maestro";
import About from "@/pages/about";
import WhiteoutGovernment from "@/pages/whiteout-ai/government";
import WhiteoutAcademicIntegrity from "@/pages/whiteout-ai/academic-integrity";
import WhiteoutSecurityWhitepaper from "@/pages/whiteout-ai/security-whitepaper";
import NotFound from "@/pages/not-found";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import Demo from "@/pages/demo";
import Review from "@/pages/review";
import Download from "@/pages/download";
import Partners from "@/pages/partners";
import Skills from "@/pages/skills";
import SkillsSuccess from "@/pages/skills/success";
import Contact from "@/pages/contact";
import Resources from "@/pages/resources";
import Security from "@/pages/security";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/post";

function Router() {
  return (
    <>
    <ScrollToTop />
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={WhiteoutAI} />
        <Route path="/demo" component={Demo} />
        <Route path="/review" component={Review} />
        <Route path="/download" component={Download} />
        <Route path="/whiteout-ai" component={WhiteoutAI} />
        <Route path="/maestro" component={Maestro} />
        <Route path="/skills" component={Skills} />
        <Route path="/skills/success" component={SkillsSuccess} />
        <Route path="/solutions/:slug">
          {(params) => <SolutionPage slug={params.slug} />}
        </Route>
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/resources" component={Resources} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug">
          {(params) => <BlogPost slug={params.slug} />}
        </Route>
        <Route path="/security" component={Security} />
        <Route path="/whiteout-ai/government" component={WhiteoutGovernment} />
        <Route path="/whiteout-ai/academic-integrity" component={WhiteoutAcademicIntegrity} />
        <Route path="/whiteout-ai/security-whitepaper" component={WhiteoutSecurityWhitepaper} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/partners" component={Partners} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <Toaster />
          <Router />
        </MotionConfig>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
