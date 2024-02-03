const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const encriptedPassword = await bcrypt.hash(password, 10)
    
    const result = await User.create({
        email,
        firstName,
        lastName,
        password: encriptedPassword,
    });
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const result = await User.update(
        { firstName, lastName },
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "invalid cradentials" });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "invalid credentials "});

    const token = jwt.sign(
        { user },
        process.env.SECRET_TOKEN,
        { expiresIn: "1d" },
    );

    return res.json({ user, token });
});

const getLoggedUser = catchError(async(req, res) => {
    const user = req.user;
    return res.json(user);
});

User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
}

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    getLoggedUser
}