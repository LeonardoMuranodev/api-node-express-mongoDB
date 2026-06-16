const Categoria = require("../models/Categoria");

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find().select("-createdAt -updatedAt -__v -_id")
        
        res.status(200).json(categorias)

    } catch (error) {
        res.status(500).json({message: `Error a la hora de obtener las categorias: ${error.message}`})
    } 
}

const obtenerCategoriaPorId = async (req, res) => {
    try {
        const categoria = req.categoria.toObject()

        delete categoria._id
        
        res.status(200).json(categoria)

    } catch (error) {
        res.status(500).json({message: `Error a la hora de obtener categoria por id: ${error.message}`})
    } 
}

const crearCategoria = async (req, res) => {
    try {
        const categoria = req.categoriaValidada

        await Categoria.create(req.body)

        res.status(200).json({message: `La categoria ${categoria.nombre} ha sido creada con exito`})

    } catch (error) {
        res.status(500).json({message: `Error a la hora de crear una categoria: ${error.message}`})
    } 
}

const actualizarCategoria = async (req, res) => {
    try {
        const {_id} = req.categoria

        await Categoria.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({message: `Categoria con ${_id} ha sido creada con exito`})

    } catch (error) {
        res.status(500).json({message: `Error a la hora de crear una categoria: ${error.message}`})
    } 
}

const eliminarCategoria = async (req, res) => {
    try {
        const {_id} = req.categoria

        await Categoria.findByIdAndDelete(_id)

        res.status(200).json({message: `Categoria con ${_id} ha sido eliminada con exito`})

    } catch (error) {
        res.status(500).json({message: `Error a la hora de crear una categoria: ${error.message}`})
    } 
}

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}