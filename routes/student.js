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
router.post('/uploadFile', upload.single('file'), (req, res) => {
    var filepath = req.file.path;
    const filestream = fs.createReadStream(filepath);
    filestream.on('error', (err) => {
        console.log('error', err);
    })
    const params = {
        Bucket: 'www.icep.co.za',
        Key: `CVs/${Date.now().toString()}` + req.file.originalname,
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

// get active campuses
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
// get active courses
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

// get all campuses
router.get('/getAllCampuses', (req, res) => {
    connection.query('select * from campus', (err, results) => {
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
// get all courses
router.get('/getAllCourse', (req, res) => {
    connection.query('select * from course', (err, results) => {
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
// send student application
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

// Get all records of students
router.get('/getAllStudents', (req, res) => {
    connection.query(`SELECT id, student_id, firstname, lastname, email, idno, dob, phoneNo, gender, IF(outstanding = 1, 'Yes', 'No') AS outstanding, houseNo, streetName, town, code, cv_file, recommendation_file, s.course_id, s.campus_id, status, post_id, DATE_FORMAT(date_created,"%d/%b/%Y") as date_created, course_name, campus_name
        FROM student s, campus camp, course cour
        WHERE s.course_id = cour.course_id
        AND s.campus_id = camp.campus_id;`, (err, results) => {
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

// get the statestics of  students
router.get('/check_statuses', (req, res) => {
    connection.query(`SELECT id, student_id, firstname, lastname, email, idno, dob, phoneNo, gender, IF(outstanding = 1, 'Yes', 'No') AS outstanding, houseNo, streetName, town, code, cv_file, recommendation_file, s.course_id, s.campus_id, status, s.post_id, DATE_FORMAT(date_created,"%d/%b/%Y") as date_created, open_date, closing_date
        FROM student s, post p
        WHERE s.post_id = p.post_id`, (err, results) => {
        if (err) { console.log(err); return }
        if (results.length > 0) {

            var pending = results.filter(value => { return value.status.toLocaleLowerCase() === 'pending'.toLocaleLowerCase() });
            var completed = results.filter(value => { return value.status.toLocaleLowerCase() === 'completed'.toLocaleLowerCase() });
            var incompleted = results.filter(value => { return value.status.toLocaleLowerCase() === 'incompleted'.toLocaleLowerCase() });
            var active = results.filter(value => { return value.status.toLocaleLowerCase() === 'active'.toLocaleLowerCase() });
            var unsuccessful = results.filter(value => { return value.status.toLocaleLowerCase() === 'unsuccessful'.toLocaleLowerCase() });

            res.send({ success: true, results, pending, completed, incompleted, active, unsuccessful })
        }
        else { res.send({ success: false, message: 'No data has found' }) }
    })
})

router.put('/update_student_status/:stud_id', (req, res) => {
    var sql = `update student
                set status =?
                where id =?`;
    var studentReq = [req.body.status, req.params.stud_id];
    connection.query(sql, studentReq, (err, results) => {
        if (err) { console.log(err); return }
        if (results.affectedRows != 0) {

            res.send({
                success: true, message:'Applicant marked '
            })
        }
        else { res.send({ success: false, message: 'Unable to update status to ' }) }
    })
})

// get the statestics of specific student 
router.get('/check_status/:student_no', (req, res) => {

    connection.query(`select * from student where student_id = '${req.params.student_no}'`, (err, results) => {
        if (err) { console.log(err); return }
        if (results.length > 0) {


            res.send({
                success: true, results
            })
        }
        else { res.send({ success: false, message: 'No data has found' }) }
    })
})

// get the posters
router.get('/posters', (req, res) => {
    //DATE_FORMAT(date_created,"%d/%b/%Y")
    connection.query(`SELECT 
        post_id, 
        postname, 
        DATE_FORMAT(open_date, "%d/%b/%Y %H:%i") AS open_date, 
        DATE_FORMAT(closing_date, "%d/%b/%Y %H:%i") AS closing_date, 
        post_ref,
        CASE
            WHEN closing_date < NOW() THEN 'past'
            WHEN open_date > NOW() THEN 'upcoming'
            ELSE 'present'
        END AS status
        FROM post;`, (err, results) => {
        if (err) { console.log(err); return }
        if (results.length > 0) {

            res.send({
                success: true, results
            })
        }
        else { res.send({ success: false, message: 'No data has found' }) }
    })
})

// Create a poster
router.post('/create_posters', (req, res) => {
    //console.log(req.body);
    var date = new Date('2025-06-18 00:30')
    console.log(date);
    var open_date = req.body.open_date + " " + req.body.open_time;
    var close_date = req.body.closing_date + " " + req.body.closing_time;
    var posterData = [req.body.postname, open_date, close_date, req.body.description, uuidv4()]
    //res.send({date, success:true, message:'Added new application'})
    connection.query('update course set open = false');
    connection.query('update campus set open = false');

    connection.query(`INSERT INTO post (postname, open_date, closing_date, post_ref)
            VALUES(?,?,?,?)`, posterData, (err, results) => {
        if (err) { console.log(err); return }
        if (results.affectedRows != 0) {

            res.send({
                success: true, results
            })
        }
        else { res.send({ success: false, message: 'No data has found' }) }
    })
    for (var k = 0; k < req.body.courses; k++) {
        connection.query(`update course set open = true where course_id = '${req.body.courses[k]}'`);
    }
    for (var k = 0; k < req.body.campuses; k++) {
        connection.query(`update campus set open = true where campus_id = '${req.body.courses[k]}'`);
    }

})

module.exports = router;