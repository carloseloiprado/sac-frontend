
var app = angular.module("app", ["chart.js"]).controller("DashboardManifestacao", function($scope, $http){
    
  //dataSet.push( ["um registro"] );
  var dataSet;
  var ctxPie;
  var myPieChart;
  var ctxBar;
  var myBarChart;
  
  //load page
  $( document ).ready(function() {  
    $("#sidebarToggle").click();
    $('#dtini').datepicker("setDate", new Date());    
    $('#dtfim').datepicker("setDate", new Date()); 
    
    $scope.buscamanifestacoes();
  });

  //Quando o campo cep recebe um click.
  $scope.buscamanifestacoes = function() {

    if ( $("#dtini").val() == '' || $("#dtfim ").val()  == '' )
      return;

    $http({
      method : "GET",
      url : "action/data/dashboardmanifestacoes",
      headers: {
          'Content-type': 'application/json'
      },
      params: {origem: $("#origem").val(),
               tipo: $("#tipo").val(),
               uf: $("#uf").val(),
               dtini: $("#dtini").val(),
               dtfim: $("#dtfim ").val()}
      }).then(function mySucces(response) {
                
        var iIdx      = 0;
        var iQtdTotal = 0;
        dataSet   = [];

        //$scope.itensmanifestacao = response.data.ttRetorno
        //angular.forEach(response.data.ttRetorno, function(value, key) {
          dataSet.push( response.data.ttRetorno[iIdx].qtdaberta);
          dataSet.push( response.data.ttRetorno[iIdx].qtdemandamento);
          dataSet.push( response.data.ttRetorno[iIdx].qtdpendente);
          dataSet.push( response.data.ttRetorno[iIdx].qtdsolucionada);
          dataSet.push( response.data.ttRetorno[iIdx].qtdfinalizada);
          iQtdTotal = response.data.ttRetorno[iIdx].qtdtotal; 
          //iIdx++;
        //}, iIdx, iQtdTotal);

        // Set new default font family and font color to mimic Bootstrap's default styling
        Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#858796';

        // Pie Chart Example
        //var ctxPie = document.getElementById("myPieChart");
        ctxPie = $('#myPieChart');
        myPieChart = new Chart(ctxPie, {
          type: 'doughnut',
          data: {
            labels: ["Aberta", "Em Andamento", "Pendente", "Solucionada", "Finalizada"],
            datasets: [{
              data: dataSet,
              backgroundColor: ['#f5eb55', '#CEECF5', '#f16153', '#1cc88a','#d0cdcd'],
              hoverBackgroundColor: ['#f5eb55', '#CEECF5','#f16153', '#1cc88a','#d0cdcd'],
              borderColor: ['#f5eb55', '#CEECF5','#f16153', '#1cc88a','#d0cdcd'],
            }],
          },
          options: {
            maintainAspectRatio: false,
            tooltips: {
              backgroundColor: "rgb(255,255,255)",
              bodyFontColor: "#858796",
              borderColor: '#dddfeb',
              borderWidth: 1,
              xPadding: 15,
              yPadding: 15,
              displayColors: false,
              caretPadding: 10,
            },
            legend: {
              display: false
            },
            cutoutPercentage: 80,
          },
        });


        // Bar Chart Example
        //var ctxBar = document.getElementById("myBarChart");
        ctxBar      = $('#myBarChart');
        myBarChart  = new Chart(ctxBar, {
          type: 'bar',
          data: {
              labels: ["Aberta", "Em Andamento", "Pendente", "Solucionada", "Finalizada"],
              datasets: [{
              label: "Total",
              backgroundColor: ['#f5eb55', '#CEECF5', '#f16153', '#1cc88a','#d0cdcd'],
              hoverBackgroundColor: ['#f5eb55', '#CEECF5','#f16153', '#1cc88a','#d0cdcd'],
              borderColor: ['#f5eb55', '#CEECF5','#f16153', '#1cc88a','#d0cdcd'],
              data: dataSet,
              }],
          },
          options: {
              maintainAspectRatio: false,
              layout: {
              padding: {
                  left: 10,
                  right: 25,
                  top: 25,
                  bottom: 0
              }
              },
              scales: {
              xAxes: [{
                  time: {
                    unit: 'month'
                  },
                  gridLines: {
                      display: false,
                    drawBorder: false
                  },
                  ticks: {
                    maxTicksLimit: 6
                  },
                  maxBarThickness: 25,
              }],
              yAxes: [{
                  ticks: {
                    min: 0,
                    max: iQtdTotal,
                    maxTicksLimit: 5,
                    padding: 10,
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return ' ' + value;
                    }
                  },
                  gridLines: {
                    color: "rgb(234, 236, 244)",
                    zeroLineColor: "rgb(234, 236, 244)",
                    drawBorder: false,
                    borderDash: [2],
                    zeroLineBorderDash: [2]
                  }
              }],
              },
              legend: {
                display: false
              },
              tooltips: {
                  titleMarginBottom: 10,
                  titleFontColor: '#6e707e',
                  titleFontSize: 14,
                  backgroundColor: "rgb(255,255,255)",
                  bodyFontColor: "#858796",
                  borderColor: '#dddfeb',
                  borderWidth: 1,
                  xPadding: 15,
                  yPadding: 15,
                  displayColors: false,
                  caretPadding: 10,
                  callbacks: {
                      label: function(tooltipItem, chart) {
                          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                          return datasetLabel + ': ' + tooltipItem.yLabel;
                      }
                  }
              },
          }
        });

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

