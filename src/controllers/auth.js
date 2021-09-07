const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const db = require("../config/db");

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const error = "Invalid email or password"
        const [user] = await db.query("SELECT * FROM `users` WHERE `email` = ?", [email]);
        if (!user) throw new Error(error)
        console.log(req.body, user)
        const result = await bcrypt.compare(password, user.hash.toString())
        if (!result) throw new Error(error)
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: 365 * 60 * 24 * 1000 }
        );
        res.json({
            status: 1,
            token,
            message: 'Login successful!',
            user
        })
    } catch (e) {
        console.log(e)
        res.json({
            status: 0,
            message: e.message,
        });
    }
};

module.exports.register = async (req, res) => {
    try {
        const { email, password, name, type } = req.body;
        const [user] = await db.query("SELECT * FROM `users` WHERE `email` = ?", [email]);
        if (user) throw new Error("User already exists!")
        const hash = await bcrypt.hash(password, 10)
        await db.query("INSERT INTO `users` (`email`, `hash`, `name`, `type`) VALUES(?, ?, ?, ?)", [email, hash, name, type ? type: 'app']);
        res.json({
            status: 1,
            message: 'User registration successful'
        })
    } catch (e) {
        res.json({
            status: 0,
            message: e.message,
        });
        console.log(e)
    }
};

module.exports.user = async (req, res) => {
    try {
        const { userId } = req.query;
        const [user] = await db.query("SELECT * FROM `users` WHERE `id` = ?", [userId]);
        res.json({
            status: 1,
            user,
        })
    } catch (e) {
        res.json({
            status: 0,
            message: e.message,
        });
    }
};

module.exports.uploads = async (req, res) => {
    try {
        const { userId } = req.query;
        const images = await db.query("SELECT * FROM `images` WHERE `user_id` = ? ORDER BY `id` DESC", [userId]);
        res.json({
            status: 1,
            images
        })
    } catch (e) {
        res.json({
            status: 0,
            message: e.message,
        });
    }
};

module.exports.allUploads = async (req, res) => {
    try {
        const images = await db.query("SELECT * FROM `images` ORDER BY `id` DESC");
        res.json({
            status: 1,
            images
        })
    } catch (e) {
        res.json({
            status: 0,
            message: e.message,
        });
    }
};