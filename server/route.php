<?php


include "autoloader.php";
define('URL', 'http://webservices.nextbus.com/service/publicXMLFeed');

$url = addslashes('/work/ttc/server/route.php');

$requestUrl = $_SERVER['REQUEST_URI'];

$diff = substr($requestUrl, strlen($url));
//var_dump($requestUrl, $diff);
$opts = array(
    'http'=>array(
        'method'=>"GET"
    )
);

$context = stream_context_create($opts);

// Open the file using the HTTP headers set above
$file = file_get_contents(URL . $diff, false, $context);

header("Content-Type: text/xml");
echo $file;