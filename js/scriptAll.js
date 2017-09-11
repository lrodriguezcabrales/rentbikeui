//serverLink = 'http://localhost:8080/rentbike/web/app_dev.php/';
serverLink = 'http://localhost/rentbike/web/app_dev.php/';

//'Router' is a name of the router class
var Router = Backbone.Router.extend ({
  routes: {
      '': 'user',
      'user': 'user',
      'newUser': 'newUser',
      'updateUser/:id':'updateUser',
      'client': 'listCLient',
      'newClient': 'newClient',
      'attribute': 'listAttributeList',
      'newAttributeList': 'newAttributeList',
      'vehicle': 'listVehicle',
      'newVehicle': 'newVehicle',
      'updateVehicle': 'updateVehicle',
  },

  user: function(){
    $('#content').empty();
       listUsers();
  },
  newUser: function () {
    $('#content').empty();
       newUser();
  },
  updateUser: function(id) {
    $('#content').empty();
      updateUser(id);
  },
  listCLient: function () {
    $('#content').empty();
       listCLient();
  },
  newClient: function () {
    $('#content').empty();
       newClient();
  },
  listAttributeList: function () {
    $('#content').empty();
       listAttributeList();
  },
  newAttributeList: function () {
    $('#content').empty();
       newAttributeList();
  },
  listVehicle: function () {
    $('#content').empty();
       listVehicle();
  },
  newVehicle: function () {
    $('#content').empty();
       newVehicle();
  },
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
  url: serverLink+'user',
  initialize: function(){
     // TODO: acciones de inicialización del modelo
  }
});

var ClientModel = Backbone.Model.extend({
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
  url: serverLink+'client',
  initialize: function(){
     // TODO: acciones de inicialización del modelo
  }
});

var UserCollection = Backbone.Collection.extend({
  model: User,
  url: function() {
     return serverLink+'user';
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

    var Combo = Backbone.View.extend({
      tpl: '<input id="combo" placeholder="Select ..." style="width: 55%;" />',
      required: false,
      labelname: null,
      render: function(where){

          var me = this;

          var input = $(this.tpl);

          var formgroup = $('<div class="form-group"></div>');
          formgroup.addClass('col-sm-6');

          if(!_.isNull(conf.labelname)){
            this.label = $('<label>'+conf.labelname+'</label>');
            formgroup.append(this.label);
          }

          if(conf.required){
            this.obj.attr('required', true);
            this.label.append('<span class="required">*</span>')
          }
          
          formgroup.append($(this.tpl));

          conf.render.append(formgroup);

          setTimeout(function (argument) {
             var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: serverLink+conf.url,
                        type: "get",
                        dataType: "json"
                    }
                },
                schema: {
                    total: 'total',
                    data: 'data'
                }
              }); 

              me.comboKendo = $('#combo').kendoComboBox({
                dataTextField: conf.displayField,
                dataValueField: conf.valueField,
                dataSource: dataSource,
                filter: "contains",
                suggest: true,
                index: 3
              });

              // create ComboBox from select HTML element
              $("#size").kendoComboBox();

              var fabric = $("#combo").data("kendoComboBox");
              var select = $("#size").data("kendoComboBox");


          }, 1000);
        
      },  
      value: function (value) {

        var me = this;
        if (value === undefined) {

            me.kendoDataCombobox = me.comboKendo.data("kendoComboBox");
            var dataItem = me.kendoDataCombobox.dataItem();

           
            if(dataItem){
              dataItem = dataItem.toJSON();
            }else{
                dataItem = [];
            }

            return dataItem;  
        

        } else {
          me.obj.val(value);
        }
      },

    });

    
    var combo = new Combo(conf);
    combo.render(conf.render);
    
    return combo;

  //}, 1000);

}

function Grid(conf) {

  var grid = $('<div id="grid"></div>');

  var toolbar = $('<div class="toolbar"></div>');

  if(conf.toolbar){
    for(var i=0; i< conf.toolbar.length; i++){
      var iToolbar = conf.toolbar[i];
      var btnAction = $('<button type="button" class="btn btn-primary">'+iToolbar.title+'</button>');
      toolbar.append(btnAction);
      //btnAction.click = iToolbar.click;
    
      btnAction.click(iToolbar.click);
    }

    grid.append(toolbar);
  }

  

  // setTimeout(function (argument) {

    conf.render.append(grid);

    var dataSource = new kendo.data.DataSource({
      transport: {
          read: {
              // the remote service url
              url: serverLink+conf.url,

              // the request type
              type: "get",

              // the data type of the returned result
              dataType: "json",

              // additional custom parameters sent to the remote service
              // data: {
              //     lat: 42.42,
              //     lon: 23.20,
              //     cnt: 10
              // }
          }
      },
      // describe the result format
      schema: {
          // the data, which the data source will be bound to is in the "list" field of the response
          // data: "list"
          total: 'total',
          data: 'data',
      },

    }); 

    grid.kendoGrid({
        dataSource: dataSource,
        height: 400,
        groupable: false,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: conf.columns
    });

   


  // }, 1000);


}

function listUsers () {

  //$('body').append('<div id="gridUser" class="grid"></div>');
  
  setTimeout(function (argument) {
    //$('body').find('#content').append('<div id="gridUser"></div>');
  
    var gridListUser = Grid({
      render: $('#content'),
      url: 'user/list',
      columns: [
          {
             field: "firstname", 
             title: "Nombre"
          },
          {
             field: "secondname", 
             title: "Segundo Nombre"
          },
          {
             field: "lastname", 
             title: "Apellido"
          },
          {
             field: "secondlastname", 
             title: "Segundo Apellido"
          },
          { 
            command: {
              text: "Update",
              click: function (e) {

                e.preventDefault();

                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                router.navigate('updateUser/'+dataItem.id, true);
              } 
            }, 
            title: " ", 
            width: "180px" 
          }
      ],
      toolbar: [
        { 
          title: "Add", 
          click: function (argument) {
              router.navigate('newUser', true);
          }
        }
      ]
    });
      
  }, 1000);
}

