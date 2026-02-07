import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import GlobalSearch from "./components/GlobalSearch";
import Footer from "./components/Footer";
import Home from "./components/Home";
import HomeMarketplace from "./components/HomeMarketplace";
import Login from "./components/Login";
import RegisterB2BWizard from "./components/RegisterB2BWizard";
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
import "./App.css";

function AppContent() {
  const location = useLocation();
  const hideNavbar = [
    "/login",
    "/registro",
    "/recuperar-contrasena",
    "/dashboard",
  ].includes(location.pathname);

  // Mostrar búsqueda global solo en páginas minoristas
  const showGlobalSearch = !hideNavbar;

  return (
    <>
      {!hideNavbar && <Navbar />}
      {showGlobalSearch && <GlobalSearch />}
      <Routes>
        <Route path="/" element={<HomeMarketplace />} />
        <Route path="/home-old" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegisterB2BWizard />} />
        <Route path="/recuperar-contrasena" element={<RecoverPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
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
