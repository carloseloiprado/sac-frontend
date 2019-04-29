
var app = angular.module("app", ["chart.js"]).controller("DetailManifestacao", function($scope, $http){

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

        $scope.historicomanifestacao = response.data.ttRetorno;        

        $('#carregandoModal').modal('hide');

      }, function myError(response) {
              ERRO = response.statusText;
              console.log(ERRO);
      });
  }

  $scope.idmanifestacao     = location.search.substr(1,(location.search.indexOf("&")-1))
  $scope.idtarmanifestacao  = location.search.substr(location.search.indexOf("&")+1)
  $scope.lnktramitar        =  location.search.replace('T','');
  $scope.mensagemmodal      =  "Deseja realmente assumir a manifesta\xE7\xE3o?";
  $scope.corpomensagemmodal =  "Assuma e execute as tarefas pertinentes para atender a manifesta\xE7\xE3o"
  $scope.histBack           = document.referrer.split('/')[6]

  if ($scope.idtarmanifestacao == 0){
    $("#btnAssume").hide();
    $("#btnAssumeHist").hide();
    $("#btnTramitaHist").hide();
    $("#btnTramita").hide();
    $("#lnkAssume").hide();
    $("#lnkTramita").hide();
    $("#lnkTransferir").hide();
    $("#btnTrans").hide();
    $("#btnTransHist").hide();
  }
  else if ( $scope.idtarmanifestacao.substr(0,1) == 'T'){
    $("#btnAssume").hide();
    $("#btnAssumeHist").hide();
    $("#lnkAssume").hide();
  }
  else if ( $scope.idtarmanifestacao.substr(0,1) == 'A'){
    $("#btnTramitaHist").hide();
    $("#btnTramita").hide();
    $("#lnkTramita").hide();
    $("#lnkTransferir").hide();
    $("#btnTrans").hide();
    $("#btnTransHist").hide();
    $scope.idtarmanifestacao  = $scope.idtarmanifestacao.replace('A','');
  }

  if ( $("#grpSAC").val() == "#" ) {
    $("#btnEditar").hide();
    $("#lnkEditar").hide();
  }

  $scope.fechamodalhist = function() {
    $("#historicoManifestacaoModal").modal('hide');
  };  

  $scope.assumemanifestacao = function() {

    $("#assumeManifestacaoModal").modal('hide');
    $scope.mensagemmodal  =  "Processando...";
    $scope.corpomensagemmodal  =  "Aguarde fim do processamento...."
    $("#processaManifestacaoModal").modal('show');

    $http({
          method : "POST",
          url : "action/data/manifestacao",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: "assumemanifestacao", id: $scope.idmanifestacao, idtar: $scope.idtarmanifestacao},
          data:   { parecertecnico: 'Manifestação'}
          }).then(function mySucces(response) {

            $("#processaManifestacaoModal").modal('hide');
            $scope.mensagemmodal  =  "Manifesta\xE7\xE3o assumida com sucesso!";
            $scope.corpomensagemmodal  =  "Manifesta\xE7\xE3o " + $scope.idmanifestacao + " assumida com sucesso!";
            $("#sucessoAssumeManifestacaoModal").modal('show');  

          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });
  };

  $scope.doTheBack = function() {
    window.history.back();
  };

});

