// src/components/Ranking.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRanking } from "../services/playersService";

export default function Ranking() {
  const { user } = useAuth();
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const miFilaRef = useRef(null);

  useEffect(() => {
    async function cargar() {
      try {
        const lista = await getRanking();
        setJugadores(lista);
      } catch (e) {
        console.error("Error cargando ranking:", e);
      }
      setLoading(false);
    }
    cargar();
  }, []);

  function iniciales(nombre) {
    return (nombre || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  }

  const top3 = jugadores.slice(0, 3);
  const resto = jugadores.slice(3);

  // Avatar reutilizable
  function Avatar({ j, size }) {
    return j.foto ? (
      <img src={j.foto} alt="" className={`${size} rounded-2xl object-cover`} />
    ) : (
      <div className={`${size} rounded-2xl bg-acid/10 text-acid-d flex items-center justify-center font-archivo font-extrabold`}>
        {iniciales(j.nombre)}
      </div>
    );
  }

  return (
    <div className="pb-[100px]">
      <div className="px-5 pt-5 pb-3">
        <h1 className="font-archivo font-black text-[28px] tracking-tight text-ink">Ranking</h1>
        <p className="text-txt-2 text-sm mt-1">Málaga · Temporada 2026</p>
      </div>

      {loading ? (
        <p className="text-center text-txt-2 mt-10">Cargando ranking...</p>
      ) : jugadores.length === 0 ? (
        <p className="text-center text-txt-2 mt-10">Aún no hay jugadores.</p>
      ) : (
        <>
          {/* PODIO top 3 */}
          {top3.length > 0 && (
            <div className="flex justify-center items-end gap-3 px-5 py-6">
              {/* 2º (plata) */}
              {top3[1] && (
                <div className="flex flex-col items-center">
                  <Avatar j={top3[1]} size="w-14 h-14" />
                  <div className="font-archivo font-black text-base text-slate-400 mt-2">2º</div>
                  <div className="text-[12px] font-semibold text-ink text-center leading-tight">{top3[1].nombre.split(" ")[0]}</div>
                  <div className="text-[11px] text-txt-3 font-archivo font-bold">{top3[1].puntos}</div>
                </div>
              )}
              {/* 1º (oro) - más grande y al centro */}
              {top3[0] && (
                <div className="flex flex-col items-center -mt-4">
                  <div className="text-2xl mb-1">👑</div>
                  <div className="ring-4 ring-yellow-400 rounded-2xl">
                    <Avatar j={top3[0]} size="w-18 h-18" />
                  </div>
                  <div className="font-archivo font-black text-lg text-yellow-500 mt-2">1º</div>
                  <div className="text-[13px] font-bold text-ink text-center leading-tight">{top3[0].nombre.split(" ")[0]}</div>
                  <div className="text-[12px] text-txt-3 font-archivo font-bold">{top3[0].puntos}</div>
                </div>
              )}
              {/* 3º (bronce) */}
              {top3[2] && (
                <div className="flex flex-col items-center">
                  <Avatar j={top3[2]} size="w-14 h-14" />
                  <div className="font-archivo font-black text-base text-amber-700 mt-2">3º</div>
                  <div className="text-[12px] font-semibold text-ink text-center leading-tight">{top3[2].nombre.split(" ")[0]}</div>
                  <div className="text-[11px] text-txt-3 font-archivo font-bold">{top3[2].puntos}</div>
                </div>
              )}
            </div>
          )}

          {/* LISTA del 4º en adelante */}
          <div className="px-5">
            {resto.map((j, i) => {
              const soyYo = j.uid === user.uid;
              const puesto = i + 4; // porque empieza tras el podio
              return (
                <div
                  key={j.uid}
                  ref={soyYo ? miFilaRef : null}
                  className={`flex items-center gap-3.5 py-3 rounded-xl px-2 ${
                    soyYo ? "bg-acid/10 -mx-2" : ""
                  }`}
                >
                  <div className={`font-archivo font-extrabold text-base w-7 text-center ${soyYo ? "text-acid-d" : "text-txt-3"}`}>
                    {puesto}
                  </div>
                  <Avatar j={j} size="w-10 h-10" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14.5px] text-ink">
                      {j.nombre} {soyYo && <span className="text-acid-d font-bold">(tú)</span>}
                    </div>
                    <div className="text-[12px] text-txt-3">
                      {j.partidos || 0} partidos · {j.victorias || 0} victorias
                    </div>
                  </div>
                  <div className="font-archivo font-bold text-[15px] text-txt-2">{j.puntos || 1000}</div>
                </div>
              );
            })}
          </div>

          {/* Si estoy en el top 3, un aviso simpático */}
          {top3.some((j) => j.uid === user.uid) && (
            <p className="text-center text-acid-d font-semibold text-sm mt-4">
              ¡Estás en el podio! 🏆
            </p>
          )}
        </>
      )}
    </div>
  );
}