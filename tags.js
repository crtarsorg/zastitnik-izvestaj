//iniciajlni tagovi
//
//smestanje u web bazu


var db = new PouchDB('tagovi');


function pronadji(argument) {
	// body...
}

function addTag(text) {
  var tag = {
    _id: new Date().toISOString(),
    title: text,
    completed: false,
    nek_param : "levi neki"
  };
  db.put(tag, function callback(err, result) {
    if (!err) {
    	console.log(result);
      console.log('Successfully posted a tag!');
    }
  });
}


function showTags() {
  db.allDocs({include_docs: true, descending: true}, function(err, doc) {
    console.log(doc.rows);
  });
}

function getTag(id ) {
	db.get( id ).then(function (doc) {
	  console.log(doc);
	}).catch(function (err) {
	  console.log(err);
	});
}

/*window['db'] = db;
window['addTag'] = addTag;
window['showTags'] = showTags;
window['getTag'] = getTag;*/


// kada se predje kursorom preko nekog pasusa
// otvara se prozorcic
// sa poljem za unos tagova



