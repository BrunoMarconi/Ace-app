// src/components/Home.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMiPosicion } from "../services/playersService";
import { miProximoPartido, misRetosPendientes } from "../services/matchService";

export default function Home({ onIrAPartidos }) {
  const { user, profile } = useAuth();
  const [pos, setPos] = useState(null);
  const [partido, setPartido] = useState(null);
  const [retos, setRetos] = useState([]);

  useEffect(() => {
    async function cargar() {
      if (!user) return;
      try {
        const p = await getMiPosicion(user.uid);
        setPos(p);
        const pp = await miProximoPartido(user.uid);
        setPartido(pp);
        const r = await misRetosPendientes(user.uid);
        setRetos(r);
      } catch (e) {
        console.error("Error cargando home:", e);
      }
    }
    cargar();
  }, [user]);

  const rival = partido
    ? partido.retadorUid === user.uid
      ? partido.rivalNombre
      : partido.retadorNombre
    : null;

  return (
    <div className="pb-[100px]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="font-archivo font-black text-2xl tracking-tight text-ink">
          A<span className="text-acid">c</span>e
        </div>
        <div className="w-11 h-11 rounded-full bg-acid text-white font-archivo font-bold text-sm flex items-center justify-center">
          {(profile?.nombre || "J")[0]}
        </div>
      </div>

      {/* Banner de retos pendientes (lo más urgente, arriba del todo) */}
      {retos.length > 0 && (
        <div className="px-5 mb-4">
          {retos.map((reto) => (
            <div
              key={reto.id}
              onClick={onIrAPartidos}
              className="bg-acid rounded-2xl p-4 cursor-pointer mb-2 relative overflow-hidden"
            >
              <div className="flex items-center gap-2 text-white/90 font-archivo font-extrabold text-[11px] uppercase tracking-[1.5px] mb-2">
                <i className="ti ti-bell-ringing"></i>
                Te han retado
              </div>
              <div className="flex items-center justify-between">
                <div className="text-white">
                  <span className="font-archivo font-extrabold text-base">
                    {reto.retadorNombre}
                  </span>
                  <span className="text-white/80 text-sm"> quiere jugar contigo</span>
                </div>
                <i className="ti ti-chevron-right text-white text-2xl"></i>
              </div>
              <button className="w-full mt-3 bg-white text-acid-d font-archivo font-extrabold text-sm rounded-xl py-2.5">
                Ver reto
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hero: posición */}
      <div className="px-5 pb-7 text-center">
        <div className="text-xs font-semibold text-txt-3 uppercase tracking-[2px] mb-2.5">
          Hola {profile?.nombre?.split(" ")[0] || "jugador"} · tu posición en Málaga
        </div>
        <div className="font-archivo font-black text-[92px] leading-[0.85] tracking-tighter text-ink flex items-start justify-center">
          <span className="text-[44px] text-acid mt-2 mr-0.5">#</span>
          {pos?.posicion ?? "—"}
        </div>
        <div className="mt-3.5">
          <span className="font-archivo font-bold text-base text-ink">
            {profile?.puntos ?? 1000} puntos
          </span>
        </div>

        {/* Stats */}
        <div className="flex mt-6 bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl overflow-hidden">
          <div className="flex-1 py-3.5 border-r border-[rgba(20,30,50,0.08)]">
            <div className="font-archivo font-extrabold text-xl text-ink">
              {profile?.partidos ?? 0}
            </div>
            <div className="text-[11px] text-txt-3 uppercase tracking-wide mt-0.5">
              Partidos
            </div>
          </div>
          <div className="flex-1 py-3.5 border-r border-[rgba(20,30,50,0.08)]">
            <div className="font-archivo font-extrabold text-xl text-acid">
              {profile?.victorias ?? 0}
            </div>
            <div className="text-[11px] text-txt-3 uppercase tracking-wide mt-0.5">
              Victorias
            </div>
          </div>
          <div className="flex-1 py-3.5">
            <div className="font-archivo font-extrabold text-xl text-ink">
              {profile?.partidos
                ? Math.round((profile.victorias / profile.partidos) * 100)
                : 0}
              %
            </div>
            <div className="text-[11px] text-txt-3 uppercase tracking-wide mt-0.5">
              Win rate
            </div>
          </div>
        </div>
      </div>

      {/* Banner: tienes un partido (solo si hay) */}
      {partido && (
        <div className="px-5 mb-6">
          <div
            onClick={onIrAPartidos}
            className="bg-gradient-to-br from-acid to-acid-d rounded-2xl p-[18px] cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-white font-archivo font-extrabold text-[11px] uppercase tracking-[1.5px] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              Tienes un partido
            </div>
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="font-archivo font-extrabold text-base">
                  vs {rival}
                </div>
                <div className="text-xs text-white/80 mt-0.5">
                  Pendiente de jugar
                </div>
              </div>
              <i className="ti ti-chevron-right text-white text-2xl"></i>
            </div>
            <button className="w-full mt-3.5 bg-white text-acid-d font-archivo font-extrabold text-sm rounded-xl py-3">
              Ir al partido
            </button>
          </div>
        </div>
      )}

      {/* Accesos rápidos */}
      <div className="px-5 flex gap-3">
        <div
          onClick={onIrAPartidos}
          className="flex-1 bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl p-4 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-acid/10 text-acid-d flex items-center justify-center text-xl mb-2.5">
            <i className="ti ti-ball-tennis"></i>
          </div>
          <div className="font-archivo font-bold text-sm text-ink">Mis partidos</div>
          <div className="text-[11.5px] text-txt-3">Retos y resultados</div>
        </div>
        <div className="flex-1 bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-acid/10 text-acid-d flex items-center justify-center text-xl mb-2.5">
            <i className="ti ti-trophy"></i>
          </div>
          <div className="font-archivo font-bold text-sm text-ink">
            Puesto #{pos?.posicion ?? "—"}
          </div>
          <div className="text-[11.5px] text-txt-3">de {pos?.total ?? "—"} jugadores</div>
        </div>
      </div>
    </div>
  );
}