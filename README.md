# Tienda de Perritos

Proyecto fullstack desplegado en **AWS** y **Azure Entra ID**, que integra autenticación híbrida (administradores internos y clientes externos) y comunicación segura entre frontend, backend y base de datos.

---

##  Tecnologías principales
- **Frontend:** React / Nginx / Docker
- **Backend:** Node.js / Express / MySQL
- **Infraestructura:** AWS EC2, API Gateway, Elastic IP
- **Autenticación:** Microsoft Entra ID (Azure)
- **Base de datos:** MySQL (Docker o instancia EC2)

---

##  Clonar el repositorio

git clone https://github.com/<tu_usuario>/<tu_repositorio>.git
cd <tu_repositorio>

Levantar el proyecto localmente
Instala Docker Desktop y asegúrate de que esté corriendo.

Ejecuta:

docker-compose up --build
Accede al frontend en http://localhost:80 y al backend en http://localhost:3001.

 Configuración en AWS
 EC2
Crea dos instancias EC2 (una para frontend y otra para backend).

Asigna Elastic IPs a ambas.

Abre los puertos:

Frontend: 80

Backend: 3001

Sube tus imágenes Docker o usa docker-compose directamente en cada instancia.

API Gateway
Crea un REST API.

Configura las rutas:

/ → apunta al frontend (Elastic IP)

/api/{proxy+} → apunta al backend (Elastic IP)

Crea un Stage llamado prod.

Copia el Invoke URL para usarlo en la configuración de Azure.

 Configuración en Azure Entra ID
🔹 Tenant interno (administradores)
Registra una aplicación SPA.

Configura las URIs de redirección:

Código
https://<api-id>.execute-api.<region>.amazonaws.com/prod
Crea usuarios administradores y habilita MFA (Microsoft Authenticator).

🔹 Tenant externo (clientes)
Registra dos aplicaciones:

SPA Cliente

API Cliente

Configura el flujo Sign-up / Sign-in.

Define los scopes y roles (CLIENTE, ADMIN).

Actualiza los valores en authConfig.js:

javascript
export const msalConfig = {
  auth: {
    clientId: "<CLIENT_ID_SPA>",
    authority: "https://<TENANT>.b2clogin.com/<TENANT>.onmicrosoft.com/<POLICY>",
    redirectUri: "https://<api-id>.execute-api.<region>.amazonaws.com/prod"
  }
};

Base de datos MySQL
Usa Docker o una instancia EC2.

Variables de entorno:

Código
DB_HOST=<ip_backend_o_nombre_contenedor>
DB_PORT=3306
DB_NAME=tienda_perritos
DB_USER=alumno
DB_PASSWORD=alumno123

Variables de entorno (GitHub Actions)
Configura los siguientes Secrets en tu repositorio:

Nombre	Descripción
AWS_ACCESS_KEY_ID	Access key de AWS
AWS_SECRET_ACCESS_KEY	Secret key de AWS
AWS_REGION	Región (ej. us-east-1)
AWS_API_GATEWAY_URL	URL base del API Gateway
AAD_INTERNAL_CLIENT_ID	Client ID app interna
AAD_EXTERNAL_CLIENT_ID	Client ID app externa
AAD_EXTERNAL_AUDIENCE	Application ID URI del backend externo
DB_HOST	Host de la base de datos
DB_USER	Usuario de la base de datos
DB_PASSWORD	Contraseña de la base de datos


Pruebas finales

Accede al frontend desde el Invoke URL de API Gateway.

Inicia sesión con usuario administrador o cliente.

Verifica conexión con backend y base de datos.

Comprueba que las rutas /api/productos y /api/pedidos respondan correctamente.

Resultado
Arquitectura funcional desplegada en AWS y Azure con autenticación híbrida, comunicación segura y base de datos operativa.
