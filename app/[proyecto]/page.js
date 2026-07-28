import { notFound } from "next/navigation";
import { getProyecto } from "@/lib/proyectos";
import ReportForm from "./ReportForm";

export async function generateMetadata({ params }) {
  const { proyecto: proyectoId } = await params;
  const proyecto = getProyecto(proyectoId);
  return { title: proyecto ? `Reportes — ${proyecto.nombre}` : "Reportes" };
}

export default async function ProyectoPage({ params }) {
  const { proyecto: proyectoId } = await params;
  const proyecto = getProyecto(proyectoId);

  if (!proyecto) notFound();

  return <ReportForm proyecto={proyecto} />;
}
