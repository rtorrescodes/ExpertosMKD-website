# Expertos MKD - Website

Plataforma principal de Expertos MKD, refactorizada desde cero utilizando las tecnologías web más modernas para máxima velocidad, optimización SEO y automatización de procesos comerciales.

## 🚀 Arquitectura y Tecnologías

El sitio web está construido bajo una arquitectura **Serverless / Cloud-Native**:
- **Framework:** Next.js (App Router)
- **Estilos:** Tailwind CSS
- **Base de Datos:** PostgreSQL en **Supabase** (vía Connection Pooler / Transaction Mode `6543`)
- **ORM:** Prisma Client (v6.19.3)
- **Autenticación:** Supabase SSR (Manejo por Cookies para SSR y Middlewares)
- **Infraestructura:** Google Cloud Run (Container Docker optimizado en formato Standalone)
- **Correo transaccional:** Titan SMTP a través de Nodemailer

## 💻 Desarrollo Local

Para correr este proyecto en tu máquina necesitas Node.js (v20+ recomendado):

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus variables de entorno creando un archivo `.env`:
   ```env
   # Transaction Pooler (puerto 6543) - Usado por la aplicación en ejecución
   DATABASE_URL="postgresql://postgres.USER:PASS@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
   # Session Pooler (puerto 5432) - Usado exclusivamente para migraciones (npx prisma migrate dev)
   DIRECT_URL="postgresql://postgres.USER:PASS@aws-1-us-west-2.pooler.supabase.com:5432/postgres"

   NEXT_PUBLIC_SUPABASE_URL="..."
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   
   SMTP_HOST="smtp.titan.email"
   SMTP_PORT="465"
   SMTP_USER="..."
   SMTP_PASS="..."
   SMTP_FROM="..."
   SMTP_TO="..."
   ```
4. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
5. Inicia el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## 🕵️ Privacidad Analítica (Opt-out)

Para evitar inflar los números de analítica web durante las tareas de administración, desarrollo o pruebas de concepto, hemos implementado una herramienta de exclusión.

Para activar tu estado de administrador/desarrollador invisible:
Navega a `/api/opt-out`. 
El sistema inyectará automáticamente una cookie segura `ignore_analytics` de larga duración (10 años). Todo script de marketing dentro de la capa `layout.tsx` (Google Analytics, Meta Pixel, Hotjar, etc.) ignorará tu tráfico.

## 🚢 Despliegue en Producción

El proyecto está configurado para desplegarse mediante Docker a Google Cloud Run (`hosting-zirian`).

```bash
# 1. Compila la imagen y envíala a Google Container Registry
gcloud builds submit --tag gcr.io/hosting-zirian/expertosmkdweb . --project hosting-zirian

# 2. Despliega la imagen en Cloud Run inyectando las variables de entorno
gcloud run deploy expertosmkdweb \
  --image gcr.io/hosting-zirian/expertosmkdweb \
  --project hosting-zirian \
  --region us-central1 \
  --allow-unauthenticated \
  --env-vars-file env.yaml
```

**NOTA:** El archivo `env.yaml` nunca debe subirse al repositorio. Se gestiona localmente y contiene las credenciales en producción. El archivo `.gcloudignore` previene que las credenciales locales suban a Cloud Build.
