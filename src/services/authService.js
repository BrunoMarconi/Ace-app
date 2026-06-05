import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../firebase";

// Crea el perfil en Firestore si no existe
async function createProfile(user, extra = {}) {
  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();

  const profile = {
    uid: user.uid,
    nombre: extra.nombre || user.displayName || "Jugador",
    email: user.email,
    foto: user.photoURL || null,
    zona: extra.zona || "Málaga",
    nivel: extra.nivel || "Intermedio",
    puntos: 1000,
    partidos: 0,
    victorias: 0,
    disponibilidad: {},
    perfilCompleto: !!extra.zona,   // true si vino con zona (email), false si no (Google)
    creado: serverTimestamp(),
  };
  await setDoc(ref, profile);
  return profile;
}

// Registro con email
export async function registerEmail(email, pass, datos) {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await createProfile(cred.user, datos);
}

// Login con email
export async function loginEmail(email, pass) {
  await signInWithEmailAndPassword(auth, email, pass);
}

// Login / registro con Google
export async function loginGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  await createProfile(result.user, {});
}

// Cerrar sesión
export function logout() {
  return signOut(auth);
}

// Traducir errores de Firebase a español claro
export function traducirError(code) {
  const m = {
    "auth/email-already-in-use": "Ese email ya tiene cuenta. Prueba a entrar.",
    "auth/invalid-email": "El email no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "Email o contraseña incorrectos.",
    "auth/user-not-found": "No hay cuenta con ese email.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/popup-closed-by-user": "Has cerrado la ventana de Google.",
  };
  return m[code] || "Error: " + code;
}


// Guardar la disponibilidad del usuario (lista de "día-franja")
export async function guardarDisponibilidad(uid, disponibilidad) {
  await updateDoc(doc(db, "usuarios", uid), {
    disponibilidad: disponibilidad,
  });
}

// Completar el perfil (zona y nivel) tras registro con Google
export async function completarPerfil(uid, zona, nivel) {
  await updateDoc(doc(db, "usuarios", uid), {
    zona,
    nivel,
    perfilCompleto: true,
  });
}