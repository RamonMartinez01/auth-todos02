const { getAll, create, getOne, remove, update } = require('../controllers/toDo.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const toDoRouter = express.Router();

toDoRouter.route('/todos')
    .get(verifyJWT, getAll)
    .post(verifyJWT, create);

toDoRouter.route('/todos/:id')
    .get(verifyJWT, getOne)
    .delete(verifyJWT, remove)
    .put(verifyJWT, update);

module.exports = toDoRouter;