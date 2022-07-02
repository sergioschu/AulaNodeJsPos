const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const UserModel = mongoose.model('User');

router.get('/', async (req, res, next) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findOne({ _id: id })
        if (user) {
            res.status(200).json({
                user: user,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/users/" + user._id
                }
            })
        } else {
            res.status(404).json("Usuário não existe!");
        }

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/signup', async (req, res, next) => {
    try {

        let user = new UserModel({});
        user.name = req.body.name;
        user.username = req.body.username;
        user.setPassword(req.body.password);

        const status = await user.save();

        res.status(201).json(status)

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Por favor preencha o usuário e a senha' });
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }

        if (user) {
            return res.json({ token: user.generateJWT() });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;