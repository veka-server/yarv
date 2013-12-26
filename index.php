<?php include('php/proxy.php'); ?>
<html>
<head>
	<title>YARV</title>
	<meta charset="utf-8"/>
	<link rel="stylesheet" type="text/css" href="css/defaut.css">
</head>
<body>

<div id="loaderImage" class='hidden'></div>

<p id="jsOFF">Pour utiliser se site, veuillez activer le javascript.</p>

<nav id='nav' class='hidden'>

	<h1>YARV</h1>

	<h3>Navigation</h3>
	<ul>
		<li><a id="all">Tous les flux</a></li>
		{{#flux}}
			<li><a id='{{id}}' class='nav'>{{site}}</a></li>
		{{/flux}}
	</ul>
	<h3>Options</h3>

	<ul>
		<li><a id="clean">Vider le cache</a></li>
		<li><a id="onlylu"></a></li>
	</ul>
	

	<ul id='info'>
		<li>{{count}} articles disponibles pour les 48 dernières heures.</li>
	</ul>
</nav>

<div id="content" class="hidden">
	{{#articles}}
		<article class='{{class}}'>
			<h1>{{title}}</h1>
			<h2>{{date_humaine}} <a href="{{link}}" target='_blank'>Voir la source chez {{site}}</a></h2>
			<div>{{{content}}}</div>
			<input type='button' value='Marquer comme lu' class='boutonLu' id='{{hash}}'/>
		</article>
	{{/articles}}
</div>

<script type="text/javascript" src='js/lib/jquery.js'></script>
<script type="text/javascript" src='js/lib/mustache.js'></script>
<script type="text/javascript" src='js/lib/md5.js'></script>
<script type="text/javascript" src='js/loader.js'></script>
<script type="text/javascript" src='js/config.js'></script>
<script type="text/javascript" src='js/app.js'></script>

</body>
</html>