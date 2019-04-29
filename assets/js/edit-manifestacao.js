(function () {
  var fileCatcher           = document.getElementById('btnGravar');
  var fileInput             = document.getElementById('file');
  var fileListDisplayRight  = document.getElementById('file-list-display-right');
  var fileListDisplayLeft   = document.getElementById('file-list-display-left');
  
  var fileList = [];
  var renderFileList, sendFile, clearFiles;
  
  fileCatcher.addEventListener('click', function (evnt) {
    evnt.preventDefault();
    clearFiles();
  });
  
  fileInput.addEventListener('change', function (evnt) {
    //fileList = [];
    for (var i = 0; i < fileInput.files.length; i++) {
      //if ( fileInput.files[i].type.indexOf('rar') > -1 || fileInput.files[i].type.indexOf('zip') > -1 )
        fileList.push(fileInput.files[i]);
    }
    if ( fileList.length > 0 )
      renderFileList()
  });
  
  renderDelFileList = function (x) {

    //delete fileList[x];
    fileList.splice(x, 1)

    renderFileList();
  };

  renderFileList = function () {
    fileListDisplayRight.innerHTML = '';
    fileListDisplayLeft.innerHTML = '';

    fileList.forEach(function (file, index) {
      var fileDisplayEl = document.createElement('p');
      fileDisplayEl.innerHTML = '<a href="#" onclick="renderDelFileList(' + index + ')"  class="btn btn-icon-split"><span class="fas fa-trash" title="Excluir anexo!"></span></a>' + '  ' + file.name.substring(0,6) + "..." + file.type + '<div class="dropdown-divider"></div>';
      
      if (index % 2 == 0 )
        fileListDisplayRight.appendChild(fileDisplayEl);
      else
        fileListDisplayLeft.appendChild(fileDisplayEl);
      
    });
  };
  
  clearFiles = function () {    
    var request = new XMLHttpRequest();
    request.open("POST", 'action/upload?action=clear');
    request.send();
    sleep(500);
    fileList.forEach(function (file) {
      sendFile(file);
    });
  };

  sendFile = function (file) {
    var formData = new FormData();
    var request = new XMLHttpRequest();
 
    formData.set('file', file);
    request.open("POST", 'action/upload');
    request.send(formData);
  };
})();

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var app = angular.module("app", ["chart.js"]).controller("EditaManifestacao", function($scope, $http){

  //load page
  $( document ).ready(function() {

    $scope.disabledItemTpoItem = false;
    $scope.disabledItem = false;

    //busca itens do estoque
    $scope.obtemdadositem();
    
    //busca form temporário manifestação
    //$scope.buscaitensinseridosmanifestacao();
    $scope.buscamanifestacao()

    //busca anexos da manifestação
    //$scope.buscaanexosmanifestacao();

    $('#gravandoModal').modal('show');
    $scope.mensagemmodal = 'Carregando...';
    $('#gravandoModal').modal('hide');
    $("#sidebarToggle").click()
        
  });

  $('.selectpicker').selectpicker();
  $('.file-upload').file_upload();
  $scope.idmanifestacao     = location.search.substr(1,(location.search.indexOf("&")-1))
  $scope.idtarmanifestacao  = location.search.substr(location.search.indexOf("&")+1).replace('T','');
  $scope.histBack           = document.referrer.split('/')[6]

  //Quando o campo cep recebe um click.
  $scope.obtemdadositem = function() {
    console.log('');

    $http({
          method : "GET",
          url : "action/data/itemestoque",
          headers: {
              'Content-type': 'application/json'
          },
          params: {ptpitem: $('#tpitem').val()}
          }).then(function mySucces(response) {

            $('#item').select2({
                placeholder: "Selecione um item",
                allowClear: true ,                
                //minimumInputLength: 3,
                quietMillis: 50,
                data: { results: response.data.ttRetorno, text: "text" },
                formatResult: function(data) {
                  return data.text ;
                },
                formatSelection: function(data) {
                  return data.text;
                },
              }).on("select2-blur", function(e) {                                         
                      console.log("blur");
              });
          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
          });
  };

  $scope.addItem = function() {

    $scope.erroitemjainserido = false

    var encontrou = false

    angular.forEach($scope.itensmanifestacao, function(value, key) {

       // console.log(value)

        if(value.it_codigo == $("#item").val())
          encontrou = true

       // console.log(value)

    }, encontrou);


    if (encontrou) {
      $scope.erroitemjainserido = true;
      $("#item").focus();
      return;
    }

    if ($("#item").val() == "") return;

    $scope.erro = 'gray';

    $scope.salvarmanifestacao('addItem');

    $http({
        method : "POST",
        url : "action/data/manifestacao-form",
        headers: {
            'Content-type': 'application/json'
        },
        params: {
                  requested: 'editaitemmanifestacao',
                  id: $scope.idmanifestacao
                },
        data: { item      : $("#item").val() }
        }).then(function mySucces(response) {
            
            //busca item pedido
            $scope.buscaitensinseridosmanifestacao();

        }, function myError(response) {
                ERRO = response.statusText;
                console.log(ERRO);
          });

  };

  $scope.eliminaritempedido = function(x) {

    $scope.itemselecionado = x.item;
    console.log('eliminar item: '+x.item);

    // $scope.mensagemmodal = 'Deseja excluir o item ' +x.item+ ' do pedido?'
    //$('#dialogosimnao').modal('show')

    $http({
          method : "DELETE",
          url : "action/data/manifestacao-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: "excluiitemmanifestacao",
                   it_codigo: x.it_codigo,
                   id: $scope.idmanifestacao}
          }).then(function mySucces(response) {

            //$scope.mensagemmodal =  'Item excluido com sucesso'
            //$('#modalmensagem').modal('show')
            $scope.erroitemjainserido = false;
            $scope.buscaitensinseridosmanifestacao()

          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });

  };
 
  $scope.buscaitensinseridosmanifestacao = function () {
    $('#gravandoModal').modal('hide');
    $http({
          method : "GET",
          url : "action/data/manifestacao-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'buscaitensmanifestacao', id: $scope.idmanifestacao}
          }).then(function mySucces(response) {
            
            $('#gravandoModal').modal('hide');
            var log;
            var iQtd = 0;

            //console.log(response.data.ttRetorno)
  
            $scope.itensmanifestacao = response.data.ttRetorno

            angular.forEach(response.data.ttRetorno, function(value, key) {
              iQtd++;
            }, iQtd);
            
            (iQtd > 0) ? $('#divTableItens').show() : $('#divTableItens').hide();
            (iQtd > 0) ? $scope.disabledItemTpoItem = true : $scope.disabledItemTpoItem = false;
            (iQtd > 0) ? $scope.disabledItem = true : $scope.disabledItem = false;

            if (iQtd > 0) $scope.errovalidafinalizaform = false;
           
            //$scope.buscamanifestacao();
            $('#gravandoModal').modal('hide');
            
          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
          });
    $('#gravandoModal').modal('hide');
  }

  $scope.buscamanifestacao = function () {
    
    $http({
          method : "GET",
          url : "action/data/manifestacao-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'buscamanifestacao', id: $scope.idmanifestacao}
          }).then(function mySucces(response) {

            $('#gravandoModal').modal('hide');
            $scope.protocolo   = response.data.response[0].protocolo;
            $scope.origem      = response.data.response[0].origem;
            $scope.telefone    = response.data.response[0].telefone;
            $scope.cliente     = response.data.response[0].cliente;
            $scope.cep         = response.data.response[0].cep;
            $scope.rua         = response.data.response[0].rua;
            $scope.nrlogradouro  = response.data.response[0].nrlogradouro;
            $scope.complemento   = response.data.response[0].complemento;
            $scope.bairro        = response.data.response[0].bairro;
            $scope.cidade        = response.data.response[0].cidade;
            $scope.uf            = response.data.response[0].uf;
            
            //$scope.tipo          = response.data.response[0].tipo;
            //$("#tipo").val(response.data.response[0].tipo).change();

            $scope.tpitem        = response.data.response[0].tpitem;
            //$("#tpitem").val(response.data.response[0].tpitem).change();
            
            $scope.ocorrencia    = response.data.response[0].ocorrencia;
            $scope.resposta      = response.data.response[0].resposta;
            $scope.investigacao  = response.data.response[0].investigacao;
            
            $scope.buscaitensinseridosmanifestacao();
            $('#gravandoModal').modal('hide');
          }, function myError(response) {
                
                  ERRO = response.statusText;
                  console.log(ERRO);
          });   
    $('#gravandoModal').modal('hide');
  }

  
  $scope.prefinalizamanifestacao = function() {
     
    if ( $("#ocorrencia").val() == "" || $("#ocorrencia").val() == null  ) return;
    if ( $("#resposta").val() == "" || $("#resposta").val() == null  ) return;

    $scope.errovalidafinalizaform = false;
    var qtdItem = 0;

    angular.forEach($scope.itensmanifestacao, function(value, key) {
      qtdItem++;
    }, qtdItem);

    if ( ( $("#tpitem").val() == 'Reclamação: Produto' || $("#tpitem").val() == 'Reclamação: Embalagem' ) && ( qtdItem == 0) ){      
      $scope.errovalidafinalizaform = true;
      $("#item").focus();
      return;        
    }
    //$('#btnGravar').click();
    $("#btnGravar").trigger('click');
    
    $('#prefinalizamanifestacaoModal').modal('show');
  };

  $scope.finalizamanifestacao = function() {

    $scope.errovalidafinalizaform = false;

    var qtdItem = 0;

    angular.forEach($scope.itensmanifestacao, function(value, key) {
      qtdItem++;
    }, qtdItem);

    if ( ( $("#tpitem").val() == 'Reclamação: Produto' || $("#tpitem").val() == 'Reclamação: Embalagem' ) && ( qtdItem == 0) ){      
      $("#prefinalizamanifestacaoModal").modal('hide');
      $scope.errovalidafinalizaform = true;
      $("#item").focus();
      return;        
    }

    $("#prefinalizamanifestacaoModal").modal('hide');
    $scope.mensagemmodal  = "Aguarde mais um pouco, finalizando edi\xE7\xE3o da Manifesta\xE7\xE3o";
    //$('#gravandoModal').modal('show');
    $http({
          method : "POST",
          url : "action/data/manifestacao-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: "finalizaedicaomanifestacao", id: $scope.idmanifestacao},
          data:   { parecertecnico: 'Manifestação'}
          }).then(function mySucces(response) {
              
              $('#gravandoModal').modal('hide');
              if (response.data.ttRetornoHeader[0].retornoSucesso == true) {
                $('#finalizamanifestacaoModal').modal('show');
                $scope.mensagemmodal = 'Manifesta\xE7\xE3o editada com sucesso.';
                $scope.nummanifestacaosistema = "Manifesta\xE7\xE3o "  + response.data.ttRetornoHeader[0].retornoMensagem;
                $('#gravandoModal').modal('hide');
              }
              else {
                $('#errofinalizamanifestacaoModal').modal('show');
                $scope.mensagemmodal  = "Erro ao Finalizar a Manifesta\xE7\xE3o";
                $scope.nummanifestacaosistema = response.data.ttRetornoHeader[0].retornoMensagem;
                $('#gravandoModal').modal('hide');
              }

          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });
    $('#gravandoModal').modal('hide');
  };

  //envia pedido form //USADO NA API.
  $scope.salvarmanifestacao = function (called) {

    if (called != 'finaliza') $('#gravandoModal').modal('show');
    $scope.mensagemmodal = 'Salvando informa\xE7\xF5es da manifesta\xE7\xE3o.';

    $http({
        method : "POST",
        url : "action/data/manifestacao-form",
        headers: {
            'Content-type': 'application/json'
        },
        params: {requested: 'editamanifestacao', id: $scope.idmanifestacao},
        data: { ocorrencia  : $("#ocorrencia").val(),
                resposta    : $("#resposta").val(),
                investigacao: $("#investigacao").val()                
              }
        }).then(function mySucces(response) {
          $('#gravandoModal').modal('hide');

          if (called != 'addItem') $scope.buscamanifestacao();          
        }, function myError(response) {
                ERRO = response.statusText;
                console.log(ERRO);
        });
            
  };

});

