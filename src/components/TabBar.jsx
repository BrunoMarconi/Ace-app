// src/components/TabBar.jsx
const tabs = [
  { id: "home", label: "Inicio", icon: "ti-home" },
  { id: "buscar", label: "Buscar", icon: "ti-search" },
  { id: "partidos", label: "Partidos", icon: "ti-ball-tennis" },
  { id: "ranking", label: "Ranking", icon: "ti-trophy" },
  { id: "perfil", label: "Perfil", icon: "ti-user" },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[82px] bg-white border-t border-[rgba(20,30,50,0.08)] flex items-start pt-3 z-40 max-w-[480px] mx-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 flex flex-col items-center gap-1 text-[10px] font-semibold transition ${
            active === t.id ? "text-acid" : "text-txt-3"
          }`}
        >
          <i className={`ti ${t.icon} text-[22px]`}></i>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}