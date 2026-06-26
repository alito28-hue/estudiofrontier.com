const { Resend } = require('resend');

// TEMP: onboarding@resend.dev (Resend's shared test sender) can only deliver
// to the Resend account's own address until estudiofrontier.com is verified
// as a domain in Resend. Switch back to cristian@estudiofrontier.com once
// that's done — see README.md "Formulario de contacto".
const TO_EMAIL = 'solutionslearning613@gmail.com';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  const { Nombre, Correo, Empresa, Mensaje } = req.body || {};

  if (!Nombre || !Correo || !Mensaje) {
    return res.status(400).json({ ok: false, error: 'Faltan campos requeridos' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY no está configurada en las variables de entorno');
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el mensaje' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'Estudio Frontier - Ferreiro <onboarding@resend.dev>',
      to: TO_EMAIL,
      reply_to: Correo,
      subject: `Nueva consulta de ${Nombre}`,
      text: `Nombre: ${Nombre}\nCorreo: ${Correo}\nEmpresa: ${Empresa || '-'}\n\nMensaje:\n${Mensaje}`,
    });
    // resend.emails.send() reports API errors (invalid key, unverified domain, etc.)
    // in the returned object instead of throwing — must check it explicitly.
    if (error) {
      console.error(error);
      return res.status(500).json({ ok: false, error: 'No se pudo enviar el mensaje' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'No se pudo enviar el mensaje' });
  }
};
