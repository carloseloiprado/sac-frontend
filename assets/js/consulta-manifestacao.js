
var app = angular.module("app", ["chart.js"]).controller("ConsultaManifestacao", function($scope, $http){
  
  var dataSet = [];
  //dataSet.push( ["um registro"] );
  //load page
  $( document ).ready(function() {  
    $("#sidebarToggle").click();
    $('#dtini').datepicker("setDate", new Date());    
    $('#dtfim').datepicker("setDate", new Date());  
  });
  
  //Quando o campo cep recebe um click.
  $scope.buscamanifestacoes = function() {

      if ( $("#dtini").val() == '' || $("#dtfim ").val()  == '' )
        return;

      dataSet = []; 
      $http({
        method : "GET",
        url : "action/data/consultamanifestacoes",
        headers: {
            'Content-type': 'application/json'
        },
        params: {origem: $("#origem").val(),
                 tipo: $("#tipo").val(),
                 uf: $("#uf").val(),
                 dtini: $("#dtini").val(),
                 dtfim: $("#dtfim ").val()}
        }).then(function mySucces(response) {
                  
          var iIdx = 0;
          //$scope.itensmanifestacao = response.data.ttRetorno

          angular.forEach(response.data.ttRetorno, function(value, key) {
            dataSet.push( [ '<a href="print-manifestacao?' + response.data.ttRetorno[iIdx].id +  '&' + response.data.ttRetorno[iIdx].idtar + '" target="_blank" class="btn btn-sm"><i class="fa fa-align-justify" style="font-size:24px" data-toggle="tooltip" data-placement="right" title="Imprimie Manifesta&ccedil;&atilde;o Detalhada!"></i></a>', response.data.ttRetorno[iIdx].nrprotocolo, response.data.ttRetorno[iIdx].dtcadastro,response.data.ttRetorno[iIdx].tempo , response.data.ttRetorno[iIdx].sstatus, response.data.ttRetorno[iIdx].responsavel, response.data.ttRetorno[iIdx].origem, response.data.ttRetorno[iIdx].tipo, response.data.ttRetorno[iIdx].tempo ] );
            iIdx++;
          }, iIdx);

          var table = $('#myTable').DataTable( {
              dom: 'Bfrtip',
              buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
              ],
              "createdRow": function( row, data, dataIndex){                  
                  if( data[4] == 'ABERTA')
                      $(row).addClass('aberta');
                  else if( data[4] == 'EM ANDAMENTO')
                      $(row).addClass('emandamento');
                  else if( data[4] == 'PENDENTE')
                      $(row).addClass('pendente');
                  else if( data[4] == 'SOLUCIONADA')
                      $(row).addClass('solucionada');
                  else if( data[4] == 'FINALIZADA')
                      $(row).addClass('finalizada');                  
              },
              paging: true,
              searching: false,
              destroy: true,
              data: dataSet,
              responsive: true,
              columns: [
                  { title: "&nbsp;"},
                  { title: "Protocolo"},
                  { title: "Aberta"},
                  { title: "Dura&ccedil;&atilde;o"},
                  { title: "Status"},
                  { title: "Respons&aacute;vel"},
                  { title: "Origem"},
                  { title: "Tipo"}
              ]
              });

              var btcpy = document.getElementsByClassName("dt-button")[0];
              btcpy.classList.add("btn-primary");
              var btcsv = document.getElementsByClassName("dt-button")[1];
              btcsv.classList.add("btn-primary");
              var btexc = document.getElementsByClassName("dt-button")[2];
              btexc.classList.add("btn-primary");
              var btpdf = document.getElementsByClassName("dt-button")[3];
              btpdf.classList.add("btn-primary");
              var btprt = document.getElementsByClassName("dt-button")[4];
              btprt.classList.add("btn-primary");

        }, function myError(response) {
                ERRO = response.statusText;
                console.log(ERRO);
        });
        //$("#sidebarToggle").click();
  }

  $("#btnDtIni").click(function() {
    $("#dtini").focus();
  });

  $("#btnDtFim").click(function() {
    $("#dtfim").focus();
  });

});

