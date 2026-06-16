const Producto = require("../models/Producto")


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

module.exports = {
    validarIdDeProducto,
    validarSchemaProducto
}