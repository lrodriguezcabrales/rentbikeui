serverLink = 'http://localhost/rentbike/web/app_dev.php/';

//'Router' is a name of the router class
var Router = Backbone.Router.extend ({
routes: {
    '': 'list',
    'list': 'list',
    'new': 'new',
    'update': 'update'
},

list: function(){
  $('#content').append('jejeje');
     listUsers();
},
new: function () {
  $('#content').append('jejeje');
     newUser();
},
update: function() {
  $('#content').append('jejeje');
     updateUser();
}
});

//'router' is an instance of the Router
var router = new Router();

//Start listening to the routes and manages the history for bookmarkable URL's
Backbone.history.start();

var User = Backbone.Model.extend({
  defaults:{
     id: null,
     email: null,
     firstname: null,
     secondname: null,
     lastname: null,
     secondlastname: null,
     password: null,
     roles: null
  },
  url: 'http://localhost/rentbike/web/app_dev.php/user',
  initialize: function(){
     // TODO: acciones de inicialización del modelo
  }
});

var UserCollection = Backbone.Collection.extend({
  model: User,
  url: function() {
     return 'http://localhost/rentbike/web/app_dev.php/user';
  },
  initialize: function(){
     // TODO: acciones de inicialización del modelo
  }
});


function Text(conf) {

  var where = conf.render;

  var Text = Backbone.View.extend({
    tpl: '<input type="text"></input>',
    render: function(where){
      
      var me = this;

      me.obj = $(this.tpl);

      me.obj.addClass('form-control');

      var formgroup = $('<div class="form-group"></div>');
      
      if(!_.isNull(me.label)){
        var label = $('<label>'+conf.label+'</label>');
        formgroup.append(label);
      }

      formgroup.append(me.obj);

      setTimeout(function(){
        
          if(_.isObject(where)){
            where.append(formgroup);
          }else{
            $(where).append(formgroup);
          }

      }, 100);

      return this;
    },  
    value: function (value) {
      var me = this;
      if (value === undefined) {
        return me.obj.val();
      } else {
        me.obj.val(value);
      }
    },
  });

  var text = new Text(conf);
  text.render(where);

  return text;
}



function listUsers () {


  $('body').append('<div id="gridUser" class="grid"></div>');
/*  $('body').find('#content').append('<div id="gridUser"></div>');*/

  $("#gridUser").jsGrid({
    height: "auto",
    width: "100%",
    sorting: true,
    paging: false,
    autoload: true,
    editing: true,
    controller: {
        loadData: function() {
            var d = $.Deferred();

            $.ajax({
                url: "http://localhost/rentbike/web/app_dev.php/user/list",
                dataType: "json"
            }).done(function(response) {
                d.resolve(response.data);
            });

            return d.promise();
        }
    },
    fields: [
        {
           name: "firstname", 
           type: "text"
        },
        {
           name: "lastname", 
           type: "text"
        },
        {
           name: "email", 
           type: "text"
        },
        {
           type: "control",
           modeSwitchButton: false,
           editButton: true,
           headerTemplate: function() {
              var btnAdd = $('<button type="button"> Add</button>');

              btnAdd.click(function (argument) {
                 
                 router.navigate('new', true);

                 
              })
             
              return btnAdd;
           }
        },
     
    ],
    onItemEditing: function(args) {
     
        args.cancel = true;

        router.navigate('update', true);
     }
  });
}

function newUser(argument) {

  $("#gridUser").remove();

  var NewUserView = Backbone.View.extend({
     render: function(where){
          
        var div = $('<div></div>');

        var form = $('<form id="form-user"></form>');
/*
        var fields = [];
        var labels = [];

        var firstname = $('<input type="text" id="firstname-user"></input>');
        var secondname = $('<input type="text" id="secondname-user"></input>');
        var lastname = $('<input type="text" id="lastname-user"></input>');
        var secondlastname = $('<input type="text" id="secondlastname-user"></input>');
        var password = $('<input type="password" id="password-user"></input>');


        var labelFirstname = $('<label type="text" for="firstname-user"></label>');
        var labelSecondname = $('<label type="text" for="secondname-user"></label>');
        var labelLastname = $('<label type="text" for="lastname-user"></label>');
        var labelSecondlastname = $('<label type="text" for="secondlastname-user"></label>');
        var labelPassword = $('<label type="password" for="password-user"></label>');

        fields.push(firstname);
        fields.push(secondname);
        fields.push(lastname);
        fields.push(secondlastname);
        fields.push(password);

        labels.push(labelFirstname);
        labels.push(labelSecondname);
        labels.push(labelLastname);
        labels.push(labelSecondlastname);
        labels.push(labelPassword);*/


/*        for (var i = 0; i < fields.length; i++) {

           var field = fields[i];
           var label = labels[i];
           field.addClass('form-control');

           var formgroup = $('<div class="form-group"></div>');
           formgroup.append(label);
           formgroup.append(field);

           form.append(formgroup);   
        }

        div.append(form);

*/        


        //$(this.el).append(div);

        var firstname = Text({
          label: 'Nombre',
          render: form
        });

        var secondname = Text({
          label: 'Segundo nombre',
          render: form
        });
        var lastname = Text({
          label: 'Apellido',
          render: form
        });
        var secondlastname = Text({
          label: 'Segundo apellido',
          render: form
        });
        var password = Text({
          label: 'Contraseña',
          render: form
        });

        div.append(form);

        var btnSave = $('<button>Guardar</button>');
        div.append(btnSave);

        btnSave.click(function (argument) {
            debugger
            var json = {
              'firstname': firstname.value(),
              'lastname': lastname.value(),
              'secondname': secondname.value(),
              'secondlastname': secondlastname.value(),
              'password': password.value()
            };


            var parameters = {
                type: 'POST',     
                //headers: K.currentApplication.buildRequestHeader(),                
                url : serverLink + 'user',
                contentType: 'application/json',
                dataType: "json",        
                data: json,        
                success: function(response){  
                  debugger  
                },
                error: function (e) {
                  alert('error');
                  debugger
                }
            };

            $.ajax(parameters); 



        });


        setTimeout(function(){
          $(where).append(div);
        }, 100);

        
        

        

        return this;
     },
  });

  var newUser = new NewUserView();
  newUser.render('#content');

//    /*console.log('Crear Usuario');
//    var newUser = new User({
//       "email":"pepito@gmail.com",
//       "firstname":"Pepito",
//       "lastname":"Perez",
//       "password": "12345"
//       }
//    );

//    libroNuevo.save();
//    coleccion_libros.add(newUser);*/

}

function updateUser() {
  alert('VIsta Update')
}