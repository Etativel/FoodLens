import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";
import Home from "./pages/Home/Home.jsx";
import MyFood from "./pages/MyFood/MyFood.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import Calories from "./pages/Calories/Calories.jsx";
import Result from "./pages/Result/Result.jsx";
import Recipe from "./pages/Recipe/Recipe.jsx";
import BottomNavLayout from "./BottomnavLayout.jsx";
import AppLayout from "./AppLayout.jsx";
import RecipeDetails from "./components/Recipe/RecipeDetails.jsx";
import ScanDetails from "./pages/ScanDetails/ScanDetails.jsx";
import UpdateField from "./pages/UpdateField/UpdateField.jsx";

import Onboarding from "./pages/Onboarding/Onboarding.jsx";
import SignIn from "./pages/Auth/SignIn.jsx";
import Signup from "./pages/Auth/SignUp.jsx";
import EmailVerification from "./pages/Auth/EmailVerification.jsx";
import ResetPassword from "./pages/Auth/ResetPassword.jsx";
import ResetPasswordEmailSent from "./pages/Auth/ResetPasswordNotification.jsx";

import Redirection from "./Redirection.jsx";

const router = createBrowserRouter([
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <Signup /> },
  { path: "/verify", element: <EmailVerification /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/email-token-sent", element: <ResetPasswordEmailSent /> },
  { path: "/", element: <Redirection /> },
  {
    element: <AppLayout />,
    children: [
      {
        element: <BottomNavLayout />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/calories", element: <Calories /> },
          { path: "/my-food", element: <MyFood /> },
          { path: "/settings", element: <Settings /> },
          { path: "/recipe", element: <Recipe /> },
        ],
      },
      { path: "/onboarding", element: <Onboarding /> },
      { path: "/results", element: <Result /> },
      { path: "/recipe/:recipeId", element: <RecipeDetails /> },
      { path: "/scan/:foodId", element: <ScanDetails /> },
      { path: "/settings/:field", element: <UpdateField /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback="">
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
