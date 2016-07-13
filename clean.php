<html>
<head>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<title>Izvestaj 2015</title>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

</head>
<body lang=EN-US link=blue vlink=purple>

<style type="text/css">

#nav{
  max-width: 15%;
  font-size: 12px;
  float: left;
  padding:1%;
}
#nav span{
  margin:8px;
  padding:2px;
  display: block;
}
#nav span:hover{
  cursor: hand;
  background-color: #cccccc;
}

#displayCont{
  max-width: 80%;
  /* font-size: 12px; */
  float: right;
  padding:1%;
}

#clearFloat{
  clear:both;
  padding-top: 300px;
  display: block;
}

#mainDocContent{
  display:none;
}

.filtered{
  background-color: red;
}


</style>


<script>


$( document ).ready(function() {
    console.log( "ready!" );

  var h = $(":header");
  var cont = {};
  //console.dir(h);

    $( h ).each(function( index ) {
      //trim &nbsp
      $("#nav").append('<span id="showCont'+index+'">'+h[index].innerText.replace(/\u00a0/g," ")+'</span>' );

      //put everything between H tags into array
      cont['showCont'+index] =  $(h[index]).nextUntil(h[index+1]).andSelf();


//function for click in left menu - ID's in main menu has same id as index in cont variable
  $('#showCont'+index).click(function(){
    console.log( cont['showCont'+index] );
    $('#displayCont').html();
    $('#displayCont').html(cont['showCont'+index]);
    console.dir(cont['showCont'+index])
  });
});

//search input handler
 $("#filter").keyup(function(){
      //remove filtered class from document
      $(".filtered").removeClass("filtered");
      //TODO remove filtered class from variables



        // Get the filter text / reset the count to zero
        var filter = $(this).val(), count = 0;

        $.each(cont, function(key, val){
          if (val.text().search(new RegExp(filter, "i")) > 0) {
            //ima pojam u textu - nastavi
            //prikazi pojam u listi nadjenih

            reg = new RegExp("\\s?([^\\s]+\\s" + filter + "\\s[^\\s]+)\\s?", "i");
            if(val.text().match(reg)){
            console.log (val.text().match(reg)[0]);
            }



            //console.dir(val);
            //console.log(a);

            //add red class to nav
            $('#'+key).addClass("filtered");

            val.html(function(i, val) {
                //var re = new RegExp(filter,"gi");  //
                var re = new RegExp(filter+ "(?![^<>]*>)","gi");
                return val.replace(re,'<span class="filtered" >'+filter+'</span>');
            });

          }
        });

        //console.log(filter);

    //display num results
    $("#filter-count").text("Rezultata = "+count);

   });






console.dir(cont);



});
</script>



<div id="search">

<form id="live-search" action="" class="styled" method="post">
    <fieldset>
        <input type="text" class="text-input" id="filter" value="" />
        <span id="filter-count"></span>
        <span id="filterlist"></span>
    </fieldset>
</form>


</div>


<div id="nav">
</div>


<div id="displayCont">
</div>


<div id="clearFloat"></div>


<div id="mainDocContent">
<?php include("izvestaj2015.html");?>
</div>


</body>
</html>