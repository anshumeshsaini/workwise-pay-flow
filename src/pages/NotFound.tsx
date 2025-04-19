
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-7xl font-bold text-primary">404</h1>
          <p className="text-2xl text-muted-foreground">This page doesn't exist</p>
          <Button asChild className="mt-4">
            <a href="/">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
