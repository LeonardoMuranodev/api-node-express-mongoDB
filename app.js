const express = require("express")
const conectarDB = require("./config/db")
require("dotenv").config()

//Imports routers
const routerProductos = require("./routes/productos.routes")

// Configuraciones globales
const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())

// use de routers
app.use("/productos", routerProductos)

//Conexion con la BD hecha en config
conectarDB()

app.listen(PORT, async () => {
    
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

// ver mongoBD --> http://localhost:8081/