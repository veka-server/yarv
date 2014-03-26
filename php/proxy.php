<?php 

// lecture du fichier de config pour consulter les url autorisé
$flux = json_decode(file_get_contents('config.json'), true);

// proxy php pour recuperer les flux
if(isset($_GET['flux']) && in_array($_GET['flux'], $flux))
{

	// Set your return content type
	header('Content-type: application/xml');

	// Get that website's content
	$handle = fopen($_GET['flux'], "r");

	// If there is something, read and return
	if ($handle) {
	    while (!feof($handle)) {
	        $buffer = fgets($handle, 4096);
	        echo str_replace('&', '&amp;', $buffer);
	    }
	    fclose($handle);
	}
	die();
}