(function () {
  //var fileCatcher           = document.getElementById('btnGravar');
  var fileInput             = document.getElementById('file');
  var fileListDisplayRight  = document.getElementById('file-list-display-right');
  var fileListDisplayLeft   = document.getElementById('file-list-display-left');
  
  var fileList = [];
  var fileListAux = [];
  var renderFileList, sendFile, clearFiles;
  
  /*fileCatcher.addEventListener('click', function (evnt) {
    evnt.preventDefault();
    clearFiles();
  });*/
  
  document.addEventListener("DOMContentLoaded", function(event) {
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
    clearOneFiles(x);
    //fileList.splice(x, 1);
    //fileListAux.splice(x, 1)     
    fileListAux[x] = '<div class="progress" style="width:60%">'
                    + ' <div id="prgBar' + x + '" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%; color:#858796">'  
                    + 'anexo exclu&iacute;do...&nbsp;' 
                    + ' </div></div><BR>'
                    + '<div class="dropdown-divider"></div>'
                    ;
    renderFileList();
  };

  renderFileList = function () {
    fileListDisplayRight.innerHTML = '';
    fileListDisplayLeft.innerHTML = '';

    fileList.forEach(function (file, index) {
      var fileDisplayEl = document.createElement('p');

      if ( fileListAux[index] != '' && fileListAux[index] != undefined)
        fileDisplayEl.innerHTML = fileListAux[index];
      else
        fileDisplayEl.innerHTML = '<div class="progress" style="width:60%">'
                              + ' <div id="prgBar' + index + '" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%; color:#858796">' 
                              + file.name.substring(0,6) + "..." + file.type + '&nbsp;' 
                              + ' </div></div>'
                              + '<a href="#" onclick="renderDelFileList(' + index + ')"  class="btn btn-icon-split"><span class="fas fa-trash" title="Excluir anexo!"></span></a>&nbsp; | &nbsp;'
                              + '<a href="#" onclick="sendOneFile(' + index + ')"  class="btn btn-icon-split"><span class="fas fa-save" title="Salvar anexo!"></span></a>'
                              + '<div class="dropdown-divider"></div>'
                              ;                         
      
      if (index % 2 == 0 )
        fileListDisplayRight.appendChild(fileDisplayEl);
      else
        fileListDisplayLeft.appendChild(fileDisplayEl);
      
    });
    
  };
  
  clearFiles = function () {    
    var request = new XMLHttpRequest();
    request.open("POST", 'action/upload?action=clear&filename=tudo');
    request.send();
    /*sleep(3000);
    fileList.forEach(function (file) {
      sendFile(file);
    });*/
  };

  clearOneFiles = function (x) {
    
    var y = 0;

    fileList.forEach(function (file) {

      if ( y == x ) {
        var request = new XMLHttpRequest();
        request.open("POST", 'action/upload?action=clear&filename=idx'+x+'--'+file.name+'&extfile=.'+file.type.substring(file.type.length,file.type.indexOf('/')+1));
        request.send();
      }
      y++;
    });
  };

  sendFile = function (file) {
    var formData = new FormData();
    var request = new XMLHttpRequest();
 
    formData.set('file', file);
    request.open("POST", 'action/upload');
    request.send(formData);
  };

  sendOneFile = function (x) {
    
    var y = 0;

    $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 50);
    //sleep(2000);

    fileList.forEach(function (file) {

      if ( y == x ) {

        var formData = new FormData();
        var request = new XMLHttpRequest();
        formData.set('file', file);
        request.open("POST", 'action/upload?filename=idx'+x+'--'+file.name+'&extfile=.'+file.type.substring(file.type.length,file.type.indexOf('/')+1));
        request.send(formData);

        $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 90);
        sleep(200);
        $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 130);
        sleep(200);
        $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 160);
        sleep(1000);
        $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 1000);
        $('#prgBar'+x).attr('aria-valuenow', 100).css('color', '#FFFFFF');
        
        fileListAux[x] = '<div class="progress" style="width:60%">'
                    + ' <div id="prgBar' + XMLHttpRequest + '" class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:200%; color:#FFFFFF">' 
                    + file.name.substring(0,6) + "..." + file.type + '&nbsp;' 
                    + ' </div></div>'
                    + '<a href="#" onclick="renderDelFileList(' + x + ')"  class="btn btn-icon-split"><span class="fas fa-trash" title="Excluir anexo!"></span></a>&nbsp; | &nbsp;'
                    + '<a href="#" onclick="sendOneFile(' + x + ')"  class="btn btn-icon-split"><span class="fas fa-save" title="Salvar anexo!"></span></a>'
                    + '<div class="dropdown-divider"></div>'
                    ;
      }
      y++;
    });
    
  };
})();

