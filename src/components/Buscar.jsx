// src/components/Buscar.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPlayers } from "../services/playersService";
import { crearReto } from "../services/matchService";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const FRANJAS = ["Mañana", "Mediodía", "Tarde", "Noche"];

// Color del nivel
function colorNivel(nivel) {
  if (nivel === "Competición") return "text-purple-600 bg-purple-50";
  if (nivel === "Avanzado") return "text-acid-d bg-acid/10";
  return "text-green-700 bg-green-50"; // Intermedio
}

export default function Buscar() {
  const { user, profile } = useAuth();
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [diaFiltro, setDiaFiltro] = useState(null);
  const [franjaFiltro, setFranjaFiltro] = useState(null);
  const [retando, setRetando] = useState(null); // uid al que estoy retando

  useEffect(() => {
    async function cargar() {
      if (!user) return;
      try {
        const lista = await getPlayers(user.uid);
        setJugadores(lista);
      } catch (e) {
        console.error("Error cargando jugadores:", e);
      }
      setLoading(false);
    }
    cargar();
  }, [user]);

  function iniciales(nombre) {
    return nombre.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  }

  async function retar(rival) {
    setRetando(rival.uid);
    try {
      await crearReto(profile, rival);
      alert("¡Reto enviado a " + rival.nombre + "! Lo verás en Partidos.");
    } catch (e) {
      console.error("Error al retar:", e);
      alert("No se pudo enviar el reto.");
    }
    setRetando(null);
  }

  function resumenDisp(disp) {
    if (!Array.isArray(disp) || disp.length === 0) return null;
    const txt = disp.slice(0, 2).join(", ");
    return disp.length > 2 ? txt + "…" : txt;
  }

  const jugadoresFiltrados = jugadores.filter((j) => {
    if (!diaFiltro || !franjaFiltro) return true;
    const clave = `${diaFiltro}-${franjaFiltro}`;
    return Array.isArray(j.disponibilidad) && j.disponibilidad.includes(clave);
  });

  function limpiarFiltro() {
    setDiaFiltro(null);
    setFranjaFiltro(null);
  }

  return (
    <div className="pb-[100px]">
      <div className="px-5 pt-5 pb-3">
        <h1 className="font-archivo font-black text-[28px] tracking-tight text-ink">
          Buscar
        </h1>
        <p className="text-txt-2 text-sm mt-1">
          {jugadores.length} {jugadores.length === 1 ? "jugador" : "jugadores"} en Málaga
        </p>
      </div>

      {/* Filtro de disponibilidad */}
      <div className="px-5 mb-4">
        <div className="bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-archivo font-bold text-sm text-ink flex items-center gap-2">
              <i className="ti ti-calendar-clock text-acid-d"></i>
              ¿Cuándo quieres jugar?
            </span>
            {(diaFiltro || franjaFiltro) && (
              <button onClick={limpiarFiltro} className="text-xs text-acid-d font-semibold">
                Quitar
              </button>
            )}
          </div>
          <div className="flex gap-1.5 mb-3 overflow-x-auto">
            {DIAS.map((d) => (
              <button
                key={d}
                onClick={() => setDiaFiltro(diaFiltro === d ? null : d)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition ${
                  diaFiltro === d ? "bg-acid text-white" : "bg-card-2 text-txt-2"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {FRANJAS.map((f) => (
              <button
                key={f}
                onClick={() => setFranjaFiltro(franjaFiltro === f ? null : f)}
                className={`py-2 rounded-lg text-[11px] font-semibold transition ${
                  franjaFiltro === f
                    ? "bg-acid/10 text-acid-d border-[1.5px] border-acid"
                    : "bg-card-2 text-txt-2 border-[1.5px] border-transparent"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-txt-2 mt-10">Cargando jugadores...</p>
      ) : jugadoresFiltrados.length === 0 ? (
        <div className="text-center mt-12 px-8">
          <div className="w-20 h-20 rounded-3xl bg-card-2 flex items-center justify-center text-4xl text-txt-3 mx-auto mb-5">
            <i className="ti ti-users"></i>
          </div>
          <h3 className="font-archivo font-extrabold text-lg text-ink mb-2">
            {diaFiltro && franjaFiltro ? "Nadie libre entonces" : "Aún no hay más jugadores"}
          </h3>
          <p className="text-txt-2 text-sm leading-relaxed">
            {diaFiltro && franjaFiltro
              ? "Prueba con otro día u hora, o quita el filtro."
              : "Cuando más gente se registre, aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div className="px-5 space-y-3">
          {jugadoresFiltrados.map((j) => (
            <div
              key={j.uid}
              className="bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                {j.foto ? (
                  <img src={j.foto} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-acid/10 text-acid-d flex items-center justify-center font-archivo font-extrabold text-lg">
                    {iniciales(j.nombre)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-archivo font-bold text-[16px] text-ink">
                    {j.nombre}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${colorNivel(j.nivel)}`}>
                      {j.nivel}
                    </span>
                    <span className="text-[12px] text-txt-3">
                      <i className="ti ti-map-pin text-[11px]"></i> {j.zona}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-archivo font-extrabold text-lg text-ink">{j.puntos ?? 1000}</div>
                  <div className="text-[10px] text-txt-3 uppercase tracking-wide">puntos</div>
                </div>
              </div>

              {/* Fila inferior: stats + disponibilidad */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[rgba(20,30,50,0.06)] text-[12px] text-txt-2">
                <span><b className="text-ink">{j.partidos ?? 0}</b> partidos</span>
                <span><b className="text-ink">{j.partidos ? Math.round((j.victorias / j.partidos) * 100) : 0}%</b> victorias</span>
                {resumenDisp(j.disponibilidad) && (
                  <span className="ml-auto text-acid-d font-semibold">
                    <i className="ti ti-clock"></i> {resumenDisp(j.disponibilidad)}
                  </span>
                )}
              </div>

              {/* Botón retar */}
              <button
                onClick={() => retar(j)}
                disabled={retando === j.uid}
                className="w-full mt-3 bg-acid text-white font-archivo font-bold text-sm rounded-xl py-3 active:scale-[0.98] transition disabled:opacity-50"
              >
                {retando === j.uid ? "Enviando..." : "Retar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}