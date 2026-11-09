import { createClient } from '@supabase/supabase-js';

// Vercel leerá estas variables automáticamente (las configuraremos después)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { codigo } = req.query;

  if (!codigo) {
    return res.status(400).json({ status: "error", message: "Falta el código" });
  }

  // 1. Buscar el código en la base de datos
  const { data, error } = await supabase
    .from('licencias')
    .select('usado')
    .eq('codigo', codigo)
    .single();

  // Si no existe el código, rechazar
  if (error || !data) {
    return res.status(404).json({ status: "error", message: "Código inválido" });
  }

  // Si ya está usado, rechazar
  if (data.usado === true) {
    return res.status(403).json({ status: "error", message: "Este código ya está en uso" });
  }

  // 2. Si está libre, lo marcamos como usado
  await supabase
    .from('licencias')
    .update({ usado: true })
    .eq('codigo', codigo);

  // 3. Damos luz verde
  return res.status(200).json({ status: "success", message: "Licencia activada" });
}