function limpa_formulario_cep() {
  // Limpa valores do formulário de cep.
  $("#rua").val("");
  $("#bairro").val("");
  $("#cidade").val("");
  $("#uf").val("");            
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

var app = angular.module("app", ["chart.js"]).controller("NovaManifestacao", function($scope, $http){

  //load page
  $( document ).ready(function() {

    $scope.disabledItemTpoItem = false;
    $scope.disabledItem = false;

    //busca itens do estoque
    $scope.obtemdadositem();
    
    //busca form temporário manifestação
    //$scope.buscaitensinseridosmanifestacao();
    $scope.buscaformmanifestacao()

    //busca anexos da manifestação
    //$scope.buscaanexosmanifestacao();

    $('#gravandoModal').modal('show');
    $scope.mensagemmodal = 'Carregando...';
    $('#gravandoModal').modal('hide');
    $("#sidebarToggle").click();
    $('#gravandoModal').modal('hide');
        
  });

  $('.selectpicker').selectpicker();

  $('.file-upload').file_upload();

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

  //Quando o campo cep recebe um click.
  $("#btnCep").click(function() {

    //Nova variável "cep" somente com dígitos.
    //var cep = $(this).val().replace(/\D/g, '');
    var cep = $("#cep").val().replace(/\D/g, '');
    
    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if(validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            $("#rua").val("...");
            $("#bairro").val("...");
            $("#cidade").val("...");
            $("#uf").val("...");
            
            //Consulta o webservice viacep.com.br/
            $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {

                if (!("erro" in dados)) {
                    //Atualiza os campos com os valores da consulta.
                    $("#rua").val(dados.logradouro);
                    $("#bairro").val(dados.bairro);
                    $("#cidade").val(dados.localidade);
                    $("#uf").val(dados.uf);
                    $('#mensagemShowCep').html('');
						        $('#mensagemShowCep').removeClass( "alert alert-danger");
                } //end if.
                else {
                    //CEP pesquisado não foi encontrado.
                    limpa_formulario_cep();
                    $('#mensagemShowCep').html('CEP n&atilde;o encontrado.');
						        $('#mensagemShowCep').addClass( "alert alert-danger");                    
                }
            });
        } //end if.
        else {
            //cep é inválido.
            limpa_formulario_cep();
            $('#mensagemShowCep').html('CEP informado inv&aacute;lido.');
						$('#mensagemShowCep').addClass( "alert alert-danger"); 
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulario_cep();
    }
  });

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
      return;
    }

    if ($("#item").val() == "") return;

    $scope.erro = 'gray';

    $scope.salvarmanifestacaoform();

    $http({
        method : "POST",
        url : "action/data/manifestacao-form",
        headers: {
            'Content-type': 'application/json'
        },
        params: {
                  requested: 'criaitemmanifestacao'
                },
        data: { item      : $("#item").val() ,
                ds_tp_item: $("#tpitem").val() }
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
                   it_codigo: x.it_codigo}
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
          params: {requested: 'buscaitensinseridosmanifestacao'}
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
           
            //$scope.buscaformmanifestacao();
            $('#gravandoModal').modal('hide');
            
          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
          });
    $('#gravandoModal').modal('hide');
  }

  $scope.buscaformmanifestacao = function () {
    
    $http({
          method : "GET",
          url : "action/data/manifestacao-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'buscaformmanifestacao'}
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
            
            $scope.tipo          = response.data.response[0].tipo;
            $("#tipo").val(response.data.response[0].tipo).change();

            $scope.tpitem        = response.data.response[0].tpitem;
            $("#tpitem").val(response.data.response[0].tpitem).change();
            
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
     
    if ( $("#protocolo").val() == "" || $("#protocolo").val() == null ) return;
    if ( $("#origem").val() == "" || $("#origem").val() == null ) return;
    //if ( $("#telefone").val() == "" || $("#telefone").val() == null  ) return;
    if ( $("#cliente").val() == "" || $("#cliente").val() == null  ) return;
    /*if ( $("#cep").val() == "" || $("#cep").val() == null  ) return;
    if ( $("#rua").val() == "" || $("#rua").val() == null  ) return;
    if ( $("#nrlogradouro").val() == "" || $("#nrlogradouro").val() == null  ) return;
    if ( $("#bairro").val() == "" || $("#bairro").val() == null  ) return;
    if ( $("#cidade").val() == "" || $("#cidade").val() == null  ) return;
    if ( $("#uf").val() == "" || $("#uf").val() == null  ) return;*/
    if ( $("#tipo").val() == "" || $("#tipo").val() == null  ) return;
    if ( $("#tpitem").val() == "" || $("#tpitem").val() == null  ) return;      
    if ( $("#ocorrencia").val() == "" || $("#ocorrencia").val() == null  ) return;
    if ( $("#resposta").val() == "" || $("#resposta").val() == null  ) return;

    $scope.errovalidafinalizaform = false;
    var qtdItem = 0;

    angular.forEach($scope.itensmanifestacao, function(value, key) {
      qtdItem++;
    }, qtdItem);

    if ( ( $("#tipo").val() == 'reclamacao' ) && ( ( $("#tpitem").val() == 'produto' ) || ( $("#tpitem").val() == 'embalagem' ) ) && ( qtdItem == 0) ){      
      $scope.errovalidafinalizaform = true;
      $("#item").focus();
      return;        
    }
    //$('#btnGravar').click();
    $('#prefinalizamanifestacaoModal').modal('show');
    //$("#btnGravar").trigger('click'); 
  };

  $scope.finalizamanifestacao = function() {

    $scope.errovalidafinalizaform = false;

    var qtdItem = 0;

    angular.forEach($scope.itensmanifestacao, function(value, key) {
      qtdItem++;
    }, qtdItem);

    if ( ( $("#tipo").val() == 'reclamacao' ) && ( ( $("#tpitem").val() == 'SAI' ) || ( $("#tpitem").val() == 'SAE' ) ) && ( qtdItem == 0) ){ 
      
      $("#prefinalizamanifestacaoModal").modal('hide');
      $scope.errovalidafinalizaform = true;
      $("#item").focus();
      return;        
    }

    $("#prefinalizamanifestacaoModal").modal('hide');
    $scope.mensagemmodal  = "Aguarde mais um pouco, finalizando sua Manifesta\xE7\xE3o";
    $('#gravandoModal').modal('show');
    $http({
          method : "POST",
          url : "action/data/manifestacao-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: "finalizamanifestacaoform"},
          data:   { parecertecnico: 'Manifestação'}
          }).then(function mySucces(response) {

              if (response.data.ttRetornoHeader[0].retornoSucesso == true) {
                $scope.limparmanifestacaoform('finalizada');
                $('#finalizamanifestacaoModal').modal('show');
                $scope.mensagemmodal = 'Manifesta\xE7\xE3o criada com sucesso.';
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
  $scope.limparmanifestacaoform = function (action) {

    $('#confirmacancelModal').modal('hide');
    if (action != 'finalizada') {
      $('#gravandoModal').modal('show');
      $scope.mensagemmodal = 'Descartando informa\xE7\xF5es da manifesta\xE7\xE3o.';
    }

    $http({
        method : "POST",
        url : "action/data/manifestacao-form",
        headers: {
            'Content-type': 'application/json'
        },
        params: {requested: 'criamanifestacaoform'},
        data: { protocolo : "",
                origem    : "0800",
                telefone  : "",
                cliente   : "",
                cep       : "",
                rua       : "",
                nrlogradouro: "",
                complemento : "",
                bairro      : "",
                cidade      : "",
                uf          : "",
                tipo        : "elogio",
                tpitem      : "SAI",
                ocorrencia  : "",
                resposta    : "",
                investigacao: ""               
              }
        }).then(function mySucces(response) {
            $scope.buscaformmanifestacao();            
        }, function myError(response) {
                ERRO = response.statusText;
                console.log(ERRO);
          });

  };

  //envia pedido form //USADO NA API.
  $scope.salvarmanifestacaoform = function (called) {

    if (called != 'finaliza') $('#gravandoModal').modal('show');
    $scope.mensagemmodal = 'Salvando informa\xE7\xF5es da manifesta\xE7\xE3o.';

    $http({
        method : "POST",
        url : "action/data/manifestacao-form",
        headers: {
            'Content-type': 'application/json'
        },
        params: {requested: 'criamanifestacaoform'},
        data: { protocolo : $("#protocolo").val(),
                origem    : $("#origem").val(),
                telefone  : $("#telefone").val(),
                cliente   : $("#cliente").val(),
                cep       : $("#cep").val(),
                rua       : $("#rua").val(),
                nrlogradouro: $("#nrlogradouro").val(),
                complemento : $("#complemento").val(),
                bairro      : $("#bairro").val(),
                cidade      : $("#cidade").val(),
                uf          : $("#uf").val(),
                tipo        : $("#tipo").val(),
                tpitem      : $("#tpitem").val(),
                ocorrencia  : $("#ocorrencia").val(),
                resposta    : $("#resposta").val(),
                investigacao: $("#investigacao").val()                
              }
        }).then(function mySucces(response) {
          $('#gravandoModal').modal('hide');
          $scope.buscaformmanifestacao();          
        }, function myError(response) {
                ERRO = response.statusText;
                console.log(ERRO);
        });
            
  };

});

