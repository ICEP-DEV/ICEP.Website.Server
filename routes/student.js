require('dotenv').config();
const express = require('express');
const fs = require('fs');
const AWS = require('aws-sdk')
const multer = require('multer');
const connection = require("../config/config");
const router = express.Router();
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRETE_ACCESS_KEY,
    region: "eu-west-1"
});

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });


router.post('/uploadFile', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const params = {
    Bucket: 'web.co.za',
    Key: `CVs/${Date.now()}-${file.originalname}`,
    Body: file.buffer, // ← use the in-memory buffer
    ContentType: file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('S3 Upload Error:', err);
      return res.status(500).json({ success: false, message: "Upload failed", error: err });
    }
    res.json({ success: true, message: "Uploaded successfully", link: data.Location });
  });
});


router.get('/getCampuses', (req, res) => {
    connection.query('select * from campus where open = true', (err, results) => {
        if (err) {
            console.log(err);
            return
        }
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: 'This application is not open for any campuses' })
        }
    })
})

router.get('/getCourse', (req, res) => {
    connection.query('select * from course where open = true', (err, results) => {
        if (err) {
            console.log(err);
            return
        }
        if (results.length > 0) {
            res.send({ success: true, results })
        }
        else {
            res.send({ success: false, message: 'This application is not open for any courses' })
        }
    })
})

router.post('/student_application', (req, res) => {
    console.log(req.body);
    /*`select * from post p, student s 
                        where p.post_id = s.post_id
                        and student_id = '${req.body.student_id}'`
                        // and post_ref ='${req.body.post_ref}' */
    connection.query(`select * from  student
                        where student_id = '${req.body.student_id}'`
        // and post_ref ='${req.body.post_ref}'
        , (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                res.send({ success: false, message: "this student number already exist in this application", result });
            }
            else {
                var sqlInsert = `INSERT INTO student (student_id, firstname, lastname, email, idno, dob, phoneNo, gender, outstanding, houseNo, streetName, town, code, cv_file, 
                                recommendation_file, course_id, campus_id, status)
                                values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

                var bodyParams = [req.body.student_id, req.body.firstname, req.body.lastname, req.body.email, req.body.idno, req.body.dob, req.body.phoneNo, req.body.gender,
                req.body.outstanding, req.body.houseNo, req.body.streetName, req.body.town, req.body.code, req.body.cv_file, req.body.recommendation_file, req.body.course, req.body.campus, "Pending"];

                connection.query(sqlInsert, bodyParams, (err, results) => {
                    if (err) throw err;

                    if (results.affectedRows != 0) {
                        res.send({ success: true, message: "The request was send successfully" });
                    }
                    else {
                        res.send({ success: false, message: "Unable to send application" });
                    }
                })
            }
        })

})

router.get('/check_status/:student_no', (req, res) => {

    connection.query(`select * from student where student_id = '${req.params.student_no}'`, (err, results) => {
        if (err) { console.log(err); return }
        if (results.length > 0) { res.send({ success: true, results }) }
        else { res.send({ success: false, message: 'No data has found' }) }
    })
})

module.exports = router;