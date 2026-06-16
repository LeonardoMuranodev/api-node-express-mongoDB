const mongoose = require("mongoose")

const imagenSchema = new mongoose.Schema({
    url: {
        required: [true, "La url de la imagen es obligatoria"],
        trim: true,
        type: String,
        match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/, "La URL de la imagen no es válida o el formato no es soportado"]
    },
    descripcion: {
        trim: true,
        type: String
    }
})


// Creacion del esquema
const productoSchema = new mongoose.Schema({
    nombre: {
        type:String,
        /* en vez de mandar solo que es requerido por true, con un array ponemos el mensaje de error personalizado
        
        [valor, mensaje.error]
        */
        required: [true, "Nombre es requerido"],
        trim: true
    },
    descripcion: {
        type:String,
        required: [true, "Descripcion es requerido"],
        trim: true
    },
    precio: {
        type:Number,
        required: [true, "Precio es requerido"],
        min: [0, "El precio no puede ser negativo"]
    },
    stock: {
        type:Number,
        required: [true, "Stock es requerido"],
        min: [0, "El Stock no puede ser negativo"]
    },
    imagenes: [imagenSchema]
}, {
    timestamp: true, // createdAt y updatedAt
    strict: true // rigido con el schema proporcionado
})

/*Creacion del modelo a partir del schema: sera rigido es decir, debe tener si o si los campos, si tiene demas los ignora, si no los tiene si da error*/
const Producto = mongoose.model("Producto", productoSchema)

module.exports = {
    Producto,
    imagenSchema
}