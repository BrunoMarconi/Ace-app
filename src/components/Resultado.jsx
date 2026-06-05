// src/components/Resultado.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { meterResultado } from "../services/matchService";

export default function Resultado({ partido, onBack, onHecho }) {
  const { user, profile } = useAuth();
  const [ganador, setGanador] = useState(null); // "yo" o "rival"
  const [sets, setSets] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Datos del rival
  const rivalUid = partido.retadorUid === user.uid ? partido.rivalUid : partido.retadorUid;
  const rivalNombre = partido.retadorUid === user.uid ? partido.rivalNombre : partido.retadorNombre;

  async function guardar() {
    if (!ganador) { alert("Marca quién ganó."); return; }
    if (!sets.trim()) { alert("Pon el resultado (ej: 6-3, 4-6, 6-2)."); return; }
    setGuardando(true);
    try {
      const ganadorUid = ganador === "yo" ? user.uid : rivalUid;
      const ganadorNombre = ganador === "yo" ? profile.nombre : rivalNombre;
      await meterResultado(partido.id, {
        sets,
        ganadorUid,
        ganadorNombre,
        metidoPor: user.uid,
      });
      onHecho();
    } catch (e) {
      console.error("Error metiendo resultado:", e);
      alert("No se pudo guardar el resultado.");
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-bg max-w-[480px] mx-auto z-50">
      {/* Cabecera */}
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(20,30,50,0.08)] bg-white flex-shrink-0">
        <button onClick={onBack} className="text-2xl text-txt-2">
          <i className="ti ti-arrow-left"></i>
        </button>
        <div className="font-semibold text-ink">Resultado del partido</div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-txt-2 text-sm mb-5">Tú vs {rivalNombre}</p>

        {/* Quién ganó */}
        <p className="text-[11px] font-bold uppercase tracking-wide text-txt-3 mb-3">
          ¿Quién ganó?
        </p>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setGanador("yo")}
            className={`flex-1 rounded-2xl border-[1.5px] p-4 font-archivo font-bold transition ${
              ganador === "yo"
                ? "border-acid bg-acid/10 text-acid-d"
                : "border-[rgba(20,30,50,0.08)] bg-white text-ink"
            }`}
          >
            Gané yo
          </button>
          <button
            onClick={() => setGanador("rival")}
            className={`flex-1 rounded-2xl border-[1.5px] p-4 font-archivo font-bold transition ${
              ganador === "rival"
                ? "border-acid bg-acid/10 text-acid-d"
                : "border-[rgba(20,30,50,0.08)] bg-white text-ink"
            }`}
          >
            Ganó {rivalNombre}
          </button>
        </div>

        {/* Resultado por sets */}
        <p className="text-[11px] font-bold uppercase tracking-wide text-txt-3 mb-3">
          Resultado (sets)
        </p>
        <input
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          placeholder="Ej: 6-3, 4-6, 6-2"
          className="w-full bg-white border-[1.5px] border-[rgba(20,30,50,0.08)] rounded-xl p-4 text-[15px] outline-none focus:border-acid"
        />
        <p className="text-txt-3 text-xs mt-2">
          Escribe los sets separados por comas.
        </p>
      </div>

      {/* Botón guardar */}
      <div className="p-5 flex-shrink-0">
        <button
          onClick={guardar}
          disabled={guardando}
          className="w-full bg-acid text-white font-archivo font-extrabold text-base rounded-2xl py-4 active:scale-[0.98] transition disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Enviar resultado"}
        </button>
        <p className="text-txt-3 text-xs text-center mt-3">
          {rivalNombre} tendrá que confirmar el resultado.
        </p>
      </div>
    </div>
  );
}