export const PROYECTOS = [
  { id: "mystylecases", nombre: "MyStyleCases", ico: "🛍️", logo: "/mystylecases-logo.avif" },
  { id: "liga-cancer", nombre: "Liga Nacional Contra el Cáncer", ico: "🎗️", logo: "/incanlogo.png" },
  { id: "tennis", nombre: "Guatemalan Tennis League", ico: "🎾", logo: "/logo_gtl.jpg" },
  { id: "crm", nombre: "CRM", ico: "📇", logo: "/rebeldezk-logo.png" },
  { id: "campus-adep", nombre: "Campus ADEP", ico: "🎓", logo: "/campus-logo.png" },
  // Clientes de redes sociales: piden tareas (posts, pautas, leads, web),
  // no bugs de un sistema, así que ese tipo se oculta para ellos.
  { id: "mm", nombre: "M+M", ico: "📣", sinBugs: true },
  { id: "del-atlantico", nombre: "Del Atlántico", ico: "🌊", sinBugs: true },
];

export function getProyecto(id) {
  return PROYECTOS.find((p) => p.id === id) ?? null;
}

export const TIPOS = [
  { id: "bug", label: "Bugs", emoji: "🐞" },
  { id: "mejora", label: "Mejoras del sistema", emoji: "✨" },
  { id: "recomendacion", label: "Cambios Personalizados", emoji: "💡" },
];

export function tiposDe(proyecto) {
  return proyecto?.sinBugs ? TIPOS.filter((t) => t.id !== "bug") : TIPOS;
}

export const DESC_LABEL = {
  mejora: "¿Qué te gustaría mejorar?",
  recomendacion: "¿Qué cambio personalizado necesitas?",
};
