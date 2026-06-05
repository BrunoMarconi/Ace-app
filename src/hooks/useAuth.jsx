import { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar el perfil, con reintentos
  async function cargarPerfil(uid, intentos = 5) {
    for (let i = 0; i < intentos; i++) {
      const snap = await getDoc(doc(db, "usuarios", uid));
      if (snap.exists()) {
        return snap.data();
      }
      // Si no existe todavía (se está creando), espera un poco y reintenta
      await new Promise((r) => setTimeout(r, 400));
    }
    return null;
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await cargarPerfil(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}