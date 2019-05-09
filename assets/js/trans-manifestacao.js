
var app = angular.module("app", ["chart.js"]).controller("tramManifestacao", function($scope, $http){

    //load page
    $( document ).ready(function() {
  
      $('#carregandoModal').modal('show');
      $scope.errotramitaparecer = false;
      $scope.errotramitaresponsavel = false;
      $scope.buscamanifestacao();

      //busca usuários do grupo do usuário corrente
      $scope.obtemdadosusuarios();
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

          $scope.buscaitemmanifestacao();
          $scope.buscaanexomanifestacao();
          $scope.buscahistoricomanifestacao();
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
    $scope.histBack           = document.referrer.split('/')[6] 
  
    $scope.pretransferemanifestacao = function() {
     
      $("#historicoManifestacaoModal").modal('hide');

      $scope.errotramitaresponsavel = false;
      if ( $("#tpitem").val() == "" || $("#tpitem").val() == null  ) {
        $scope.errotramitaresponsavel = true;
        $("#tpitem").focus() 
        return;  
      }  

      $('#pretransferemanifestacaoModal').modal('show');
    };

    $scope.transferirmanifestacao = function() {

      $("#pretransferemanifestacaoModal").modal('hide');
      $scope.mensagemmodal      =  "Processando...";
      $scope.corpomensagemmodal =  "Aguarde fim do processamento...."      
      //$("#transferindoManifestacaoModal").modal('show');
      
      $http({
            method : "POST",
            url : "action/data/trans-manifestacao",
            headers: {
                'Content-type': 'application/json'
            },
            params: {requested: "transferemanifestacao",
                     idtarmanifestacao: $scope.idtarmanifestacao,
                     idmanifestacao: $scope.idmanifestacao,
                     ptpitem: $('#tpitem').val()},
            data:   { parecertecnico: $('#parecertecnico').val(),
                      conclusao     : ''}
            }).then(function mySucces(response) {

                $("#transferindoManifestacaoModal").modal('hide');

                if (response.data.ttRetornoHeader[0].retornoSucesso == true) {
                  $('#transferemanifestacaoModal').modal('show');
                  $scope.mensagemmodal  = "Manifesta\xE7\xE3o Transferida com Sucesso";
                  console.log(response.data);
                  $scope.nummanifestacaosistema = "Manifesta\xE7\xE3o "  + response.data.ttRetornoHeader[0].retornoMensagem + " transferida com sucesso. ";
                  
                }
                else {
                  $('#errotransferemanifestacaoModal').modal('show');
                  $scope.mensagemmodal  = "Erro ao Tr\xE2mitar a Manifesta\xE7\xE3o";
                  console.log(response.data);
                  $scope.nummanifestacaosistema = response.data.ttRetornoHeader[0].retornoMensagem;
                }
  
            }, function myError(response) {
                    ERRO = response.statusText;
                    console.log(ERRO);
              });
    };

    //Quando o campo cep recebe um click.
    $scope.obtemdadosusuarios = function() {
      console.log('');

      $http({
            method : "GET",
            url : "action/data/usuariosgrupo",
            headers: {
                'Content-type': 'application/json'
            },
            params: {idmanifestacao: $scope.idmanifestacao}
            }).then(function mySucces(response) {

              $('#tpitem').select2({
                  placeholder: "Selecione um usuário ou grupo",
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

  });
  
  