require('./models/db');

const express = require('express');
const path = require('path');

const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');

const usersController = require('./controllers/usersController');
var app = express();
var cors = require('cors')
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());
app.use(cors());

app.use('/', usersController);

app.listen(3000, () => {
    console.log('server est bien lancé sur le Port: 3000');
});

