var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET all roles
router.get('/', async function (req, res, next) {
    try {
        let result = await roleModel.find({ isDeleted: false });
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET role by ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({ _id: id, isDeleted: false });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// POST new role
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel(req.body);
        await newRole.save();
        res.send(newRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT update role
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await roleModel.findByIdAndUpdate(id, req.body, { new: true });
        if (updatedItem) {
            res.send(updatedItem);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// DELETE role (soft delete)
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await roleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (updatedItem) {
            res.send(updatedItem);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// 4) Get all users with a specific role
router.get('/:id/users', async function (req, res, next) {
    try {
        let roleId = req.params.id;
        // Check if role exists
        let role = await roleModel.findOne({ _id: roleId, isDeleted: false });
        if (!role) {
            return res.status(404).send({ message: "ROLE NOT FOUND" });
        }
        let users = await userModel.find({ role: roleId, isDeleted: false });
        res.send(users);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

module.exports = router;
