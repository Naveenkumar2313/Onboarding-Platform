import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "./components/Loadable";
import ParcLayout from "./components/ParcLayout/ParcLayout";

// FIX: Point to components/auth/AuthGuard
import AuthGuard from "./components/auth/AuthGuard"; 

import JwtLogin from "./views/sessions/JwtLogin"; 

const DefaultDashboard = Loadable(lazy(() => import("./views/dashboard/DefaultDashboard")));
const StudentOnboarding = Loadable(lazy(() => import("./views/onboarding/StudentOnboarding")));
const FacultyOnboarding = Loadable(lazy(() => import("./views/onboarding/FacultyOnboarding")));

const routes = [
  { path: "/", element: <Navigate to="/dashboard/default" /> },
  
  // SESSION ROUTES
  { path: "/session/signin", element: <JwtLogin /> },
  
  // PROTECTED ROUTES
  {
    element: (
      <AuthGuard>
        <ParcLayout />
      </AuthGuard>
    ),
    children: [
      { path: "/dashboard/default", element: <DefaultDashboard /> },
      { path: "/onboarding/student", element: <StudentOnboarding /> },
      { path: "/onboarding/faculty", element: <FacultyOnboarding /> },
    ]
  },
  
  { path: "*", element: <Navigate to="/session/signin" /> }
];

export default routes;