serverLink = 'http://localhost/rentbike/web/app_dev.php/';

//'Router' is a name of the router class
var Router = Backbone.Router.extend ({
  routes: {
      '': 'list',
      'list': 'list',
      'new': 'new',
      //'update': 'update'
      "update/:id":"update",
      'client': 'clientList',
      'newCLient': 'newCLient'
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
  },
  clientList: function () {
    $('#content').empty();
       listCLient();
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

var Client = Backbone.Model.extend({
  defaults:{
     id: null,
     firstname: null,
     secondname: null,
     lastname: null,
     secondlastname: null,
     password: null,
     identificationNumber: null,
     identificationType: null
  },
  url: 'http://localhost/rentbike/web/app_dev.php/client',
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
      formgroup.addClass('col-sm-6');

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

function Combo(conf) {

  debugger

  var input = $('<input id="combo" placeholder="Select fabric..." style="width: 80%;" />');

  setTimeout(function (argument) {
    conf.render.append(input);

    $("#combo").kendoComboBox({
      dataTextField: "text",
      dataValueField: "value",
      dataSource: [
        { text: "Cotton", value: "1" },
        { text: "Polyester", value: "2" },
        { text: "Cotton/Polyester", value: "3" },
        { text: "Rib Knit", value: "4" }
      ],
      filter: "contains",
      suggest: true,
      index: 3
    });

    // create ComboBox from select HTML element
    $("#size").kendoComboBox();

    var fabric = $("#combo").data("kendoComboBox");
    var select = $("#size").data("kendoComboBox");
  
  }, 1000)

}

function Grid(conf) {

  debugger
  var grid = $('<div id="grid"></div>');

  setTimeout(function (argument) {
    conf.render.append(grid);

        $("#grid").kendoGrid({
        dataSource: {
            type: "odata",
            transport: {
                read: "http://localhost/rentbike/web/app_dev.php/user/list"
            },
            pageSize: 20
        },
        height: 550,
        groupable: true,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [
          {
             field: "firstname", 
             field: "firstname"
          }
        ]
    });
  }, 1000)


}

function listUsers () {

  //$('body').append('<div id="gridUser" class="grid"></div>');
  
  setTimeout(function (argument) {
    $('body').find('#content').append('<div id="gridUser"></div>');
  
    setTimeout(function (argument) {
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
    }, 1000)
      
  }, 1000);
}

function newUser(argument) {

  $("#gridUser").remove();

  var NewUserView = Backbone.View.extend({
     render: function(where){
          
        var div = $('<div></div>');

        var form = $('<form id="form-user"></form>');
        var fieldset1 = $('<fieldset class="sections"></fieldset>');
        fieldset1.append('<legend class="sections">Información general</legend>');

        var firstname = Text({
          label: 'Nombre',
          required: true,
          render: fieldset1
        });

        var secondname = Text({
          label: 'Segundo nombre',
          render: fieldset1
        });
        var lastname = Text({
          label: 'Apellido',
          required: true,
          render: fieldset1
        });
        var secondlastname = Text({
          label: 'Segundo apellido',
          render: fieldset1
        });
        var email = Text({
          label: 'Correo',
          render: fieldset1
        });
        var password = Text({
          label: 'Contraseña',
          render: fieldset1
        });

        var comoboTest = Combo({
          render: fieldset1
        });

        var gridTest = Grid({
          render: fieldset1
        });

        form.append(fieldset1);
        div.append(form);

        var btnSave = $('<button>Guardar</button>');
        btnSave.addClass('btn btn-primary');
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
              var fieldset1 = $('<fieldset class="sections"></fieldset>')
              fieldset1.append('<legend class="sections">Información general</legend>');

              var firstname = Text({
                label: 'Nombre',
                required: true,
                render: fieldset1
              });
              firstname.value(response.firstname);

              var secondname = Text({
                label: 'Segundo nombre',
                render: fieldset1
              });
              secondname.value(response.secondname);

              var lastname = Text({
                label: 'Apellido',
                required: true,
                render: fieldset1
              });
              lastname.value(response.lastname);

              var secondlastname = Text({
                label: 'Segundo apellido',
                render: fieldset1
              });
              secondlastname.value(response.secondlastname);

              var email = Text({
                label: 'Correo',
                render: fieldset1
              });
              email.value(response.email);

              var password = Text({
                label: 'Contraseña',
                render: fieldset1
              });
              password.value(response.password);

              form.append(fieldset1);
              div.append(form);

              var btnSave = $('<button>Guardar</button>');
              btnSave.addClass('btn btn-primary');
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

function listClients () {
  
  setTimeout(function (argument) {
    $('body').find('#content').append('<div id="gridClient"></div>');
  
    $("#gridClient").jsGrid({
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
                url: "http://localhost/rentbike/web/app_dev.php/client/list",
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
  }, 100)
}