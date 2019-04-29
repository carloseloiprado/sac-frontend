$(document).ready(function(){

	$('#btn-troca-senha').click(function () {		
	
		$("#mensagem").empty(); 
	
		if( $("#senhaAtual").val().length == 0 || $("#novaSenha").val().length == 0 ){
			$("#mensagem").append("<div class='alert alert-danger'>Favor preencher os campos de Senha Atual e Nova Senha.</div>"); 
			return false;
		}
		
		if( $("#novaSenha").val().length < 6 ){
			$("#mensagem").append("<div class='alert alert-danger'>Favor preencher o campo Nova Senha com pelo menos 6 caracteres.</div>");
			return false;
		}	
		
		if( $("#novaSenha").val() != $("#novaSenhaConfirma").val() ){
			$("#mensagem").append("<div class='alert alert-danger'>A senha digitada nos campos Nova Senha e Repita Nova Senha devem ser iguais.</div>");
			return false;
		}		
		
		$("#formTrocaSenha").submit()
	
	});
	$("#sidebarToggle").click()
});	

