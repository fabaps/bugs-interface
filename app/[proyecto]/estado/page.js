import { notFound } from "next/navigation";
import { getProyecto } from "@/lib/proyectos";
import { createAdminClient } from "@/lib/supabase/admin";
import EstadoView from "./EstadoView";

export async function generateMetadata({ params }) {
  const { proyecto: proyectoId } = await params;
  const proyecto = getProyecto(proyectoId);
  return { title: proyecto ? `Estado — ${proyecto.nombre}` : "Estado" };
}

// Vista pública de solo lectura: los datos se leen en el servidor con la
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

  return <EstadoView proyecto={proyecto} reportes={reportes ?? []} />;
}
