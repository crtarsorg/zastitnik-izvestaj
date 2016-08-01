
var sadrzaj;

 $(function() {

 	$('#tabs').tab();

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  var target = $(e.target).attr("href") // activated tab
	  //alert(target);
	  if(target == "#reference"){
		  
		//$('#reference').html(curPage);		  
		  
	  	//if(sadrzaj != undefined)
	  	//	$("#displayCont").html(sadrzaj)
	
		loadReferencesFor(curPage);
		
	  } else {
		  //load data from cont
		  $("#displayCont").html(cont[curPage]);
	  }
	}); 

	// na pocetku dodaj jos
	// 
	// treba samo da formatiram tekst

/* 	console.log(cont);

	$.get("reference/nasilje.html", function(response) {
        sadrzaj = response;
    }); */
	
	
	function loadReferencesFor(cpage){
		
		$('#reference').html('');
		
		$.get("reference/"+cpage+".html",{ "_": $.now() }, function(response) {
			
			parseRefResponse(response);
			
		}).fail(function(){ 
		  $('#reference').html('No references found');
		  $('#displayCont').html('');
		});
		
	}
	
	function parseRefResponse(refCont){
		
		$('#reference').html('');
		$("#displayCont").html(refCont);

		
	    $('#displayCont :header').each(function addH(i){
			if(this.id){
				$('#reference').append('<p class="refactive"><a href="#'+this.id+'">'+this.innerText+'</a></p>');
			}
		});
		

	}	
	
	
	
})