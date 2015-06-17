/* CC3206 Programming Project
Lecture Class: 203
Lecturer: Dr Simon WONG
Group Member: CHAN You Zhi Eugene (11036677A)
Group Member: FONG Chi Fai (11058147A)
Group Member: SO Chun Kit (11048455A)
Group Member: SO Tik Hang (111030753A)
Group Member: WONG Ka Wai (11038591A)
Group Member: YEUNG Chi Shing (11062622A) */

var xmlHttp;
var password = null;
var playerid_valid = false;
var password_valid = false;
var password2_valid = false;
var email_valid = false;
var phoneno_valid = true;

function validate_playerid(str) {
	var node = document.getElementById('playerid_state');
	playerid_valid = false;
	if (str === "") {
		node.innerHTML = "Required";
	}
	else if (str.length < 5) {
		node.innerHTML = "Player name length less than 5";
	}
	else {
		xmlHttp = GetXmlHttpObject();
		if (xmlHttp == null) {
			alert ("Browser does not support HTTP Request.");
			return;
		}
		var url = "playerid.php";
		url = url + "?id=" + str;
		xmlHttp.open("GET", url, false);
		xmlHttp.send(null);
		document.getElementById("playerid_state").innerHTML = xmlHttp.responseText;
		if (node.innerHTML === "") {
			playerid_valid = true;
		}
	}
	enable_submit();
}

function validate_password(str) {
	password = str;
	var node = document.getElementById('password_state');
	password_valid = false;
	if (str === "") {
		node.innerHTML = "Required";
	}
	else if (str.length < 6) {
		node.innerHTML = "Password length less than 6";
	}
	else {
		node.innerHTML = "";
		password_valid = true;
	}
	enable_submit();
}

function validate_password2(str) {
	var node = document.getElementById('password2_state');
	password2_valid = false;
	if (str === "") {
		node.innerHTML = "Required";
	}
	else if (str !== password) {
		node.innerHTML = "Not same as password";
	}
	else {
		node.innerHTML = "";
		password2_valid = true;
	}
	enable_submit();
}

function validate_email(str) {
	var node = document.getElementById('email_state');
	email_valid = false;
	if (str === "") {
		node.innerHTML = "Required";
	}
	else if (str.indexOf("@") === -1) {
		node.innerHTML = "'@' sign required";
	}
	else if (str.indexOf(" ") !== -1) {
		node.innerHTML = "'space' sign not allowed";
	}
	else {
		node.innerHTML = "";
		email_valid = true;
	}
	enable_submit();
}

function validate_phoneno(str) {
	var node = document.getElementById('phoneno_state');
	phoneno_valid = true;
	var temp = parseInt(str);
	if (str === "") {
		node.innerHTML = "";
	}
	else if (str != temp) {
		node.innerHTML = "Not a number";
		phoneno_valid = false;
	}
	else {
		node.innerHTML = "";
	}
	enable_submit();
}

function enable_submit() {
	if (playerid_valid && password_valid && password2_valid && email_valid && phoneno_valid) {
		var node = document.getElementById('reg');
		reg.disabled = false;
	}
	else {
		var node = document.getElementById('reg');
		reg.disabled = true;
	}
}

// Show the popup window
function showPopup(name) {
	var background = $('#popup-background');
	background.fadeIn('slow');
	$('#' + name + '-window').fadeIn('slow');
}

// Hide the popup window
function hidePopup(name) {
	$('#popup-background').fadeOut('slow');
	$('#' + name + '-window').fadeOut('slow');
}

function GetXmlHttpObject() {
	var xmlHttp = null;
	try {
		// Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	}
	catch (e) {
		//Internet Explorer
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e) {
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return xmlHttp;
}