const express = require('express');
const User = require('../models/user.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userMiddleware = require('../middlewares/user.middleware');

const authRouter = express.Router();

/// Sign Up /
authRouter.post('/api/signup', async (req, res) => {
    try{
        const {name, email, password} = req.body;
        const existing = await User.findOne({ email });
        if(existing){
            return res
                .status(400)
                .json({ msg: 'User with this email already exists!'});
        }

        const hashedPassword = await bcryptjs.hash(password, 8);

        let user = new User({
            email,
            password: hashedPassword,
            name
        });
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.post('/api/signin', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res
                .status(400)
                .json({ msg: 'User with this email does not exists!' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            return res
                .status(400)
                .json({ msg: 'Invalid password.' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, ...user._doc });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ msg: 'User with this email does not exists!' });
        }

        const secret = process.env.JWT_SECRET + user.password;
        const payload = {
            email: user.email,
            id: user.id
        }
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
        const link = `${req.headers.host}/api/reset-password/${user.id}/${token}`;

        // Send email instead log
        console.log(link);

        return res.json({ msg: `Password reset link has been sent to ${user.email}` });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


authRouter.post('/api/reset-password/:id/:token', async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password, confirmPassword } = req.body;
        const user = await User.findOne({ id });
        if (!user) {
            return res
                .status(400)
                .json({ msg: 'User does not exists!' });
        }

        const secret = process.env.JWT_SECRET + user.password;

        try {
            const payload = jwt.verify(token, secret);
            if (!payload) return res.status(401).json({ msg: 'Token verification failed, authorization denied' });

            if (password !== confirmPassword) return res.status(400).json({ msg: 'Confirm password didn\'t match' });

            const hashedPassword = await bcryptjs.hash(password, 8);

            user.password = hashedPassword;
            user.save();

            res.json({ msg: `Password successfully changed` });

        } catch (e) {
            res.status(500).json({ error: e.message });
        }

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.get('/', userMiddleware, async(req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});

module.exports = authRouter;