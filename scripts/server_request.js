/* CC3206 Programming Project
Lecture Class: 203
Lecturer: Dr Simon WONG
Group Member: CHAN You Zhi Eugene (11036677A)
Group Member: FONG Chi Fai (11058147A)
Group Member: SO Chun Kit (11048455A)
Group Member: SO Tik Hang (111030753A)
Group Member: WONG Ka Wai (11038591A)
Group Member: YEUNG Chi Shing (11062622A) */

var polling, request;

// Server request
var server = (function() {
	// Get xmlhttp object
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
	
	// Send JSON
	function sendJSON(action, data, async) {
		try {
			polling = GetXmlHttpObject();
			polling.open("POST", action, async);
			polling.send(data);
		} catch (exception) {
			alert("Browser does not support HTTP Request.");
		}
	}
	
	// Get JSON
	function getJSON(action, async) {
		try {
			request = GetXmlHttpObject();
			request.open("GET", action, async);
			request.send(null);
			return request.responseText;
		} catch (exception) {
			alert("Browser does not support HTTP Request.");
		}
	}
	
	return {
		// get profile
		get_profile : function() {
			var p_name = document.getElementById('pname').innerHTML;
			var postData = JSON.parse('{"name":"' + p_name + '"}');
			var dataString = JSON.stringify(postData);
			var url = "get_profile.php";
			sendJSON(url, dataString, false);
			document.getElementById("profile").innerHTML = polling.responseText;
		},
		// Renew game status from server to client
		renewGame : function(table) {
			var url = "renew_game.php";
			url = url + "?table=" + table;
			return getJSON(url, false);
		},
		// Update game status from client to server
		updateGame : function(table, cardlist, cardcount, crystal, landfill, stack, discard, totalcrystal, playerenable, cardtypeisexist) {
			var cardlistStr = new Array();
			for (var i = 0; i < cardlist.length; i++) {
				cardlistStr[i] = '';
				for (var j = 0; j < cardlist[i].length; j++) {
					cardlistStr[i] = cardlistStr[i] + "#" + cardlist[i][j].id + "#";
				}
			}
			var stackStr = '';
			for (var i = 0; i < stack.length; i++) {
				stackStr = stackStr + "#" + stack[i].id + "#";
			}
			var discardStr = '';
			for (var i = 0; i < discard.length; i++) {
				discardStr = discardStr + "#" + discard[i].id + "#";
			}
			var cardtypeisexistStr = new Array();
			for (var i = 0; i < cardtypeisexist.length; i++) {
				if (cardtypeisexist[i] == true)
					cardtypeisexistStr[i] = 1;
				else if (cardtypeisexist[i] == false)
					cardtypeisexistStr[i] = 0;
			}
			
			var str = "{\"table\":\"" + table + "\", \"stack\":\"" + stackStr + "\", \"discard\":\"" + discardStr + "\", \"totalcrystal\":" + totalcrystal + ", \"playerinfo\":[";
			for (var i = 0; i < cardlist.length; i++) {
				if (i == cardlist.length - 1) {
					str = str + "{\"cardlist\":\"" + cardlistStr[i] + "\", \"cardcount\":" + cardcount + ", \"crystal\":" + crystal[i] + ", \"landfill\":" + landfill[i] + ", \"playerenable\":" + playerenable[i] + "}], ";
				}
				else {
					str = str + "{\"cardlist\":\"" + cardlistStr[i] + "\", \"cardcount\":" + cardcount + ", \"crystal\":" + crystal[i] + ", \"landfill\":" + landfill[i] + ", \"playerenable\":" + playerenable[i] + "}, ";
				}
			}
			str = str + "\"cardtype\":[";
			for (var i = 0; i < cardtypeisexist.length; i++) {
				if (i == cardtypeisexist.length - 1) {
					str = str + "{\"cardtypeisexist\":" + cardtypeisexistStr[i] + "}]}"
				}
				else {
					str = str + "{\"cardtypeisexist\":" + cardtypeisexistStr[i] + "}, ";
				}
			}
			var postData = JSON.parse(str);
			var dataString = JSON.stringify(postData);
			sendJSON("update_game.php", dataString, false);
		},
		renewUi : function(table) {
			var url = "renew_ui.php";
			url = url + "?table=" + table;
			return getJSON(url, false);
		},
		releaseTable : function(table) {
			var postData = JSON.parse('{"table":"' + table + '"}');
			var dataString = JSON.stringify(postData);
			sendJSON("release_table.php", dataString, true);
		},
		// Get player enable status
		getPlayerEnableStatus : function(table, player) {
			var url = "get_enable_status.php";
			url = url + "?table=" + table + "&player=" + player;
			return getJSON(url, false);
		},
		// Update player win and lose record
		setWinLose : function(table, winner, player) {
			var str = '{"table":"' + table + '", "winnerinfo":[';
			for (var i = 0; i < winner.length; i++) {
				if (i == winner.length - 1) {
					str = str + '{"winner":"' + winner[i] + '"}], ';
				}
				else {
					str = str + '{"winner":"' + winner[i] + '"}, ';
				}
			}
			str = str + '"playerinfo":[';
			for (var i = 0; i < player.length; i++) {
				if (i == player.length - 1) {
					str = str + '{"player":"' + player[i] + '"}]}';
				}
				else {
					str = str + '{"player":"' + player[i] + '"}, ';
				}
			}
			alert(str);
			var postData = JSON.parse(str);
			var dataString = JSON.stringify(postData);
			sendJSON("set_win_lose.php", dataString, true);
		}
	};
})();