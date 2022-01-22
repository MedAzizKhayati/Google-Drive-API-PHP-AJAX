<?php
require __DIR__ . '/../../vendor/autoload.php';
session_start();

/**
 * Returns an authorized API client.
 * @return Google_Client the authorized client object
 */
function getClient()
{
    $client = new Google_Client();
    $client->setApplicationName('Google Drive API PHP Quickstart');
    $client->addScope(Google_Service_Drive::DRIVE);
    $client->setAuthConfig(__DIR__ . '/../../credentials/credentials.json');
    $client->setRedirectUri('http://' . $_SERVER['HTTP_HOST'] . '/libs/php/authentication.php');
    $client->setAccessType('offline');
    $client->setPrompt('select_account consent');

    // Load previously authorized token from a file, if it exists.
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.

    $tokenPath = __DIR__ . '/../../credentials/token.json';
    if (file_exists($tokenPath)) {
        $accessToken = json_decode(file_get_contents($tokenPath), true);
        $client->setAccessToken($accessToken);
    }
    // If there is no previous token or it's expired.
    if ($client->isAccessTokenExpired()) {
        if ($client->getRefreshToken()) {
            $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
        }
        else if (!isset($_GET['code'])) {
            $auth_url = $client->createAuthUrl();
            header('Location: ' . filter_var($auth_url, FILTER_SANITIZE_URL));
        } else {
            // Exchange authorization code for an access token.
            $accessToken = $client->fetchAccessTokenWithAuthCode($_GET['code']);
            $client->setAccessToken($accessToken);

            // Check to see if there was an error.
            if (array_key_exists('error', $accessToken)) {
                throw new Exception(join(', ', $accessToken));
            }

            // Save the token to a file.
            if (!file_exists(dirname($tokenPath))) {
                mkdir(dirname($tokenPath), 0700, true);
            }

            file_put_contents($tokenPath, json_encode($client->getAccessToken()));
            
            $redirect_uri = 'http://' . $_SERVER['HTTP_HOST'];
            header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
        }
    }

    return $client;
}

// Save the client variable as a SERVER variables.
$_SERVER['google_client'] = getClient();
