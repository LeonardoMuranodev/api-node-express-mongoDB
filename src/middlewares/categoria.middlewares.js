const Categoria = require("../models/Categoria")

console.log("¿Qué es Categoria?:", Categoria); 
const validarIdDeCategoria = async (req, res, next) => {
    try {
        const {idCategoria} = req.params

        //Es el select por ID de mongo
        const categoria = await Categoria.findById(idCategoria).select("-createdAt -updatedAt -__v")

        if (!categoria) {
            res.status(404).json({message: `El id: ${idCategoria} no existe`})
        }

        req.categoria = categoria

        next()
    } catch (error) {
        res.status(500).json({message: `Error a la hora de obtener el id de la categoria: ${error.message}`})
    } 
}

const validarSchemaCategoria = async (req, res, next) => {
    try {
        const nuevaCategoria = new Categoria(req.body)

        
        await nuevaCategoria.validate()

        req.categoriaValidada = nuevaCategoria

        next()
    } catch(error) {
        return res.status(400).json({ message: "Datos inválidos", details: error.message })
    }
}

module.exports = {
    validarIdDeCategoria,
    validarSchemaCategoria
}