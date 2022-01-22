// The parent folder is initialized at root folder.
let parents = ['root'];

// This function will help us getUrlParameters
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};
// Getting URL parameters if existing, and displaying the files inside the folder
// Of the given ID
let folderId = getUrlParameter('file_id');
folderId ? parents.push(folderId) : null;


const fetchFiles = () => {
	// using ajax to make a POST request to getFiles.php
	$.ajax({
		url: '/libs/php/getFiles.php',
		type: 'POST',
		dataType: 'json',
		data: {
			parent: parents[parents.length - 1],
		},
		success: result => {
			//console.log(result);

			// Reseting the content of #google-drive-row
			$('#google-drive-row').html('');

			if (parents.length > 1) {
				$('#google-drive-row').append(`
					<button type="button" id="back" class="btn btn-success">Back</button>
					<br><br>
				`);
			}

			// If it was successfull
			if (result.status.name == 'ok') {
				if (result.data.length == 0) {
					// Tell the user there is no events for this day.
					$('#google-drive-row').append(`
							<h4 style="color: red"> There are no files in this directory!!</h4>
						`);
				} else {
					// For each file, show its information.
					result.data.forEach(file => {
						$('#google-drive-row').append(`
							<div class="card" >
							<div class="card-body">
								<h5 class="card-title">${file.name}</h5>
								</p>
									<p class="card-text"> Created at: 
									${new Date(file.createdTime)}
								</p>
								${file.mimeType == "application/vnd.google-apps.folder" ?
								`<a class="card-link" file-id="${file.id}" style="cursor: pointer" id="folder">Check Folder</a>`
								:`<a class="card-link" file-name="${file.name}" file-id="${file.id}" style="cursor: pointer" id="file">Download</a>`}
							</div>
							</div>
							`)
					});
				}
			}
		},
		// In case of any error, log the errors, also let the user, there has been an internal error and ask him to try again
		// later
		error: (jqXHR, textStatus, errorThrown) => {
			console.log(jqXHR, textStatus, errorThrown);
			$('#google-drive-row').html(`
					<h4 style="color: red"> THERE HAS BEEN AN INTERNAL ERROR, PLEASE TRY AGAIN LATER!!</h4>
				`);
		}
	})
}

// Calling the API once the page loads.
fetchFiles();

$('#google-drive-row').on('click', '#folder', (event) => {
	// console.log(event.target.getAttribute('file-id'));
	const folderId = event.target.getAttribute('file-id');
	parents.push(folderId);
	// Dynamic URL Parameters
	window.history.replaceState(null, null, "?file_id="+folderId);
	fetchFiles();
})

$('#google-drive-row').on('click', '#back', (event) => {
	parents.pop();
	previous = parents[parents.length - 1];
	// Dynamic URL Parameters
	previous != "root"
	? window.history.replaceState(null, null, "?file_id="+previous)
	: window.history.replaceState(null, null, "?file_id=");
	fetchFiles();
})



// Downloading files from Google Drive
$('#google-drive-row').on('click','#file', (event) => {
	const fileId = event.target.getAttribute('file-id');
	const fileName = event.target.getAttribute('file-name');
	$.ajax({
		url: '/libs/php/downloadFile.php?file_id='+fileId,
		cache: false,
		xhr: function () {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 2) {
					if (xhr.status == 200) {
						xhr.responseType = "blob";
					} else {
						xhr.responseType = "text";
					}
				}
			};
			return xhr;
		},
		success: function (data) {
			//Convert the Byte Data to BLOB object.
			var blob = new Blob([data], { type: "application/octetstream" });
			
			//Check the Browser type and download the File.
			var isIE = false || !!document.documentMode;
			if (isIE) {
				window.navigator.msSaveBlob(blob, fileName);
			} else {
				var url = window.URL || window.webkitURL;
				link = url.createObjectURL(blob);
				var a = $("<a />");
				a.attr("download", fileName);
				a.attr("href", link);
				$("body").append(a);
				a[0].click();
				$("body").remove(a);
			}
		},
		error: (jqXHR, textStatus, errorThrown) => {
			console.log(jqXHR, textStatus, errorThrown);
			$('#google-drive-row').html(`
					<h4 style="color: red"> THERE HAS BEEN AN INTERNAL ERROR, PLEASE TRY AGAIN LATER!!</h4>
			`);
		}
	});
})
