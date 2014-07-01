var listing = document.querySelector('#listing');
var input = document.querySelector('textarea');
var saveButton = document.querySelector('#save');
var delayedInputUpdater = 0;
var lastString = '';
var preview = document.querySelector('iframe');

function buildListing(snippetnames) {
    listing.innerHTML = "";
    snippetnames.forEach(function(snippetname) {
        var a = document.createElement("a");
        a.textContent = snippetname[0];
        a.href = "snippet.html?name=" + snippetname[0];

        var span = document.createElement("span");
        span.textContent = snippetname[1];


        var li = document.createElement("li");
        li.appendChild(a);
        li.appendChild(span);
        listing.appendChild(li);
    });
}

function updatePreview() {
    if (lastString != input.value) {
        preview.contentWindow.document.open();
        preview.contentWindow.document.write(input.value);
        preview.contentWindow.document.close();
        saveButton.classList.remove('inactive');
    }
}

function updateInput(event) {
    if (delayedInputUpdater)
        clearTimeout(delayedInputUpdater);
    delayedInputUpdater = setTimeout(updatePreview, 100);
}

function save() {
    var input = document.querySelector('textarea');
    var params = "snippet=" + encodeURIComponent(input.value);

    var http = new XMLHttpRequest();
    http.open("POST", "savesnippet.cgi", true);
    http.responseType = 'json';
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            history.pushState(null, null,
                              "snippet.html?name=" + http.response[0]);
            updateListing();
            saveButton.classList.add('inactive');
        }
    };
    http.send(params);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function updateListing() {
    var http = new XMLHttpRequest();
    http.open("GET", "getsnippets.cgi", true);
    http.responseType = 'json';
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            buildListing(http.response);
        }
    };
    http.send();
}

function load(name) {
    var http = new XMLHttpRequest();
    http.open("GET", "snippet.cgi?name=" + name, true);
    http.responseType = 'text';
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            input.value = http.responseText;
            updatePreview();
            saveButton.classList.add('inactive');
        }
    };
    http.send();
}

function setup() {
    updateListing();
    var initial = getParameterByName('name');
    if (initial) {
        load(initial);
    }
    updatePreview();
}

setup();

window.addEventListener("popstate", function(e) {
    setup();
});
