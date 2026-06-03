const {Router} = require("express")

const router = Router()

//Controladores
const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} =  require("../controllers/productos.controllers")

//Middlewares
const {
    validarIdDeProducto,
} =  require("../middlewares/productos.middlewares")

router.get("/", obtenerProductos)
router.get("/:idProducto", validarIdDeProducto, obtenerProductoPorId)
router.post("/", crearProducto)
router.put("/:idProducto", validarIdDeProducto, actualizarProducto)
router.delete("/:idProducto", validarIdDeProducto, eliminarProducto)


module.exports = router