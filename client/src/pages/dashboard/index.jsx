import { useAuth } from "@/context/AuthContext";
import VisitorDashboard from "./components/VisitorDashboard";
import UserDashboard from "./components/UserDashboard";

const Dashboard = () => {
  const { token } = useAuth();
  const isLoggedIn = !!token;

  return isLoggedIn ? <UserDashboard /> : <VisitorDashboard />;
};

export default Dashboard;
