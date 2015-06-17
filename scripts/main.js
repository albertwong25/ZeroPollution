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
var request, polling, postData, dataString;
var playername, ptextbox;
var table1, table2, selected_table;
var table1_playerlist, table2_playerlist, table1_playercount, table2_playercount;
var table1_selected = false;
var table2_selected = false;
var table_clicked;

function init() {
	$('#home, #profile, #chatroom, #game-rules, #about, #credit, #logout').bind('click', function(event) {
		var id = event.target.id;
		if(id === 'home') {
			// Ask player confirm to back home page
			var homeConfirm = confirm("Back to home page?");
			if (homeConfirm) {
				document.myform1.submit();
			}
		} else if(id === 'profile') {
			get_profile();
			showPopup('profile');
			var popup = $('#popup-background, #profile-close');
			popup.click(function() {
				hidePopup('profile');
				popup.unbind('click');
			});
			$('body').keyup(function(event) {
				// Esc key
				if(event.keyCode === 27) {
					hidePopup('profile');
					$('body').unbind('keyup');
				}
			});
		} else if(id === 'chatroom') {
			document.myform3.submit();
		} else if(id === 'game-rules') {
			showPopup('rule');
			var popup = $('#popup-background, #rule-close');
			popup.click(function() {
				hidePopup('rule');
				popup.unbind('click');
			});
			$('body').keyup(function(event) {
				// Esc key
				if(event.keyCode === 27) {
					hidePopup('rule');
					$('body').unbind('keyup');
				}
			});
		} else if(id === 'about') {
			showPopup('about');
			var popup = $('#popup-background, #about-close');
			popup.click(function() {
				hidePopup('about');
				popup.unbind('click');
			});
			$('body').keyup(function(event) {
				// Esc key
				if(event.keyCode === 27) {
					hidePopup('about');
					$('body').unbind('keyup');
				}
			});
		} else if(id === 'credit') {
			showPopup('credit');
			var popup = $('#popup-background, #credit-close');
			popup.click(function() {
				hidePopup('credit');
				popup.unbind('click');
			});
			$('body').keyup(function(event) {
				// Esc key
				if(event.keyCode === 27) {
					hidePopup('credit');
					$('body').unbind('keyup');
				}
			});
		} else if(id === 'logout') {
			// Ask player confirm to logout
			var logoutConfirm = confirm("Logout?");
			if (logoutConfirm) {
				location.href="index.html";
			}
		}
	});

	start();
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

function get_profile() {
		playername = $("#pname").val();
		xmlHttp = GetXmlHttpObject();
		if (xmlHttp == null) {
			alert ("Browser does not support HTTP Request.");
			return;
		}
		postData = JSON.parse('{"name":"' + playername + '"}');
		dataString = JSON.stringify(postData);
		var url = "get_profile.php";
		xmlHttp.open("POST", url, false);
		xmlHttp.send(dataString);
		document.getElementById("profile").innerHTML = xmlHttp.responseText;
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

function start() {
	playername = document.getElementById("pname").value;
	table1 = document.getElementById("table1");
	table1.addEventListener("click", function(){ postPlayer("table1"); }, false);
	table2 = document.getElementById("table2");
	table2.addEventListener("click", function(){ postPlayer("table2"); }, false);
	
	table1_playerlist = document.getElementById("table1_playerlist");
	table2_playerlist = document.getElementById("table2_playerlist");
	
	leave_button = document.getElementById("leave_button");
	leave_button.addEventListener("click", function(){ leave(); }, false);
	
	table1_button = document.getElementById("table1_button");
	table1_button.addEventListener("click", function(){ setToStartedState("table1"); }, false);
	table2_button = document.getElementById("table2_button");
	table2_button.addEventListener("click", function(){ setToStartedState("table2"); }, false);
	
	selected_table = document.getElementById("selected_table");
	
	window.setInterval("getTableStatus()", 200);
}

// client to server
function postPlayer(tname){
	leave();
	postData = JSON.parse('{"name":"' + playername + '", "table":"' + tname + '"}');
	dataString = JSON.stringify(postData);
	table_clicked = tname;
	sendJSON("record_selected_table.php", true);
}

function setToStartedState(tname){
	if ($('#' + tname + '_playerlist li:eq(0)').html() === undefined)
		alert("No player insides the table.");
	else if ($('#' + tname + '_playerlist li:eq(1)').html() === undefined)
		alert("Game can only be started with two ore more players.");
	else {
		var tablehost = document.getElementById(tname + "_playerlist").firstChild.innerHTML;
		// alert( "1.Host: " + tablehost + " Player: " + playername);
		if (playername == tablehost){
			postData = JSON.parse('{"table":"' + tname + '"}');
			dataString = JSON.stringify(postData);
			sendJSON("set_to_started_state.php", true);
		}
		else
			alert("Only the HOST player " + tablehost + " can start the game.");
	}
}

function sendJSON(action, async){
	try {
		request = GetXmlHttpObject();
		if (async)
			request.addEventListener("readystatechange", checkJoinStatus, false);
		request.open("POST", action, async);
		request.send(dataString);
	} catch (exception) {
		alert("Browser does not support HTTP Request.");
	}
}

function checkJoinStatus(){
	if (request.readyState == 4 && request.status == 200){
		// alert(request.responseText);
		if (table_clicked == "table1") table1_selected = true;
		if (table_clicked == "table2") table2_selected = true;
	}
}

// server to client
function getTableStatus(){
	try {
		polling = GetXmlHttpObject();
		polling.addEventListener("readystatechange", stateChange, false);
		polling.open("GET", "tables_status.php", true);
		polling.send(null);
	} catch (exception) {
		alert("Browser does not support HTTP Request.");
	}
}

function stateChange(){
	if (polling.readyState == 4 && polling.status == 200){
		var result = JSON.parse(polling.responseText);
		table1_playerlist.innerHTML = result[0].playerlist;
		table2_playerlist.innerHTML = result[1].playerlist;
		if (result[0].joinenable == 0)
			$("#table1 h4").text("Table 1 (started)");
		else
			$("#table1 h4").text("Table 1");
		if (result[1].joinenable == 0)
			$("#table2 h4").text("Table 2 (started)");
		else
			$("#table2 h4").text("Table 2");
		if (table1_selected && result[0].status == "started" && result[0].joinenable == 1){
			selected_table.value = "table1";
			table1_selected = false; // stop opening indefinite number of forms
			var host = document.getElementById("table1_playerlist").firstChild.innerHTML;
			postData = JSON.parse('{"table":"table1", "player":"' + playername + '", "host":"' + host + '"}');
			dataString = JSON.stringify(postData);
			sendJSON("initial_game.php", false);
			setTimeout("document.myform.submit()", 2000);
		}
		if (table2_selected && result[1].status == "started" && result[1].joinenable == 1){
			selected_table.value = "table2";
			table2_selected = false; // stop opening indefinite number of forms
			var host = document.getElementById("table2_playerlist").firstChild.innerHTML;
			postData = JSON.parse('{"table":"table2", "player":"' + playername + '", "host":"' + host + '"}');
			dataString = JSON.stringify(postData);
			sendJSON("initial_game.php", false);
			setTimeout("document.myform.submit()", 2000);
		}
	}
}

function leave(){
	postData = JSON.parse('{"name":"' + playername + '"}');
	dataString = JSON.stringify(postData);
	sendJSON("leave_table.php", false);
}

// Initialize the event handler when DOM is ready
$(document).ready(function() {
	init();
});