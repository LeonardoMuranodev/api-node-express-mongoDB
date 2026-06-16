const {Router} = require("express")

const router = Router()

//Controladores
const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerImagenesDeProducto,
    agregarImagenAProducto,
    eliminarImagenDeProducto
} =  require("../controllers/productos.controllers")

//Middlewares
const {
    validarIdDeProducto,
    validarSchemaProducto,
    validarIdImagen,
    validarSchemaImagen
} =  require("../middlewares/productos.middlewares")

router.get("/", obtenerProductos)
router.get("/:idProducto", validarIdDeProducto, obtenerProductoPorId)
router.post("/", validarSchemaProducto, crearProducto)
router.put("/:idProducto", validarIdDeProducto, actualizarProducto)
router.delete("/:idProducto", validarIdDeProducto, eliminarProducto)

// rutas de imagenes
router.get("/:idProducto/imagenes", validarIdDeProducto, obtenerImagenesDeProducto)
router.post("/:idProducto/imagenes", validarIdDeProducto, validarSchemaImagen, agregarImagenAProducto)
router.delete("/:idProducto/imagenes/:idImagen", validarIdDeProducto, validarIdImagen, eliminarImagenDeProducto)

module.exports = router