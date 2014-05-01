<?php 

// lecture du fichier de config pour consulter les url autorisé
$flux = json_decode(file_get_contents('config.json'), true);

// proxy php pour recuperer les flux
if(isset($_GET['flux']) && in_array($_GET['flux'], $flux))
{
	// Get that website's content
	$handle = fopen($_GET['flux'], "r");

	// If there is something, read and return
	if ($handle) {
		$page = '';
	    while (!feof($handle)) {
	        $buffer = fgets($handle, 4096);
	        $page .= str_replace('&', '&amp;', $buffer);
	    }
	    fclose($handle);
	}

	if(isset($page) && ( stripos($page, '<rss') !== false || stripos($page, '<feed') !== false ) )
	{
		// Set your return content type
		header('Content-type: application/xml');
		echo  $page;		
	}

	die();
}
