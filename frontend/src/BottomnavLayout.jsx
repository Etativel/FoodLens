import "./BottomnavLayout.css";
import BottomNavigation from "./components/Navigation/BottomNavigation";
import Sidebar from "./components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function BottomNavLayout() {
  return (
    <div className="h-screen relative overflow-hidden lg:flex bg-neutral-900">
      <Sidebar />
      <div className="hidden lg:flex flex-col h-screen min-w-65  shadow-lg "></div>
      <Outlet className="content-wrapper" />
      <BottomNavigation />
    </div>
  );
}

export default BottomNavLayout;
