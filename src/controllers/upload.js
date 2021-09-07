const fs = require("fs");
const db = require("../config/db");
const Busboy = require("busboy");

module.exports.image = (req, res) => {
    try {
        let savePath = "";
        const {userId} = req.query
        const body = {}
        const busboy = new Busboy({ headers: req.headers });
        busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
            savePath = "public/images/" + userId + "_" + filename;
            file.pipe(fs.createWriteStream("./" + savePath));
        });

        busboy.on('field', (fieldname, val) => {
            body[fieldname] = val
        })

        busboy.on("finish", function () {
            const {data, size} = body
            db.query(
                "INSERT INTO `images`(`user_id`, `path`, `data`) VALUES (?, ?, ?)",
                [userId, savePath, data]
            ).catch((e) => console.log(e));
            res.json({
                status: 1,
                message: "Upload Success.",
            });
        });
        return req.pipe(busboy);
    } catch (e) {
        console.log(e)
        res.json({
            status: 1,
            message: e.message,
        });
    }
};
