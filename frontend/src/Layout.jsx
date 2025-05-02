import "./Layout.css";
import BottomNavigation from "./components/Navigation/BottomNavigation";
import Home from "./pages/Home/Home";
function Layout() {
  return (
    <div class="h-screen relative overflow-hidden">
      <Home />
      <BottomNavigation />
    </div>
  );
}

export default Layout;
