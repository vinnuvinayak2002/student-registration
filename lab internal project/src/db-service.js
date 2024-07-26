const sql = require('mysql2');
const env = require('dotenv');

env.config();

const con = sql.createConnection(
    {
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    }
);

function getStudents(callback) {
    con.query('select * from students', (err, rows) => {
        if (err) {
            console.log('Error fetching Data');
            console.log(err);
        }
        else {
            console.log(rows);
            callback(rows);
        }
    });
}

// function saveData(firstname, lastname, email, dob, gender, address) {
// }


function saveStudent(student, callback) {
    con.query(`insert into students(firstname, lastname, email, dob, gender, address) values('${student.firstName}', '${student.lastName}', '${student.email}', '${student.dob}', '${student.gender}', '${student.address}')`, (err, res) => {
        if (err) {
            console.log('Error saving student');
            console.log(err);
            callback(false);
        }
        else {
            console.log(res);
            callback(res.affectedRows > 0);
        }
    });
}


function deleteStudent(id, callback) {
    con.query(`delete from students where id = ${id}`, (err, res) => {
        if (err) {
            console.log('Error deleting student');
            console.log(err);
            callback(false);
        }
        else {
            console.log(res);
            callback(res.affectedRows > 0);
        }
    });
}


function createStudentsTable() {
    con.query('CREATE TABLE person ( name VARCHAR(100) ,  age INT)', (err, res) => {
        if (err) {
            console.log('Error creating Table');
            console.log(err);
        }
        else {
            console.log(res);
        }        
    });
}

function createUsersTable() {
    con.query('CREATE TABLE users ( username VARCHAR(100) ,  password varchar(100))', (err, res) => {
        if (err) {
            console.log('Error creating Table users');
            console.log(err);
        }
        else {
            console.log(res);
        }        
    });
}

function createDatabase() {
    con.query('CREATE DATABASE studentdb;', (err, res) => {
        if (err) {
            console.log('Error creating DB');
            console.log(err);
        }
        else {
            console.log(res);
        }
    });
}

function findUser(name, pwd, callback) {
    con.query(`select * from users where username =  '${name}' and password = '${pwd}'`, (err, rows) => {
        if (err) {
            console.log('Error finding User');
            console.log(err);
            callback(false);
        }
        else {
            console.log(rows);
            callback(rows.length > 0);
        }
    });
}

module.exports = {
    getStudents,
    saveStudent,
    deleteStudent,
    validateUser: findUser
}