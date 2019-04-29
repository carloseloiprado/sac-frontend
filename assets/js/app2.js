/*



angular.module("app", ["chart.js"]).controller("MainController", function($scope, $http){




    //$scope.faturamentomensal = " R$ 310000,00"
    //$scope.metamensal = " R$ 500000,00"
    //$scope.saldometa = " R$ 250000,00"
    //$scope.totalpedidosmensal = " R$ 250000,00"
    //$scope.ultimospedidos = []
    //$scope.valortotalpedido = "Sem Faturamento Mensal"
    ULTIMOSPEDIDOSGLOBAL = [];
    ERRO = [];


    var formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });

    $scope.saldoemcarteira = formatter.format(12000.00);


    $scope.saldoemcarteira = 12000.00



    function meusultimospedidos() {

      $http({
            method : "GET",
            url : "action/pedido",
            headers: {
                'Content-type': 'application/json'
            },
            params: {requested: 'meusultimospedidos'}
            }).then(function mySucces(response) {
                    $scope.ultimospedidos = response.data.ttRetorno;
                    console.log(response.data.ttRetorno);
                }, function myError(response) {
                    ERRO = response.statusText;
                    console.log(ERRO);
              });

    }



    $http({
          method : "GET",
          url : "action/pedido",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'meusultimospedidos'}
          }).then(function mySucces(response) {
                  $scope.ultimospedidos = response.data.ttRetorno;

                    var log = [];
                    angular.forEach(response.data.ttRetorno, function(value, key) {

                      $scope.faturamentomensal = value.valortotalpedido;

                      //para uso no pie
                      $scope.data = [value.aprovadospie, value.aquardandoatendimentopie];


                      console.log(value.valortotalpedido);

                    }, log);

                  console.log(response.data.ttRetorno);

              }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });









    var vm = this;
    vm.title = 'Pedidos';
    vm.searchInput = '';
    //vm.ultimospedidos = ULTIMOSPEDIDOSGLOBAL;




    vm.shows = [
        {
            title: '3241 - Supermercado BH',
            valor: 2011,
            favorite: true
        },
        {
            title: '1240 - Atacadão MI',
            valor: 2010,
            favorite: false
        },
        {
            title: '2356 - Atakarejo',
            valor: 2002,
            favorite: true
        },
        {
            title: '2110 - Supermercado Alem',
            valor: 2013,
            favorite: true
        },
        {
            title: '5678 - Consuminas',
            valor: 2005,
            favorite: false
        }
    ];
    vm.orders = [
        {
            id: 1,
            title: 'valor Ascending',
            key: 'valor',
            reverse: false
        },
        {
            id: 2,
            title: 'valor Descending',
            key: 'valor',
            reverse: true
        },
        {
            id: 3,
            title: 'Title Ascending',
            key: 'title',
            reverse: false
        },
        {
            id: 4,
            title: 'Title Descending',
            key: 'title',
            reverse: true
        }
    ];
    vm.order = vm.orders[0];




    function InlineEditorController($scope){

    	// $scope is a special object that makes
    	// its properties available to the view as
    	// variables. Here we set some default values:

    	$scope.showtooltip = false;
    	$scope.value = 'Edit me.';

    	// Some helper functions that will be
    	// available in the angular declarations

    	$scope.hideTooltip = function(){

    		// When a model is changed, the view will be automatically
    		// updated by by AngularJS. In this case it will hide the tooltip.

    		$scope.showtooltip = false;
    	}

    	$scope.toggleTooltip = function(e){
    		e.stopPropagation();
    		$scope.showtooltip = !$scope.showtooltip;
    	}
    }


    $scope.obterdetalhepedido = function (pedido) {

      console.log(pedido)

      $http({
            method : "POST",
            url : "action/detalhe-pedido",
            headers: {
                'Content-type': 'application/json'
            },
            params: {requested: "obterdetalhepedido", nomeabrev: pedido.cliente, numpedido: pedido.nrpedcli}
            }).then(function mySucces(response) {

              $scope.mensagemmodal = "Detalhe Pedido"
              $scope.pedido = pedido.nrpedcli
              $scope.cliente = pedido.cliente
              $('#detalhepedido').modal('show')
              $scope.listadetalhepedido = response.data.ttRetorno
              console.log(response.data.ttRetorno)


            }, function myError(response) {
                    ERRO = response.statusText;
                    console.log(ERRO);
              });





    }


    //para o grafico pie
    $scope.labelsstatuspedido = ["Aguardando Atendimento", "Aprovados"];
    //$scope.data = [300, 500];
    $scope.statuspedidoscolor = ["#eaee07","#119f05"]


    //para o grafico misto de pedidos diarios.

      $scope.labels = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];
      $scope.series = ['Total Faturado', 'Saldo Carteira', "Total Volumes"];

      $scope.datapedidosdiarios = [
         [65, 59, 80, 81, 56, 55, 40],
         [28, 48, 40, 19, 86, 27, 90],
         [45, 30,70, 19, 46, 20, 32]
       ];

       $scope.colorpedidosdiarios = ["#eaee07","#119f05","#093ef2"]


       $scope.novopedido = function() {
             $scope.count++;
         }



         // at the bottom of your controller
         var init = function () {

           console.log(vm.shows);

            //meusultimospedidos();
            // check if there is query in url
            // and fire search in case its value is not empty
         };
         // and fire it after definition
         init();


});

*/
