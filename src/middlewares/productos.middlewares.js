const {Producto} = require("../models/Producto")
const mongoose = require("mongoose");
const { imagenSchema } = require("../models/Producto");

const validarIdDeProducto = async (req, res, next) => {
    try {
        const {idProducto} = req.params

        //Es el select por ID de mongo
        const producto = await Producto.findById(idProducto).select("-createdAt -updatedAt -__v")

        if (!producto) {
            res.status(404).json({message: `El id: ${idProducto} no existe`})
        }

        req.producto = producto

        next()
    } catch (error) {
        res.status(500).json({message: `Error a la hora de obtener producto por id: ${error.message}`})
    } 
}

const validarSchemaProducto = async (req, res, next) => {
    try {
        // 1. Creamos la instancia (pero no se guarda en BD todavía)
        const nuevoProducto = new Producto(req.body);
        
        // 2. Validamos contra el Schema de Mongoose
        await nuevoProducto.validate();
        
        // 3. Si llega hasta acá, es porque es válido. 
        // Se lo pasamos al siguiente middleware/controlador
        req.productoValidado = nuevoProducto;
        next();
    } catch (error) {
        // Si falla la validación, respondemos acá mismo
        res.status(400).json({ message: "Datos inválidos", details: error.message });
    }
};

const validarIdImagen = async (req, res, next) => {
    try {
        const producto = req.producto
        const {idImagen} = req.params

        console.log("id img", idImagen)
        console.log("produc", producto)

        const existeImagenId = producto.imagenes.some(img => img._id.toString() === idImagen)

        if (!existeImagenId) {
            return res.status(404).json({ message: "Imagen no encontrada para este producto"});
        }

        next();
    } catch (error) {
        res.status(500).json({ message: `Error a la hora de validar la imagen ${error.message}` });
    }
};



const validarSchemaImagen = async (req, res, next) => {
    try {
        // 1. Usamos el esquema exportado para crear un modelo temporal.
        // Si 'Imagen' ya existe en mongoose.models, lo usa; si no, lo crea.
        const Imagen = mongoose.models.Imagen || mongoose.model("Imagen", imagenSchema);
        
        // 2. Ahora sí podemos instanciarlo porque es un modelo real
        const nuevaImagen = new Imagen(req.body);
        
        // 3. Validamos
        await nuevaImagen.validate();
        
        req.imagenValidada = nuevaImagen;
        next();
    } catch (error) {
        return res.status(400).json({ 
            message: "Datos de imagen inválidos", 
            details: error.message 
        });
    }
};

module.exports = {
    validarIdDeProducto,
    validarSchemaProducto,
    validarIdImagen,
    validarSchemaImagen
}