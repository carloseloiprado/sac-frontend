function formatDec(num,dec){
    if(isNaN(num)|| num==0 ) return '';
    var numaux='',iaux=0;
    var flgDot = 0;
    for(var i=0;i<dec;i++){
        num = num * 10;
    }
    num = Math.round(num);
    for(var i=0;i<dec;i++){
        num = num / 10;
    }
    num = num + 0.000005;
    num=String(num);
    for(var i=0;i<num.toString().length;i++){
        if(num.toString().substr(i,1)!='.'){
            if(!flgDot){
                numaux+=num.toString().substr(i,1);
            }
            else if(iaux<dec){
                numaux+=num.toString().substr(i,1);
                iaux++;
            }
        }
        else{
            flgDot = 1 ;
            numaux+=',';
        }
    }
    if(!flgDot)
          numaux+=',';
    for(var i=0;i<(dec-iaux);i++)
        numaux+='0';
    if (dec == 0 ) numaux = numaux.replace(",","");
    return numaux;
}



function cfloat(num){
    if(num.toString().length==0) num = 0;
    if(num.toString()=="?") num = 0;
    num = new String(num);
    num = num.replace('.','');
    num = num.replace('.','');
    num = num.replace('.','');
    num = num.replace('.','');
    num = num.replace('.','');
    num = num.replace(',','.');
    return Number(num); //+ 0.000000000001;
}


