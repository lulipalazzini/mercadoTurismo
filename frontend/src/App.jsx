import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import GlobalSearch from "./components/GlobalSearch";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import RecoverPassword from "./components/RecoverPassword";
import Dashboard from "./components/Dashboard";
import Alojamientos from "./pages/Alojamientos";
import Paquetes from "./pages/Paquetes";
import Autos from "./pages/Autos";
import Pasajes from "./pages/Pasajes";
import Transfers from "./pages/Transfers";
import Circuitos from "./pages/Circuitos";
import Excursiones from "./pages/Excursiones";
import SalidasGrupales from "./pages/SalidasGrupales";
import Cruceros from "./pages/Cruceros";
import Cupos from "./pages/Cupos";
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar-contrasena" element={<RecoverPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/paquetes" element={<Paquetes />} />
        <Route path="/alojamientos" element={<Alojamientos />} />
        <Route path="/autos" element={<Autos />} />
        <Route path="/pasajes" element={<Pasajes />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/circuitos" element={<Circuitos />} />
        <Route path="/excursiones" element={<Excursiones />} />
        <Route path="/salidas-grupales" element={<SalidasGrupales />} />
        <Route path="/cruceros" element={<Cruceros />} />
        <Route path="/cupos" element={<Cupos />} />
        <Route path="/seguros" element={<Seguros />} />
      </Routes>
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
