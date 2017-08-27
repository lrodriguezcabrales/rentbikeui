serverLink = 'http://localhost/rentbike/web/app_dev.php/';

//'Router' is a name of the router class
var Router = Backbone.Router.extend ({
  routes: {
      '': 'list',
      'list': 'list',
      'new': 'new',
      //'update': 'update'
      "update/:id":"update"
  },

  list: function(){
    $('#content').empty();
       listUsers();
  },
  new: function () {
    $('#content').empty();
       newUser();
  },
  update: function(id) {
    $('#content').empty();
      updateUser(id);
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
    required: false,
    labelname: null,
    render: function(where){
      
      var me = this;

      me.obj = $(this.tpl);

      me.obj.addClass('form-control');

      var formgroup = $('<div class="form-group"></div>');
      
      me.labelname = conf.label;

      if(!_.isNull(me.labelname)){
        me.label = $('<label>'+me.labelname+'</label>');
        formgroup.append(me.label);
      }

      if(conf.required){
        me.obj.attr('required', true);
        me.label.append('<span class="required">*</span>')
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

        var item = args.item;
        router.navigate('update/'+item.id, true);
     }
  });
}

function newUser(argument) {

  $("#gridUser").remove();

  var NewUserView = Backbone.View.extend({
     render: function(where){
          
        var div = $('<div></div>');

        var form = $('<form id="form-user"></form>');

        var firstname = Text({
          label: 'Nombre',
          required: true,
          render: form
        });

        var secondname = Text({
          label: 'Segundo nombre',
          render: form
        });
        var lastname = Text({
          label: 'Apellido',
          required: true,
          render: form
        });
        var secondlastname = Text({
          label: 'Segundo apellido',
          render: form
        });
        var email = Text({
          label: 'Correo',
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
            var data = {
              'firstname': firstname.value(),
              'lastname': lastname.value(),
              'secondname': secondname.value(),
              'secondlastname': secondlastname.value(),
              'email': email.value(),
              'password': password.value()
            };

            data = JSON.stringify(data);

            var parameters = {
                type: 'POST',     
                //headers: K.currentApplication.buildRequestHeader(),                
                url : serverLink + 'user',
                contentType: 'application/json',
                dataType: "json",        
                data: data,        
                success: function(response){  
                  alert(response.msj);  
                },
                error: function (e) {
                  alert('error');
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

}

function updateUser(id) {

  var me = this;

  $("#gridUser").remove();

  var UpdateUserView = Backbone.View.extend({
     render: function(where){
        var parameters = {
            type: 'GET',     
            //headers: K.currentApplication.buildRequestHeader(),                
            url : serverLink + 'user/'+ id,
            contentType: 'application/json',
            dataType: "json",
            success: function(response){  
              var div = $('<div></div>');

              var form = $('<form id="form-user"></form>');

              var firstname = Text({
                label: 'Nombre',
                required: true,
                render: form
              });
              firstname.value(response.firstname);

              var secondname = Text({
                label: 'Segundo nombre',
                render: form
              });
              secondname.value(response.secondname);

              var lastname = Text({
                label: 'Apellido',
                required: true,
                render: form
              });
              lastname.value(response.lastname);

              var secondlastname = Text({
                label: 'Segundo apellido',
                render: form
              });
              secondlastname.value(response.secondlastname);

              var email = Text({
                label: 'Correo',
                render: form
              });
              email.value(response.email);

              var password = Text({
                label: 'Contraseña',
                render: form
              });
              password.value(response.password);

              div.append(form);

              var btnSave = $('<button>Guardar</button>');
              div.append(btnSave);

              btnSave.click(function (argument) {
                  var data = {
                    'firstname': firstname.value(),
                    'lastname': lastname.value(),
                    'secondname': secondname.value(),
                    'secondlastname': secondlastname.value(),
                    'email': email.value(),
                    'password': password.value()
                  };

                  data = JSON.stringify(data);

                  var parameters = {
                      type: 'PUT',     
                      //headers: K.currentApplication.buildRequestHeader(),                
                      url : serverLink + 'user/'+id,
                      contentType: 'application/json',
                      dataType: "json",        
                      data: data,        
                      success: function(response){  
                        alert(response.msj);  
                      },
                      error: function (e) {
                        alert('error');
                      }
                  };

                  $.ajax(parameters); 
              });


              setTimeout(function(){
                $(where).append(div);
              }, 100);

            },
            error: function (e) {
              alert('Error al cargar los datos');
            }
        };

        $.ajax(parameters); 
      

        return this;
     }
  });      

  var updateUser = new UpdateUserView();
  updateUser.render('#content');

}