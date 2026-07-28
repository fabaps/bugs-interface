import { notFound } from "next/navigation";
import Link from "next/link";
import { getProyecto, TIPOS } from "@/lib/proyectos";
import { createAdminClient } from "@/lib/supabase/admin";

export async function generateMetadata({ params }) {
  const { proyecto: proyectoId } = await params;
  const proyecto = getProyecto(proyectoId);
  return { title: proyecto ? `Estado — ${proyecto.nombre}` : "Estado" };
}

const ESTADO_LABEL = { nuevo: "Nuevo", revision: "En revisión", resuelto: "Resuelto" };
const ESTADO_CLASS = { nuevo: "on-new", revision: "on-rev", resuelto: "on-done" };

function fmtFecha(iso) {
  return new Date(iso).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
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
  return <>{r.descripcion}</>;
}

// Vista pública de solo lectura: se arma en el servidor con la
// service_role key (nunca llega al navegador), así el cliente ve
// únicamente los reportes de SU proyecto, sin necesitar login y sin
// poder editar nada.
export default async function EstadoPage({ params }) {
  const { proyecto: proyectoId } = await params;
  const proyecto = getProyecto(proyectoId);
  if (!proyecto) notFound();

  const supabase = createAdminClient();
  const { data: reportes } = await supabase
    .from("reportes")
    .select("*")
    .eq("proyecto", proyecto.id)
    .order("created_at", { ascending: false });

  const lista = reportes ?? [];

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="brand">
          <span className="mark">{proyecto.ico}</span>
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

      {TIPOS.map((tp) => {
        const items = lista.filter((r) => r.tipo === tp.id);
        return (
          <div className="group" key={tp.id}>
            <h2>
              {tp.emoji} {tp.label} <span className="cnt">{items.length}</span>
            </h2>
            {items.length === 0 ? (
              <div className="empty">Nada por aquí todavía.</div>
            ) : (
              items.map((r) => (
                <div className={`report b-${r.tipo}`} key={r.id}>
                  <div className="top">
                    <span className={`pbadge p-${r.prioridad}`}>P{r.prioridad}</span>
                  </div>
                  <div className="desc">
                    <Cuerpo r={r} />
                  </div>
                  <div className="metaline">
                    <span>👤 {r.nombre}</span>
                    <span>🕐 {fmtFecha(r.created_at)}</span>
                  </div>
                  <div className="statusrow">
                    <span className={`pill ${ESTADO_CLASS[r.estado]}`}>
                      {ESTADO_LABEL[r.estado]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        );
      })}

      <p className="footlink">
        <Link href="/login">🔒 Equipo RebelCoderz</Link>
      </p>
    </div>
  );
}
