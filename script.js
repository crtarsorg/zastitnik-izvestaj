var stavke = [];
var cont = {};

var ci2015, ci2014, ci2013; 


Array.prototype.indexOfId = function(el) {
    for (var i = 0; i < this.length; i++)
        if (this[i].meta.split("-")[0] === el.meta.split("-")[0] && el.position == this[i].position)
            return i;
    return -1;
}


$(document).ready(function() {
    console.log("ready!");

    var pr = pretraga();

    pr.appendFinded();

    //get the footnotes
    var footnotes = $('#footnotes').html();
    $('#footnoteContent').html(footnotes)

    $("#hideSearch").click(function(ev) {
        pr.hideResult();
    })

    $("#closeSearch").click(function(ev) {
        pr.removeResult();
    })


    var folder = "dokumenti/";

     $.get(folder + "ci2015_izabrano.html" , function(response) {
            ci2015 = response;
        });
     $.get(folder + "ci2014_izabrano.html" , function(response) {
            ci2014 = response;
        });

     $.get(folder + "ci2013_izabrano.html" , function(response) {
            ci2013 = response;
        });


    // show compare window
    $('#uporedi').click(function() {

        //uzmi vrednost kliknutog
        var godina = $("#izvestajUporedi").val()
        var dokument ="";
       

        switch(godina) {
            case "2015":        
                html2compare = ci2015;
                break;
            case "2014":                
                html2compare = ci2014;
                break;
            case "2013":                
               html2compare = ci2013;
                break;
        }

        if(dokument!=""){
           
            
        }
        //alert()
        //ucitaj izvestaj koji odgovara godini
        //spakuj ga u neke promenljive
        // i ucitaj samo onu koja je neophodna  

        $('#displayContCompare').html(html2compare);

        $(function() {
            $("#displayCont").animate({
                width: '36%'
            }, { duration: 200, queue: false });
            $("#displayContCompare").animate({
                width: '36%',
                opacity: 1.0
            }, { duration: 200, queue: false });
        });

    });



    //var h = $(":header");
    //exclude H3 from parsing - parse H3 on demand
    var h = $("h1,h2");
   
    var excludedSearch = [];
    var oldH = 0;
    var html2compare;
    //http://stackoverflow.com/questions/11583271
    $.get("xtestCompare.html", function(response) {
        html2compare = response;
    });
    //console.dir(h);

    $(h).each(function(index) {
        //console.dir(h[index]);
        //trim &nbsp

        if (h[index].nodeName == "H1") {
            $("#nav").append('<span class="emptyHeader" id="showCont' + index + '">' + h[index].innerText.replace(/\u00a0/g, " ") + '</span>'); //return true;
            oldH = index;
            excludedSearch.push('showCont' + index);
            //set plain HTML for Chapters

        } else {
            $("#nav").append('<span class="header" id="showCont' + index + '">' + h[index].innerText.replace(/\u00a0/g, " ") + '</span>');
        }

        //put everything between H tags into array
        cont['showCont' + index] = $(h[index]).nextUntil(h[index + 1]).andSelf();

        //        $.each(cont['showCont' + index],function(i){
        //            cont['showCont' + oldH].append(cont['showCont' + index][i]);
        //        })

        //merge is ok as lon as you put header variable name into excluded search
        $.merge(cont['showCont' + oldH], cont['showCont' + index]);


        //console.dir(cont['showCont' + index]);

        //function for click in left menu - ID's in main menu has same id as index in cont variable
        $('#showCont' + index).click(function() {
            $('#displayCont').html();
            $('#displayCont').html(cont['showCont' + index]);
            //posto se vec ucitao u #displayCont
            parseH3subsection('showCont' + index, h[index].nodeName);
        });

    });

    



    // var key_u = 0;

    //search input handler
    $("#filter").keyup(function(ev) {

        //remove filtered class from document
        if ($("#filter").val().length == 0) pr.removeResult();

        if ($("#filter").val().length < 3) return;

        /*console.log("key up " +key_u )
        console.log(ev.keyCode)
               key_u++;*/

        //        var $svi_oznaceni = $(".filtered");
        //
        //        $svi_oznaceni.each(function(ind, el) {
        //            //ako ima id ili klasu, samo ukloni filterd klasu
        //            if( $(el).prop("id").indexOf("showCont")!=-1 )
        //                {
        //                    $(el).contents().unwrap();
        //                }
        //            else if ($(el).prop("id")   || !($(el).attr("class") == "filtered")) //ili ima klasu
        //                $(el).removeClass("filtered");
        //            else {
        //                //http://stackoverflow.com/a/4232971s
        //                $(el).contents().unwrap();
        //            }
        //        })

        pr.resetResult();
        pr.searchTerm();

        // ukloniti span tagove, ostaviti sadrzaj


        // Get the filter text / reset the count to zero
        var filter = $(this).val(),
            count = 0;
        //var count_l = 0

        $.each(cont, function(key, val) {

            if ($.inArray(key, excludedSearch) >= 0) { //  && key!="showCont5"   console.log(key);
                return;
            }
            if (val.text().search(new RegExp(filter, "i")) < 0) {
                return;
            }

            //remove filtered results from variable FIRST
            val.html(function(i, val_h) {
                var val_ar;
                var re = new RegExp("<\/?span[^>]*>", "g");

                val_ar = val_h.replace(re, '');
                return val_ar;

            });


            //disable search in headear variable (but those will be marked bcz of referencing)

            //add red class to nav
            $('#' + key).addClass("filtered");


            //console.log(count_l);
            //count_l++;
            function highlighting(i, val_ht) {
                //console.dir(val);


                // console.log(val_ht);



                //?????? ?????????
                //var re = new RegExp(filter,"gi");  //
                var re = new RegExp(filter + "(?![^<>]*>)", "gi");
                var match_all = val_ht.match(re)
                if (!match_all)
                    return val_ht;




                match_all.forEach(function(el) {

                    var val_text = $($.parseHTML(val_ht)).text();

                    var osnovni_index = val_text.indexOf(el);
                    var pocetni_index = (osnovni_index - 50) > 0 ? (osnovni_index - 50) : 0;
                    var krajnji_index = (osnovni_index + 50) < val_text.length ? (osnovni_index + 50) : val_text.length;

                    var pojam_za_prikaz = val_text.substring(pocetni_index, krajnji_index)


                    count = count + 1;


                    pojam_za_prikaz = pojam_za_prikaz.replace(re, '<span class="filtered" id="' + key + '-' + count + '" >' + el + '</span>');
                    val_ht = val_ht.replace(re, '<span class="filtered" id="' + key + '-' + count + '" >' + el + '</span>');

                    var detail = { "podaci": pojam_za_prikaz, "meta": key + '-' + count, 'position': osnovni_index };

                    //if (stavke.indexOfId(detail) == -1)
                    stavke.push(detail);

                    // triggerEvent(document, "nadjen-unos", {  })

                })
                return val_ht;

            }
            //val.html( highlighting );

            val.html(function(i, valspan) {
                //console.log('xxxxxxxxx');
                //var re = new RegExp(filter+"(?![^<>]*>)","i");
                //http://stackoverflow.com/questions/12493128
                var re = new RegExp("(?!<span[^>]*?>)(" + filter + ")(?![^<]*?</span>)", "i");

                //test regex in loop and make changes - match_all too many problems - using while
                while (re.test(valspan)) {

                    var foundSearchTerm = re.exec(valspan)[0];

                    valspan = valspan.replace(re, '<span class="filtered" id="' + key + '-' + count + '" >' + foundSearchTerm + '</span>');

                    //push to result list
                    //var refind = ("(?![^<>]*>)","i");
                    //var refind = new RegExp("(<span[^>]*?>)("+filter+")([^<]*?</span>)","i");
                    //Resenje 1 -
                    var surroudingWords = valspan.substr(valspan.lastIndexOf('<span class="filtered" id="' + key + '-' + count + '" >' + foundSearchTerm + '</span>'), valspan.length);
                    var pretext = valspan.substr(0, valspan.lastIndexOf('<span class="filtered" id="' + key + '-' + count + '" >' + foundSearchTerm + '</span>'));
                    var surroudingWords = $($.parseHTML(pretext)).text().split(" ").splice(-5).join(" ") + " " + $($.parseHTML(surroudingWords)).text().split(" ").splice(0, 10).join(" ");;

                    //var filterPos = valspan.lastIndexOf('<span class="filtered"');


                    //Resenje 2
                    //var filterIndex = valspan.lastIndexOf('<span class="filtered" id="'+key+'-'+count+'" >' + filter + '</span>');
                    //var pretext = $( $.parseHTML(valspan.substr(0,filterIndex)) ).text().split(" ").splice(-5).join(" ");
                    //var posttext = $( $.parseHTML(valspan.substr(filterIndex,valspan.length)) ).text().split(" ").splice(1,5).join(" ");
                    //var surroudingWords = pretext + filter+" " +posttext  ;    //
                    //surroudingWords =  surroudingWords.substr(0, Math.min(surroudingWords.length, surroudingWords.lastIndexOf(" ")))
                    //surroudingWords =  surroudingWords.match(refind, "")

                    //var surroudingWords = $( $.parseHTML(valspan) ) ; ??????

                    //console.dir("filterIndex:"+filterIndex);
                    //console.dir(valspan);
                    //console.dir(surroudingWords);
                    //console.dir("found:"+foundSearchTerm);

                    var detail = { "podaci": surroudingWords, "meta": key + '-' + count, 'position': count };
                    stavke.push(detail);

                    count++;
                }


                //                    //check if replacement happend
                //                    if(out.length!=valspan.length){
                //                        //push item to list
                //                        var detail = { "podaci": filter, "meta": key+'-'+count,'position':count }    ;
                //                        stavke.push(detail);
                //                        // increase count
                //                        count++;
                //                    }

                //create list

                //if (stavke.indexOfId(detail) == -1)




                return valspan;
            });


        });

        pr.displaySearch();

        //console.log(filter);

        //display num results
        $("#filter-count").text("Rezultata = " + count);

    });


    //load chapter and show filtered content if any ??????

    window.onpopstate = function(event) {
        var hash = window.location.hash.replace("#", "");

       //if clicked on search link
        if(hash.indexOf('showCont') > -1){
            $('#' + hash.split('-')[0]).trigger('click');

            //scroll to found keyword in content
            $('html body').animate({
                scrollTop: $('#displayCont #' + hash).offset().top
            }, 500);
        } else {
            $('html body').animate({
                scrollTop: $('#footnoteContent').find('#'+hash.substring(1)).offset().top
            }, 500);
        }

    };


    //empty #mainDocContent to remove duplicated anchors
    $('#mainDocContent').html('');

    // show first
    $('#showCont0').trigger('click');


});


