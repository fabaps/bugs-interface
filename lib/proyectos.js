export const PROYECTOS = [
  { id: "mystylecases", nombre: "MyStyleCases", ico: "🛍️" },
  { id: "liga-cancer", nombre: "Liga Nacional Contra el Cáncer", ico: "🎗️" },
  { id: "tennis", nombre: "Guatemalan Tennis League", ico: "🎾" },
  { id: "crm", nombre: "CRM", ico: "📇" },
];

export function getProyecto(id) {
  return PROYECTOS.find((p) => p.id === id) ?? null;
}

export const TIPOS = [
  { id: "bug", label: "Bugs", emoji: "🐞" },
  { id: "mejora", label: "Mejoras del sistema", emoji: "✨" },
  { id: "recomendacion", label: "Recomendaciones", emoji: "💡" },
];

export const DESC_LABEL = {
  mejora: "¿Qué te gustaría mejorar?",
  recomendacion: "¿Qué nos recomiendas?",
};
