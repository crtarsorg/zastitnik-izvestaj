function prikaziTagovane(arg) {
  
  var naziv = "";

  switch( arg ) {
    case "ministarstva":
      naziv = "ministarstva";   
      break;
    case "vlada":
      naziv = "vlada";
      break;
    case "skupstina":
      naziv = "skupstina";
      break;
    case "ostali":
      naziv = "ostali";
      break;
  }

    $("p[akter]").hide()
     
    if(naziv =="ministarstva"){
     //$("p[akter]").hide() 
      $("p[akter]").filter(function(ind,la){if($(la).attr('akter')) return ($(la).attr('akter').indexOf('ministar')!=-1)}).show()
    }
    else if(naziv =="vlada"){
     //$("p[akter]").hide() 
      $("p[akter='vlada']").show()
    }

    else if(naziv =="skupstina"){
     //$("p[akter]").hide() 
      $("p[akter='skupstina']").show()
    }
    else if(naziv =="ostali"){
     //$("p[akter]").hide() 
      $("p[akter='ostali']").show()
    }

}