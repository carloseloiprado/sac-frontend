(function () {

    var dataSet = [];    
    
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', "action/data/manifestacoesabertas", true);
    req.onload  = function() {
        var jsonResponse = req.response;
        // do something with jsonResponse
        try{
            for (var i = 0; i < req.response.ttRetorno.length ; i++) {
                dataSet.push( [ '<a href="detail-manifestacao?' + req.response.ttRetorno[i].id +  '&' + req.response.ttRetorno[i].idtar + '" class="btn btn-sm"><i class="fa fa-align-justify" style="font-size:24px" data-toggle="tooltip" data-placement="right" title="Detalhar Manifesta&ccedil;&atilde;o!"></i></a>', req.response.ttRetorno[i].id, req.response.ttRetorno[i].dtcadastro, req.response.ttRetorno[i].sstatus, req.response.ttRetorno[i].origem, req.response.ttRetorno[i].tipo ] );
            }
            $('#myTable').DataTable( {
                paging: true,
                searching: true,
                destroy: true,
                data: dataSet,
                responsive: true,
                columns: [
                    { title: "&nbsp;"},
                    { title: "ID"},
                    { title: "Aberta"},
                    { title: "Status"},
                    { title: "Origem"},
                    { title: "Tipo"}
                ]
                }); 
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
  
  