var app = angular.module("app", ["chart.js"]).controller("NovoPedidoController", function($scope, $http){


  var TABELAPRECOGLOBAL
  var itemunico
  $scope.qtitenspedido = 0

  $scope.precotabela = ""
  $scope.descontocanal = ""
  $scope.valoripi = ""
  $scope.valorst = ""
  $scope.valortotal = ""
  $scope.pesototal = ""
  $scope.prc_liquido = ""

  
    $scope.excluirpedidoaberto = function () {

      $http({
            method : "DELETE",
            url : "action/pedido-form",
            headers: {
                'Content-type': 'application/json'
            },
            params: {requested: "excluipedidoativo"}
            }).then(function mySucces(response) {

                console.log(response.data.ttRetornoHeader[0].retornoMensagem)

                $scope.mensagemmodal =  response.data.ttRetornoHeader[0].retornoMensagem
                $('#modalmensagem').modal('show')



            }, function myError(response) {
                    ERRO = response.statusText;
                    console.log(ERRO);
              });



    }


   


  
//carrega itens venda.
$scope.carregaitensdevenda();

$scope.carregaitensdevenda = function () {

    console.log(TABELAPRECOGLOBAL)


  //buscando itens para venda.
  $http({
        method : "POST",
        url : "action/data/itemvenda",
        headers: {
            'Content-type': 'application/json'
        },
        params: {term: "", tabeladepreco: TABELAPRECOGLOBAL}
        }).then(function mySucces(response) {

            console.log(response.data.ttRetorno)

            $('#item').select2({
              placeholder: "Selecione um item",
              allowClear: true ,
              quietMillis: 50,
               minimumInputLength: 3,
              data: { results: response.data.ttRetorno, text: "text" },
              formatResult: function(data) {
                return data.text ;
              },
              formatSelection: function(data) {
                return data.text;
              },
            }).on("select2-blur", function(e) {

                    console.log("blur item");


            });


        }, function myError(response) {
                ERRO = response.statusText;
                console.log(ERRO);
          });

        }


  //começar a inclusão de itens no pedido.
  $scope.showItemPedido = function() {

      $scope.erroitemjainserido = false  

      $scope.erro = 'gray';


      $("#item").select2("val", "");

      $scope.salvarpedidoform();
      console.log('estou aqui');

      $scope.titlemodal = "INSIRA O ITEM"
      $scope.quantidade = "";
      $scope.descontocampanha = "";
      $scope.descontoitem = "";
      $scope.descontocanal = ''
      $scope.precooriginal = ''
      $scope.item = ""

      bloqueiacampos(true)
      $('#modalitem').modal('show')

  };


  //envia pedido form //USADO NA API.
  $scope.salvarpedidoform = function () {

      $(".loading").show();

    $http({
          method : "POST",
          url : "action/pedido-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'criapedidoform',
                   ordemcompracliente: $scope.ordemcompracliente,
                   tipopedido: $scope.tipopedido,
                   pedidoorigem : $scope.pedidoorigem,
                   pagamento: $scope.pagamento,
                   cliente: $scope.cliente,
                   tabpreco: $scope.tabeladepreco,
                   entrega: $scope.entrega,
                   dtentrega : $("#dtentrega").val(),
                   dtentregafim : $("#dtentregafim").val(),
                   observacaonotafiscal: $("#observacaonotafiscal").val(),
                   observacaologistica: $("#observacaologistica").val()}
          }).then(function mySucces(response) {

              $(".loading").hide();
                //TENHO QUE REVER!!!
                /*
                console.log(response.data.ttRetornoHeader[0].retornoMensagem)
                console.log(response.data.ttRetornoHeader[0].retornoSucesso)
                if (response.data.ttRetornoHeader[0].retornoSucesso == false ){
                  $scope.mensagemmodal =  response.data.ttRetornoHeader[0].retornoMensagem
                  $('#modalitem').modal('hide')
                  $('#dialogopedidoandamento').modal('show')
                }
                */


          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });



  };

  //load page
  $( document ).ready(function() {
    //  $scope.salvarpedidoform();
    //apagar pedido em andamento.

      $(".loading").show();
      $("#novopedidobotao").hide();


    $http({
          method : "POST",
          url : "action/data/get-emitente",
          headers: {
              'Content-type': 'application/json'
          },
          params: {term: ""}
          }).then(function mySucces(response) {

                $(".loading").hide();

              console.log(response.data.ttRetorno)

              $('#cliente').select2({
                placeholder: "Selecione um cliente",
                allowClear: true ,
                //minimumInputLength: 2,
                quietMillis: 50,
                data: { results: response.data.ttRetorno, text: "nome" },
                formatResult: function(data) {
                  return data.nome ;
                },
                formatSelection: function(data) {
                  return data.nome;
                },
              }).on("select2-blur", function(e) {
                      console.log($scope.cliente)
                      //busca tabela de preco.
                      console.log($scope.tabeladepreco)
                      console.log("blur");
                      $scope.obtemdadoscliente($scope.cliente)
                      $scope.buscaformapagamentocliente()

              });
          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });



    $scope.apagarpedidoandamento()
    //$("#descontocampanha").mask("99,99");
    //$("#descontoitem").mask("99,99");

    $( "#tipopedido" ).blur(function() {
      if($( "#tipopedido" ).val() == "Bonificação"){
        $("#usapedidoorigem").show();
        $("#usapagamento").hide();


      }else{
        $("#usapedidoorigem").hide();
        $("#usapagamento").show();
      }

    });



  });




  $scope.apagarpedidoandamento = function () {


    $http({
          method : "DELETE",
          url : "action/pedido-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: "apagarpedidoandamento"}
          }).then(function mySucces(response) {

              console.log('pedido em andamento apagado.')

          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });



  }

  //USADO NA API.
  $scope.puxarpedidoaberto = function() {


    //TENHO QUE FAZER.
    $http({
          method : "GET",
          url : "action/pedido-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: 'obterpedidoaberto'}
          }).then(function mySucces(response) {



          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });



  };


  //USADO NA API.
  $scope.salvaritempedido = function() {

    $(".loading").show();


    if($("#quantidade").val() == '' )  {
         //salvando pedido no form.
         //$scope.salvarpedidoform();rever!!

         $scope.erro = 'red';

         $scope.erroquantidade = true


       }
       else {

         if (itemunico == $scope.item)
         {
           $scope.erroitemjainserido = true

         }else {

            $scope.erroitemjainserido = false

             var log
             var encontrou = false

             angular.forEach($scope.itenspedido, function(value, key) {

               console.log(value)

                if(value.it_codigo == $scope.item)
                  encontrou = true

                console.log(value)

             }, log);


             console.log(encontrou)

              $scope.erroquantidade = false

              $scope.erro = 'gray';

          $http({
                method : "POST",
                url : "action/pedido-form",
                headers: {
                    'Content-type': 'application/json'
                },
                params: {requested: 'criaitempedido',
                         item: $scope.item,
                         quantidade: $scope.quantidade,
                         descontocampanha: $scope.descontocampanha,
                         descontoitem: $scope.descontoitem,
                         cliente: $scope.cliente,
                         tabeladepreco: $scope.tabeladepreco,
                         pagamento: $scope.pagamento,
                         valortotal: $scope.valortotal,
                         valorst: $scope.valorst,
                         valoripi: $scope.valoripi,
                         descontocanal: $scope.descontocanal,
                         precounitario: $scope.prc_liquido}
                }).then(function mySucces(response) {

                    //$(".loading").hide();
                    //$('#modalitem').modal('hide')


                    //$scope.mensagemmodal = 'Item inserido com sucesso.'
                    //$('#modalmensagem').modal('show')

                    //busca item pedido
                    $scope.buscaitensinseridosnopedido()




                }, function myError(response) {
                        ERRO = response.statusText;
                        console.log(ERRO);
                  });



                  /*

                  if($scope.qtitenspedido.length >= 1){
                    bloqueiacampos(true)
                  }else{
                    bloqueiacampos(false)
                  }*/


                 console.log('valores itens do pedido');
                 itemunico = $scope.item
                 console.log($scope.item)
                 console.log($scope.quantidade)
                 console.log($scope.descontocampanha)
                 console.log($scope.descontoitem)

                 }
    }


    $("#item").select2("val", "");
    $scope.quantidade = "";
    $scope.descontocampanha = "";
    $scope.descontoitem = "";
    $scope.descontocanal = ''
    $scope.precooriginal = ''
    $scope.item = ""


  };

  $scope.eliminaritempedido = function(x) {

     $scope.itemselecionado = x.item;
     console.log('eliminar item: '+x.item);

    // $scope.mensagemmodal = 'Deseja excluir o item ' +x.item+ ' do pedido?'
     //$('#dialogosimnao').modal('show')

     $http({
           method : "DELETE",
           url : "action/pedido-form",
           headers: {
               'Content-type': 'application/json'
           },
           params: {requested: "excluiitempedido",
                    codigo: x.it_codigo,
                    cliente: $scope.cliente}
           }).then(function mySucces(response) {


               $scope.mensagemmodal =  'Item excluido com sucesso'
               $('#modalmensagem').modal('show')
               $scope.buscaitensinseridosnopedido()


           }, function myError(response) {
                   ERRO = response.statusText;
                   console.log(ERRO);
             });



             /*
             if($scope.qtitenspedido.length >= 1){
               bloqueiacampos(true)
             }else{
               bloqueiacampos(false)
             }
             */



  };

  $scope.excluiritempedidodefinitivo = function(x) {

    //$('#dialogosimnao').modal('show')

 };


 $scope.buscatabelapreco = function () {

     $scope.tabeladepreco = 'Tabela de Preço: 25.6'

 }


  $scope.buscardadositempedido = function() {

      $(".loading").show();

      var descontocampanha
      var descontoitem


      $scope.descontocampanha = formatDec(cfloat($('#descontocampanha').val(),2))
      $scope.descontoitem = formatDec(cfloat($('#descontoitem').val(),2))

      if ($('#descontocampanha').val() == '')
      {
          descontocampanha = 0
        }else {
          descontocampanha = $('#descontocampanha').val()
        }

          if ($('#descontoitem').val() == '')
          {
              descontoitem = 0
            }else {
              descontoitem = $('#descontoitem').val()
            }



    $http({
          method : "POST",
          url : "action/detalheitem",
          headers: {
              'Content-type': 'application/json'
          },
          params: { requested: 'obterdetalheitem',
                    tabpreco: $scope.tabeladepreco,
                    formapagamento: $scope.pagamento,
                    codcliente: $scope.cliente,
                    coditem: $scope.item,
                    descontoitem: descontoitem,
                    descontocampanha: descontocampanha,
                    quantidade: $scope.quantidade}
          }).then(function mySucces(response) {

              //console.log(response.data.ttrelatorio[0].prc_tabela)
              $scope.precotabela = response.data.ttrelatorio[0].prc_tabela
              $scope.descontocanal = response.data.ttrelatorio[0].per_desc_canal
              $scope.valoripi =  response.data.ttrelatorio[0].val_ipi
              $scope.valorst = response.data.ttrelatorio[0].val_st
              $scope.valortotal =  response.data.ttrelatorio[0].prc_liquido
              $scope.pesototal = response.data.ttrelatorio[0].peso_bruto
              $scope.prc_liquido = response.data.ttrelatorio[0].prc_liquido

            console.log(response.data.ttrelatorio);
              $(".loading").hide();

          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });



  };


  $scope.criarpedidos = function() {

    $(".loading").show();

    $http({
          method : "POST",
          url : "action/pedido-form",
          headers: {
              'Content-type': 'application/json'
          },
          params: {requested: "finalizapedidoform", cliente: $scope.cliente, observacaonota: $("#observacaonotafiscal").val(), observacaologistica: $("#observacaologistica").val(), dtagendamento: $("#dtagendamento").val()}
          }).then(function mySucces(response) {

              $(".loading").hide();
              $('#dialogofinalizacaopedido').modal('show')
              $scope.mensagemmodal  = "Pedido Criado com Sucesso"
              console.log(response.data)
              $scope.numpedidosistema = response.data.ttRetornoHeader[0].retornoMensagem

              $("#desativapainelfooter").hide()
              $("#tabelaitenspedido").hide()
              $("#novopedidobotao").show();



          }, function myError(response) {
                  ERRO = response.statusText;
                  console.log(ERRO);
            });






  };


$scope.buscaitensinseridosnopedido = function () {


  $http({
        method : "POST",
        url : "action/pedido-form",
        headers: {
            'Content-type': 'application/json'
        },
        params: {requested: 'buscaitensinseridosnopedido',
                 cliente: $scope.cliente }
        }).then(function mySucces(response) {

          var log
          var valortotaltabelasoma = 0
          angular.forEach(response.data.ttRetorno, function(value, key) {

              valortotaltabelasoma = valortotaltabelasoma + value.total

              //busca total valor tabela
              $scope.valortotaltabela = valortotaltabelasoma

          }, log);

            console.log(response.data.ttRetorno)

            $scope.itenspedido = response.data.ttRetorno
            $scope.qtitenspedido = response.data.ttRetorno.length;

            if ($scope.itenspedido.length == 0)
              $scope.valortotaltabela = 0

            //$scope.mensagemmodal = response.data.ttRetornoHeader[0].retornoMensagem
            //$('#modalmensagem').modal('show')


        }, function myError(response) {
                ERRO = response.statusText;
                console.log(ERRO);
          });



}

/*
 $scope.itenspedido = [
      {
          item: '60.0101 - MultiUso 1',
          quantidade: 1,
          precooriginal: '45,67',
          descontocanal: '15,00%',
          descontocampanha: '13,00%',
          descontoitem: '4,00%',
          valorunitmercadoria: '42,00',
          valoripi: '7,14',
          valorst: '0,00',
          valortotal: '51,20'
      },
      {
        item: '60.0101 - MultiUso 2',
        quantidade: 1,
        precooriginal: '45,67',
        descontocanal: '15,00%',
        descontocampanha: '13,00%',
        descontoitem: '4,00%',
        valorunitmercadoria: '42,00',
        valoripi: '7,14',
        valorst: '0,00',
        valortotal: '51,20'
      },
      {
        item: '60.0101 - MultiUso 3',
        quantidade: 1,
        precooriginal: '45,67',
        descontocanal: '15,00%',
        descontocampanha: '13,00%',
        descontoitem: '4,00%',
        valorunitmercadoria: '42,00',
        valoripi: '7,14',
        valorst: '0,00',
        valortotal: '51,20'
      }
  ];
*/



  });


  app.filter('setDecimal', function ($filter) {
      return function (input, places) {
          if (isNaN(input)) return input;
          // If we want 1 decimal place, we want to mult/div by 10
          // If we want 2 decimal places, we want to mult/div by 100, etc
          // So use the following to create that factor
          var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
          return Math.round(input * factor) / factor;
      };
  });


  function bloqueiacampos(tipo) {

    $("#dtagendamento").prop('disabled', tipo);
    $("#dtagendamentofim").prop('disabled', tipo);
    $("#dtentrega").prop('disabled', tipo);
    $("#dtentregafim").prop('disabled', tipo);
    $("#ordemcompracliente").prop('disabled', tipo);
    $("#tipopedido").prop('disabled', tipo);
    $("#entrega").prop('disabled', tipo);
    $("#pagamento").prop('disabled', tipo);
    $("#cliente").prop('disabled', tipo);
    //$("#pedidoorigem").prop('disabled', tipo);


  }


function convertedata(data) {
  return moment(data).format("DD/MM/YYYY");
}
