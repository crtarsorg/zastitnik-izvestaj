
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var html = require("html");

var folder = "./dokumenti/"

jedanFile(folder , 'refs1.html');
//getFiles( folder );

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);

    for (var i in files){
        var name = dir + '' + files[i];
        
        console.log(name);

		if(fs.lstatSync(name).isDirectory())
			continue;
		var data = fs.readFileSync( name /*'./test.htm'*/, 'utf8').toString();
		  
		 ocisti(data, files[i]);
		  //close file
		  
    }
    return files_;
}


function jedanFile (dir, files){
    
    var name = dir + '' + files;
   
	var data = fs.readFileSync( name /*'./test.htm'*/, 'utf8').toString();
	  
	ocisti(data, files );
	
}





function ocisti(podaci , naziv) {

	//'table', 'thead', "style",
	var initPodesavanja = {
		allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
		  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
		   'caption','table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre' ,
		  "script","head" ,"title","body","html", "meta" , "img"],
		allowedAttributes: {
		  a: [ 'href', 'name', 'target' ],
		  // We don't currently allow img itself by default, but this
		  // would make sense if we did
		  table:[  'border', 'cellspacing', 'cellpadding', 'width', 'style' ],
		  tr:['style'],
		  td:['style','width','rowspan','style'],
		  img: [ 'src' ],
		  meta:['*'],
		  div:['id',"class"],
		  script:['src'],

		},
		// Lots of these won't come up by default because we don't allow them
		selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
		// URL schemes we permit
		allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],
		allowedSchemesByTag: {}
	}

	var clean = sanitizeHtml(podaci , initPodesavanja );

	//replace </i><i> ; dodati colspan="2" na pojedina mesta, ne moze automatski
	//>\d{1,3}\.(\d{1,2}\.)?\s{2,20}
	//<b></b>
	//<p> </p>
	//�
	clean = html.prettyPrint(clean, {indent_size: 2}); 


	fs.writeFile( folder +naziv+"rez.html"/*"./clean.html"*/, clean, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 
}
