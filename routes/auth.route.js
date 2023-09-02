const { Router } = require('express');
const router = Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.json({
                status: 'bad',
                msg: "Please enter username and password"
            });
        }
        if (username.length < 4) {
            return res.json({
                status: "bad",
                msg: "Username must be at least 4 characters"
            });
        }
        if (username.length > 20) {
            return res.json({
                status: "bad",
                msg: "Username must be less than 20 characters"
            });
        }

        if (password.length < 8) {
            return res.json({
                status: "bad",
                msg: "Password must be at least 8 characters"
            });
        }

        const existUser = await User.findOne({ username });

        if (existUser) {
            return res.json({
                status: "bad",
                msg: "Username already exists"
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = await new User({
            username,
            password: hashedPass,
        });

        const savedUser = await newUser.save();

        const token = await jwt.sign({ savedUser }, "ethad");

        res.json({
            status: 'ok',
            msg: "User created successfully",
            user: savedUser,
            token,
        });
    }
    catch (error) {
        console.log(error.message);
    }
});

//Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.json({
                status: 'bad',
                msg: "Please enter username and password"
            });
        }

        const existUser = await User.findOne({ username });

        if (!existUser) {
            return res.json({
                status: "bad",
                msg: "User does not exist",
            });
        }

        const comparedPass = await bcrypt.compare(password, existUser.password);

        if (!comparedPass) {
            return res.json({
                status: "bad",
                msg: "Password is incorrect",
            });
        }
        const token = await jwt.sign({ user: existUser }, "ethad");

        const decodedToken = await jwt.decode(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0ZjJlOGVmNjU2MGZkZTAzZjhiZmExNyIsInVzZXJuYW1lIjoibmd1eWVuIiwicGFzc3dvcmQiOiIkMmIkMTAkRmxVekpOajFYN2sxVDFkSFF2TTZsLnkyaTYxR2N4Qkx6cms4UWtkZkQ5aFdiOHN5ZXJhajIiLCJjcmVhdGVkQXQiOiIyMDIzLTA5LTAyVDA3OjQ5OjAzLjEyOVoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA5LTAyVDA3OjQ5OjAzLjEyOVoiLCJfX3YiOjB9LCJpYXQiOjE2OTM2NDE5NTN9.Od1MtsVXzmb_yl5qpCuuyd5xNzJRkdNo0K7HY_B3aXQ"
            , "ethad");
        console.log(decodedToken);
        res.json({
            status: 'ok',
            msg: "User logged in successfully",
            user: existUser,
            token,
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
module.exports = router;