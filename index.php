<?php
// proxy php pour recuperer les flux
if(isset($_GET['flux']))
{
	// Set your return content type
	header('Content-type: application/xml');

	// Get that website's content
	$handle = fopen($_GET['flux'], "r");

	// If there is something, read and return
	if ($handle) {
	    while (!feof($handle)) {
	        $buffer = fgets($handle, 4096);
	        echo $buffer;
	    }
	    fclose($handle);
	}
	die();
}
?>
<html>
<head>
	<title>YARV</title>
		<meta charset="utf-8"/>
		<link rel="stylesheet" type="text/css" href="defaut.css">
</head>
<body>

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
			<h2>{{date_humaine}} <a href="{{link}}">Voir la source chez {{site}}</a></h2>
			<div>{{{content}}}</div>
			<input type='button' value='Marquer comme lu' class='boutonLu' id='{{hash}}'/>
		</article>
	{{/articles}}
</div>

<div id="loaderImage"></div>

<script type="text/javascript" src='jquery.js'></script>
<script type="text/javascript" src='mustache.js'></script>
<script type="text/javascript" src='md5.js'></script>
<script type="text/javascript" src='loader.js'></script>
<script type="text/javascript" src='config.js'></script>
<script type="text/javascript" src='app.js'></script>

</body>
</html>