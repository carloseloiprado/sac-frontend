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
        request.open("POST", 'action/upload?action=clear&filename=idx'+x+'tr'+file.name+'&extfile=.'+file.type.substring(file.type.length,file.type.indexOf('/')+1));
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
        request.open("POST", 'action/upload?filename=idx'+x+'tr'+file.name+'&extfile=.'+file.type.substring(file.type.length,file.type.indexOf('/')+1));
        request.send(formData);

        $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 90);
        sleep(200);
        $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 130);
        sleep(200);
        $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 160);
        sleep(1000);
        $('#prgBar'+x).attr('aria-valuenow', 100).css('width', 200);
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

  
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
  
  var app = angular.module("app", ["chart.js"]).controller("tramManifestacao", function($scope, $http){
  
      //load page
      $( document ).ready(function() {
    
        $('#carregandoModal').modal('show');
        $scope.errotramitaparecer = false;
        $scope.errotramitaconclusao = false;
        $scope.buscamanifestacao();
        $("#sidebarToggle").click()
            
      });
  
      $scope.buscamanifestacao = function () {
        $('#carregandoModal').modal('hide');
        $http({
          method : "GET",
          url : "action/data/manifestacao",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'manifestacao', id: $scope.idmanifestacao}
          }).then(function mySucces(response) {
            
            $scope.protocolo    = response.data.ttRetorno[0].protocolo;
            $scope.bairro       = response.data.ttRetorno[0].bairro;
            $scope.cep          = response.data.ttRetorno[0].cep;
            $scope.cidadeuf     = response.data.ttRetorno[0].cidadeuf;
            $scope.cliente      = response.data.ttRetorno[0].cliente;
            $scope.dthrmanifestacao = response.data.ttRetorno[0].dthrmanifestacao;
            $scope.investigacao     = response.data.ttRetorno[0].investigacao;
            $scope.logradouro       = response.data.ttRetorno[0].logradouro;
            $scope.ocorrencia       = response.data.ttRetorno[0].ocorrencia;
            $scope.origem           = response.data.ttRetorno[0].origem;
            $scope.protocolo        = response.data.ttRetorno[0].protocolo;
            $scope.resposta         = response.data.ttRetorno[0].resposta;
            $scope.telefone         = response.data.ttRetorno[0].telefone;
            $scope.tipotpitem       = response.data.ttRetorno[0].tipotpitem;
  
            $scope.buscaanexomanifestacao();
            $scope.buscahistoricomanifestacao();
            $scope.buscaitemmanifestacao();
            $('#carregandoModal').modal('hide');
    
          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
          }); 
          $('#carregandoModal').modal('hide'); 
      }
      
      $scope.buscaitemmanifestacao = function () {
        $('#carregandoModal').modal('hide');
        $http({
          method : "GET",
          url : "action/data/manifestacao",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'itemmanifestacao', id: $scope.idmanifestacao}
          }).then(function mySucces(response) {
    
            $scope.itensmanifestacao = response.data.ttRetorno 
            $('#carregandoModal').modal('hide');         
          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
          });
          $('#carregandoModal').modal('hide');
    
      }

      $scope.buscaanexomanifestacao = function () {
        $('#carregandoModal').modal('hide');
        $http({
          method : "GET",
          url : "action/data/manifestacao",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'anexomanifestacao', id: $scope.idmanifestacao}
          }).then(function mySucces(response) {
  
            $scope.anexomanifestacao = response.data.ttRetorno
            $('#carregandoModal').modal('hide');          
          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
          });
          $('#carregandoModal').modal('hide');
      }
    
      $scope.buscahistoricomanifestacao = function () {
        $('#carregandoModal').modal('hide');
        $http({
          method : "GET",
          url : "action/data/manifestacao",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'historicomanifestacao', id: $scope.idmanifestacao}
          }).then(function mySucces(response) {
  
            $scope.historicomanifestacao = response.data.ttRetorno
            $('#carregandoModal').modal('hide');          
          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
          });
          $('#carregandoModal').modal('hide');
      }
    
      $scope.idmanifestacao     = location.search.substr(1,(location.search.indexOf("&")-1))
      $scope.idtarmanifestacao  = location.search.substr(location.search.indexOf("&")+1) 
      $scope.lnktramitar        =  location.search.replace('T','');
      $scope.histBack           = document.referrer.split('/')[6]
    
      $scope.pretramitamanifestacao = function() {
       
        $("#historicoManifestacaoModal").modal('hide');
  
        $scope.errotramitaconclusao = false;
        if ( $("#conclusao").val() == "" || $("#conclusao").val() == null || $("#conclusao").val() == "selecione" ) {
          $scope.errotramitaconclusao = true;
          $("#conclusao").focus()
          return;    
        }
        
        $scope.errotramitaparecer = false;
        if ( $("#parecertecnico").val() == "" || $("#parecertecnico").val() == null ) {
          $scope.errotramitaparecer = true;
          return;
        }
        $('#pretramitamanifestacaoModal').modal('show');
        //$("#btnGravar").trigger('click');        
      };
  
      $scope.presolucionamanifestacao = function() {
       
        $("#historicoManifestacaoModal").modal('hide');
  
        $scope.errotramitaconclusao = false;
        if ( $("#conclusao").val() == "" || $("#conclusao").val() == null  ) {
          $scope.errotramitaconclusao = true;
          return;    
        }
        
        $scope.errotramitaparecer = false;
        if ( $("#parecertecnico").val() == "" || $("#parecertecnico").val() == null ) {
          $scope.errotramitaparecer = true;
          return;
        } 
        $('#presolucionamanifestacaoModal').modal('show');
        //$("#btnGravar").trigger('click');        
      };
  
      $scope.tramitarmanifestacao = function() {
  
        $("#pretramitamanifestacaoModal").modal('hide');
        $('#presolucionamanifestacaoModal').modal('hide');
        $scope.mensagemmodal  =  "Processando...";
        $scope.corpomensagemmodal  =  "Aguarde fim do processamento...."
        $("#tramitandoManifestacaoModal").modal('show');
        
        $http({
              method : "POST",
              url : "action/data/tram-manifestacao",
              headers: {
                  'Content-type': 'application/json'
              },
              params: {requested: "tramitamanifestacao",
                       idtarmanifestacao: $scope.idtarmanifestacao,
                       idmanifestacao: $scope.idmanifestacao,
                       ptpitem: ''},
              data:   { parecertecnico: $('#parecertecnico').val(),
                        conclusao     : $('#conclusao').val(),
                        acao          : 'TRÂMITADA'} 
              }).then(function mySucces(response) {
  
                  $("#tramitandoManifestacaoModal").modal('hide');
  
                  if (response.data.ttRetornoHeader[0].retornoSucesso == true) {
                    $('#tramitamanifestacaoModal').modal('show');
                    $scope.mensagemmodal  = "Manifesta\xE7\xE3o Tr\xE2mitada com Sucesso";
                    console.log(response.data);
                    $scope.nummanifestacaosistema = "Manifesta\xE7\xE3o "  + response.data.ttRetornoHeader[0].retornoMensagem + " tr\xE2mitada com sucesso. ";
                    
                  }
                  else {
                    $("#tramitandoManifestacaoModal").modal('hide');
                    $('#errotramitamanifestacaoModal').modal('show');
                    $scope.mensagemmodal  = "Erro ao Tr\xE2mitar a Manifesta\xE7\xE3o";
                    console.log(response.data);
                    $scope.nummanifestacaosistema = response.data.ttRetornoHeader[0].retornoMensagem;
                  }
    
              }, function myError(response) {
                      ERRO = response.statusText;
                      console.log(ERRO);
                });
                $("#tramitandoManifestacaoModal").modal('hide');                
      };
  
      $scope.solucionamanifestacao = function() {
  
        $("#presolucionamanifestacaoModal").modal('hide');
        $scope.mensagemmodal  =  "Processando...";
        $scope.corpomensagemmodal  =  "Aguarde fim do processamento...."
        //$("#tramitandoManifestacaoModal").modal('show');
        
        $http({
              method : "POST",
              url : "action/data/tram-manifestacao",
              headers: {
                  'Content-type': 'application/json'
              },
              params: {requested: "tramitamanifestacao",
                       idtarmanifestacao: $scope.idtarmanifestacao,
                       idmanifestacao: $scope.idmanifestacao,
                       ptpitem: 'SAC'},
              data:   { parecertecnico: $('#parecertecnico').val(),
                        conclusao     : $('#conclusao').val(),
                        acao          : 'TRÂMITADA'}
              }).then(function mySucces(response) {
  
                  $("#tramitandoManifestacaoModal").modal('hide');
  
                  if (response.data.ttRetornoHeader[0].retornoSucesso == true) {
                    $('#tramitamanifestacaoModal').modal('show');
                    $scope.mensagemmodal  = "Manifesta\xE7\xE3o Tr\xE2mitada com Sucesso";
                    console.log(response.data);
                    $scope.nummanifestacaosistema = "Manifesta\xE7\xE3o "  + response.data.ttRetornoHeader[0].retornoMensagem + " tr\xE2mitada com sucesso. ";
                    
                  }
                  else {
                    $('#errotramitamanifestacaoModal').modal('show');
                    $scope.mensagemmodal  = "Erro ao Tr\xE2mitar a Manifesta\xE7\xE3o";
                    console.log(response.data);
                    $scope.nummanifestacaosistema = response.data.ttRetornoHeader[0].retornoMensagem;
                  }
    
              }, function myError(response) {
                      ERRO = response.statusText;
                      console.log(ERRO);
                });
      };
  
    });
  