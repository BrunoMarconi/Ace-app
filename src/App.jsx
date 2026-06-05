// src/App.jsx
import Partidos from "./components/Partidos";
import { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Auth from "./components/Auth";
import TabBar from "./components/TabBar";
import Buscar from "./components/Buscar";
import { logout } from "./services/authService";
import Ranking from "./components/Ranking";
import Disponibilidad from "./components/Disponibilidad";
import Home from "./components/Home";
import Perfil from "./components/Perfil";



function Contenido() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState("home");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-txt-2">
        Cargando...
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <div className="min-h-screen bg-bg max-w-[480px] mx-auto relative">
      {tab === "home" && <Home onIrAPartidos={() => setTab("partidos")} />}
      {tab === "buscar" && <Buscar />}
      {tab === "perfil" && <Perfil />}
      {tab === "partidos" && <Partidos />}
      {tab === "ranking" && <Ranking />}
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Contenido />
    </AuthProvider>
  );
}