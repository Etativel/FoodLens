import "./BottomnavLayout.css";
import BottomNavigation from "./components/Navigation/BottomNavigation";
import { Outlet } from "react-router-dom";

function BottomNavLayout() {
  return (
    <div className="h-screen relative overflow-hidden ">
      <Outlet className="content-wrapper" />
      <BottomNavigation />
    </div>
  );
}

export default BottomNavLayout;
