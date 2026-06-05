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
import CompletarPerfil from "./components/CompletarPerfil";



function Contenido() {
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState("home");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-txt-2">
        Cargando...
      </div>
    );
  }

  if (!user) return <Auth />;

  // Si el perfil aún no está completo (típico de Google), pedir que lo complete
  if (profile && profile.perfilCompleto === false) {
    return (
      <CompletarPerfil
        uid={user.uid}
        nombre={profile.nombre}
        onListo={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg max-w-[480px] mx-auto relative">
      {tab === "home" && <Home onIrAPartidos={() => setTab("partidos")} />}
      {tab === "buscar" && <Buscar />}
      {tab === "partidos" && <Partidos />}
      {tab === "ranking" && <Ranking />}
      {tab === "perfil" && <Perfil />}
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