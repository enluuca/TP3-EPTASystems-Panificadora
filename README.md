# La Espiga de Oro S.R.L. - Sistema de Gestión Centralizado

Trabajo Práctico Integrador para la materia **Desarrollo de Sistemas Web (Back End)** **IFTS N°29** | Instituto de Formación Técnica Superior  
**Grupo Desarrollador:** EPTASystems  
**Integrantes:** Pablo Off, Enzo Giangreco  

---

##  Descripción del Proyecto
Este proyecto consiste en un ecosistema digital de gestión centralizada para pedidos, catálogo de productos y nómina de clientes (sucursales) de la panificadora industrial **La Espiga de Oro S.R.L.** El software está construido bajo el patrón arquitectónico **MVC (Modelo-Vista-Controlador)**, garantizando una separación limpia entre la lógica de datos, las reglas de negocio y la interfaz de usuario.

---

##  Tecnologías Utilizadas
* **Entorno de Ejecución:** Node.js
* **Framework Backend:** Express.js
* **Base de Datos NoSQL:** MongoDB Atlas (Persistencia en la nube)
* **Modelado de Datos:** Mongoose ODM
* **Motor de Plantillas:** Pug (Vistas dinámicas, responsivas y modulares)
* **Seguridad y Sesiones:** Bcrypt (Hasheo de claves), Express-Session y Connect-Mongo (Sesiones en BD)

---

##  Novedades de Arquitectura y Seguridad (Cierre del Proyecto)

Para esta última etapa evolutiva, transformamos el sistema en una plataforma robusta, segura y de nivel profesional, implementando los siguientes hitos de ingeniería de software:

### 1. Control de Accesos Basado en Roles (RBAC - Role-Based Access Control)
Diseñamos un sistema de jerarquías para proteger la integridad comercial del negocio:
* **Rol Vendedor:** Acceso estándar. Puede iniciar sesión, visualizar el tablero operativo, consultar el catálogo de artículos y el listado de sucursales. No tiene permisos de escritura.
* **Rol Administrador:** Acceso total. Es el único perfil autorizado para dar de alta nuevos productos en la lista de precios o registrar clientes en el sistema.
* **Middleware de Autorización:** Desarrollamos un interceptor quirúrgico (`permitirRoles`) que valida el rango del usuario antes de resolver peticiones HTTP críticas. Cualquier intento de intrusión forzada por URL es bloqueado devolviendo un código de estado `403 (Acceso Denegado)` mediante una pantalla de error amigable.

### 2. Gestión de Sesiones Persistentes y Seguridad Completa
* **Autenticación con Hasheo:** El registro cifra las contraseñas en MongoDB de forma irreversible utilizando algoritmos de salado (`bcrypt`).
* **Persistencia de Sesión en Base de Datos:** Implementamos `express-session` acoplado nativamente a `connect-mongo`. Las sesiones activas ya no se pierden al reiniciar el servidor backend, sino que se almacenan de manera segura en el clúster, permitiendo auditar usuarios conectados en tiempo real.

### 3. Refactorización Profunda del Flujo CRUD Asíncrono
* **Operaciones No Bloqueantes:** Todos los controladores operan bajo la sintaxis `async/await`.
* **Control de Errores Global (`catchAsync`):** Desarrollamos una utilidad contenedora para capturar excepciones asíncronas de manera centralizada, canalizándolas hacia un middleware especializado de manejo de errores.
* **Manejo de Relaciones:** El listado de pedidos recupera dinámicamente información embebida de las colecciones de clientes y productos mediante operaciones de cruce de datos (`.populate()`).

### 4. Rediseño Visual e Identidad Corporativa (UI/UX)
* Migramos de estilos embebidos HTML elementales a una arquitectura CSS centralizada basada en variables semánticas (`:root`).
* Diseñamos un tablero dinámico de monitoreo de órdenes con **etiquetas de estado cromáticas** (Pendiente, En Producción, Despachado, Entregado).
* Implementamos tablas interactivas con efectos *zebra* al cursor (`hover`) y controles con desborde responsivo (`overflow-x: auto`) para garantizar que el sistema sea utilizable desde dispositivos móviles en la planta de producción.

---

##  Guía de Instalación y Ejecución

Seguí estos pasos para desplegar el entorno de desarrollo local:

### 1. Requisitos Previos
* Tener instalado [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada).
* Acceso a un clúster de MongoDB (Local o MongoDB Atlas en la nube).

### 2. Clonación e Instalación de Dependencias
Abrí una terminal en la carpeta raíz del proyecto e instalá los paquetes requeridos ejecutando:
```bash
npm install

node seed.js

npm run dev