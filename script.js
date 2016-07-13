$(document).ready(function() {
    console.log("ready!");

    var pr = pretraga();

    pr.appendFinded();


    $("#hideSearch").click(function(ev) {
        pr.hideResult();
    })

    $("#closeSearch").click(function(ev) {
        pr.removeResult();
    })



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
        if ($("#filter").val().length == 0) pr.removeResult();

        if ($("#filter").val().length < 3) return;


        var $svi_oznaceni = $(".filtered");

        $svi_oznaceni.each(function(ind, el) {
            //ako ima id ili klasu, samo ukloni filterd klasu
            if ($(el).prop("id") || !($(el).attr("class") == "filtered")) //ili ima klasu
                $(el).removeClass("filtered");
            else {
                //http://stackoverflow.com/a/4232971s
                $(el).contents().unwrap();
            }
        })

        pr.resetResult();
        pr.searchTerm();

        // ukloniti span tagove, ostaviti sadrzaj

        //TODO remove filtered class from variables



        // Get the filter text / reset the count to zero
        var filter = $(this).val(),
            count = 0;

        $.each(cont, function(key, val) {

	        //remove filtered results from variable FIRST
	        val.html(function(i, val) {
	        	var re = new RegExp("<\/?span[^>]*>","g"); 
	                return val.replace(re,'');
	        }); 


            if (val.text().search(new RegExp(filter, "i")) > 0) {
                //ima pojam u textu - nastavi
                //prikazi pojam u listi nadjenih

                reg = new RegExp("\\s?([^\\s]+\\s+" + filter + "\\S+\\s+[^\\s]+)\\s?", "ig");
                if (val.text().match(reg)) {
                    // console.log(val.text().match(reg)[0]);

                    var temp_val = val.text();
                    var temp_nadjeni = temp_val.match(reg);

                    temp_nadjeni.forEach(function(el) {

                        //nadji prvo pojavljivanje - uzmi index
                        // uzmi iteme pre i posle
                        var osnovni_index = temp_val.indexOf(el);
                        var pocetni_index = (osnovni_index - 50) > 0 ? (osnovni_index - 50) : 0;
                        var krajnji_index = (osnovni_index + 50) < temp_val.length ? (osnovni_index + 50) : temp_val.length;

                        var pojam_za_prikaz = temp_val.substring(pocetni_index, krajnji_index)



                        pojam_za_prikaz = pojam_za_prikaz.replace(new RegExp(filter, 'ig'), '<span class="filtered" >' + filter + '</span>');
                        triggerEvent(document, "nadjen-unos", { "detail": { "podaci": pojam_za_prikaz, "meta": key } })

                    })




                }



                //console.dir(val);
                //console.log(a);

                //add red class to nav
                $('#' + key).addClass("filtered");

                

                function highlighting (i, val) {


                        //var re = new RegExp(filter,"gi");  //
                        var re = new RegExp( filter+"(?![^<>]*>)", "gi");
                        var match_all = val.match(re)
                        if (!match_all)
                            return val;

                        match_all.forEach(function(el) {

                            val = val.replace(re, '<span class="filtered" >' + el + '</span>');
                        })
                        return val;
                    
                }

                

                val.html( highlighting );

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


    var resetF = function() {
        stavke = [];
    }

    var prikaziPretraguF = function() {

        $(".sadrzaj-pretrage").empty();

        stavke.forEach(function(ind, el) {
            //treba da se poziva funkcija sa parametrom, da se skrolujem
            $(".sadrzaj-pretrage").append(" <div class='stavka-pretrage'><a href='#"+ ind.meta+"'>" + ind.podaci + "</a> </div> ")
        })

    }

    var dodajF = function() {

        document.addEventListener("nadjen-unos", function(e) {
            //console.log(e.detail); 


            // sta ako ima vise pojavaljivanja nekog termina u jednom pasusu? da li treba da se prikaze u pretrazi
            if (stavke.indexOf(e.detail) == -1)
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

        $('.filtered').removeClass('filtered')
            //ukloni sve dugmice

        //zasad skrivanje, treba da se ukloni lista pretrage
        $(".sadrzaj-pretrage").hide();


    }

    return {
        resetResult: resetF,
        displaySearch: prikaziPretraguF,
        appendFinded: dodajF,
        searchTerm: pretragaF,
        hideResult: hideResultF,
        removeResult: removeResultF
    }
}
