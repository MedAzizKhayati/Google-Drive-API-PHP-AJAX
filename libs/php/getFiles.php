<?php
require  __DIR__ . '/authentication.php';

$client = $_SERVER['google_client'];


if (isset($_REQUEST['parent']) && $_REQUEST['parent']) {

    // Get the API client and construct the service object.
    $service = new Google_Service_Drive($client);

    // Print the names and IDs for up to 10 files.
    $optParams = array(
        'fields' => 'nextPageToken, files(id, name, parents, mimeType, size, createdTime, owners)',
        'q' => "'me' in owners and '". $_REQUEST['parent'] ."' in parents"
    );
    $results = $service->files->listFiles($optParams);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data'] = $results->getFiles();
} else {
    // In case the request doesn't have date information.
    $output['status']['code'] = "404";
    $output['status']['name'] = "failed";
    $output['status']['description'] = "missing parent paramater";
}

// Returning the response as a JSON Object.
echo json_encode($output);
