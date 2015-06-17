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
	// Number of player
	var playerCount;
	var maxCrystal = 12;
	var totalCrystal;
	// Stock card array
	var stock;
	var discardpile;
	// Player card array (2D)
	var players;
	// The ID of the current player
	var currentPlayer;
	// The current playing direction (true: clockwise; false: anti-clockwise)
	var player1CardsClickEnabled;
	// Allow user clicking the stock pile
	var stockpileClickEnabled;
	var cardTypeIsExist;
	var playerCrystal;
	var playerLandfill;
	// The game state
	var isGameEnd;

	function resetGameBoard() {
		cardTypeIsExist = new Array();	
		for(var i = 0; i < card.getMaxRubblishType(); i++){
			cardTypeIsExist[i] = false;
		}
	}

	// Reset all the arrays
	function resetArrays() {
		stock = new Array();
		players = new Array();
		discardpile = new Array();
		for(var i = 0; i < playerCount; i++) {
			players[i] = new Array();
		}
	}

	// Create all the cards to the stock pile
	function createCards() {
		var temp;
		var cardId = 0;
		var TypeId = 0;
		var totalCard = card.getMaxCardType();
		for(var i = 0; i < totalCard; i++) {
			for(var j = 0; j < 8; j++) {
				temp = new Object();
				temp.id = cardId;
				temp.typeId = TypeId;
				stock.push(temp);
				cardId++;
			}
			TypeId++;
		}
		card.maxCardId = 65;
	}

	// Shuffle the cards by swapping cards in the stock pile
	function shuffleCards(maxCard) {
		var shuffleTimes = Math.floor(Math.random() * 8) + 10;
		var randIndex;
		var temp;
		for(var i = 0; i < shuffleTimes; i++) {
			for(var j = 0; j < maxCard; j++) {
				randIndex = Math.floor(Math.random() * maxCard);
				temp = stock[j];
				stock[j] = stock[randIndex];
				stock[randIndex] = temp;
			}
		}
	}

	// Deal cards to the players at the beginning of the game
	function dealCards() {
		for(var i = 0; i < 4; i++) {
			// For every card
			for(var j = 0; j < playerCount; j++) {
				// For every player
				players[j][i] = stock.pop();
			}
		}
	}

	function resetCrystal() {
		totalCrystal = maxCrystal;
	}
	
	// Goto next player and delegate the computer player's play to computerPlayerTurn()
	function nextPlayer() {
		ui.clearToast();
		if(!game.checkEndGame()) {
			if(stock.length <= 5){
				var counter = discardpile.length;
				for(var i = 0; i < counter;i++) {
					stock.push(discardpile.pop());
				}
				shuffleCards(counter);
			}
			if(moveToNextPlayer() !== 0) {
				setTimeout(function(){computerPlayerTurn();},3000);
				document.getElementById('player' + (currentPlayer+1) + '-playedCardHolder').innerHTML = '';
			} else {
				ui.bindCardClickListener();
				ui.lockNewGame(false);
				player1CardsClickEnabled = true;
				ui.showToast('Your turn.');
				if(players[0].length === 0) {
					for(var i = 0; i < 5; i++) {
						// Get the card
						var cardObject = game.getStockPileCardToHumanPlayer();
						// Update the UI
						ui.removeCardFromStockPile();
						if(card.isExcessLandfillCard(cardObject)||card.isIncineratorFailureCard(cardObject)) {
							game.removePlayerCard(0, cardObject.id);
							game.playCardProcessor(cardObject);
							nextPlayer();
						} else {
							ui.addCardToHumanPlayerTray(cardObject);
							nextPlayer();
						}
					}
				} else if(game.getLegalCards(0).length === 0) {
					stockpileClickEnabled = true;
				} else {
					stockpileClickEnabled = false;
				}
			}
		}
	}

	// Find out the current player ID
	function moveToNextPlayer() {
			ui.unbindCardClickListener();
			currentPlayer++;
			if(currentPlayer >= playerCount) {
				currentPlayer = 0;
			}
			return currentPlayer;	
	}

	// Computer player play card
	function computerPlayerTurn() {
		if(players[currentPlayer].length === 0) {
			for(var i = 0; i < 5; i++) {
				players[currentPlayer].push(stock.pop());
				ui.removeCardFromStockPile();
				ui.addCardToComputerPlayerTray(currentPlayer);
			}
		} else {
				// Get all legal cards
				var legalCards = game.getLegalCards(currentPlayer);
				if(legalCards.length !== 0) {
					if (legalCards.length >= 3){
						var randomCardOut = Math.floor(Math.random() * 3) + 1;
						for(var i = 0; i < randomCardOut; i++) {
							var legalCards = game.getLegalCards(currentPlayer);
							computerPlayCard(legalCards);
						}
					} else if (legalCards.length === 2) {
						var randomCardOut = Math.floor(Math.random() * 2) + 1;
						for(var i = 0; i < randomCardOut; i++) {
							var legalCards = game.getLegalCards(currentPlayer);
							computerPlayCard(legalCards);
						}
					} else if (legalCards.length === 1) {
						var legalCards = game.getLegalCards(currentPlayer);
						computerPlayCard(legalCards);
					}
					if (game.getPlayerCards(currentPlayer).lenght>6){
						var randomIndex = Math.floor(Math.random() * game.getPlayerCards(currentPlayer).lenght);
						game.addCardToDiscardPile(cardObject);
						game.removePlayerCard(currentPlayer, cardObject.id);
					}
					$('#player' + (currentPlayer+1) + '-playedCard').fadeIn(1500)
					.fadeOut(1500);
					computerDrawCard();
					computerDrawCard();
				} else {
					// Don't have any legal card to play, then draw a card from stock pile
					if(!game.checkEndGame()) {
						for(var i = 0; i < 2; i++) {
							var numOfCard = players[currentPlayer].length;
							var randomIndex = Math.floor(Math.random() * numOfCard);
							var cardObject = players[currentPlayer][randomIndex];
							ui.addCardToDiscardPile(cardObject);
							game.addCardToDiscardPile(cardObject);
							game.removePlayerCard(currentPlayer, cardObject.id);
							ui.removeCardFromComputerPlayerTray(currentPlayer);
						}
						for(var i = 0; i < 2; i++) {
							var cardObject = stock.pop();
							if(card.isExcessLandfillCard(cardObject)||card.isIncineratorFailureCard(cardObject)) {
								game.playCardProcessor(cardObject);
							} else {
								players[currentPlayer].push(cardObject);
								ui.removeCardFromStockPile();
								ui.addCardToComputerPlayerTray(currentPlayer);
							}
						}
					}
				
				}
		}
		nextPlayer();
	}
	
	function computerPlayCard(legalCards) {
		// Play a card in the legal card array randomly
		var randomIndex = Math.floor(Math.random() * legalCards.length);
		var cardObject = legalCards[randomIndex];
		if(card.isFunctionalCard(cardObject)) {
		// If this card is a legal play, then remove it and add to discard pile
			game.addCardToDiscardPile(cardObject);
			game.removePlayerCard(currentPlayer, cardObject.id);
			ui.addCardToDiscardPile(cardObject);
		} else {
			game.addCardToDiscardPile(cardObject);
			game.removePlayerCard(currentPlayer, cardObject.id);
		}
		ui.addCardToPlayedCard(cardObject, currentPlayer);
		ui.removeCardFromComputerPlayerTray(currentPlayer);
		game.playCardProcessor(cardObject);
	}
	
	function computerDrawCard() {
		var cardObject = stock.pop();
		if(card.isExcessLandfillCard(cardObject)||card.isIncineratorFailureCard(cardObject)) {
			game.playCardProcessor(cardObject);
		} else {
			players[currentPlayer].push(cardObject);
			ui.removeCardFromStockPile();
			ui.addCardToComputerPlayerTray(currentPlayer);
		}
	}

	return {
		// Initialize the game
		init : function(playerNumber) {
			playerCount = playerNumber;
			playerCrystal = new Array;
			playerCrystal = [0, 0, 0, 0];
			playerLandfill = new Array;
			playerLandfill = [0, 0, 0, 0];
			ui.updateCrystalArea();
			stockpileClickEnabled = false;
			isGameEnd = false;
			ui.bindCardClickListener();
			currentPlayer = 0;
			resetGameBoard();
			resetArrays();
			createCards();
			shuffleCards(card.getMaxCard());
			dealCards();
            resetCrystal();

			// If human player don't have any legal card, then allow him pick card from stockpile
			if(this.getLegalCards(0).length === 0) {
				stockpileClickEnabled = true;
			}
			player1CardsClickEnabled = true;
		},
		getPlayerCrystal : function(player) {
			return playerCrystal[player];
		},
		getPlayerLandfill : function(player) {
			return playerLandfill[player];
		},
                getTotalCrystal : function() {
			return totalCrystal;
		},
		getNextPlayer : function() {
			ui.bindPassClickListener();
			nextPlayer();
		},
		// Get the number of players
		getPlayerCount : function() {
			return playerCount;
		},
		// Get the ID of the current player
		getCurrentPlayer : function() {
			return currentPlayer;
		},
		// Get the stock card array
		getStockCards : function() {
			return stock;
		},
		// Get the player card array
		getPlayerCards : function(playerId) {
			return players[playerId];
		},
		pushCheat: function(cardObject) {
			players[0].push(cardObject);
		},
		// Pick a card from stock pile for human player
		getStockPileCardToHumanPlayer : function() {
			var cardObject = stock.pop();
			players[0].push(cardObject);
			return cardObject;
		},
		// Get the number of cards of player
		getPlayerCardNumber : function(playerId) {
			return players[playerId].length;
		},
		// Get the card object from a player
		getPlayerCard : function(playerId, cardId) {
			var cardArray = players[playerId];
			var arrayLength = cardArray.length;
			for(var i = 0; i < arrayLength; i++) {
				if(cardArray[i].id === cardId) {
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
				if(cardArray[i].id === cardId) {
					return cardArray.splice(i, 1)[0];
				}
			}
			return null;
		},
		addCardToDiscardPile : function(cardObject) {
			discardpile.push(cardObject);
		},
		resetCrystalArea : function() {
			for(var i = 0; i < playerCount; i++) {
				playerCrystal[i] = 0;
				playerLandfill[i] = 0;
			}
			ui.updateCrystalArea();
		},
		// Check whether this card object is a legal play
		isLegalPlay : function(cardObject) {
			if ( card.isFunctionalCard(cardObject) ) {
				return true;
			} else if ( !cardTypeIsExist[cardObject.typeId]) {
				return true;
			} else {
				return false;
			}
		},
		// Get the legal cards array of a player
		getLegalCards : function(playerId) {
			var cardArray = players[playerId];
			var arrayLength = cardArray.length;
			var legalCards = new Array();
			for(var i = 0; i < arrayLength; i++) {
				if(this.isLegalPlay(cardArray[i])) {
					legalCards.push(cardArray[i]);
				}
			}
			return legalCards;
		},
		getMergeCards : function(playerId) {
			var cardArray = players[playerId];
			var arrayLength = cardArray.length;
			var mergeCards = new Array();
			for(var i = 0; i < arrayLength; i++) {
				if(card.isMergeCard(cardArray[i])) {
					legalCards.push(cardArray[i]);
				}
			}
			return mergeCards;
		},
		getPlayer1CardsClickEnabled : function() {
			return player1CardsClickEnabled;
		},
		getStockpileClickEnabled : function() {
			return stockpileClickEnabled;
		},
		setStockpileClickEnabled : function(value) {
			stockpileClickEnabled = value;
		},
		checkNextTurn : function () {
			if ( (ui.getHolderClick() >= 3) || ui.getPass()  || (game.getLegalCards(0)==0) || (game.checkEndGame()) ) {
				for( var i = 0; i < 2; i++) {
					var cardObject = game.getStockPileCardToHumanPlayer();
					// Update the UI
					ui.removeCardFromStockPile();
					if(card.isExcessLandfillCard(cardObject)||card.isIncineratorFailureCard(cardObject)) {
						game.removePlayerCard(0, cardObject.id);
						game.playCardProcessor(cardObject);
					} else {
						ui.addCardToHumanPlayerTray(cardObject);
					}
				}
				ui.unbindPassClickListener();
				ui.resetHolderClick();
				ui.setPassFalse();
				nextPlayer();
			}
		},
		// Do the checking task after the player played a card
		playCardProcessor : function(cardObject) {
			ui.lockNewGame(true);
			if(card.isFunctionalCard(cardObject)) {
				if(card.isConversionCard(cardObject)) {
				// Convert the points of Landfill pollution into Energy Crystals
					if(currentPlayer === 0) {
						playerCrystal[currentPlayer] += playerLandfill[currentPlayer];
						totalCrystal -= playerLandfill[currentPlayer] ;
						playerLandfill[currentPlayer] = 0;
						game.checkNextTurn();
					} else {
						playerCrystal[currentPlayer] += playerLandfill[currentPlayer];
						playerLandfill[currentPlayer] = 0;
					}
				} else if(card.isDishonestTraderCard(cardObject)){
				// Stealing 1 Ennrgy Crystal from your oppenent, increasing 2 ponint of the Landfill
					if(currentPlayer === 0) {

						// If it is a human player, pop a window and let him select a suit
						ui.unbindCardClickListener();
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
								playerCrystal[playerId] -= 1;
								playerLandfill[playerId] += 2;
								playerCrystal[0] += 1;
								ui.bindCardClickListener();
								game.checkNextTurn();
							}
						});
					} else {
						// If it is a computer player, choose a suit (0-3) randomly
						var playerId = Math.floor(Math.random() * 4);
						playerCrystal[playerId] -= 1;
						playerLandfill[playerId] += 2;
						playerCrystal[0] += 1;
					}
				} else if(card.isExcessLandfillCard(cardObject)){
				// Increase two points from the Landfill
					if(currentPlayer === 0) {
						for(i=0; i < playerCount ;i++) {
							playerLandfill[i] += 2;
						}
						game.checkNextTurn();
					} else {
						for(i=0; i < playerCount ;i++) {
							playerLandfill[i] += 2;
						}
					}
				} else if(card.isHighTechnologyCard(cardObject)){
				// As part of any Trash combination
					if(currentPlayer === 0) {
						// If it is a human player, pop a window and let him select a suit
						ui.unbindCardClickListener();
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
					} else {
						// If it is a computer player, choose a suit (0-3) randomly
						var cardId = Math.floor(Math.random() * 24);
						ui.addCardToDiscardPile(cardObject);
						game.addCardToDiscardPile(cardObject);
						cardObject.typeId = cardId;
						ui.addCardToRubblishArea(cardObject);
						cardTypeIsExist[cardObject.typeId] = true;
						game.checkRubblishCollect(currentPlayer);
						ui.bindCardClickListener();
					}
				} else if(card.isIncineratorFailureCard(cardObject)){
				// increase one point from the Landfill
					if (currentPlayer === 0) {
						for(i=0; i < playerCount ;i++) {
							playerLandfill[i] += 1;
						}
						game.checkNextTurn();
					} else {
						for(i=0; i < playerCount ;i++) {
							playerLandfill[i] += 1;
						}
					}
				} else if(card.isIncineratorCard(cardObject)){
				// deduct one point from the Landfill
					if (currentPlayer === 0) {
						playerLandfill[currentPlayer] -= 1;
						game.checkNextTurn();
					} else {
						playerLandfill[currentPlayer] -= 1;
					}
				} else if(card.isJunkRetrievingCard(cardObject)){
				// get a card from your oppenent's hand
					if(currentPlayer === 0) {
						// If it is a human player, pop a window and let him select a suit
						ui.unbindCardClickListener();
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
								ui.removeCardFromComputerPlayerTray(playerId);
								players[0].push(cardObject);
								ui.addCardToHumanPlayerTray(cardObject);
								ui.bindCardClickListener();
								game.checkNextTurn();
							}
						});
					} else {
						// If it is a computer player, choose a suit (0-3) randomly
						var playerId;
						do{
							playerId = Math.floor(Math.random() * 4);
						} while(currentPlayer !== playerId);
						var numOfCard = players[playerId].length;
						var cardId = Math.floor(Math.random() * numOfCard);
						var cardObject = players[playerId][cardId];
						game.removePlayerCard(playerId, cardObject.id);
						ui.removeCardFromComputerPlayerTray(playerId);
						players[currentPlayer].push(cardObject);
						ui.addCardToComputerPlayerTray(currentPlayer);
					}
				} else if(card.isLandfillTransferCard(cardObject)) {
				// Every player transfers their Landfill to next opponent in anti-clockwise
					if (currentPlayer === 0) {
						var temp = playerLandfill[0];
						for(var i = 0; i < (playerCount-1); i++) {
							playerLandfill[i] = playerLandfill[(i+1)];
						}
						playerLandfill[3] = temp;
						game.checkNextTurn();
					} else {
						var temp = playerLandfill[0];
						for(var i = 0; i < (playerCount-1); i++) {
							playerLandfill[i] = playerLandfill[(i+1)];
						}
						playerLandfill[3] = temp;
					}

				} else if (cardObject.typeId===32) {
					game.checkNextTurn();
				}
			} else {
				if(currentPlayer === 0) {
					ui.clearToast();
					cardTypeIsExist[cardObject.typeId] = true;
					ui.addCardToRubblishArea(cardObject);
					game.checkNextTurn();
				} else {
					cardTypeIsExist[cardObject.typeId] = true;
					ui.addCardToRubblishArea(cardObject);
				}
			}
			ui.updateCrystalArea();
		},
		checkRubblishCollect : function(currentPlayer) {
			 if (cardTypeIsExist[0]&&cardTypeIsExist[1]&&cardTypeIsExist[2]) {
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
				totalCrystal--;
			} 
			if (cardTypeIsExist[3]&&cardTypeIsExist[4]&&cardTypeIsExist[5]) {
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
				totalCrystal--;
			}
			if (cardTypeIsExist[6]&&cardTypeIsExist[7]&&cardTypeIsExist[8]) {
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
				totalCrystal--;
			}
			if (cardTypeIsExist[9]&&cardTypeIsExist[10]&&cardTypeIsExist[11]&&cardTypeIsExist[12]&&cardTypeIsExist[13]) {
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
				totalCrystal -= 2;
			}
			if (cardTypeIsExist[14]&&cardTypeIsExist[15]&&cardTypeIsExist[16]&&cardTypeIsExist[17]&&cardTypeIsExist[18]) {
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
				totalCrystal -= 2;
			}
			if (cardTypeIsExist[19]&&cardTypeIsExist[20]&&cardTypeIsExist[21]&&cardTypeIsExist[22]&&cardTypeIsExist[23]) {
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
				totalCrystal -= 2;
			}
		},
		// Check the game is ended. If ended, show the results
		checkEndGame : function() {
			if(totalCrystal <= 0) {
				isGameEnd = true;
				ui.showResult();
				return true;
			} else {
				// The game is not ended
				isGameEnd = false;
				return false;
			}
		},
		// Calculate the score of each player when the game ends
		calculateScore : function() {
			var scoreArray = new Array();

			// Summing up all the players' scores
			for(var i = 0; i < playerCount; i++) {
				scoreArray[i] = playerCrystal[i] - playerLandfill[i];
			}

			// Finding the winner (player with minium score)
			var highest = scoreArray[0];
			var winner = new Array();
			winner[0] = 0;
			for(var i = 1; i < playerCount; i++) {
				if(scoreArray[i] > highest) {
					highest = scoreArray[i];
					winner[0] = i;
				}
			}

			var result = new Object();
			result.scores = scoreArray;
			result.winner = winner;
			return result;
		}
	};
})();