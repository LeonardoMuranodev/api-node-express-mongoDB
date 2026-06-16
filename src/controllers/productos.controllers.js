const Producto = require("../models/Producto")

const obtenerProductos = async (req, res) => {
    try {
        /*Es el select de mongo: con el select le uedo decir que campos seleccionar o cuales no, con un guion menos*/
        const productos = await Producto.find().select("-createdAt -updatedAt -__v -_id")

        res.status(200).json({productos})
    } catch (error) {
        res.status(500).json({message: `Error a la hora de obtener productos: ${error.message}`})
    }
}

const obtenerProductoPorId = (req, res) => {
    try {
        //Recibo por middleware el producto, lo pasoa objeto para sacarle el _id
        const producto = req.producto.toObject()

        delete producto._id

        res.status(200).json({producto})
    } catch (error) {
        res.status(500).json({message: `Error a la hora de obtener producto por id: ${error.message}`})
    }
}

const crearProducto = async (req, res) => {
    try {
        const producto = req.productoValidado

        await producto.save()

        res.status(201).json({message: "El producto ha sido creado con exito!"})
    } catch (error) {
        res.status(500).json({message: `Error a la hora de crear producto: ${error.message}`})
    }
}

const actualizarProducto = async (req, res) => {
    try {
        //Recibo por middleware el producto
        const {_id} = req.producto 

        //id a actualizar, nuevos campos, opciones extras
        await Producto.findByIdAndUpdate(_id, req.body, {
            new: true, // me devuelve el producto actualizado
            runValidators: true // validador de schema
        })

        res.status(200).json({message: `Producto con id: ${_id}  actualizado con exito`})
    } catch (error) {
        res.status(500).json({message: `Error a la hora de actualizar producto por id: ${error.message}`})
    }
}

const eliminarProducto = async (req, res) => {
    try {
        //Recibo por middleware el producto
        const {_id} = req.producto 

        await Producto.findByIdAndDelete(_id)

        res.status(200).json({message: `Producto con id: ${_id}  eliminado con exito`})
    } catch (error) {
        res.status(500).json({message: `Error a la hora de eliminar producto por id: ${error.message}`})
    }
}

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}