const mongoose = require("mongoose")

// El segudno parametro de un nuevo schema es un objeto con configuraciones, en este caso que tenga los campos por defecto de tiempo


const categoriaSchema = new mongoose.Schema({
    nombre: {
        required: [true, "EL nombre de la categorria es obligatorio"],
        trim: true,
        type: String
    },
    descripcion: {
        trim: true,
        type: String
    }
    }, {
        timestamps: true
    }
)

const Categoria = mongoose.model("Categoria", categoriaSchema)

module.exports = Categoria