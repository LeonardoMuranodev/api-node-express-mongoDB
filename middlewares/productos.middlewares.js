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

module.exports = {
    validarIdDeProducto
}