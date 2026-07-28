import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProyecto } from "@/lib/proyectos";
import PanelView from "./PanelView";

export async function generateMetadata({ params }) {
  const { proyecto: proyectoId } = await params;
  const proyecto = getProyecto(proyectoId);
  return { title: proyecto ? `Panel — ${proyecto.nombre}` : "Panel" };
}

export default async function PanelProyectoPage({ params }) {
  const { proyecto: proyectoId } = await params;
  const proyecto = getProyecto(proyectoId);
  if (!proyecto) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: reportes } = await supabase
    .from("reportes")
    .select("*")
    .eq("proyecto", proyecto.id)
    .order("created_at", { ascending: false });

  return <PanelView proyecto={proyecto} initialReportes={reportes ?? []} />;
}
