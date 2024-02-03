const express = require('express');
const router = express.Router();
const userRouter = require('./user.router')
const toDoRouter = require('./toDo.router')

// colocar las rutas aquí
router.use(userRouter)
router.use(toDoRouter)

module.exports = router;