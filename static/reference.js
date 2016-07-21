
var sadrzaj;

 $(function() {

 	$('#tabs').tab();

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  var target = $(e.target).attr("href") // activated tab
	  //alert(target);
	  if(target == "#reference"){
	  	if(sadrzaj != undefined)
	  		$("#displayCont").html(sadrzaj)
	  }
	}); 

	// na pocetku dodaj jos
	// 
	// treba samo da formatiram tekst

	console.log(cont);

	$.get("reference/nasilje.html", function(response) {
        sadrzaj = response;
    });
	
	
})