# Google-Drive-API-PHP-AJAX
This is a project requested by Junk Doctors, it is a web application for fetching Google Drive files and folders, and allowing to download them.

Prerequisites

* PHP 5.4 or greater with the command-line interface (CLI) and JSON extension installed
* The Composer dependency management tool
* Nodejs
* A Google Cloud Platform project with the API enabled. To create a project and enable an API, refer to https://developers.google.com/workspace/guides/create-project and enable the API.

Instructions

1. First thing you need to do, is to go and create an OAuth Client ID for your project, and set the type to be "Desktop".
2. Then go and download the JSON credentials and paste it in the project directory, inside a subfolder named credentials, NOTE: this is very important.
3. You may run in the console: "composer install", in order to install all the needed libraries, in our case the google api client.
4. You may run in the console: "npm install", in order to install the JQuery library.
5. Lastly, run the whole web application via: "php -S localhost:3000" or any other port you wish to use, and if it is your first time, you have to navigate to, localhost:3000/libs/php/authentication.php in order to authenticate your Web App with the google client, and if you manage to authenticate successfully, you'll be redirected to the home page where you can use the application as you like.
