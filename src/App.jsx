import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));
const Dokter = React.lazy(() => import("./pages/Dokter"));
const DetailDokter = React.lazy(() => import("./pages/DetailDokter"));
const Patients = React.lazy(() => import("./pages/Patients"));
const Inventory = React.lazy(() => import("./pages/Inventory"));
const Loyalty = React.lazy(() => import("./pages/Loyalty"));
const Surveys = React.lazy(() => import("./pages/Surveys"));
const PatientDetail = React.lazy(() => import("./pages/PatientDetail"));
const ActivityLogs = React.lazy(() => import("./pages/ActivityLogs"));
const Promotions = React.lazy(() => import("./pages/Promotions"));
const Appointments = React.lazy(() => import("./pages/Appointments"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Examination = React.lazy(() => import("./pages/Examination"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />

        <Route element={<MainLayout />}>
          <Route path="/patients" element={<Patients />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dokter" element={<Dokter />} />
          <Route path="/dokter/:id" element={<DetailDokter />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/examination/:id" element={<Examination />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
           <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;