import "./Layout.css";
import BottomNavigation from "./components/Navigation/BottomNavigation";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="h-screen relative overflow-hidden">
      <Outlet className="content-wrapper" />
      <BottomNavigation />
    </div>
  );
}

export default Layout;
