"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { tiposDe } from "@/lib/proyectos";

const ESTADO_LABEL = { nuevo: "En revisión", revision: "En pruebas", resuelto: "Resuelto" };
const ESTADO_CLASS = { nuevo: "on-new", revision: "on-rev", resuelto: "on-done" };

const FILTROS_BASE = [
  { id: "todos", label: "Todos" },
  { id: "bug", label: "Bugs" },
  { id: "mejora", label: "Mejoras" },
  { id: "recomendacion", label: "Cambios Personalizados" },
  { id: "resueltos", label: "Resueltos" },
  { id: "cronograma", label: "📅 Cronograma" },
];

const TIPO_EMOJI = { bug: "🐞", mejora: "✨", recomendacion: "💡" };
const TIPO_LABEL = { bug: "Bug", mejora: "Mejora", recomendacion: "Cambio Personalizado" };

// Ordena por fecha de entrega (más lejana primero); sin fecha va al final.
function ordenarPorCronograma(items) {
  return [...items].sort((a, b) => {
    if (!a.fecha_entrega && !b.fecha_entrega) return 0;
    if (!a.fecha_entrega) return 1;
    if (!b.fecha_entrega) return -1;
    return b.fecha_entrega.localeCompare(a.fecha_entrega);
  });
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// "YYYY-MM-DD" -> "YYYY-MM"
function mesDe(ymd) {
  return ymd.slice(0, 7);
}

function labelMes(yyyyMm) {
  const [y, m] = yyyyMm.split("-").map(Number);
  return `${MESES[m - 1]} ${y}`;
}

function fmtFecha(iso) {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// fecha_entrega llega como "YYYY-MM-DD"; se arma con componentes locales
// para que no se corra un día por la zona horaria.
function fmtEntrega(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Cuerpo({ r }) {
  if (r.tipo === "bug") {
    return (
      <>
        {r.que_hacia && (
          <>
            <span className="k">Hacía:</span> {r.que_hacia}
            <br />
          </>
        )}
        {r.que_esperaba && (
          <>
            <span className="k">Esperaba:</span> {r.que_esperaba}
            <br />
          </>
        )}
        {r.que_paso && (
          <>
            <span className="k">Pasó:</span> {r.que_paso}
          </>
        )}
      </>
    );
  }
  return (
    <>
      {r.titulo && (
        <>
          <strong>{r.titulo}</strong>
          <br />
        </>
      )}
      {r.descripcion}
    </>
  );
}

export default function EstadoView({ proyecto, reportes }) {
  const TIPOS = tiposDe(proyecto);
  const FILTROS = proyecto.sinBugs
    ? FILTROS_BASE.filter((f) => f.id !== "bug")
    : FILTROS_BASE;

  const [filtro, setFiltro] = useState("todos");
  const [mes, setMes] = useState("todos");

  function renderCard(r, { showTipo = false, entregaTag = false } = {}) {
    return (
      <div className={`report b-${r.tipo}`} key={r.id}>
        <div className="top">
          {showTipo && (
            <span className="tipobadge">
              {TIPO_EMOJI[r.tipo]} {TIPO_LABEL[r.tipo]}
            </span>
          )}
          <span className={`pbadge p-${r.prioridad}`}>P{r.prioridad}</span>
        </div>
        <div className="desc">
          <Cuerpo r={r} />
        </div>
        <div className="metaline">
          <span>👤 {r.nombre}</span>
          <span>🕐 Creado: {fmtFecha(r.created_at)}</span>
          {entregaTag && r.fecha_entrega ? (
            <span className="entregatag">📅 Entrega: {fmtEntrega(r.fecha_entrega)}</span>
          ) : (
            <span>
              📅 Entrega:{" "}
              {r.fecha_entrega ? fmtEntrega(r.fecha_entrega) : "pendiente"}
            </span>
          )}
        </div>
        <div className="statusrow">
          <span className={`pill ${ESTADO_CLASS[r.estado]}`}>
            {ESTADO_LABEL[r.estado]}
          </span>
        </div>
      </div>
    );
  }

  function renderGrupo(titulo, items, key) {
    return (
      <div className="group" key={key}>
        <h2>
          {titulo} <span className="cnt">{items.length}</span>
        </h2>
        {items.length === 0 ? (
          <div className="empty">Nada por aquí todavía.</div>
        ) : (
          items.map(renderCard)
        )}
      </div>
    );
  }

  const resueltos = reportes.filter((r) => r.estado === "resuelto");

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <span className={`mark${proyecto.logo ? " haslogo" : ""}`}>
            {proyecto.logo ? (
              <Image src={proyecto.logo} alt={proyecto.nombre} width={34} height={34} priority />
            ) : (
              proyecto.ico
            )}
          </span>
          <div>
            <div className="who">{proyecto.nombre}</div>
            <div className="by">Soporte por RebelCoderz</div>
          </div>
        </div>
        <div className="tabs">
          <Link href={`/${proyecto.id}`}>Reportar</Link>
          <button className="active">Panel</button>
        </div>
      </div>

      <h1>Estado de tus reportes</h1>
      <p className="lead">
        Aquí puedes ver cómo va cada reporte. Esta vista es solo de lectura.
      </p>

      <div className="filters">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            className={filtro === f.id ? "active" : ""}
            onClick={() => setFiltro(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtro === "todos" &&
        TIPOS.map((tp) =>
          renderGrupo(
            `${tp.emoji} ${tp.label}`,
            reportes.filter((r) => r.tipo === tp.id && r.estado !== "resuelto"),
            tp.id
          )
        )}
      {filtro === "todos" && renderGrupo("✅ Resueltos", resueltos, "resueltos")}

      {filtro !== "todos" &&
        filtro !== "resueltos" &&
        filtro !== "cronograma" &&
        (() => {
          const tp = TIPOS.find((t) => t.id === filtro);
          return renderGrupo(
            `${tp.emoji} ${tp.label}`,
            reportes.filter((r) => r.tipo === tp.id && r.estado !== "resuelto"),
            tp.id
          );
        })()}

      {filtro === "resueltos" && renderGrupo("✅ Resueltos", resueltos, "resueltos")}

      {filtro === "cronograma" &&
        (() => {
          const mesesDisponibles = [
            ...new Set(
              reportes.filter((r) => r.fecha_entrega).map((r) => mesDe(r.fecha_entrega))
            ),
          ].sort();

          const items = ordenarPorCronograma(
            mes === "todos"
              ? reportes
              : reportes.filter((r) => r.fecha_entrega && mesDe(r.fecha_entrega) === mes)
          );

          return (
            <div className="group">
              <h2>
                📅 Cronograma <span className="cnt">{items.length}</span>
              </h2>
              <p className="lead" style={{ marginTop: "-6px", marginBottom: "10px" }}>
                Ordenado por fecha de entrega, del más lejano al más próximo.
              </p>
              <div className="field" style={{ maxWidth: "260px" }}>
                <label>Filtrar por mes de entrega</label>
                <select className="f" value={mes} onChange={(e) => setMes(e.target.value)}>
                  <option value="todos">Todos los meses</option>
                  {mesesDisponibles.map((m) => (
                    <option key={m} value={m}>
                      {labelMes(m)}
                    </option>
                  ))}
                </select>
              </div>
              {items.length === 0 ? (
                <div className="empty">Nada por aquí todavía.</div>
              ) : (
                (() => {
                  const conFecha = items.filter((r) => r.fecha_entrega);
                  const sinFecha = items.filter((r) => !r.fecha_entrega);
                  return (
                    <>
                      {conFecha.length > 0 && (
                        <div className="timeline">
                          {conFecha.map((r) => (
                            <div className="timeline-item" key={r.id}>
                              <div className="timeline-rail">
                                <div className="timeline-dot" />
                                <div className="timeline-line" />
                              </div>
                              {renderCard(r, { showTipo: true, entregaTag: true })}
                            </div>
                          ))}
                        </div>
                      )}
                      {sinFecha.length > 0 && (
                        <>
                          <p className="lead" style={{ fontSize: "13px", margin: "6px 0" }}>
                            Sin fecha asignada
                          </p>
                          {sinFecha.map((r) => renderCard(r, { showTipo: true }))}
                        </>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          );
        })()}

      <p className="footlink">
        <Link href="/login">🔒 Equipo RebelCoderz</Link>
      </p>
    </div>
  );
}
