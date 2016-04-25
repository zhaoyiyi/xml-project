<?php
// Make request to get xml files and echo.

// target api url
define('URL', 'http://webservices.nextbus.com/service/publicXMLFeed');
// server path
define('PATH', '/work/ttc/server/route.php');

$requestUrl = $_SERVER['REQUEST_URI'];

$diff = substr($requestUrl, strlen(PATH));
$opts = array(
    'http' => ['method' => "GET"]
);
$context = stream_context_create($opts);
$file = file_get_contents(URL . $diff, false, $context);

header("Content-Type: text/xml");
echo $file;