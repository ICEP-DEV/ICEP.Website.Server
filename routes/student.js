require('dotenv').config();
const express = require('express');
const fs = require('fs');
const AWS = require('aws-sdk')
const multer = require('multer');
const connection = require("../config/config");
const { log } = require('console');
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


router.post('/uploadFile',upload.single('file'), (req, res)=>{
    var filepath = req.file.path;
    const filestream = fs.createReadStream(filepath);
    filestream.on('error', (err) => {
        console.log('error', err);
    })
    const params = {
        Bucket: 'www.icep.co.za',
        Key: `CVs/${Date.now().toString()}`+req.file.originalname,
        Body: filestream
    }
    
    s3.upload(params, (err, data) => {
        if (err) { console.log(err); }
        if (data) {
            var link = data.Location
            res.send({ success: true, message: "Uploaded successfully", link });
        }
        else{
            res.send({ success: false, message: "Unable to upload file" });
        }
    })
    
})

router.get('/getCampuses', (req, res) =>{
    connection.query('select * from campus where open = true', (err, results)=>{
        if(err){
            console.log(err);
            return
        }
        if(results.length> 0){
            res.send({success: true, results})
        }
        else{
            res.send({success: false, message:'This application is not open for any campuses'})
        }
    })
})

router.get('/getCourse', (req, res) =>{
    connection.query('select * from course where open = true', (err, results)=>{
        if(err){
            console.log(err);
            return
        }
        if(results.length> 0){
            res.send({success: true, results})
        }
        else{
            res.send({success: false, message:'This application is not open for any courses'})
        }
    })
})

router.post('/student_application', (req, res) => {
    
    connection.query(`select * from student where student_id = '${req.body.student_id}'`, (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            res.send({ success: false, message: "this student number already exist", result });
        }
        else {
            var sqlInsert = `INSERT INTO student (student_id, firstname, lastname, email, idno, dob, phoneNo, gender, outstanding, houseNo, streetName, town, code, cv_file, 
                                recommendation_file, course_id, campus_id, status)
                                values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

            var bodyParams = [req.body.student_id, req.body.firstname, req.body.lastname, req.body.email, req.body.idno, req.body.dob, req.body.phoneNo, req.body.gender,
            req.body.outstanding, req.body.houseNo, req.body.streetName, req.body.town, req.body.code, req.body.cv_file, req.body.recommendation_file, req.body.course_id, req.body.campus_id, "Pending"];

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

router.get('/check_status/:student_no', (req, res)=>{

    connection.query(`select * from student where student_id = '${req.params.student_no}'`, (err, results)=>{
        if(err){console.log(err); return}
        if(results.length>0){res.send({success:true, results})}
        else{res.send({success:false, message:'No data has found'})}
    })
})

module.exports = router;