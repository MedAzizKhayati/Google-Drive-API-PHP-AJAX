<?php
require  __DIR__ . '/authentication.php';

$client = $_SERVER['google_client'];


if (isset($_REQUEST['file_id']) && $_REQUEST['file_id']) {

    // Get the API client and construct the service object.
    $service = new Google_Service_Drive($client);
    $fileId = $_REQUEST['file_id'];
    // Print the names and IDs for up to 10 files.
    $optParams = array(
        "alt" => "media"
    );
    $content = $service->files->get($fileId, array("alt" => "media"));

    // Open file handle for output.
    $filePath = "__DIR__ . '/temp";
    $outHandle = fopen($filePath, "w+");

    // Until we have reached the EOF, read 1024 bytes at a time and write to the output file handle.

    while (!$content->getBody()->eof()) {
        fwrite($outHandle, $content->getBody()->read(1024));
    }

    // Close output file handle.
    fclose($outHandle);

    header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
    header("Cache-Control: public"); // needed for internet explorer
    header("Content-Type: application/zip");
    header("Content-Transfer-Encoding: Binary");
    header("Content-Length:" . filesize($filePath));
    header("Content-Disposition: attachment");
    readfile($filePath);
    unlink($filePath);
    die();
} else {
    // In case the request doesn't have date information.
    $output['status']['code'] = "404";
    $output['status']['name'] = "failed";
    $output['status']['description'] = "missing parent paramater";
}

// Returning the response as a JSON Object.
echo json_encode($output);
