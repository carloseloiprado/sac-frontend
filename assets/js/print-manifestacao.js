
var app = angular.module("app", ["chart.js"]).controller("PrintManifestacao", function($scope, $http){

  //load page
  $( document ).ready(function() {
    $scope.buscamanifestacao();

  });

  $scope.buscamanifestacao = function () {
     
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
        $scope.usuario          = response.data.ttRetorno[0].usuario;
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
      }, function myError(response) {
              ERRO = response.statusText;
              console.log(ERRO);
      });

  }

  $scope.buscaitemmanifestacao = function () {
     
    $http({
      method : "GET",
      url : "action/data/manifestacao",
      headers: {
          'Content-type': 'application/json'
      },
      params: {requested: 'itemmanifestacao', id: $scope.idmanifestacao}
      }).then(function mySucces(response) {

        $scope.itensmanifestacao = response.data.ttRetorno 
                 
      }, function myError(response) {
              ERRO = response.statusText;
              console.log(ERRO);
      });

  }

  $scope.buscaanexomanifestacao = function () {
    
    $http({
      method : "GET",
      url : "action/data/manifestacao",
      headers: {
          'Content-type': 'application/json'
      },
      params: {requested: 'anexomanifestacao', id: $scope.idmanifestacao}
      }).then(function mySucces(response) {

        $scope.anexomanifestacao = response.data.ttRetorno 
                 
      }, function myError(response) {
              ERRO = response.statusText;
              console.log(ERRO);
      });

  }

  $scope.buscahistoricomanifestacao = function () {
     
    $http({
      method : "GET",
      url : "action/data/manifestacao",
      headers: {
          'Content-type': 'application/json'
      },
      params: {requested: 'historicomanifestacao', id: $scope.idmanifestacao}
      }).then(function mySucces(response) {

        $scope.historicomanifestacao = response.data.ttRetorno;        

         

      }, function myError(response) {
              ERRO = response.statusText;
              console.log(ERRO);
      });
  }

  $scope.retornaDataHoraAtual = function (){

    var dNow = new Date();
    var localdate = dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
    return localdate;
  }

  $scope.idmanifestacao     = location.search.substr(1,(location.search.indexOf("&")-1))
  $scope.idtarmanifestacao  = location.search.substr(location.search.indexOf("&")+1)
  $scope.dthrimpressao      = $scope.retornaDataHoraAtual()

});

