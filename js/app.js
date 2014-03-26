$(function() {

function html_entity_decode(str) {
    try {
		var  tarea=document.createElement('textarea');
		tarea.innerHTML = str; return tarea.value;
		tarea.parentNode.removeChild(tarea);
	} catch(e) {
		//for IE add <div id="htmlconverter" style="display:none;"></div> to the page
		document.getElementById("htmlconverter").innerHTML = '<textarea id="innerConverter">' + str + '</textarea>';
		var content = document.getElementById("innerConverter").value;
		document.getElementById("htmlconverter").innerHTML = "";
		return content;
	}
}



function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

var strip_tags = function (input, allowed) {
  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var tri = function(a, b){
	a = new Date(a["date"]).getTime();
	b = new Date(b["date"]).getTime();
	return b-a;
}

var checkStrorage = function(id){
	if(!supports_html5_storage) return '';

	var lu = localStorage.getItem('lu');


	if(lu)
	if(JSON.parse(lu)[id])
	return 'lu';

	return '';
}

var parseRSS = function(data, i){
    $(data).find("item").each(function () { 
        var el = $(this);       

        var date = new Date(el.find("pubDate").text());
        if( date.getTime() < (new Date().getTime()-(3600000*24)*jours))
        	return 0 ;

        var content = el.find("content\\:encoded").text();
        if(!content) { content = el.find("description").text(); }

        var hash = md5(el.find("title").text()+el.find("pubDate").text()+el.find("link").text());
		var class2 = checkStrorage(hash);
		var mois = date.getMonth() + 1;

        tableau_articles.push({ 	"site" 			: 	html_entity_decode(el.parent().find("title").first().text()),
        							"link"			: 	html_entity_decode(el.find("link").text()),
        							"title"			: 	html_entity_decode(el.find("title").text()),
        							"date"			: 	html_entity_decode(el.find("pubDate").text()),
        							"date_humaine"	: 	html_entity_decode(date.getDate()+'/'+mois+'/'+date.getFullYear()+'  '+date.getHours()+':'+date.getMinutes()),
        							"content"		: 	strip_tags(html_entity_decode(content),striptagsVar),
        							"class"			: 	"rss"+i+' '+class2 ,
        							"hash"			: 	hash ,
        });
    });
}

var parseATOM = function(data, i){

    $(data).find("entry").each(function () { 
        var el = $(this);

        var date = new Date(el.find("updated").text());
		var mois = date.getMonth() + 1;
        if( date.getTime() < (new Date().getTime()-(3600000*24)*jours))
        	return 0 ;

        var content = strip_tags(el.find("content").text(),striptagsVar);
        if(!content){content = strip_tags(el.find("summary").text(),striptagsVar);}


        var hash = md5(el.find("title").text()+el.find("updated").text()+el.find("link").text());
		var class2 = checkStrorage(hash);

        tableau_articles.push({ 	"site" 	: 	html_entity_decode(el.parent().find("title").first().text()),
        							"link"	: 	html_entity_decode(el.find("link").text()),
        							"title"	: 	html_entity_decode(el.find("title").text()),
        							"date_humaine"	: 	date.getDate()+'/'+mois+'/'+date.getFullYear()+'  '+date.getHours()+':'+date.getMinutes(),
        							"date"	: 	html_entity_decode(el.find("updated").text()),
        							"content"	: html_entity_decode(content),
        							"class"		: "rss"+i+' '+class2 ,
        							"hash"		: hash ,
        });

    });

}

var goPage = function(afficherlu){
	$('article').css('display','none');
	$(page_curr).css('display','block');
	if($(page_curr+'.lu').length == 0) 
	{
		$('#onlylu').html('');
		return 1 ;
	}
	if(afficherlu != 1){
		$('.lu').css('display','none');
		$('#onlylu').html('Afficher les lus');
	}
	else
	{
		$('#onlylu').html('Cacher les lus');
	}
}

var navigation = function(){	
	var tableau_flux = [];
	$.each(flux, function(key, value) {
		tableau_flux.push({'site':key,'id':tableau_bouton[key.replace(/\W/g, '')]});
	});
	code_html = Mustache.render($('#nav').html(),{flux : tableau_flux, count : tableau_articles.length});
	$('#nav').html(code_html);
	$('#nav').css('display','block');

	$('.nav').each(function(){
	   	$(this).click(function(){
			page_curr = $(this).attr('id');
			goPage();
    	});
	});

	$('#all').click(function(){
		page_curr = 'article';
		goPage();
	});
}


var iframeOff = function(){
	$('#content').find('iframe').each(function(){
		var myIframe = $(this);
		$(myIframe).css('display','none');

		var div = $('<div class="iframeOff"></div>');
		div.insertBefore($(this));

		div.click(function(){
			$(myIframe).css('display','');
			$(this).remove();
		})

	})
}

var afficher = function(){

	// trie les article par date
	tableau_articles.sort(tri);

	// ajoute les article dans la page
	var code_html = Mustache.render($('#content').html(),{articles : tableau_articles});
	$('#content').html(code_html);

	// premier affichage
	goPage();

	// suppression des pub integré a mes flux
    $(".tentblogger-rss-footer").remove();
    $(".feedflare").remove();

	// genere et affiche la bar de navigation
	navigation();

	// modifie les iframes
	iframeOff();

	$('article .boutonLu').each(function(){
		$(this).click(function(){
			if(!supports_html5_storage)return 0;

			var lu = JSON.parse(localStorage.getItem('lu'));
			if(!lu) var lu = {};

			// ajoute la class lu
			$(this).parent('article').addClass(' lu');
			
			// enregistre les donnée chez l'utilisateur
			lu[this.id] = '1';
			localStorage.setItem('lu', JSON.stringify(lu));

			goPage();

		})
	})

	$('#clean').click(function(){
		localStorage.clear();
		document.location.reload(true);
	});

	$('#onlylu').click(function(){
		var el = $(this);

		if($(page_curr+'.lu').css('display') == 'none')
		{
			goPage(1);
		}
		else
		{
			goPage(0);
		}

	});

	// affiche les articles et dissimule le loader
	$('#content').show(function(){
		$('#loaderImage').hide();
	});

}

var debut = function()
{
	var len =  Object.size(flux);
	var i = 1;

	$.each(flux, function(key, value) {

		$.get('?flux='+encodeURIComponent(value), function (data) {

		tableau_bouton[key.replace(/\W/g, '')] = '.rss'+i ;

		parseRSS(data, i);

		parseATOM(data, i);

		if (i == len ) { afficher(); } i++;

		});

	});
}

// dissimule le message d'erreur pour le javascript desactivé
$('#jsOFF').hide();

// affiche le loader
$('#loaderImage').show();

var tableau_articles = []; 	// tableau contenant tout les articles
var tableau_bouton = {}; 	// tableau contenant les pairs clé:valeur utiles pour la navigation
var striptagsVar = '<i><b><a><div><p><img><strong><h1><h2><h3><h5><h6><iframe>';
var page_curr = 'article';


debut();

});
