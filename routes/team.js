require('dotenv').config();
const express = require('express');
const fs = require('fs');
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const connection = require("../config/config");
const router = express.Router();


// add new team member
router.post('/add_member', (req, res) => {
    var image = 'https://s3.eu-west-1.amazonaws.com/www.icep.co.za/team/tba.jpg'
    var posterData = [uuidv4(), req.body.name, req.body.surname, req.body.email, req.body.role, 'pending', 'ICEP@2025', req.body.campus, image]
    //res.send({date, success:true, message:'Added new application'})


    connection.query(`INSERT INTO team (team_id, name, surname, email, role, status, password, campus, image)
                 VALUES(?,?,?,?,?,?,?,?,?)`, posterData, (err, results) => {
        if (err) { console.log(err); return }
        if (results.affectedRows != 0) {

            res.send({
                success: true, message: 'User added successfully'
            })
        }
        else { res.send({ success: false, message: 'Unable to upload information, plesae try again' }) }
    })

})

// login
router.post('/login', (req, res) => {
    var sql = `select * from team  where email ='${req.body.email}'`;

    connection.query(sql, (err, results) => {
        if (err) { console.log(err); return }
        if (results.length > 0) {
            if (results[0].password === req.body.password) {
                var result = {
                    id: results[0].team_id,
                    email: results[0].email,
                    name: results[0].name,
                    surname: results[0].surname,
                    status: results[0].status
                }
                res.send({
                    success: true, result
                })
            }
            else { res.send({ success: false, message: 'Enter correct information' }) }

        }
        else { res.send({ success: false, message: 'Enter correct information' }) }
    })
})

// get all members
router.get('/get_team', (req, res) => {
    var sql = `select team_id, name, surname, email, password, role, image, status, campus_name, campus, course_name, course 
                from team  t
                LEFT JOIN campus cam ON t.campus = cam.campus_id
                LEFT JOIN course cor ON t.course = cor.course_id`;

    connection.query(sql, (err, results) => {
        if (err) { console.log(err); return }
        if (results.length > 0) {
            res.send({
                success: true, results
            })

        }
        else { res.send({ success: false, message: 'Enter correct information' }) }
    })
})

// get member by id
router.get('/get_member/:team_id', (req, res) => {
    var sql = `select team_id, name, surname, email, password, role, image, status, campus_name, campus, course_name, course 
                from team  t, course cor, campus cam
                where t.campus = cam.campus_id
                and t.course = cor.course_id
                and team_id  ='${req.params.team_id}'`;

    connection.query(sql, (err, results) => {
        if (err) { console.log(err); return }
        if (results.length > 0) {

            var result = {
                email: results[0].email,
                role: results[0].role,
                name: results[0].name,
                surname: results[0].surname,
                image: results[0].image,
                status: results[0].status,
                password: results[0].password,
                course: results[0].course,
                campus: results[0].campus,
                course_name: results[0].course_name,
                campus_name: results[0].campus_name
            }
            res.send({
                success: true, result
            })

        }
        else { res.send({ success: false, message: 'Enter correct information' }) }
    })
})

router.get('/get_user_team/:team_id', (req, res) => {
    var sql = `select team_id, name, surname, email, password, role, image, status, campus, course 
                from team 
                where team_id  ='${req.params.team_id}'`;

    connection.query(sql, (err, results) => {
        if (err) { console.log(err); return }
        if (results.length > 0) {

            var result = {
                email: results[0].email,
                role: results[0].role,
                name: results[0].name,
                surname: results[0].surname,
                image: results[0].image,
                status: results[0].status,
                password: results[0].password,
                course: results[0].course,
                campus: results[0].campus,
            }
            res.send({
                success: true, result
            })

        }
        else { res.send({ success: false, message: 'Enter correct information' }) }
    })
})

router.put('/update_team_infomation/:team_id', (req, res) => {
    var sql = `update team
                set status =?,
                campus = ?,
                course = ?,
                name =?,
                surname=?,
                password=?,
                email=?,
                image=?,
                role=?
                where team_id =?`;
    var teamtReq = [req.body.status, req.body.campus, req.body.course, req.body.name, req.body.surname, req.body.password, req.body.email, req.body.image, req.body.role, req.params.team_id];
    connection.query(sql, teamtReq, (err, results) => {
        if (err) { console.log(err); return }
        if (results.affectedRows != 0) {

            res.send({
                success: true, message: 'Successfuly updated '
            })
        }
        else { res.send({ success: false, message: 'Unable to update' }) }
    })
})

module.exports = router;