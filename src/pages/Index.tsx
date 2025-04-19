
import { useAuth } from "@/hooks/useAuth";
import { Dashboard } from "@/components/dashboard/Dashboard";
import Layout from "@/components/layout/Layout";

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Index;