function parseH3subsection(clicked, clickedNodeName) {

    // do not show if H1 node clicked
    if (clickedNodeName == "H1") {
        $('.h3sub').remove();
        $('#subNavHolder').remove();
        return;
    }

    //alert(clicked);
    var contsub = {};
    $('.h3sub').remove();
    $('#subNavHolder').remove();
    //parse clicked element value for H3
    var helements = $("#displayCont h3");

    if (helements.length < 1) {
        return; }

    //create element to hold subnav
    $('<span  id="subNavHolder"></span>').insertAfter('#' + clicked);

    $(helements).each(function(index) {
        //$('<span class="h3sub">'+helements[index].innerText.replace(/\u00a0/g, " ")+'</span>').insertAfter('#'+clicked);
        $('#subNavHolder').append('<span class="h3sub" id="showContSub' + index + '" >' + helements[index].innerText.replace(/\u00a0/g, " ") + '</span>');

        contsub['showContSub' + index] = $(helements[index]).nextUntil(helements[index + 1]).andSelf();

        //napravi click event za svaki span
        $('#showContSub' + index).click(function() {
            $('#displayCont').html();
            $('#displayCont').html(contsub['showContSub' + index]);
        });


    })

}


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




    var resetF = function() {
        stavke = [];
    }

    var prikaziPretraguF = function() {

        $(".sadrzaj-pretrage").empty();

        stavke.forEach(function(ind, el) {
            //treba da se poziva funkcija sa parametrom, da se skrolujem
            $(".sadrzaj-pretrage").append(" <div class='stavka-pretrage'><a href='#" + ind.meta + "'>" + ind.podaci + "</a> </div> ")
        })

    }

    var dodajF = function() {

        document.addEventListener("nadjen-unos", function(e) {
            //console.log(e.detail);


            // sta ako ima vise pojavaljivanja nekog termina u jednom pasusu? da li treba da se prikaze u pretrazi


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




/*jQuery(document).ready(function($) {
    $('#tabs').tab();
});*/
