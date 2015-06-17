/* CC3206 Programming Project
Lecture Class: 203
Lecturer: Dr Simon WONG
Group Member: CHAN You Zhi Eugene (11036677A)
Group Member: FONG Chi Fai (11058147A)
Group Member: SO Chun Kit (11048455A)
Group Member: SO Tik Hang (111030753A)
Group Member: WONG Ka Wai (11038591A)
Group Member: YEUNG Chi Shing (11062622A) */

// Game state and processes
var game = (function() {
	// Point to current table
	var currentTable;
	// Number of player
	var playerCount;
	// Player position in array
	var playerPosition;
	// Player name
	var playerName;
	// Player card array (2D)
	var players;
	// Total number of crystal
	var totalCrystal;
	// Player crystal number
	var playerCrystal;
	// Player Land fill level
	var playerLandfill;
	// Play card enable status of player
	var playerEnable;
	// Stock card array
	var stock;
	// Discardpile array
	var discardpile;
	// Check whether card type exist or not
	var cardTypeIsExist;
	// Allow user clicking the card
	var playerCardsClickEnabled;
	// Allow user clicking the stock pile
	var stockpileClickEnabled;
	// Id of setInterval
	var intervalId;
	// Id of setInterval
	var intervalId2;
	// The game state
	var isGameEnd;
	
	function updateFromServer() {
		// Get data from server
		var json_string = JSON.parse(server.renewGame(currentTable));
		var patten = /#(.*?)#/g;
		// Set server information to client
		for (var i = 0; i < playerCount; i++){
			players[i] = json_string[i].cardlist.match(patten);
			playerCrystal[i] = parseInt(json_string[i].crystal);
			playerLandfill[i] = parseInt(json_string[i].landfill);
			playerEnable[i] = json_string[i].play_card_enable;
		}
		stock = json_string[6].cardlist.match(patten);
		discardpile = json_string[7].cardlist.match(patten);
		totalCrystal = parseInt(json_string[6].crystal);
		
		if (totalCrystal == 0)
			isGameEnd = true;
		
		if (stock == null)
			stock = new Array();
		if (discardpile == null)
			discardpile = new Array();
		
		// Remove # in card array
		for (var i = 0; i < playerCount; i++){
			if (players[i] != null){
				for (var j = 0; j < players[i].length; j++){
					players[i][j] = players[i][j].replace(/#/g, "");
				}
			}
		}
		if (stock != null){
			for (var i = 0; i < stock.length; i++){
				stock[i] = stock[i].replace(/#/g, "");
			}
		}
		if (discardpile != null){
			for (var i = 0; i < discardpile.length; i++){
				discardpile[i] = discardpile[i].replace(/#/g, "");
			}
		}
		setCardToObject();
		
		// If player don't have any legal card, then allow him pick card from stockpile
		if (game.getLegalCards(playerPosition).length == 0) {
			stockpileClickEnabled = true;
		}
		
		if (playerEnable[playerPosition] == 1)
			playerCardsClickEnabled = true;
		else if (playerEnable[playerPosition] == 0)
			playerCardsClickEnabled = false;
		
		for (var i = 0; i < playerCount; i++) {
			ui.addCardToOtherPlayerTray(i);
		}
		
		game.checkEndGame();
	}

	// Set all the cards to object type
	function setCardToObject() {
		var temp;
		var numberOfCardPerType = card.getMaxCard() / card.getMaxCardType();
		for (var i = 0; i < players.length; i++){
			if (players[i] != null){
				for(var j = 0; j < players[i].length; j++) {
					temp = new Object();
					temp.id = players[i][j];
					temp.typeId = Math.floor(players[i][j] / numberOfCardPerType);
					players[i][j] = temp;
				}
			}
		}
		if (stock != null){
			for (var i = 0; i < stock.length; i++){
				temp = new Object();
				temp.id = stock[i];
				temp.typeId = Math.floor(stock[i] / numberOfCardPerType);
				stock[i] = temp;
			}
		}
		if (discardpile != null){
			for (var i = 0; i < discardpile.length; i++){
				temp = new Object();
				temp.id = discardpile[i];
				temp.typeId = Math.floor(discardpile[i] / numberOfCardPerType);
				discardpile[i] = temp;
			}
		}
	}

	// Reset all arrays
	function resetArrays() {
		playerName = new Array();
		playerCrystal = new Array();
		playerLandfill = new Array();
		playerEnable = new Array();
		stock = new Array();
		discardpile = new Array();
		players = new Array();
		for (var i = 0; i < playerCount; i++){
			players[i] = new Array();
		}
		cardTypeIsExist = new Array();	
		for (var i = 0; i < card.getMaxRubblishType(); i++){
			cardTypeIsExist[i] = false;
		}
	}
	
	// Interval function
	function intervalFunction() {
		if (server.getPlayerEnableStatus(currentTable, playerPosition) == 1) {
			game.stopInterval();
			intervalFunction2();
			updateFromServer();
			ui.resetHolderClick();
			ui.setPassFalse();
			document.getElementById("player1-title").innerHTML = document.getElementById("player1-title").innerHTML + " <- (Your Turn)";
			document.getElementById("player1-title").setAttribute("style", "color:#F00");
			if (playerPosition != 0) {
				document.getElementById("player" + playerCount + "-title").innerHTML = playerName[playerPosition - 1];
				document.getElementById("player" + playerCount + "-title").setAttribute("style", "color:#FFF");
			}
			else {
				document.getElementById("player" + playerCount + "-title").innerHTML = playerName[playerCount - 1];
				document.getElementById("player" + playerCount + "-title").setAttribute("style", "color:#FFF");
			}
			ui.clearToast();
			ui.showToast('This is your trun. Please play card(s).');
		} else {
			intervalFunction2();
		}
	}
	// Interval function2
	function intervalFunction2() {
		var json_string = JSON.parse(server.renewUi(currentTable));
		var cardTypeIsExist_temp = new Array();
		var stock_temp = '';
		var discardpile_temp = '';
		
		// Get played card information
		for (var i = 0; i < cardTypeIsExist.length; i++){
			if (json_string.type[i] == 1) {
				cardTypeIsExist_temp[i] = true;
			} else if (json_string.type[i] == 0)
				cardTypeIsExist_temp[i] = false;
		}
		
		// Get player crystal and landfill information
		for (var i = 0; i < playerCount; i++){
			playerCrystal[i] = parseInt(json_string.crystal[i]);
			playerLandfill[i] = parseInt(json_string.landfill[i]);
			playerEnable[i] = parseInt(json_string.enable[i]);
		}
		
		// Get stock and discardpile information
		var patten = /#(.*?)#/g;
		stock_temp = json_string.cardlist[0].match(patten);
		discardpile_temp = json_string.cardlist[1].match(patten);
		if (stock_temp != null){
			for (var i = 0; i < stock_temp.length; i++){
				stock_temp[i] = stock_temp[i].replace(/#/g, "");
			}
		}
		if (discardpile_temp != null){
			for (var i = 0; i < discardpile_temp.length; i++){
				discardpile_temp[i] = discardpile_temp[i].replace(/#/g, "");
			}
		}
		var temp;
		var numberOfCardPerType = card.getMaxCard() / card.getMaxCardType();
		if (stock_temp != null) {
			for (var i = 0; i < stock_temp.length; i++){
				temp = new Object();
				temp.id = stock_temp[i];
				temp.typeId = Math.floor(stock_temp[i] / numberOfCardPerType);
				stock_temp[i] = temp;
			}
		}
		if (discardpile_temp != null) {
			for (var i = 0; i < discardpile_temp.length; i++){
				temp = new Object();
				temp.id = discardpile_temp[i];
				temp.typeId = Math.floor(discardpile_temp[i] / numberOfCardPerType);
				discardpile_temp[i] = temp;
			}
		}
		
		// Update player crystal and landfill
		ui.updateCrystalArea();
		
		// Update current player title
		for (var i = 0; i < playerCount; i++) {
			if (playerEnable[i] == 1 && i != playerPosition) {
				for (var j = 1; j < playerCount; j++) {
					if (playerName[i] == document.getElementById("player" + (j+1) + "-title").innerHTML) {
						document.getElementById("player" + (j+1) + "-title").innerHTML = document.getElementById("player" + (j+1) + "-title").innerHTML + " <- (Current Turn)";
						document.getElementById("player" + (j+1) + "-title").setAttribute("style", "color:#F00");
						if (j != 1) {
							document.getElementById("player" + (j) + "-title").innerHTML = document.getElementById("player" + (j) + "-title").innerHTML.replace(" <- (Current Turn)", "");
							document.getElementById("player" + (j) + "-title").setAttribute("style", "color:#FFF");
						}
					}
				}
			}
		}
		
		// Update stock and discardpile
		if (stock_temp != null) {
			if (stock.length != stock_temp.length) {
				ui.removeCardFromStockPile();
				stock.pop();
			}
		}
		if (discardpile_temp != null) {
			if (discardpile.length != discardpile_temp.length) {
				ui.addCardToDiscardPile(discardpile_temp[discardpile_temp.length - 1]);
				discardpile.push(discardpile_temp[discardpile_temp.length - 1]);
			}
		}
		// Update played card on table
		for (var i = 0; i < cardTypeIsExist_temp.length; i++) {
			if (cardTypeIsExist[i] != true && cardTypeIsExist_temp[i] == true) {
				for (var j = 0; j < playerCount; j++) {
					for (var k = 0; k < players[j].length; k++) {
						if (players[j][k].typeId == i) {
							ui.addCardToRubblishArea2(players[j][k]);
							cardTypeIsExist[i] = true;
							return;
						}
					}
				}
			}
		}
	}
	
	return {
		// Initialize the game
		init : function() {
			// Set player number, current table and player position
			playerCount = $('#player-number').val();
			currentTable = $('#table-name').val();
			playerPosition = $('#player-position').val();
			
			// Disable card and stock click
			playerCardsClickEnabled = false;
			stockpileClickEnabled = false;
			isGameEnd = false;
			
			// Reset all arrays
			resetArrays();
			
			// Get data from server and set game information
			updateFromServer();
			
			// Get data from server and set total number of crystal
			var json_string = JSON.parse(server.renewGame(currentTable));
			// Set player name
			for (var i = 0; i < playerCount; i++){
				playerName[i] = json_string[i].player_id;
			}
			
			game.startInterval();
		},
		// Get the number of players
		getPlayerCount : function() {
			return playerCount;
		},
		// Get the current table
		getCurrentTable : function() {
			return currentTable;
		},
		// Get self player id
		getPlayerPosition : function() {
			return playerPosition;
		},
		// Get the player name
		getPlayerName : function(playerId) {
			return playerName[playerId];
		},
		// Get the player card array
		getPlayerCards : function(playerId) {
			return players[playerId];
		},
		// Get the card object from a player
		getPlayerCard : function(playerId, cardId) {
			var cardArray = players[playerId];
			var arrayLength = cardArray.length;
			for(var i = 0; i < arrayLength; i++) {
				if(cardArray[i].id == cardId) {
					return cardArray[i];
				}
			}
			return null;
		},
		// Remove the card object from a player
		removePlayerCard : function(playerId, cardId) {
			var cardArray = players[playerId];
			var arrayLength = cardArray.length;
			for(var i = 0; i < arrayLength; i++) {
				if(cardArray[i].id == cardId) {
					return cardArray.splice(i, 1)[0];
				}
			}
			return null;
		},
		// Get the number of cards of all player
		getPlayerCardLength : function() {
			var cardCount = new Array();
			for (var i = 0; i < playerCount; i++) {
				cardCount[i] = players[i].length;
			}
			return cardCount;
		},
		// Get the number of cards of player
		getPlayerCardNumber : function(playerId) {
			return players[playerId].length;
		},
		// Get total number of crystal
		getTotalCrystal : function() {
			return totalCrystal;
		},
		// Get player crystal number
		getPlayerCrystal : function(player) {
			return playerCrystal[player];
		},
		// Get player landfill level
		getPlayerLandfill : function(player) {
			return playerLandfill[player];
		},
		// Get the enable status of player
		getPlayerEnable : function(playerId) {
			return playerEnable[playerId];
		},
		// Get the stock card array
		getStockCards : function() {
			return stock;
		},
		// Pick a card from stock pile for player
		getStockPileCardToPlayer : function() {
			var cardObject = stock.pop();
			players[playerPosition].push(cardObject);
			return cardObject;
		},
		addCardToDiscardPile : function(cardObject) {
			discardpile.push(cardObject);
		},
		getPlayerCardsClickEnabled : function() {
			return playerCardsClickEnabled;
		},
		getStockpileClickEnabled : function() {
			return stockpileClickEnabled;
		},
		setStockpileClickEnabled : function(value) {
			stockpileClickEnabled = value;
		},
		// Get the legal cards array of a player
		getLegalCards : function(playerId) {
			var cardArray = players[playerId];
			var arrayLength = cardArray.length;
			var legalCards = new Array();
			for(var i = 0; i < arrayLength; i++) {
				if(game.isLegalPlay(cardArray[i])) {
					legalCards.push(cardArray[i]);
				}
			}
			return legalCards;
		},
		// Check whether this card object is a legal play
		isLegalPlay : function(cardObject) {
			if (card.isFunctionalCard(cardObject)) {
				return true;
			} else if (!cardTypeIsExist[cardObject.typeId]) {
				return true;
			} else {
				return false;
			}
		},
		// Start update from server
		startInterval : function() {
			intervalId = window.setInterval(function(){intervalFunction()}, 100);
		},
		// Stop update from server
		stopInterval : function() {
			clearInterval(intervalId);
		},
		// Do the checking task after the player played a card
		playCardProcessor : function(cardObject) {
			var currentPlayer = parseInt(playerPosition);
			if(card.isFunctionalCard(cardObject)) {
				ui.addCardToFunctionalArea(cardObject);
				if(card.isConversionCard(cardObject)) {
					// Convert the points of Landfill pollution into Energy Crystals
					playerCrystal[currentPlayer] += playerLandfill[currentPlayer];
					playerLandfill[currentPlayer] = 0;
					game.checkNextTurn();
				} else if(card.isDishonestTraderCard(cardObject)){
					// Stealing 1 Ennrgy Crystal from your oppenent, increasing 2 ponint of the Landfill
					// pop a window and let him select a suit
					ui.clearToast();
					var suitWindow = $('#suit-selector');
					var background = $('#popup-background');
					suitWindow.fadeIn('fast');
					background.fadeIn('fast');
					ui.clearToast();
					suitWindow.bind('click', function(event) {
						var target = event.target;
						if(target.nodeName.toLowerCase() === 'button') {
							suitWindow.unbind('click');
							suitWindow.hide();
							background.hide();
							var playerId = parseInt(target.id.split('-', 2)[1]);
							playerLandfill[playerId] += 2;
							playerCrystal[currentPlayer] += 1;
							if (totalCrystal != 0)
								totalCrystal--;
							ui.bindCardClickListener();
							game.checkNextTurn();
						}
					});
				} else if(card.isExcessLandfillCard(cardObject)){
					// Increase two points from the Landfill
					for(var i = 0; i < playerCount ;i++) {
						playerLandfill[i] += 2;
					}
					game.checkNextTurn();
				} else if(card.isHighTechnologyCard(cardObject)){
					// As part of any Trash combination
					// If it is a human player, pop a window and let him select a suit
					ui.clearToast();
					var suitWindow = $('#rubblish-selector');
					var background = $('#popup-background');
					suitWindow.fadeIn('fast');
					background.fadeIn('fast');
					ui.clearToast();
					suitWindow.bind('click', function(event) {
						var target = event.target;
						if(target.nodeName.toLowerCase() === 'button') {
							suitWindow.unbind('click');
							suitWindow.hide();
							background.hide();
							var cardId = parseInt(target.id);
							ui.addCardToDiscardPile(cardObject);
							game.addCardToDiscardPile(cardObject);
							cardObject.typeId = cardId;
							ui.addCardToRubblishArea(cardObject);
							cardTypeIsExist[cardObject.typeId] = true;
							game.checkRubblishCollect(currentPlayer);
							ui.bindCardClickListener();
							game.checkNextTurn();
						}
					});
				} else if(card.isIncineratorFailureCard(cardObject)){
					// increase one point from the Landfill
					for(i=0; i < playerCount ;i++) {
						playerLandfill[i] += 1;
					}
					game.checkNextTurn();
				} else if(card.isIncineratorCard(cardObject)){
					// deduct one point from the Landfill
					if (playerLandfill[currentPlayer] != 0)
						playerLandfill[currentPlayer] -= 1;
					game.checkNextTurn();
				} else if(card.isJunkRetrievingCard(cardObject)){
					// get a card from your oppenent's hand
					// pop a window and let him select a suit
					ui.clearToast();
					var suitWindow = $('#suit-selector');
					var background = $('#popup-background');
					suitWindow.fadeIn('fast');
					background.fadeIn('fast');
					ui.clearToast();
					suitWindow.bind('click', function(event) {
						var target = event.target;
						if(target.nodeName.toLowerCase() === 'button') {
							suitWindow.unbind('click');
							suitWindow.hide();
							background.hide();
							var playerId = parseInt(target.id.split('-', 2)[1]);
							var numOfCard = players[playerId].length;
							var cardId = Math.floor(Math.random() * numOfCard);
							var cardObject = players[playerId][cardId];
							game.removePlayerCard(playerId, cardObject.id);
							ui.removeCardFromOtherPlayerTray(playerId);
							players[currentPlayer].push(cardObject);
							ui.addCardToPlayerTray(cardObject);
							ui.bindCardClickListener();
							game.checkNextTurn();
						}
					});
				} else if(card.isLandfillTransferCard(cardObject)) {
					// Every player transfers their Landfill to next opponent in anti-clockwise
					var temp = playerLandfill[0];
					for(var i = 0; i < (parseInt(playerCount) - 1); i++) {
						playerLandfill[i] = playerLandfill[(i+1)];
					}
					playerLandfill[parseInt(playerCount) - 1] = temp;
					game.checkNextTurn();
				} else if (cardObject.typeId === 32) {
					playerCrystal[currentPlayer] += totalCrystal;
					totalCrystal -= totalCrystal;
					game.checkNextTurn();
				}
			} else {
				ui.clearToast();
				cardTypeIsExist[cardObject.typeId] = true;
				ui.addCardToRubblishArea(cardObject);
				game.checkRubblishCollect(currentPlayer);
				game.checkNextTurn();
			}
		},
		checkRubblishCollect : function(currentPlayer) {
			currentPlayer = currentPlayer - 1;
			if (cardTypeIsExist[0] && cardTypeIsExist[1] && cardTypeIsExist[2]) {
				$('#battery-1').fadeOut('fast');
				$('#battery-2').fadeOut('fast');
				$('#battery-3').fadeOut('fast');
				var cardObject = new Object();
				for(var i = 0; i < 3; i++) {
					cardTypeIsExist[i] = false;
					cardObject.typeId = i;
					ui.addCardToDiscardPile(cardObject);
				}
				playerCrystal[currentPlayer]++;
				if (totalCrystal != 0)
					totalCrystal--;
			} 
			if (cardTypeIsExist[3] && cardTypeIsExist[4] && cardTypeIsExist[5]) {
				$('#oldStuff-1').fadeOut('fast');
				$('#oldStuff-2').fadeOut('fast');
				$('#oldStuff-3').fadeOut('fast');
				var cardObject = new Object();
				for(var i = 3; i < 6; i++) {
					cardTypeIsExist[i] = false;
					cardObject.typeId = i;
					ui.addCardToDiscardPile(cardObject);
				}
				playerCrystal[currentPlayer]++;
				if (totalCrystal != 0)
					totalCrystal--;
			}
			if (cardTypeIsExist[6] && cardTypeIsExist[7] && cardTypeIsExist[8]) {
				$('#surplus-1').fadeOut('fast');
				$('#surplus-2').fadeOut('fast');
				$('#surplus-3').fadeOut('fast');
				var cardObject = new Object();
				for(var i = 6; i < 9; i++) {
					cardTypeIsExist[i] = false;
					cardObject.typeId = i;
					ui.addCardToDiscardPile(cardObject);
				}
				playerCrystal[currentPlayer]++;
				if (totalCrystal != 0)
					totalCrystal--;
			}
			if (cardTypeIsExist[9] && cardTypeIsExist[10] && cardTypeIsExist[11] && cardTypeIsExist[12] && cardTypeIsExist[13]) {
				$('#metal-1').fadeOut('fast');
				$('#metal-2').fadeOut('fast');
				$('#metal-3').fadeOut('fast');
				$('#metal-4').fadeOut('fast');
				$('#metal-5').fadeOut('fast');
				var cardObject = new Object();				
				for(var i = 9; i < 14; i++) {
					cardTypeIsExist[i] = false;
					cardObject.typeId = i;
					ui.addCardToDiscardPile(cardObject);
				}
				playerCrystal[currentPlayer]++;
				playerCrystal[currentPlayer]++;
				if (totalCrystal > 1)
					totalCrystal -= 2;
				else if (totalCrystal == 1)
					totalCrystal --;
			}
			if (cardTypeIsExist[14] && cardTypeIsExist[15] && cardTypeIsExist[16] && cardTypeIsExist[17] && cardTypeIsExist[18]) {
				$('#paper-1').fadeOut('fast');
				$('#paper-2').fadeOut('fast');
				$('#paper-3').fadeOut('fast');
				$('#paper-4').fadeOut('fast');
				$('#paper-5').fadeOut('fast');
				var cardObject = new Object();
				for(var i = 14; i < 19; i++) {
					cardTypeIsExist[i] = false;
					cardObject.typeId = i;
					ui.addCardToDiscardPile(cardObject);
				}
				playerCrystal[currentPlayer]++;
				playerCrystal[currentPlayer]++;
				if (totalCrystal > 1)
					totalCrystal -= 2;
				else if (totalCrystal == 1)
					totalCrystal --;
			}
			if (cardTypeIsExist[19] && cardTypeIsExist[20] && cardTypeIsExist[21] && cardTypeIsExist[22] && cardTypeIsExist[23]) {
				$('#plastics-1').fadeOut('fast');
				$('#plastics-2').fadeOut('fast');
				$('#plastics-3').fadeOut('fast');
				$('#plastics-4').fadeOut('fast');
				$('#plastics-5').fadeOut('fast');
				var cardObject = new Object();	
				for(var i = 19; i < 24; i++) {
					cardTypeIsExist[i] = false;
					cardObject.typeId = i;
					ui.addCardToDiscardPile(cardObject);
				}

				playerCrystal[currentPlayer]++;
				playerCrystal[currentPlayer]++;
				if (totalCrystal > 1)
					totalCrystal -= 2;
				else if (totalCrystal == 1)
					totalCrystal --;
			}
		},
		checkNextTurn : function () {
			ui.updateCrystalArea();
			if ((ui.getHolderClick() >= 3) || ui.getPass() || (game.getLegalCards(playerPosition) == 0) || (game.checkEndGame())) {
				for (var i = 0; i < 2; i++) {
					var cardObject = game.getStockPileCardToPlayer();
					// Update the UI
					ui.removeCardFromStockPile();
					ui.addCardToPlayerTray(cardObject);
				}
				playerEnable[playerPosition] = 0;
				if (parseInt(playerPosition) + 1 != parseInt(playerCount)) {
					playerEnable[parseInt(playerPosition) + 1] = 1;
				}
				else {
					playerEnable[0] = 1;
				}
				ui.resetHolderClick();
				ui.setPassFalse();
				var numberOfCard = parseInt(game.getPlayerCardLength());
				server.updateGame(currentTable, players, numberOfCard, playerCrystal, playerLandfill, stock, discardpile, totalCrystal, playerEnable, cardTypeIsExist);
				playerCardsClickEnabled = false;
				
				game.checkEndGame();
				document.getElementById("player1-title").innerHTML = playerName[playerPosition];
				document.getElementById("player1-title").setAttribute("style", "color:#FFF");
				game.startInterval();
			}
			else {
				var numberOfCard = parseInt(game.getPlayerCardLength());
				server.updateGame(currentTable, players, numberOfCard, playerCrystal, playerLandfill, stock, discardpile, totalCrystal, playerEnable, cardTypeIsExist);
			}
		},
		// Check the game is ended. If ended, show the results
		checkEndGame : function() {
			if (totalCrystal <= 0) {
				isGameEnd = true;
				ui.showResult();
				return true;
			} else {
				// The game is not ended
				isGameEnd = false;
				return false;
			}
		},
		// Calculate score
		calculateScore : function() {
			// Get data from server
			var json_string = JSON.parse(server.renewGame(currentTable));
			// Set server information to client
			for (var i = 0; i < playerCount; i++){
				playerCrystal[i] = json_string[i].crystal;
				playerLandfill[i] = json_string[i].landfill;
			}
			
			var winner = new Array();
			var player = new Array();
			for (var i = 0; i < playerCount; i++) {
				player[i] = playerName[i];
			}
			var score = new Array();
			for (var i = 0; i < playerCount; i++) {
				score[i] = parseInt(playerCrystal[i]) - parseInt(playerLandfill[i]);
			}
			var crystal = new Array();
			for (var i = 0; i < playerCount; i++) {
				crystal[i] = parseInt(playerCrystal[i]);
			}
			var landfill = new Array();
			for (var i = 0; i < playerCount; i++) {
				landfill[i] = parseInt(playerLandfill[i]);
			}
			var highest = score[0];
			var winner_crystal = playerCrystal[0];
			var winner_landfill = playerLandfill[0];
			for (var i = 1; i < playerCount; i++) {
				if (score[i] > highest) {
					highest = score[i];
					winner = new Array();
					winner[0] = i;
				}
				// In case there are more than one winner (same scores)
				else if (score[i] == highest) {
					// Find winner with the lowest landfill level
					if (playerLandfill[i] < winner_landfill) {
						highest = score[i];
						winner_crystal = playerCrystal[i];
						winner_landfill = playerLandfill[i];
						winner = new Array();
						winner[0] = i;
					}
					// Find winner with the most number of crystal
					else if (playerLandfill[i] == winner_landfill && playerCrystal[i] > winner_crystal) {
						highest = score[i];
						winner_crystal = playerCrystal[i];
						winner_landfill = playerLandfill[i];
						winner = new Array();
						winner[0] = i;
					}
					// More than one winners
					else if (playerLandfill[i] == winner_landfill && playerCrystal[i] == winner_crystal) {	
						winner.push(i);
					}
				}
			}
			var result = new Object();
			result.player = player;
			result.scores = score;
			result.winner = winner;
			result.crystal = crystal;
			result.landfill = landfill;
			return result;
		},
		pushCheat: function(cardObject) {
			players[playerPosition].push(cardObject);
		}
	}
})();