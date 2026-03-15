var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users
router.get('/', async function (req, res, next) {
    try {
        let result = await userModel.find({ isDeleted: false }).populate('role');
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET user by ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findOne({ _id: id, isDeleted: false }).populate('role');
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// POST new user
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel(req.body);
        await newUser.save();
        res.send(newUser);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT update user
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedItem) {
            res.send(updatedItem);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// DELETE user (soft delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (updatedItem) {
            res.send(updatedItem);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// 2) POST /enable - status true if email and username match
router.post('/enable', async function (req, res, next) {
    try {
        const { email, username } = req.body;
        let user = await userModel.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );
        if (user) {
            res.send({ message: "User enabled successfully", user });
        } else {
            res.status(404).send({ message: "User not found or information mismatch" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// 3) POST /disable - status false if email and username match
router.post('/disable', async function (req, res, next) {
    try {
        const { email, username } = req.body;
        let user = await userModel.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (user) {
            res.send({ message: "User disabled successfully", user });
        } else {
            res.status(404).send({ message: "User not found or information mismatch" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
