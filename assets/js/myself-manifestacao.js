(function () {

    var dataSet = [];    
    
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', "action/data/myselfmanifestacoes", true);
    req.onload  = function() {
        var jsonResponse = req.response;
        // do something with jsonResponse
        try{
            for (var i = 0; i < req.response.ttRetorno.length ; i++) {
                dataSet.push( [ '<a href="detail-myselfmanifestacao?' + req.response.ttRetorno[i].id + '" class="btn btn-sm"><i class="fa fa-align-justify" style="font-size:24px" data-toggle="tooltip" data-placement="right" title="Detalhar Manifesta&ccedil;&atilde;o!"></i></a>', req.response.ttRetorno[i].id, req.response.ttRetorno[i].sstatus ,req.response.ttRetorno[i].dtcadastro, req.response.ttRetorno[i].tipo, req.response.ttRetorno[i].descricao ] );
            }
            $('#myTable').DataTable( {
                paging: true,
                searching: true,
                destroy: true,
                data: dataSet,
                columns: [
                    { title: "&nbsp;", "width": "5%" },
                    { title: "ID" , "width": "15%"},
                    { title: "Status", "width": "15%" },
                    { title: "Aberta", "width": "15%" },
                    { title: "Tipo", "width": "15%" },
                    { title: "Resumo da ocorr&ecirc;ncia", "width": "35%" }
                ]
                }); 
        }
        catch(err) {
            dataSet.push( ["Nenhum registro encontrato!"]);
            $('#myTable').DataTable( {
                paging: true,
                searching: true,
                destroy: true,
                data: dataSet,
                columns: [
                    { title: "&nbsp;", "width": "100%" }                    
                ]
                });
        }
           
    };
    
    req.send(null);
    $("#sidebarToggle").click()

})();

  
  