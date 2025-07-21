import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import { Dashboard } from "./app/Dashboard/dashboard";
import { NoDeberianEntrar } from "./app/no-deberian-entrar";
import { DashboardLayout } from "./app/Layout/dashboard-layout";
import { EmpleadosModule } from "./components/Dashboard/Empleados-module/empleados-module";
import { ProductosModule } from "./components/Dashboard/Productos-module/productos-module";
import { ProveedoresModule } from "./components/Dashboard/Proveedores-module/proveedores-module";
import { ReportesModule } from "./components/Dashboard/Reportes-module/reportes-module";
import { CajaModule } from "./components/Dashboard/Caja-module/caja-module";
import { ComprobantesModule } from "./components/Dashboard/Comprobantes-module/comprobantes-module";
import { ThemeProvider } from "./components/ui/theme-provider";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
  <BrowserRouter>
      <Routes>
    <Route index element={<NoDeberianEntrar/>} />
    
    {/* <Route element={<AuthLayout />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route> */}

    <Route path="dashboard" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="caja" element={<CajaModule />} />
      <Route path="comprobantes" element={<ComprobantesModule/>} />
      <Route path="empleados" element={<EmpleadosModule />} />
      <Route path="productos" element={<ProductosModule />} />
      <Route path="proveedores" element={<ProveedoresModule />} />
      <Route path="reportes" element={<ReportesModule/>} />
    </Route>
  </Routes>
  </BrowserRouter>
    </ThemeProvider>
);
