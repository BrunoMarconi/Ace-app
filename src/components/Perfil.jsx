// src/components/Perfil.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";
import { getMiPosicion } from "../services/playersService";
import Disponibilidad from "./Disponibilidad";

export default function Perfil() {
  const { user, profile } = useAuth();
  const [dispAbierta, setDispAbierta] = useState(false);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    async function cargar() {
      if (!user) return;
      try {
        const p = await getMiPosicion(user.uid);
        setPos(p);
      } catch (e) {
        console.error(e);
      }
    }
    cargar();
  }, [user]);

  if (dispAbierta) {
    return <Disponibilidad onBack={() => setDispAbierta(false)} />;
  }

  const winRate = profile?.partidos
    ? Math.round((profile.victorias / profile.partidos) * 100)
    : 0;

  const disp = Array.isArray(profile?.disponibilidad) ? profile.disponibilidad : [];

  return (
    <div className="pb-[100px]">
      {/* Cabecera con avatar */}
      <div className="text-center px-5 pt-10 pb-6">
        {profile?.foto ? (
          <img src={profile.foto} alt="" className="w-24 h-24 rounded-3xl object-cover mx-auto mb-4" />
        ) : (
          <div className="w-24 h-24 rounded-3xl bg-acid/10 text-acid-d flex items-center justify-center font-archivo font-black text-4xl mx-auto mb-4">
            {(profile?.nombre || "J")[0].toUpperCase()}
          </div>
        )}
        <h2 className="font-archivo font-black text-2xl text-ink">{profile?.nombre}</h2>
        <p className="text-txt-2 text-sm mt-1 flex items-center justify-center gap-1.5">
          <i className="ti ti-map-pin"></i> {profile?.zona}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[12px] font-bold text-acid-d bg-acid/10 px-3 py-1 rounded-full">
            {profile?.nivel}
          </span>
          {pos?.posicion && (
            <span className="text-[12px] font-bold text-ink bg-card-2 px-3 py-1 rounded-full">
              #{pos.posicion} en Málaga
            </span>
          )}
        </div>
      </div>

      {/* Stats en grande */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-4 bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl overflow-hidden">
          <div className="py-4 text-center border-r border-[rgba(20,30,50,0.08)]">
            <div className="font-archivo font-extrabold text-xl text-ink">{profile?.puntos ?? 1000}</div>
            <div className="text-[10px] text-txt-3 uppercase tracking-wide mt-1">Puntos</div>
          </div>
          <div className="py-4 text-center border-r border-[rgba(20,30,50,0.08)]">
            <div className="font-archivo font-extrabold text-xl text-ink">{profile?.partidos ?? 0}</div>
            <div className="text-[10px] text-txt-3 uppercase tracking-wide mt-1">Partidos</div>
          </div>
          <div className="py-4 text-center border-r border-[rgba(20,30,50,0.08)]">
            <div className="font-archivo font-extrabold text-xl text-acid">{profile?.victorias ?? 0}</div>
            <div className="text-[10px] text-txt-3 uppercase tracking-wide mt-1">Ganados</div>
          </div>
          <div className="py-4 text-center">
            <div className="font-archivo font-extrabold text-xl text-ink">{winRate}%</div>
            <div className="text-[10px] text-txt-3 uppercase tracking-wide mt-1">Win rate</div>
          </div>
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-archivo font-bold text-sm text-ink">Mi disponibilidad</h3>
          <button onClick={() => setDispAbierta(true)} className="text-xs text-acid-d font-semibold">
            Editar
          </button>
        </div>
        {disp.length === 0 ? (
          <div
            onClick={() => setDispAbierta(true)}
            className="bg-white border border-dashed border-[rgba(20,30,50,0.2)] rounded-2xl p-4 text-center text-txt-3 text-sm cursor-pointer"
          >
            <i className="ti ti-calendar-plus text-xl block mb-1"></i>
            Marca cuándo puedes jugar
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {disp.map((d) => (
              <span key={d} className="text-[12px] font-semibold bg-acid/10 text-acid-d px-3 py-1.5 rounded-lg">
                {d.replace("-", " · ")}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cerrar sesión */}
      <div className="px-5">
        <button
          onClick={logout}
          className="w-full bg-white border border-[rgba(20,30,50,0.08)] text-red-600 font-archivo font-bold rounded-2xl py-3.5 active:scale-[0.98] transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}