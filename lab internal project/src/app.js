const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const dbService = require('./db-service.js')

const app = express();
const PORT = 3002;

// Middleware
// injects the urlencoded data into request.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'html')));
app.use(session({
    secret: 'my-secret-key',
    resave: true,
    saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    dbService.validateUser(username, password, (isValid) => { 
        if (isValid) {
            req.session.authenticated = true;
            res.redirect('/students');
        } else {
            res.redirect('/login-fail');
        }
    });
});

// Endpoint to display list of students
app.get('/data', (req, res) => {

    if (!req.session.authenticated) {
        res.redirect('/');
        return;
    }
    dbService.getStudents((students) => { 
        if (!students) {
            students = '[]';
        }
        res.json(students);
    });

});

// List page
app.get('/students', (req, res) => {
    if (!req.session.authenticated) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, 'html', 'students.html'));
});

// Registration page
app.get('/register', (req, res) => {
    if (!req.session.authenticated) {
        res.redirect('/');
        return;
    }
    res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

app.get('/login-fail', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login-error.html'));
});

// Registration endpoint
app.post('/register', (req, res) => {
    if (!req.session.authenticated) {
        res.redirect('/');
        return;
    }
    const student = { firstName, lastName, email, dob, gender, address } = req.body;

    dbService.saveStudent(student, (isValid) => { 
        if (isValid) {
            res.redirect('/students');
        } else {
            res.redirect('/login-fail');
        }
    });
});

// Delete studenta student record by ID
app.delete('/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (!req.session.authenticated) {
        res.redirect('/');
        return;
    }

    dbService.deleteStudent(id, (isValid) => { 
        res.redirect('/students');
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
