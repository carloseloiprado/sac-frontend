
var app = angular.module("app", ["chart.js"]).controller("FinishManifestacao", function($scope, $http){

  //load page
  $( document ).ready(function() {

    $('#carregandoModal').modal('show');
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

        $('#carregandoModal').modal('hide');
        $scope.buscaitemmanifestacao();
        $scope.buscaanexomanifestacao();
        $scope.buscahistoricomanifestacao();
        

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
        $('#carregandoModal').modal('hide');
        $scope.itensmanifestacao = response.data.ttRetorno          
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
        $('#carregandoModal').modal('hide');
        $scope.anexomanifestacao = response.data.ttRetorno          
      }, function myError(response) {
              ERRO = response.statusText;
              console.log(ERRO);
      }); 
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
        $('#carregandoModal').modal('hide');
        $scope.historicomanifestacao = response.data.ttRetorno          
      }, function myError(response) {
              ERRO = response.statusText;
              console.log(ERRO);
      });
      $('#carregandoModal').modal('hide');
  }

  $scope.idmanifestacao     = location.search.substr(1,(location.search.indexOf("&")-1))
  $scope.idtarmanifestacao  = location.search.substr(location.search.indexOf("&")+1) 
  $scope.mensagemmodal      =  "Deseja realmente finalizar a manifesta\xE7\xE3o?";
  $scope.corpomensagemmodal =  "Manifesta\xE7\xE3o finalizada n\xE3o poder\xE1 mais ser reaberta!"
  $scope.mensagemmodaldevolve      =  "Deseja realmente devolver a manifesta\xE7\xE3o?";
  $scope.corpomensagemmodaldevolve =  "Manifesta\xE7\xE3o ser\xE1 devolvida ao usu\xE1rio respons\xE1vel!"
  $scope.histBack           = document.referrer.split('/')[6]

  $scope.fechamodalhist = function() {
    $("#historicoManifestacaoModal").modal('hide');
  };
  
  $scope.finalizaManifestacaoModal = function() {

    $scope.mensagemmodal  =  "Processando...";
    $scope.corpomensagemmodal  =  "Aguarde fim do processamento...."
    $("#finalizaManifestacaoModal").modal('hide');
    //$("#finalizandoManifestacaoModal").modal('show');

    $http({
          method : "POST",
          url : "action/data/manifestacao",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: "finalizamanifestacao", id: $scope.idmanifestacao, idtar: $scope.idtarmanifestacao},
          data:   { parecertecnico: $('#parecertecnico').val(),
                    acao          : 'Manifestação'}
          }).then(function mySucces(response) {

            $("#finalizandoManifestacaoModal").modal('hide');
            $("#suFinalizaManifestacaoModal").modal('show'); 
            $scope.mensagemmodal  =  "Manifesta\xE7\xE3o finalizada com sucesso!";
            $scope.corpomensagemmodal  =  "Manifesta\xE7\xE3o protocolo: " + $scope.protocolo + " finalizada com sucesso!";
             

          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });
  };

  $scope.devolveManifestacao = function() {

    $scope.mensagemmodaldevolve       =  "Processando...";
    $scope.corpomensagemmodaldevolve  =  "Aguarde fim do processamento...."
    $("#devolveManifestacaoModal").modal('hide');
    //$("#finalizandoManifestacaoModal").modal('show');
    
    $http({
          method : "POST",
          url : "action/data/devolve-manifestacao",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: "devolvemanifestacao",
                   idtarmanifestacao: $scope.idtarmanifestacao,
                   idmanifestacao: $scope.idmanifestacao,
                   ptpitem: ''},
          data:   { parecertecnico: $('#parecertecnico').val(),
                    conclusao     : ''}
          }).then(function mySucces(response) {

            $("#finalizandoManifestacaoModal").modal('hide');
            $("#suFinalizaManifestacaoModal").modal('show'); 
            $scope.mensagemmodal  =  "Manifesta\xE7\xE3o devolvida com sucesso!";
            $scope.corpomensagemmodal  =  "Manifesta\xE7\xE3o protocolo: " + $scope.protocolo + " devolvida ao usu\xE1rio respons\xE1vel!";

          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });
  };

});

