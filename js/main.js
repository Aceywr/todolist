var bus = new Vue();

Vue.component('done', {
    template : '<div>\
    <ul class="list-group" v-for="item in itemData">\
        <li class="list-group-item my-tasks" v-show="item.isDone"><input type="checkbox" v-bind:checked="item.isDone"> {{ item.title }}\
        <button type="button" class="btn btn-danger my-btn" v-on:click="taskDelete(item._id)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\
        </li>\
    </ul>\
    </div>\
    ',
    data : function () {
        return {
            itemData : ''
        }
    },
    methods : {
        getItems () {
            // Get data from api
            this.$http.get('http://localhost:3000/api/tasks').then(
            function (res) {
                this.itemData = res.body;
            },
            function(err) {
                return console.log(err);
            }
            );
        },
         taskDelete (id) {
            var newData = [];
            for (var i = 0; i < this.itemData.length; i++) {
                if (this.itemData[i]._id != id ) {
                    newData.push(this.itemData[i]);
                }
            }
            this.itemData = newData;
            var url = 'http://localhost:3000/api/task/' +id;
            this.$http.delete(url).then(
                function (res) {
                return console.log("ok!");
                },
                function(err) {
                return console.log(err);
                }
            );
        }
    },
    created: function () {
        this.getItems();
    },
    mounted : function () {
        bus.$on('done-page', function (id, data) {
           app.$children[0].$children[1].$children[0]._data.itemData = data;
        });
    }
    
})

Vue.component('todo', {
    template: '\
    <div>\
        <form class="form-inline">\
                <input v-model="message" placeholder="Add new" type="text" class="form-control my-input">\
                <input type="button" value="Add" v-on:click="insert" class="btn btn-primary"/>\
                <li class="list-group-item my-tasks">{{ message }}</li>\
        </form>\
            <ul class="list-group" v-for="item in itemData">\
                <li class="list-group-item my-tasks" v-if="!item.isDone"><input type="checkbox" v-bind:checked="item.isDone" v-on:click="doUpdate(item._id, item.isDone)"> {{ item.title }}\
                <button type="button" class="btn btn-danger my-btn" v-on:click="taskDelete(item._id)"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>\
                <button type="button" class="btn btn-default my-btn" data-toggle="modal" v-bind:data-target="hashId(item._id)"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button></li>\
            <div class="modal fade" v-bind:id="item._id" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
            <div class="modal-dialog" role="document">\
            <div class="modal-content">\
            <div class="modal-header">\
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
            <h4 class="modal-title" id="myModalLabel">Update task</h4>\
            </div>\
            <div class="modal-body">\
            <p>Old task : {{ item.title }}</p>\
            <input type="text" class="form-control" placeholder="New task"v-model="updateMsg">\
            </div>\
            <div class="modal-footer">\
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="taskUpdate(item._id)">Save changes</button>\
            </div>\
            </div>\
            </div>\
            </div>\
            </ul>\
    </div>',
    data: function () {
        return {
            message : '',
            itemData : '',
            updateMsg : '',
            Done : ''
        }
    },
    methods : {
         hashId : function (id) {
            return '#' + id
        },
        getItems () {
            // Get data from api
            this.$http.get('http://localhost:3000/api/tasks').then(
            function (res) {
                this.itemData = res.body;
            },
            function(err) {
                return console.log(err);
            }
            );
        },

        insert () {
            // insert data to api
            this.$http.post('http://localhost:3000/api/task', {"title" : this.message, "isDone" : false}).then(
                response => {
                    this.$http.get('http://localhost:3000/api/tasks').then(
                    function (res) {
                    this.itemData = res.body;
                    this.message = '';
                    },
                    function(err) {
                    return console.log(err);
                    }
                    );
                }, response => {
                    return console.log(response);
                }
            );
        },

        taskDelete (id) {
            var newData = [];
            for (var i = 0; i < this.itemData.length; i++) {
                if (this.itemData[i]._id != id ) {
                    newData.push(this.itemData[i]);
                }
            }
            this.itemData = newData;
            var url = 'http://localhost:3000/api/task/' +id;
            this.$http.delete(url).then(
                function (res) {
                return console.log("ok!");
                },
                function(err) {
                return console.log(err);
                }
            );
        },

        taskUpdate (id) {
            for (var i = 0; i < this.itemData.length; i++) {
                if (this.itemData[i]._id == id ) {
                   this.itemData[i].title = this.updateMsg; 
                }
            }
            var url = 'http://localhost:3000/api/task/' + id;
            this.$http.put(url, {"title" : this.updateMsg, "isDone" : false}).then(
                function (res) {
                console.log("ok!");
                },
                function(err) {
                console.log(err);
                }
            );
        },
        doUpdate (id, isDone) {
            for (var i = 0; i < this.itemData.length; i++) {
                if (this.itemData[i]._id == id ) {
                   this.itemData[i].isDone = !isDone; 
                }
            }
            var url = 'http://localhost:3000/api/task/' + id;
            this.$http.put(url, { "isDone" : !isDone }).then(
                function (res) {
                    console.log(res.body);
                },
                function(err) {
                console.log(err);
                }
            );
            bus.$emit("done-page", id, this.itemData);
        }
    },
     created: function () {
        this.getItems();
    }

})

Vue.component('page-nav', {
    template : '\
    <div>\
        <div class="btn-group btn-group-justified" role="group">\
            <a class="btn" v-for="page in pages" :herf="page.hashLink"\
            :class="{\'btn-default\' : !page.selected, \'btn-info\' : page.selected}"\
            v-on:click="selectNav(page)">{{ page.name }}</a>\
        </div>\
        <div class="page-detail"><slot></slot></div>\
    </div>',
    data : function() {
        return {
            pages : []
        }
    },
    methods : {
        selectNav : function (page) {
            this.pages.forEach(function (item, index) {
                item.selected = (item.name === page.name)
            }) 
        }
    },
    created : function () {
        this.pages = this.$children;
    }
})

Vue.component('page', {
    template : '\
    <div v-show="selected">\
        <slot></slot>\
    </div>\
    ',
    props : {
        name : {required : true},
        link : {required : true},
        active : {default : false}
    },
    computed : {
        hashLink : function () {
            return '#' + this.link;
        }
    },
    data : function () {
        return {
            selected : this.active
        }
    }
})

var app = new Vue ({
    el : '#app'
  
})







