import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.titan.email",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: parseInt(process.env.SMTP_PORT || "465") === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendTenantInvite = async (
  email: string,
  tenantName: string,
  subdomain: string,
  token: string
) => {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  // Asumimos que los tenants se acceden via subdominios
  const loginUrl = `${protocol}://${subdomain}.celeritas.local:3000/auth/verify?token=${token}&email=${email}`;
  // En producción usaríamos el dominio real: `${protocol}://${subdomain}.tudominio.com/...`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>¡Bienvenido a Celeritas!</h2>
      <p>Se ha creado tu nuevo sitio para <strong>${tenantName}</strong>.</p>
      <p>Para activar tu cuenta y configurar tu contraseña permanente, por favor haz clic en el siguiente enlace:</p>
      <div style="margin: 30px 0;">
        <a href="${loginUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Activar mi cuenta
        </a>
      </div>
      <p>O copia y pega este enlace en tu navegador:</p>
      <p style="color: #666; font-size: 14px; word-break: break-all;">
        ${loginUrl}
      </p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
      <p style="color: #888; font-size: 12px;">
        Este enlace expirará en 24 horas. Si no solicitaste esta cuenta, ignora este correo.
      </p>
    </div>
  `;

  return mailer.sendMail({
    from: `"Celeritas" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: `Activa tu cuenta de ${tenantName}`,
    html,
  });
};
