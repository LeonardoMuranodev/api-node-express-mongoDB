### 1. Conceptos Básicos: MongoDB y Mongoose

A diferencia de SQL, en MongoDB no tenemos "Tablas" ni "Filas", sino **"Colecciones"** (Collections) y **"Documentos"** (Documents). MongoDB guarda la información en formato JSON (BSON, técnicamente), lo que lo hace muy flexible.
Sin embargo, para que nuestra aplicación no sea un caos y los datos tengan reglas, utilizamos **Mongoose**. Mongoose es una librería que actúa como intermediario (ODM) y nos permite definir "Schemas" (esquemas) rígidos para validar los datos antes de guardarlos en Mongo.

### 2. Conexión a la Base de Datos (`config/db.js`)

El primer paso en tu código es establecer la comunicación con el servidor de MongoDB.

* Mongoose se utiliza para conectar con la base de datos de MongoDB mediante el método asíncrono `mongoose.connect()`.


* Se le pasa como argumento la URL de conexión obtenida de las variables de entorno usando `process.env.MONGO_URI`.


* Esta conexión se realiza dentro de un bloque `try...catch` para capturar e imprimir en consola cualquier error de conexión con MongoDB.



---

### 3. El Schema y el Modelo (`models/Producto.js`)

Aquí es donde definimos las reglas de nuestra colección de productos usando Mongoose.

* Un esquema se crea instanciando `new mongoose.Schema({ ... })`, lo que define la estructura rígida que deben seguir los documentos.


* Se definen campos específicos como `nombre`, `descripcion`, `precio`, `stock` y `categoria`, especificando explícitamente su tipo de dato (como `String` o `Number`).


* Se incluyen validaciones personalizadas pasando un array con el valor y el mensaje de error, como por ejemplo `required: [true, "Nombre es requerido"]`.


* Para los datos numéricos (`precio` y `stock`), se utiliza la validación `min: [0, "El precio no puede ser negativo"]` para evitar que se guarden valores bajo cero.


* La propiedad `trim: true` se aplica a los strings para limpiar automáticamente los espacios en blanco sobrantes a los lados.


* Como segundo parámetro del esquema se configuran opciones extra: `timestamp: true` para crear automáticamente las fechas de creación/actualización, y `strict: true` para ser rígido con el esquema y que Mongoose ignore campos adicionales enviados por el usuario.


* Finalmente, se crea y se exporta el modelo funcional utilizando `mongoose.model("Producto", productoSchema)`.



---

### 4. El Middleware de Validación (`middlewares/productos.middlewares.js`)

Para evitar repetir código en las rutas de obtener uno, actualizar y eliminar, creaste un middleware que busca si el ID es válido en la base de datos.

* El middleware extrae el parámetro `idProducto` y busca el documento en la base de datos usando el método `Producto.findById(idProducto)`.


* Utiliza el método de Mongoose `.select("-createdAt -updatedAt -__v")` para indicarle a la base de datos que excluya específicamente esos tres campos de los resultados devueltos.


* Si el producto buscado no existe, interrumpe la petición y responde con un código de estado 404.


* Si el producto existe, lo guarda en la propiedad `req.producto` y ejecuta `next()` para que el controlador pueda usar esa información.



---

### 5. Los Controladores CRUD (`controllers/productos.controllers.js`)

Aquí reside la lógica de negocio, haciendo uso de los métodos predefinidos del modelo de Mongoose.

* **Obtener todos los productos:** El método `obtenerProductos` utiliza `Producto.find()` para traer todos los documentos y le encadena `.select("-createdAt -updatedAt -__v -_id")` para filtrar y no devolver esos campos al cliente.


* **Obtener un producto:** El método `obtenerProductoPorId` toma el producto del objeto `req` y lo convierte a un objeto puro de JavaScript utilizando `req.producto.toObject()`. Luego, elimina manualmente el ID con `delete producto._id` antes de enviar la respuesta.


* **Crear un producto:** La función `crearProducto` utiliza directamente `Producto.create(req.body)` para insertar un nuevo documento en la base de datos.


* **Actualizar un producto:** Se utiliza el método `Producto.findByIdAndUpdate(_id, req.body, opciones)`. A este método se le pasa un objeto de opciones con `new: true` para que devuelva el documento con los datos nuevos, y `runValidator: true` (nota: en Mongoose suele ser *runValidators* con 's') para forzar que el esquema vuelva a validar los datos durante la actualización.


* **Eliminar un producto:** La función `eliminarProducto` borra permanentemente el documento de la base de datos invocando el método `Producto.findByIdAndDelete(_id)`.



---

### 6. Las Rutas (`routes/productos.routes.js`)

Finalmente, el enrutador orquesta todo este código.

* Se importa el `Router` de Express y se vinculan las distintas rutas (`GET`, `POST`, `PUT`, `DELETE`) con las funciones importadas del controlador.


* En las rutas que requieren un ID específico (`/:idProducto`), se inyecta el middleware `validarIdDeProducto` justo antes del controlador correspondiente para asegurar que la acción solo proceda si el producto existe.

### 1. No es un JSON, es una "Instancia de Modelo"

Cuando Mongoose hace una consulta como `findById` y te devuelve un documento, no te está entregando un simple objeto JSON plano. Te está entregando una **instancia del modelo de Mongoose**.

Ese objeto es "pesado": tiene un montón de métodos internos, funciones para guardar cambios en la base de datos, *getters*, *setters* y metadatos de MongoDB. Si intentás borrar una propiedad directamente sobre ese objeto (como el `_id`), a veces no funciona como esperás porque Mongoose está "vigilando" el objeto.

### 2. Por qué el `.toObject()`

Al llamar a `req.producto.toObject()`, le estás pidiendo a Mongoose que extraiga **solo los datos** y los transforme en un objeto plano de JavaScript (un objeto "de toda la vida", sin poderes especiales de base de datos).

Esto tiene dos beneficios:

* **Flexibilidad:** Ahora el objeto es un JSON estándar que podés modificar a tu gusto (agregarle, cambiarle o borrarle cosas) sin que Mongoose intente corregirte o reinsertar propiedades.
* **Limpieza:** Podés borrar campos internos que no querés mostrarle al usuario final (como el `_id` de Mongo o el `__v` de versión).



### 3. Por qué el `delete producto._id`

Tal como pusiste en el comentario de tu código: *"lo paso a objeto para sacarle el _id"*.
Esto es **seguridad y limpieza**:

* A veces no querés que el frontend sepa cuál es el ID interno que usa MongoDB, o simplemente querés que el JSON que recibe el cliente sea lo más limpio posible.
* Al tener un objeto plano (gracias a `toObject`), podés usar la palabra reservada `delete` de JavaScript para quitar esa propiedad de forma segura antes de enviar la respuesta.



**En resumen:**
Si no hicieras el `toObject()`, estarías enviando un objeto lleno de métodos y funciones internas de Mongoose que el cliente (el frontend o Postman) no necesita. Convertirlo a objeto plano te permite **presentar solo la información de negocio** (nombre, precio, stock) y ocultar los detalles técnicos de tu base de datos.