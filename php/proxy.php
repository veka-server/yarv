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
	        echo str_replace('&', '&amp;', $buffer);
	    }
	    fclose($handle);
	}
	die();
}
