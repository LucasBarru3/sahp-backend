# 🚗 Vehicles API Backend

Backend REST API desarrollado con Node.js, MySQL y desplegado en Vercel.

Este proyecto permite gestionar vehículos mediante operaciones CRUD, incluyendo autenticación con token JWT y registro de logs de acciones realizadas por usuarios.

---

# 📦 Tecnologías usadas

- Node.js
- MySQL
- Vercel Serverless Functions
- mysql2
- JWT Authentication
- CORS

---

# 📁 Estructura del proyecto

```bash
project/
│
├── api/
│   ├── vehicles.js
│   └── middleware/
│       └── auth.js
│
├── db.js
├── package.json
└── vercel.json
```

---

# ⚙️ Variables de entorno

Crear un archivo `.env` en desarrollo local:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tu_database
DB_PORT=3306

JWT_SECRET=tu_secreto
```

En Vercel debes añadirlas en:

```bash
Project Settings → Environment Variables
```

---

# 🗄️ Base de datos

## Tabla `vehicles`

```sql
CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255),
  image_url TEXT,
  class_id INT,
  follow_class BOOLEAN,
  tuned BOOLEAN,
  note TEXT
);
```

---

## Tabla `logs`

```sql
CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipe VARCHAR(100),
  action VARCHAR(100),
  data JSON,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 🔌 Conexión MySQL

Archivo `db.js`:

```js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5
});

module.exports = pool;
```

---

# 🚀 Endpoints

## Obtener todos los vehículos

```http
GET /api/vehicles
```

---

## Obtener vehículos por clase

```http
GET /api/vehicles?classId=1
```

---

## Crear vehículo

```http
POST /api/vehicles
```

### Headers

```http
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Body

```json
{
  "name": "Skyline",
  "model": "R34",
  "image_url": "https://...",
  "class_id": 1,
  "follow_class": true,
  "tuned": false,
  "note": "Vehículo JDM"
}
```

---

## Actualizar vehículo

```http
PUT /api/vehicles
```

### Body

```json
{
  "id": 1,
  "name": "Skyline",
  "model": "R34 V-Spec",
  "image_url": "https://...",
  "class_id": 1,
  "follow_class": true,
  "tuned": true,
  "note": "Actualizado"
}
```

---

## Eliminar vehículo

```http
DELETE /api/vehicles
```

### Body

```json
{
  "vehicle": {
    "id": 1
  }
}
```

---

# 🔐 Autenticación

Las rutas:

- POST
- PUT
- DELETE

requieren token JWT válido.

Ejemplo:

```http
Authorization: Bearer TU_TOKEN
```

---

# 🛡️ CORS

El backend incluye middleware CORS compatible con frontend desplegado en Vercel.

Actualmente:

```js
Access-Control-Allow-Origin: *
```

Se recomienda restringirlo en producción:

```js
Access-Control-Allow-Origin: https://tu-frontend.vercel.app
```

---

# ☁️ Deploy en Vercel

## Instalar Vercel CLI

```bash
npm i -g vercel
```

---

## Deploy

```bash
vercel
```

---

## Configuración recomendada `vercel.json`

```json
{
  "version": 2,
  "functions": {
    "api/*.js": {
      "runtime": "@vercel/node"
    }
  }
}
```

---

# 📦 Dependencias

Instalar dependencias:

```bash
npm install
```

Dependencias principales:

```bash
npm install express mysql2 cors jsonwebtoken
```

---

# 📝 Logs

Cada acción CRUD genera un registro automático en la tabla `logs`:

- Creación
- Actualización
- Eliminación

Incluyendo:

- usuario
- datos modificados
- tipo de acción

---

# 📄 Licencia

MIT

---

# 👨‍💻 Autor

Desarrollado por [Lucas García]
