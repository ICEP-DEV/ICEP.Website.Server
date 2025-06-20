require('dotenv').config();
const express = require('express');
const fs = require('fs');
const AWS = require('aws-sdk')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const connection = require("../config/config");
const router = express.Router();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRETE_ACCESS_KEY,
    region: process.env.REGION
});

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// upload files
router.post('/upload', upload.single('file'), (req, res) => {
    var filepath = req.file.path;
    // var folder = req.body.foder
    console.log(req.body.folder);
    console.log(req.file);

    const filestream = fs.createReadStream(filepath);
    filestream.on('error', (err) => {
        console.log('error', err);
    })
    const params = {
        Bucket: 'www.icep.co.za',
        Key: req.body.folder + `/${Date.now().toString()}` + req.file.originalname,
        Body: filestream
    }

    s3.upload(params, (err, data) => {
        // console.log("regionssss", s3.config.region);

        if (err) { console.log(err); }
        try {
            if (data) {
                var link = data.Location
                res.send({ success: true, message: "Uploaded successfully", link });
            }
        } catch (error) {
            res.json({ success: false, message: "Unable to upload file...", error });
        }
        // if (data) {
        //     var link = data.Location
        //     res.send({ success: true, message: "Uploaded successfully", link });
        // }
        // else{
        //     res.send({ success: false, message: "Unable to upload file" });
        // }
    })

})

module.exports = router;