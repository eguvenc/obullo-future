var clientId = '237644160362-7gsb3ohad0b3c8187ho972dnof7uinnp.apps.googleusercontent.com';
var apiKey   = 'AIzaSyBa1CgWyM4jMOwDh8epXPcEYd5z3o-tPwo';
var scopes   = 'https://www.googleapis.com/auth/analytics.readonly';

// This function is called after the Client Library has finished loading
function handleClientLoad() {
  // 1. Set the API Key
  gapi.client.setApiKey(apiKey);

  // 2. Call the function that checks if the user is Authenticated. This is defined in the next section
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  // Call the Google Accounts Service to determine the current user's auth status.
  // Pass the response to the handleAuthResult callback function
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	console.warn(arguments);
  if (authResult) {
    // The user has authorized access
    // Load the Analytics Client. This function is defined in the next section.
    loadAnalyticsClient();
  } else {
    // User has not Authenticated and Authorized
    handleUnAuthorized();
  }
}


// Authorized user
function handleAuthorized() {
  var authorizeButton = document.getElementById('authorize-button');
  var makeApiCallButton = document.getElementById('make-api-call-button');

  // Show the 'Get Sessions' button and hide the 'Authorize' button
  makeApiCallButton.style.visibility = '';
  authorizeButton.style.visibility = 'hidden';

  // When the 'Get Sessions' button is clicked, call the makeAapiCall function
  makeApiCallButton.onclick = makeApiCall;
}


// Unauthorized user
function handleUnAuthorized() {
	console.warn('no');
  var authorizeButton = document.getElementById('authorize-button');
  var makeApiCallButton = document.getElementById('make-api-call-button');

  // Show the 'Authorize Button' and hide the 'Get Sessions' button
  makeApiCallButton.style.visibility = 'hidden';
  authorizeButton.style.visibility = '';

  // When the 'Authorize' button is clicked, call the handleAuthClick function
  authorizeButton.onclick = handleAuthClick;
}

function handleAuthClick(event) {
	console.warn('yes');
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

function loadAnalyticsClient() {
  // Load the Analytics client and set handleAuthorized as the callback function
  gapi.client.load('analytics', 'v3', handleAuthorized);
}