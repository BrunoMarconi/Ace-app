// src/components/Chat.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { enviarMensaje, escucharMensajes } from "../services/matchService";

export default function Chat({ partido, onBack }) {
  const { user, profile } = useAuth();
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const finRef = useRef(null);

  // Con quién hablo (el otro jugador)
  const rival =
    partido.retadorUid === user.uid ? partido.rivalNombre : partido.retadorNombre;

  // Escuchar mensajes en tiempo real al abrir el chat
  useEffect(() => {
    const unsub = escucharMensajes(partido.id, setMensajes);
    return unsub; // deja de escuchar al cerrar
  }, [partido.id]);

  // Bajar al último mensaje cuando llega uno nuevo
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  async function enviar() {
    if (!texto.trim()) return;
    const t = texto;
    setTexto("");
    await enviarMensaje(partido.id, user.uid, profile.nombre, t);
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-bg max-w-[480px] mx-auto z-50">      {/* Cabecera */}
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(20,30,50,0.08)] bg-white">
        <button onClick={onBack} className="text-2xl text-txt-2">
          <i className="ti ti-arrow-left"></i>
        </button>
        <div>
          <div className="font-semibold text-ink">{rival}</div>
          <div className="text-xs text-green-600">Partido {partido.estado}</div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
        {mensajes.length === 0 && (
          <p className="text-center text-txt-3 text-sm mt-6">
            Aún no hay mensajes. ¡Saluda y cuadrad el partido!
          </p>
        )}
        {mensajes.map((m) => {
          const mio = m.autorUid === user.uid;
          return (
            <div
              key={m.id}
              className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${
                mio
                  ? "bg-acid text-white self-end rounded-br-md"
                  : "bg-white border border-[rgba(20,30,50,0.08)] text-ink self-start rounded-bl-md"
              }`}
            >
              {m.texto}
            </div>
          );
        })}
        <div ref={finRef} />
      </div>

      {/* Caja de escribir */}
      <div className="flex gap-2.5 p-3.5 border-t border-[rgba(20,30,50,0.08)] bg-white items-center">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-bg border border-[rgba(20,30,50,0.08)] rounded-xl px-4 py-3 text-sm outline-none focus:border-acid"
        />
        <button
          onClick={enviar}
          className="w-11 h-11 rounded-xl bg-acid text-white text-xl flex items-center justify-center active:scale-95 transition"
        >
          <i className="ti ti-arrow-up"></i>
        </button>
      </div>
    </div>
  );
}