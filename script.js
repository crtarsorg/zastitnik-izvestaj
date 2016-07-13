$(document).ready(function() {
        console.log("ready!");

        var h = $(":header");
        var cont = {};
        //console.dir(h);

        $(h).each(function(index) {
            //trim &nbsp
            $("#nav").append('<span id="showCont' + index + '">' + h[index].innerText.replace(/\u00a0/g, " ") + '</span>');

            //put everything between H tags into array
            cont['showCont' + index] = $(h[index]).nextUntil(h[index + 1]).andSelf();


            //function for click in left menu - ID's in main menu has same id as index in cont variable
            $('#showCont' + index).click(function() {
                console.log(cont['showCont' + index]);
                $('#displayCont').html();
                $('#displayCont').html(cont['showCont' + index]);
                console.dir(cont['showCont' + index])
            });
        });

        //search input handler
        $("#filter").keyup(function() {
            //remove filtered class from document

            if( $("#filter").val().length <3 ) return;    

            var $svi_oznaceni = $(".filtered");

            $svi_oznaceni.each(function (ind,el) {
              //ako ima id ili klasu, samo ukloni filterd klasu
                if(  $(el).prop("id") 
                  || !($(el).attr("class") =="filtered") ) //ili ima klasu
                            $(el).removeClass("filtered");
                else {
                  //http://stackoverflow.com/a/4232971s
                $(el).contents().unwrap();  
                }
            })
            
            
            // ukloniti span tagove, ostaviti sadrzaj
            
            //TODO remove filtered class from variables

            var pr = pretraga();

                pr.appendFinded(); 

            // Get the filter text / reset the count to zero
            var filter = $(this).val(),
                count = 0;

            $.each(cont, function(key, val) {
                if (val.text().search(new RegExp(filter, "i")) > 0) {
                    //ima pojam u textu - nastavi
                    //prikazi pojam u listi nadjenih

                    reg = new RegExp("\\s?([^\\s]+\\s+" + filter + "\\S+\\s+[^\\s]+)\\s?", "ig");
                    if (val.text().match(reg)) {
                       // console.log(val.text().match(reg)[0]);

                       var temp_nadjeni = val.text().match(reg);
                       temp_nadjeni.forEach(function(el) {

                            //izvuci celu recenicu    

                            triggerEvent(document,"nadjen-unos", { "detail": el })

                       })
                       

                       
                        
                    }



                    //console.dir(val);
                    //console.log(a);

                    //add red class to nav
                    $('#' + key).addClass("filtered");

                    val.html(function(i, val) {
                        //var re = new RegExp(filter,"gi");  //
                        var re = new RegExp("(" +filter + ")(?![^<>]*>)", "gi");
                        var match_all = val.match(re)
                        if(! match_all )
                          return val;

                        match_all.forEach(function(el) {
                            val.replace(re, '<span class="filtered" >' + el + '</span>');
                        })
                        return val;
                    });

                }
            });

            pr.displaySearch();

            //console.log(filter);

            //display num results
            $("#filter-count").text("Rezultata = " + count);

        });






        console.dir(cont);



    });


    function triggerEvent(el, eventName, options) {
          var event;
          if (window.CustomEvent) {
            event = new CustomEvent(eventName, options);
          } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, options);
          }
          el.dispatchEvent(event);
        }

    var pretraga = function() {

        var stavke = [];


        var prikaziPretraguF = function () {
            
            $(".sadrzaj-pretrage").empty();

            stavke.forEach(function (ind, el) {
                $(".sadrzaj-pretrage").append("<div class='stavka-pretrage'>"+ind+"</div>")
            })
            
        }

        var dodajF = function () {
                                    
            document.addEventListener("nadjen-unos", function(e) {
              //console.log(e.detail); 
            
            if(stavke.indexOf(e.detail) == -1 )  
             stavke.push(e.detail);
               
            });

        };

        var pretragaF = function(argument) {
            $(".sadrzaj-pretrage").show();
            $(".control").show()
            $("#hideSearch").html("sakrij");
            $("#hideSearch").removeAttr('show');
        }
        var hideResultF = function(arg) {
            $(".sadrzaj-pretrage").hide();
            //setuj opciju show
            $("#hideSearch").attr("show", true);
            $("#hideSearch").html("show");
            //return arg;
        }

        var removeResultF = function(arg) {
            $(".control").hide()
            $('#filter').val('')
                //ukloni sve dugmice

            //zasad skrivanje, treba da se ukloni lista pretrage
            $(".sadrzaj-pretrage").hide();


        }

        return {
            displaySearch: prikaziPretraguF,
            appendFinded: dodajF,
            searchTerm: pretragaF,
            hideResult: hideResultF,
            removeResult: removeResultF
        }
    }