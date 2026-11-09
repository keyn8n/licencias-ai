import { createClient } from '@supabase/supabase-js';

// Vercel leerá estas variables automáticamente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { pass } = req.query;

  // 1. Contraseña secreta (Cámbiala por la que tú quieras)
  if (pass !== 'MiClaveSecretaParaCrearLicencias123') {
    return res.status(401).json({ error: 'No autorizado. Contraseña incorrecta.' });
  }

  // 2. Generar un código aleatorio (Ej: PRO-8F9A2B)
  const codigoAleatorio = 'PRO-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  // 3. Guardarlo en Supabase como NO USADO
  const { data, error } = await supabase
    .from('licencias')
    .insert([{ codigo: codigoAleatorio, usado: false }]);

  if (error) {
    return res.status(500).json({ error: 'Error al guardar en la base de datos', detalle: error.message });
  }

  // 4. Devolver el código generado
  return res.status(200).json({ 
    status: 'success', 
    mensaje: 'Licencia creada con éxito',
    codigo: codigoAleatorio 
  });
}
