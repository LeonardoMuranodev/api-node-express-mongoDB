// Funcion para conectar con la BD de mongo
const mongoose =require("mongoose")
require("dotenv").config()

const conectarDB = async () => {
    try {
        // Hay que pasarle la URL para conectarse a la BD
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Conexion exitosa a la BD")
    } catch(error) {
        console.error("Error a la hora de conectar con MongoDB: ", error)
    }
}

module.exports = conectarDB