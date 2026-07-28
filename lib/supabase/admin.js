import "server-only";
import { createClient } from "@supabase/supabase-js";

// Usa la service_role key: solo puede ejecutarse en el servidor (Server
// Components, Route Handlers). "server-only" hace que el build falle si
// este archivo se importa por error desde un componente cliente.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}
