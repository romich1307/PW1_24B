# Wikipedia - Clon 📚
## Trabajo Final de Programación Web

### 👥 Participantes
- Tania Luz Ayque Puraca
- Romina Giuliana Camargo Hilachoque

### 👩‍🏫 Docente
- Edith Cano

### 📝 Descripción
Proyecto final que implementa un clon de Wikipedia usando Perl CGI, MariaDB, AJAX y Docker.

### ✨ Características
- Registro e inicio de sesión de usuarios
- Crear, leer, actualizar y eliminar artículos
- Soporte para formato Markdown en artículos
- Llamadas asíncronas AJAX para todas las operaciones

### 🔄 Implementación AJAX
El proyecto utiliza AJAX a través de JavaScript (XMLHttpRequest) para:
- Registro de usuarios
- Inicio de sesión
- Crear artículos
- Listar artículos
- Ver artículos
- Editar artículos
- Eliminar artículos

### 📋 Requisitos
- Docker
- Docker Compose

### 🌐 Acceso
- Interfaz Web: `http://localhost:8080`
- Base de datos: `localhost:3309`

### Construir y ejecutar contenedores
```
docker-compose down -v
docker-compose up --build
```
### Conectar al contenedor MariaDB
```
docker-compose exec db bash
mariadb -u alumno -ppweb1 pweb1
```
### Consultas utiles
```
-- Mostrar todas las tablas
SHOW TABLES;

-- Listar usuarios
SELECT * FROM Users;

-- Listar artículos
SELECT * FROM Articles;  
```

### Estructura del Proyecto
```
.
├── cgi-bin/           # Scripts Perl CGI
├── css/              # Hojas de estilo
├── js/               # Archivos JavaScript
├── db/               # Inicialización BD
├── Dockerfile        # Configuración servidor
└── docker-compose.yml # Orquestación
```