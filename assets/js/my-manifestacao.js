(function () {

    var dataSet = [];

    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', "action/data/manifestacoesatribuidas", true);
    req.onload  = function() {
        var jsonResponse = req.response;
        // do something with jsonResponse
        try{
            for (var i = 0; i < req.response.ttRetorno.length ; i++) {
                dataSet.push( [ '<a href="detail-manifestacao?' + req.response.ttRetorno[i].id +  '&' + req.response.ttRetorno[i].idtar + '" class="btn btn-sm"><i class="fa fa-align-justify" style="font-size:24px" data-toggle="tooltip" data-placement="right" title="Detalhar Manifesta&ccedil;&atilde;o!"></i></a>', req.response.ttRetorno[i].nrprotocolo, req.response.ttRetorno[i].dtcadastro, req.response.ttRetorno[i].tempo, req.response.ttRetorno[i].sstatus, req.response.ttRetorno[i].origem, req.response.ttRetorno[i].tipo  ] );
            }
            $('#myTable').DataTable( {
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
                searching: true,
                destroy: true,
                data: dataSet,
                responsive: true,
                columns: [
                    { title: "&nbsp;"},
                    { title: "Protocolo"},
                    { title: "Aberta"},
                    { title: "Dura&ccedil;&atilde;o"},
                    { title: "Status"},
                    { title: "Origem"},
                    { title: "Tipo"}
                ]
            } );
        }
        catch(err) {
            dataSet.push( ["Nenhum registro encontrato!"]);
            var table = $('#myTable').DataTable( {
                paging: true,
                searching: true,
                destroy: true,
                data: dataSet,
                responsive: true,
                columns: [
                    { title: "&nbsp;", "width": "100%" }                    
                ]
                });

            //new $.fn.dataTable.FixedHeader( table );
        }
    };
    req.send(null);
    $("#sidebarToggle").click()

})();

  
  