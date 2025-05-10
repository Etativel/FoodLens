import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserProvider from "./contexts/UserProvider";

import "./index.css";
import Home from "./pages/Home/Home.jsx";
import MyFood from "./pages/MyFood/MyFood.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Calories from "./pages/Calories/Calories.jsx";
import Result from "./pages/Result/Result.jsx";
import Layout from "./Layout.jsx";
// import Processing from "./components/Processing/Processing.jsx";
import Onboarding from "./pages/Onboarding/Onboarding.jsx";
import SignIn from "./pages/Auth/SingIn.jsx";
import Signup from "./pages/Auth/SignUp.jsx";

const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  { path: "/results", element: <Result /> },
  {
    element: <Layout />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/calories", element: <Calories /> },
      { path: "/my-food", element: <MyFood /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback="">
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </Suspense>
  </StrictMode>
);
