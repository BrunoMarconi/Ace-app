// src/components/Partidos.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  misPartidos,
  aceptarReto,
  rechazarReto,
  confirmarResultado,
  rechazarResultado,
} from "../services/matchService";
import Chat from "./Chat";
import Resultado from "./Resultado";

export default function Partidos() {
  const { user } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatAbierto, setChatAbierto] = useState(null);
  const [resultadoAbierto, setResultadoAbierto] = useState(null);

  async function cargar() {
    if (!user) return;
    setLoading(true);
    try {
      const lista = await misPartidos(user.uid);
      setPartidos(lista.filter((p) => p.estado !== "rechazado"));
    } catch (e) {
      console.error("Error cargando partidos:", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, [user]);

  async function aceptar(id) { await aceptarReto(id); cargar(); }
  async function rechazar(id) { await rechazarReto(id); cargar(); }
  async function confirmar(id) { await confirmarResultado(id); cargar(); }
  async function rechazarRes(id) { await rechazarResultado(id); cargar(); }

  function iniciales(nombre) {
    return (nombre || "?").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  }

  // Datos del rival respecto a mí
  function datosRival(p) {
    const soyRetador = p.retadorUid === user.uid;
    return {
      nombre: soyRetador ? p.rivalNombre : p.retadorNombre,
      foto: soyRetador ? p.rivalFoto : p.retadorFoto, // por si lo guardas
    };
  }

  if (chatAbierto) {
    return <Chat partido={chatAbierto} onBack={() => setChatAbierto(null)} />;
  }
  if (resultadoAbierto) {
    return (
      <Resultado
        partido={resultadoAbierto}
        onBack={() => setResultadoAbierto(null)}
        onHecho={() => { setResultadoAbierto(null); cargar(); }}
      />
    );
  }

  // Clasificar partidos en secciones
  const retosNuevos = partidos.filter((p) => p.rivalUid === user.uid && p.estado === "propuesto");
  const enviados = partidos.filter((p) => p.retadorUid === user.uid && p.estado === "propuesto");
  const enCurso = partidos.filter((p) => p.estado === "aceptado" || p.estado === "jugado");
  const historial = partidos.filter((p) => p.estado === "confirmado");

  // Avatar del rival
  function Avatar({ p, size = "w-12 h-12" }) {
    const r = datosRival(p);
    return r.foto ? (
      <img src={r.foto} alt="" className={`${size} rounded-xl object-cover`} />
    ) : (
      <div className={`${size} rounded-xl bg-acid/10 text-acid-d flex items-center justify-center font-archivo font-bold`}>
        {iniciales(r.nombre)}
      </div>
    );
  }

  return (
    <div className="pb-[100px]">
      <div className="px-5 pt-5 pb-3">
        <h1 className="font-archivo font-black text-[28px] tracking-tight text-ink">Partidos</h1>
        <p className="text-txt-2 text-sm mt-1">Tus retos y resultados</p>
      </div>

      {loading ? (
        <p className="text-center text-txt-2 mt-10">Cargando...</p>
      ) : partidos.length === 0 ? (
        <div className="text-center mt-12 px-8">
          <div className="w-20 h-20 rounded-3xl bg-card-2 flex items-center justify-center text-4xl text-txt-3 mx-auto mb-5">
            <i className="ti ti-ball-tennis"></i>
          </div>
          <h3 className="font-archivo font-extrabold text-lg text-ink mb-2">Aún no tienes partidos</h3>
          <p className="text-txt-2 text-sm leading-relaxed">Reta a alguien desde Buscar y aparecerá aquí.</p>
        </div>
      ) : (
        <div className="px-5 space-y-6">

          {/* SECCIÓN: Retos nuevos (te han retado) */}
          {retosNuevos.length > 0 && (
            <div>
              <h2 className="font-archivo font-bold text-xs uppercase tracking-wide text-acid-d mb-3">
                Te han retado ({retosNuevos.length})
              </h2>
              <div className="space-y-3">
                {retosNuevos.map((p) => (
                  <div key={p.id} className="bg-white border-[1.5px] border-acid/30 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar p={p} />
                      <div className="flex-1">
                        <div className="font-archivo font-bold text-ink">{datosRival(p).nombre}</div>
                        <div className="text-[13px] text-txt-2">te ha retado a jugar</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => aceptar(p.id)} className="flex-1 bg-acid text-white font-archivo font-bold text-sm rounded-xl py-2.5 active:scale-95 transition">Aceptar</button>
                      <button onClick={() => rechazar(p.id)} className="flex-1 bg-card-2 text-txt-2 font-archivo font-bold text-sm rounded-xl py-2.5 active:scale-95 transition">Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN: En curso (aceptados y jugados pendientes) */}
          {enCurso.length > 0 && (
            <div>
              <h2 className="font-archivo font-bold text-xs uppercase tracking-wide text-txt-3 mb-3">En curso</h2>
              <div className="space-y-3">
                {enCurso.map((p) => (
                  <div key={p.id} className="bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar p={p} />
                      <div className="flex-1">
                        <div className="font-archivo font-bold text-ink">vs {datosRival(p).nombre}</div>
                        <div className="text-[12px] text-txt-3">
                          {p.estado === "aceptado" ? "Pendiente de jugar" : "Resultado por confirmar"}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-acid-d bg-acid/10 px-2.5 py-1 rounded-md">
                        {p.estado === "aceptado" ? "Aceptado" : "Jugado"}
                      </span>
                    </div>

                    {/* Si jugado: marcador grande + confirmar */}
                    {p.estado === "jugado" && (
                      <div className="bg-card-2 rounded-xl p-3 mb-3 text-center">
                        <div className="font-archivo font-black text-2xl text-ink">{p.resultado}</div>
                        <div className="text-[13px] text-txt-2 mt-1">Ganó {p.ganadorNombre}</div>
                      </div>
                    )}

                    {/* Botones según estado */}
                    {p.estado === "aceptado" && (
                      <div className="flex gap-2">
                        <button onClick={() => setChatAbierto(p)} className="flex-1 bg-acid/10 text-acid-d font-archivo font-bold text-sm rounded-xl py-2.5 active:scale-95 transition">Chat</button>
                        <button onClick={() => setResultadoAbierto(p)} className="flex-1 bg-acid text-white font-archivo font-bold text-sm rounded-xl py-2.5 active:scale-95 transition">Meter resultado</button>
                      </div>
                    )}
                    {p.estado === "jugado" && (
                      p.resultadoMetidoPor !== user.uid ? (
                        <div className="flex gap-2">
                          <button onClick={() => confirmar(p.id)} className="flex-1 bg-acid text-white font-archivo font-bold text-sm rounded-xl py-2.5 active:scale-95 transition">Confirmar</button>
                          <button onClick={() => rechazarRes(p.id)} className="flex-1 bg-card-2 text-txt-2 font-archivo font-bold text-sm rounded-xl py-2.5 active:scale-95 transition">No es correcto</button>
                        </div>
                      ) : (
                        <p className="text-[13px] text-txt-3 text-center">Esperando que {datosRival(p).nombre} lo confirme…</p>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN: Retos enviados pendientes */}
          {enviados.length > 0 && (
            <div>
              <h2 className="font-archivo font-bold text-xs uppercase tracking-wide text-txt-3 mb-3">Enviados</h2>
              <div className="space-y-3">
                {enviados.map((p) => (
                  <div key={p.id} className="bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl p-4 flex items-center gap-3">
                    <Avatar p={p} size="w-10 h-10" />
                    <div className="flex-1">
                      <div className="font-semibold text-ink text-sm">{datosRival(p).nombre}</div>
                      <div className="text-[12px] text-txt-3">Esperando respuesta…</div>
                    </div>
                    <i className="ti ti-clock text-txt-3 text-lg"></i>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECCIÓN: Historial (confirmados) */}
          {historial.length > 0 && (
            <div>
              <h2 className="font-archivo font-bold text-xs uppercase tracking-wide text-txt-3 mb-3">Historial</h2>
              <div className="space-y-3">
                {historial.map((p) => {
                  const gane = p.ganadorUid === user.uid;
                  return (
                    <div key={p.id} className="bg-white border border-[rgba(20,30,50,0.08)] rounded-2xl p-4 flex items-center gap-3">
                      <Avatar p={p} size="w-10 h-10" />
                      <div className="flex-1">
                        <div className="font-semibold text-ink text-sm">vs {datosRival(p).nombre}</div>
                        <div className="text-[13px] font-archivo font-bold text-ink">{p.resultado}</div>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${gane ? "text-green-700 bg-green-50" : "text-txt-3 bg-card-2"}`}>
                        {gane ? "Victoria" : "Derrota"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}