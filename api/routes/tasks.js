var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Connect to db
mongoose.connect('mongodb://localhost');
 
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error : '));
db.once('open', function(callback) {
    console.log('connected!');
});

// Init a Schema
var taskSchema = mongoose.Schema({
    title : String,
    isDone : Boolean
});

var tasks = mongoose.model('tasks', taskSchema);

// Init test task
// var task = new tasks({ title : 'do homework', isDone : false});

// task.save(function(err) {
//     if (err) return console.error(err);
// });

// Get all tasks
router.get('/tasks', function (req, res, next) {
    tasks.find(function (err, tasks) {
        if (err) return console.error(err);
        res.json(tasks);
    });
});

// Get single task
router.get('/task/:id', function (req, res, next) {
    tasks.findById(req.params.id, function (err, task) {
        if (err) return console.error(err);
        res.json(task);
    })
})

// Add task
router.post('/task', function(req, res, next) {
    var task = req.body;
    if(!task.title) {
        res.status(400);
        res.json({
            "error" : "Bad Data"
        })}else{
            var addData = new tasks({
                title : task.title,
                isDone : task.isDone
            });
            addData.save(function (err) {
                if(err) return console.error(err);
                res.json("ok");
            });
        }
});

// Delete task
router.delete('/task/:id', function (req, res, next) {
    var conditions = {_id : req.params.id}
    tasks.remove(conditions, function (err) {
        if (err) return console.error(err);
        console.log('deleted!');
    });
});

// Update task
router.put('/task/:id', function (req, res, next) {
     if (req.body.title == null) {
        tasks.update({_id : req.params.id}, {$set : {isDone : req.body.isDone}}, {upsert : true}, function(err) {
        if (err) return console.log(err);
        res.send("update done ok!");
    });
    }else{
        var conditions = {_id : req.params.id};
        var update = {$set : { title : req.body.title, isDone : req.body.isDone}};
        var options = {upsert : true};
        tasks.update(conditions, update, options, function(err) {
        if (err) return console.log(err);
        res.send("update ok!");
        });
    }
    
});



module.exports = router;