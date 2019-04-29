/* Tamanho da modal - http://dawsonmediadesign.com/blog/development/creating-a-variable-width-modal-dialog-using-bootstrap-3/ */
$(".modal-wide").on("show.bs.modal", function() {
  var height = $(window).height() - 200;
  $(this).find(".modal-body").css("max-height", height);
});
