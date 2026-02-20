import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import HomeMarketplace from "./components/HomeMarketplace";
import Login from "./components/Login";
import Register from "./components/Register";
import RecoverPassword from "./components/RecoverPassword";
import Dashboard from "./components/Dashboard";
import Alojamientos from "./pages/Alojamientos";
import Paquetes from "./pages/Paquetes";
import Autos from "./pages/Autos";
import Transfers from "./pages/Transfers";
import Trenes from "./pages/Trenes";
import Circuitos from "./pages/Circuitos";
import Excursiones from "./pages/Excursiones";
import SalidasGrupales from "./pages/SalidasGrupales";
import Cruceros from "./pages/Cruceros";
import Seguros from "./pages/Seguros";
import PublicacionesDestacadasPage from "./pages/PublicacionesDestacadasPage";
import { getUser, getToken } from "./services/auth.service";
import { isClienteUser } from "./utils/rolePermissions";
import "./App.css";

/**
 * Ruta protegida para el dashboard B2B.
 * - Sin sesión → /login
 * - Rol cliente/user → / (marketplace)
 * - Resto → renderiza children
 */
function ProtectedDashboard({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  const user = getUser();
  if (isClienteUser(user)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = [
    "/login",
    "/registro",
    "/recuperar-contrasena",
    "/dashboard",
  ].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeMarketplace />} />
        <Route path="/home-old" element={<Home />} />
        <Route
          path="/ofertas-destacadas"
          element={<PublicacionesDestacadasPage />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<RecoverPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedDashboard>
              <Dashboard />
            </ProtectedDashboard>
          }
        />
        <Route path="/paquetes" element={<Paquetes />} />
        <Route path="/alojamientos" element={<Alojamientos />} />
        <Route path="/autos" element={<Autos />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/trenes" element={<Trenes />} />
        <Route path="/circuitos" element={<Circuitos />} />
        <Route path="/excursiones" element={<Excursiones />} />
        <Route path="/salidas-grupales" element={<SalidasGrupales />} />
        <Route path="/cruceros" element={<Cruceros />} />
        <Route path="/seguros" element={<Seguros />} />
      </Routes>
      {!hideNavbar && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
