import { useState } from "react";
import {
  registerEmail,
  loginEmail,
  loginGoogle,
  traducirError,
} from "../services/authService";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" o "signup"
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [nombre, setNombre] = useState("");
  const [zona, setZona] = useState("Alhaurín de la Torre");
  const [nivel, setNivel] = useState("Avanzado");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!email || !pass) {
      setError("Pon tu email y contraseña.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        if (nombre.trim().length < 2) {
          setError("Pon tu nombre.");
          setLoading(false);
          return;
        }
        await registerEmail(email, pass, { nombre, zona, nivel });
      } else {
        await loginEmail(email, pass);
      }
      // Al entrar, useAuth detecta la sesión y la app cambia de pantalla sola
    } catch (e) {
      setError(traducirError(e.code));
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setError("");
    try {
      await loginGoogle();
    } catch (e) {
      setError(traducirError(e.code));
    }
  }

  const inputClass =
    "w-full bg-white border-[1.5px] border-[rgba(20,30,50,0.08)] rounded-xl p-4 text-[15px] outline-none focus:border-acid transition";

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[480px] px-7 flex flex-col">
        {/* Cabecera */}
        <h1 className="font-archivo font-black text-5xl tracking-tight text-center mt-14 text-ink">
          A<span className="text-acid">c</span>e
        </h1>
        <p className="text-center text-txt-2 text-[15px] mt-1.5 mb-9">
          Tu tenis, al siguiente nivel
        </p>

        {/* Pestañas */}
        <div className="flex bg-card-2 rounded-2xl p-1 mb-6">
          <button
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 font-archivo font-bold text-sm py-3 rounded-xl transition ${
              mode === "login" ? "bg-white text-acid shadow-sm" : "text-txt-2"
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`flex-1 font-archivo font-bold text-sm py-3 rounded-xl transition ${
              mode === "signup" ? "bg-white text-acid shadow-sm" : "text-txt-2"
            }`}
          >
            Crear cuenta
          </button>
        </div>

        {/* Botón Google */}
        <button
          onClick={handleGoogle}
          className="w-full bg-white border-[1.5px] border-[rgba(20,30,50,0.15)] rounded-2xl py-4 font-semibold text-ink flex items-center justify-center gap-2.5 active:scale-[0.98] transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt=""
            className="w-5 h-5"
          />
          Continuar con Google
        </button>

        {/* Separador */}
        <div className="flex items-center gap-3.5 my-5 text-txt-3 text-[13px]">
          <div className="flex-1 h-px bg-[rgba(20,30,50,0.08)]" />
          o con tu email
          <div className="flex-1 h-px bg-[rgba(20,30,50,0.08)]" />
        </div>

        {/* Campos */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-semibold text-txt-2 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@email.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-txt-2 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={inputClass}
            />
          </div>

          {/* Campos solo en registro */}
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-[13px] font-semibold text-txt-2 mb-1.5">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre y apellido"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-txt-2 mb-1.5">
                  Zona
                </label>
                <select
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  className={inputClass}
                >
                  <option>Alhaurín de la Torre</option>
                  <option>Málaga capital</option>
                  <option>Torremolinos</option>
                  <option>Otra (Málaga)</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-txt-2 mb-1.5">
                  Tu nivel
                </label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className={inputClass}
                >
                  <option>Intermedio</option>
                  <option>Avanzado</option>
                  <option>Competición</option>
                </select>
              </div>
            </>
          )}
        </div>

        {/* Botón principal */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-acid text-white font-archivo font-extrabold text-base rounded-2xl py-4 mt-3 active:scale-[0.98] transition disabled:opacity-50"
        >
          {loading
            ? "Un momento..."
            : mode === "signup"
            ? "Crear mi cuenta"
            : "Entrar"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 text-red-600 text-[13.5px]">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
