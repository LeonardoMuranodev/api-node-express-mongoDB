const express = require("express");
const router = express.Router();

const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} = require("../controllers/categoria.controllers");

const { validarIdDeCategoria, validarSchemaCategoria } = require("../middlewares/categoria.middlewares")

router.get("/", obtenerCategorias);
router.get("/:idCategoria", validarIdDeCategoria, obtenerCategoriaPorId);
router.post("/", validarSchemaCategoria, crearCategoria);
router.put("/:idCategoria", validarIdDeCategoria, actualizarCategoria);
router.delete("/:idCategoria", validarIdDeCategoria, eliminarCategoria);

module.exports = router;