function newUser(argument) {

  //$("#gridUser").remove();

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

  //$("#gridUser").remove();

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

function listCLient () {
  
  setTimeout(function (argument) {
    //$('body').find('#content').append('<div id="grid"></div>');
  
    var gridListClient = Grid({
      render: $('#content'),
      url: 'client/list',
      columns: [
          {
             field: "fullname", 
             title: "Nombre"
          },
          {
            field: 'identificationNumber',
            title: 'Identificación'
          },
          {
            field: 'content',
            title: 'Tipo',
            template:"#: (content) ? content : '' #",
          },
          { 
            command: { 
              text: "Add", 
              click: function (argument) {
                  router.navigate('new', true);
              } 
            }, 
            title: " ", 
            width: "180px" 
          },
          { 
            command: {
              text: "Update",
              click: function (e) {

                e.preventDefault();

                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                // router.navigate('update/'+dataItem.id, true);
              } 
            }, 
            title: " ", 
            width: "180px" 
          }
      ],
      toolbar: [
        {
          title: 'Add',
          click: function (e) {
            // debugger
            e.preventDefault();
            router.navigate('newClient', true);
          }
        }
      ]
    });      
  }, 1000);
}

function newClient(argument) {

  $("#content").empty();

  var clientView = Backbone.View.extend({
     render: function(where){
          
        var div = $('<div></div>');

        var form = $('<form id="form-client"></form>');
        var fieldset1 = $('<fieldset class="sections"></fieldset>');
        fieldset1.append('<legend class="sections">Información general</legend>');

        var identificationNumber = Text({
          label: 'Identificación',
          render: fieldset1
        });

        var identificationType = Combo({
          url: 'attributelist/list',
          labelname: 'Tipo',
          displayField: 'content',
          valueField: 'value',
          render: fieldset1
        });

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
              'password': password.value(),
              'identificationNumber': identificationNumber.value(),
              'identificationType': identificationType.value()
            };

            data = JSON.stringify(data);

            var parameters = {
                type: 'POST',     
                //headers: K.currentApplication.buildRequestHeader(),                
                url : serverLink + 'client',
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
        }, 500);

        
        

        

        return this;
     },
  });

  var client = new clientView();
  client.render('#content');
}


function listAttributeList () {
  
  setTimeout(function (argument) {
    
    var gridAttributeList = Grid({
      render: $('#content'),
      url: 'attributelist/list',
      columns: [
          {
             field: "content", 
             title: "Contenido"
          },
          {
             field: "attributeName", 
             title: "Atributo"
          },
          {
             field: "value", 
             title: "Valor"
          },
          { 
            command: {
              text: "Update",
              click: function (e) {

                e.preventDefault();

                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                // debugger
                // router.navigate('update/'+dataItem.id, true);
              } 
            }, 
            title: " ", 
            width: "100px" 
          }
      ],
      toolbar: [
        {
          title: 'Add',
          click: function (e) {
            // debugger
            e.preventDefault();
            router.navigate('newAttributeList', true);
          }
        }
      ]
    });
   
  }, 500);
}

function newAttributeList(argument) {

  $("#content").empty();

  var attributeList = Backbone.View.extend({
     render: function(where){
          
        var div = $('<div></div>');

        var form = $('<form id="form-attributelist"></form>');
        var fieldset1 = $('<fieldset class="sections"></fieldset>');
        fieldset1.append('<legend class="sections">Información general</legend>');

        var content = Text({
          label: 'Contenido',
          required: true,
          render: fieldset1
        });

        var attributeName = Text({
          label: 'Atributo',
          render: fieldset1
        });

        var value = Text({
          label: 'Valor',
          required: true,
          render: fieldset1
        });

        form.append(fieldset1);
        div.append(form);

        var btnSave = $('<button>Guardar</button>');
        btnSave.addClass('btn btn-primary');
        div.append(btnSave);

        btnSave.click(function (argument) {
            var data = {
              'content': content.value(),
              'attributeName': attributeName.value(),
              'value': value.value()
            };

            data = JSON.stringify(data);

            var parameters = {
                type: 'POST',     
                //headers: K.currentApplication.buildRequestHeader(),                
                url : serverLink + 'attributelist',
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

  var attributeListView = new attributeList();
  attributeListView.render('#content');

}

function listVehicle () {
  
  setTimeout(function (argument) {
    
    var gridAttributeList = Grid({
      render: $('#content'),
      url: 'vehicle/list',
      columns: [
          {
             field: "code", 
             title: "Codigo"
          },
          {
             field: "name", 
             title: "Nombre"
          },
          {
             field: "description", 
             title: "Descripcion"
          },
          {
             field: "price", 
             title: "Precio"
          },
          { 
            command: {
              text: "Update",
              click: function (e) {

                e.preventDefault();

                // var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                // debugger
                // router.navigate('update/'+dataItem.id, true);
              } 
            }, 
            title: " ", 
            width: "100px" 
          }
      ],
      toolbar: [
        {
          title: 'Add',
          click: function (e) {
            // debugger
            e.preventDefault();
            router.navigate('newVehicle', true);
          }
        }
      ]
    });
   
  }, 500);
}