var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var app = express();

app.use(cors());

var port = 3000;

var tasks = require('./routes/tasks');

// Body Parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Route
app.use('/api', tasks);

app.listen(port, function(){
    console.log('Server started on port ' + port);
});