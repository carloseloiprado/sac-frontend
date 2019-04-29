//load page
$( document ).ready(function() {
  //  $scope.salvarpedidoform();
  //apagar pedido em andamento.
  //$(".loading").hide();

});



$('.datapicker').datepicker({
	format: "dd/mm/yyyy",
	language: "pt-BR",
	autoclose: true,
	todayHighlight: true
});




/** Remove o item da table */
function removeItem(element){
	 $(element).closest('tr').remove();
}


function editaItem(element){

	console.log($(element).closest('tr').attr('name'));
	alert($(element).closest('tr').attr('name'));

	alert($("#qtd-" + $(element).closest('tr').attr('name') ).html() );

}


var cacheFree = function(){
	return '_cf=' + new Date().getTime().toString()
}
