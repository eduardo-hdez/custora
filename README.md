# Custora - Plataforma de reservas para PPG

Este repositorio contiene la solucion desarrollada para PPG.

El sistema permite gestionar un catalogo de productos, crear y cancelar reservas, y administrar informacion operativa desde vistas para cliente y empleado.

## Estructura del proyecto

- `project/`: aplicacion principal (Node.js + Express + EJS + JS en cliente).
  - `src/controllers/`: logica de negocio por modulo (auth, productos, carrito, reservas, reportes, etc.).
  - `src/models/`: consultas y acceso a datos.
  - `src/routes/`: definicion de rutas para cliente, empleado y autenticacion.
  - `src/services/`: servicios externos e integraciones (ej. envio de correos).
  - `src/middleware/`: autenticacion, carga de archivos, rate limit y utilidades de request.
  - `src/views/`: vistas EJS para cliente, empleado y parciales.
  - `public/`: archivos estaticos (JS, imagenes, estilos compilados).
  - `src/config/`: configuraciones (ej. Supabase).
- `docs/`: documentos utilizados para entregas de avances y diagramas del proyecto.

## Videos de avances

- Avance 2: [Video](https://drive.google.com/file/d/1HEQ0B_bPZ6IPbqTNl1kHqTGn_jdh68_z/view?usp=drive_link)
- Avance 4: [Video](https://drive.google.com/file/d/1MsWeYEja_-jmKDiQv_VvVTa1L4Id-lAF/view?usp=sharing)
- Avance 5: [Video](https://drive.google.com/file/d/1auohPhZgRX5z_-ilT8NAsym-MrATZncA/view?usp=sharing)

## Cambios post-entrega recomendados para PPG

### **Correo de salida y remitente**

- Ya no se utiliza un correo hardcodeado como destinatario.
- El servicio ahora usa el correo real del usuario (`correo`) recibido en el flujo de reservas.
- Configurar variables de entorno:
  - `RESEND_API_KEY`
- Verificar dominio y remitente en Resend para produccion (evitar usar `onboarding@resend.dev`).
