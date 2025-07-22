import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";
import { Dashboard } from "./app/Dashboard/dashboard";
import { DashboardLayout } from "./app/Layout/dashboard-layout";
import { EmpleadosModule } from "./components/Dashboard/Empleados-module/empleados-module";
import { ProductosModule } from "./components/Dashboard/Productos-module/productos-module";
import { ProveedoresModule } from "./components/Dashboard/Proveedores-module/proveedores-module";
import { ReportesModule } from "./components/Dashboard/Reportes-module/reportes-module";
import { CajaModule } from "./components/Dashboard/Caja-module/caja-module";
import { ComprobantesModule } from "./components/Dashboard/Comprobantes-module/comprobantes-module";
import { ThemeProvider } from "./components/ui/theme-provider";
import { LoginPage } from "./app/Auth/Login";
// import { RegisterPage } from "./app/Auth/Register";
import { NotFound } from "./app/NotFound";
import { ProtectedRoute } from "./app/Auth/ProtectedRoute";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
  <BrowserRouter>
      <Routes>
    <Route index 

    element={<Navigate to={'/dashboard'}/>} />
    
    <Route path="login" element={
        <LoginPage />
    } />
    {/* <Route path="register" element={<RegisterPage />} /> */}
    {/* <Route element={<AuthLayout />}>
      <Route path="register" element={<Register />} />
    </Route> */}

    <Route path="dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
        
    }>
      <Route index element={<Dashboard />} />
      <Route path="caja" element={<CajaModule />} />
      <Route path="comprobantes" element={<ComprobantesModule/>} />
      <Route path="empleados" element={<EmpleadosModule />} />
      <Route path="productos" element={<ProductosModule />} />
      <Route path="proveedores" element={<ProveedoresModule />} />
      <Route path="reportes" element={<ReportesModule/>} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
  </BrowserRouter>
    </ThemeProvider>
);
