/* CC3206 Programming Project
Lecture Class: 203
Lecturer: Dr Simon WONG
Group Member: CHAN You Zhi Eugene (11036677A)
Group Member: FONG Chi Fai (11058147A)
Group Member: SO Chun Kit (11048455A)
Group Member: SO Tik Hang (111030753A)
Group Member: WONG Ka Wai (11038591A)
Group Member: YEUNG Chi Shing (11062622A) */

// User Interface
var ui = (function() {
	// Point to current table
	var currentTable;
	// Number of player
	var playerCount;
	// Player position in array
	var playerPosition;
	// Map the <div>/<ul> player IDs to the player IDs in JS
	var playerMap = new Array();
	playerMap[1] = [1];
	playerMap[2] = [1, 2];
	playerMap[3] = [1, 2, 3];
	playerMap[4] = [1, 2, 3, 4];
	playerMap[5] = [1, 2, 3, 4, 5];
	playerMap[6] = [1, 2, 3, 4, 5, 6];
	// Count number of card clicked
	var holderClickCounter = 0;
	// End turn button
	var pass = false;
	// Music control of the game
	var playBGM = document.createElement('audio');
	playBGM.src = 'music/bgm.mp3';
	playBGM.loop = true;
	playBGM.controls = true;
	var mutedMusic = false;

	// Add play cards to all the stacks to the UI
	function initGameBoard() {
		playerCount = game.getPlayerCount();
		currentTable = game.getCurrentTable();
		playerPosition = game.getPlayerPosition();
		// Hidden gameboard item and then fade in
		$('.rubblish').hide();
		$('.rubblishBin').hide();		
		for(var i = 1; i < playerCount; i++) {
			$('#player'+ (i+1) +'-holder').hide();
			$('#player'+ (i+1) +'-cardNumber').hide();
			$('#player'+ (i+1) +'-CrystalArea').hide();
		}
		$('#player1-holder').hide();
		$('#player1-CrystalArea').hide();
		$('#Pass').hide();
		$('.rubblishBin').fadeIn(1200);
		
		// Empty card holder
		clearCardHolders();
		
		var map = playerMap[playerCount];
		
		// Add cards to stock
		addCardToStockPile();

		// Add cards for player
		var cardArray = game.getPlayerCards(playerPosition);
		var cardNumber = cardArray.length;
		for(var i = 0; i < cardNumber; i++) {
			ui.addCardToPlayerTray(cardArray[i]);
		}

		// Add cards for other players
		var pointer = parseInt(playerPosition) + 1;
		for(var i = 1; i < playerCount; i++) {
			if (pointer == parseInt(playerCount)) {
				pointer = 0;
			}
			ui.initCardToOtherPlayerTray(i, game.getPlayerCardNumber(pointer++));
			var holder = document.getElementById('player' + map[i] + '-cardNumber');
			holder.innerHTML="X " + game.getPlayerCardNumber(i);
			var j = i - 1;
			$('#player'+ (i+1) +'-holder').delay(((i*1200)+(j*1200))).fadeIn(1200);
			$('#player'+ (i+1) +'-cardNumber').delay(((i*1200)+(j*1200))).fadeIn(1200);
			$('#player'+ (i+1) +'-CrystalArea').delay((((i*1200)+1200)+(j*1200))).fadeIn(1200);
		}
		
		$('#player1-holder').fadeIn(1200);
		$('#player1-CrystalArea').delay(1200).fadeIn(1200);
		$('#Pass').delay(1200).fadeIn(1200);
		if (game.getPlayerCardsClickEnabled())
			ui.showToast('This is your trun. Please play card(s).');
		else {
			for (i = 0; i < playerCount; i++) {
				if (game.getPlayerEnable(i) == 1)
					ui.showToast('This is ' + game.getPlayerName(i) + ' trun. Please wait.');
			}
		}
		$('#toast').hide();
		$('#toast').delay(6400).fadeIn('fast');	
	}
	
	// Empty all the <ul> tags for holding the cards when a new game starts
	function clearCardHolders() {
		$('#player1-holder, #player2-holder, #player3-holder, #player4-holder, #player5-holder, #player6-holder').empty();
		$('#stockpile-holder, #discardpile-holder').empty();
	}
	
	// Add cards to the stockpile when the game starts
	function addCardToStockPile() {
		var cardArray = game.getStockCards();
		var cardNumber = cardArray.length;
		var holder = document.getElementById('stockpile-holder');
		for(var i = 0; i < cardNumber; i++) {
			var node = document.createElement('li');
			node.setAttribute('id', 'card-' + cardArray[i].id);
			node.setAttribute('class', 'card-back card');
			node.setAttribute('style', uiUtil.getRandomRotateStyle() + uiUtil.getRandomCoordStyle());
			node.innerHTML = '&nbsp;';
			holder.appendChild(node);
		}
	}
	
	return {
		init : function() {
			game.init();
			playBGM.play();
			initGameBoard();
			ui.updateCrystalArea();
			ui.bindCardClickListener();
			
			// Bind the event listeners and handlers for the buttons in the control
			$('#home, #profile, #chatroom, #game-rules, #about, #credit, #music, #logout').bind('click', function(event) {
				var id = event.target.id;
				if(id === 'home') {
					// Ask player confirm to back home page
					var homeConfirm = confirm("Back to home page?");
					if (homeConfirm) {
						document.myform.submit();
					}
				} else if(id === 'profile') {
					server.get_profile();
					ui.showPopup('profile');
					var popup = $('#popup-background, #profile-close');
					popup.click(function() {
						ui.hidePopup('profile');
						popup.unbind('click');
					});
					$('body').keyup(function(event) {
						// Esc key
						if(event.keyCode === 27) {
							ui.hidePopup('profile');
							$('body').unbind('keyup');
						}
					});
				} else if(id === 'chatroom') {
					document.myform3.submit();
				} else if(id === 'game-rules') {
					ui.showPopup('rule');
					var popup = $('#popup-background, #rule-close');
					popup.click(function() {
						ui.hidePopup('rule');
						popup.unbind('click');
					});
					$('body').keyup(function(event) {
						// Esc key
						if(event.keyCode === 27) {
							ui.hidePopup('rule');
							$('body').unbind('keyup');
						}
					});
				} else if(id === 'about') {
					ui.showPopup('about');
					var popup = $('#popup-background, #about-close');
					popup.click(function() {
						ui.hidePopup('about');
						popup.unbind('click');
					});
					$('body').keyup(function(event) {
						// Esc key
						if(event.keyCode === 27) {
							ui.hidePopup('about');
							$('body').unbind('keyup');
						}
					});
				} else if(id === 'credit') {
					ui.showPopup('credit');
					var popup = $('#popup-background, #credit-close');
					popup.click(function() {
						ui.hidePopup('credit');
						popup.unbind('click');
					});
					$('body').keyup(function(event) {
						// Esc key
						if(event.keyCode === 27) {
							ui.hidePopup('credit');
							$('body').unbind('keyup');
						}
					});
				} else if(id === 'music') {
					if(mutedMusic){
						playBGM.muted = false;
						mutedMusic = false;
						$('#music').html('Music On');
					} else {
						playBGM.muted = true;
						mutedMusic = true;
						$('#music').html('Music Off');
					}
				} else if(id === 'logout') {
					// Ask player confirm to logout
					var logoutConfirm = confirm("Logout?");
					if (logoutConfirm) {
						location.href="index.html";
					}
				}
			});
		},
		// Bind the event listeners for #stockpile-holder and #player1-holder at every new game
		bindCardClickListener : function() {
			// Bind the event listeners and handlers for the stockpile
			$('#stockpile-holder').bind('click', function(event) {
				var target = event.target;
				if(target.nodeName.toLowerCase() === 'li') {
					if(game.getPlayerCardsClickEnabled() && game.getStockpileClickEnabled()) {
						var cardArray = game.getPlayerCards(playerPosition);
						var cardNumber = cardArray.length;
						for(var i = 0; i < cardNumber; i++) {
							ui.addCardToWindowsTray(cardArray[i]);
						}
						ui.unbindCardClickListener();
						ui.clearToast();
						var windows = $('#card-windows');
						var background = $('#popup-background');
						windows.fadeIn('fast');
						background.fadeIn('fast');
						windows.bind('click', function(event) {
							var target = event.target;
							var Iid;
							if(target.nodeName.toLowerCase() === 'li') {
								// Get the card objcet behind that the user clicked
								var cardId = parseInt(target.id.split('-', 2)[1]);
								var cardObject = game.getPlayerCard(playerPosition, cardId);
								game.removePlayerCard(playerPosition, cardId);
								Iid = target.id;
								ui.addCardToDiscardPile(cardObject);
								game.addCardToDiscardPile(cardObject);
								windows.unbind('click');
								windows.fadeOut();
								background.fadeOut();
							}
							document.getElementById('player1-holder').removeChild(document.getElementById(Iid));
							$('card-holder').empty();
						});
						for( var i = 0; i < 2; i++) {
							// Get the card
							var cardObject = game.getStockPileCardToPlayer();
							// Update the UI
							ui.removeCardFromStockPile();
							ui.addCardToPlayerTray(cardObject);
						}
						ui.bindCardClickListener();
					} else if (!game.getPlayerCardsClickEnabled()) {
						for (i = 0; i < playerCount; i++) {
							if (game.getPlayerEnable(i) == 1)
								ui.showToast('This is ' + game.getPlayerName(i) + ' trun. Please wait.');
						}
					} else {
						ui.showToast("You still have card to play.");
					}
				}
			});
			// Bind the event listeners and handlers for the cards of player
			$('#player1-holder').bind('mouseover mouseout', function(event) {
				var target = event.target;
				if(target.nodeName.toLowerCase() === 'li') {
					var cardId = parseInt(target.id.split('-', 2)[1]);
					var cardObject = game.getPlayerCard(playerPosition, cardId);
					ui.showToast(card.getCardDescription(cardObject));
					$('#context-windows').fadeIn('fast');
					document.getElementById('card-context').innerHTML = card.getCardContent(cardObject);
				}
			});
			$('#player1-holder').bind('click', function(event) {
				var target = event.target;
				if(target.nodeName.toLowerCase() === 'li') {
					// If player clicks a card
					if(game.getPlayerCardsClickEnabled()) {
						// If it is player's turn
						// Get the card objcet behind that the user clicked
						var cardId = parseInt(target.id.split('-', 2)[1]);
						var cardObject = game.getPlayerCard(playerPosition, cardId);
						if(game.isLegalPlay(cardObject)) {
							ui.unbindCardClickListener();
							ui.clearToast();
							var holder = document.getElementById('player1-holder');
							if(card.isFunctionalCard(cardObject)) {
								// If this card is a legal play, then remove it and add to discard pile
								game.removePlayerCard(playerPosition, cardId);
								ui.addCardToDiscardPile(cardObject);
								game.addCardToDiscardPile(cardObject);
								// Update the UI
								holder.removeChild(document.getElementById(target.id));
							} else {
								game.removePlayerCard(playerPosition, cardId);
								// Update the UI
								holder.removeChild(document.getElementById(target.id));
							}
							// set the width so that the cards can align center
							holder.style.width = 720 + 'px';
							ui.incrementHolderClick();
							game.playCardProcessor(cardObject);
							ui.bindCardClickListener();
						} else {
							ui.showToast("Card already existed in gameboard. Please choose another card to play.");
						}
					} else {
						for (i = 0; i < playerCount; i++) {
							if (game.getPlayerEnable(i) == 1)
								ui.showToast('This is ' + game.getPlayerName(i) + ' trun. Please wait.');
						}
					}
				}
			});
			$('#Pass').bind('click', function(event) {
				if (game.getPlayerCardsClickEnabled() && ui.getHolderClick() >= 1) {
					ui.showToast('Moving to next player.');
					pass = true;
					game.checkNextTurn();
				}
				else if (!game.getPlayerCardsClickEnabled()) {
					for (i = 0; i < playerCount; i++) {
						if (game.getPlayerEnable(i) == 1)
							ui.showToast('This is ' + game.getPlayerName(i) + ' trun. Please wait.');
					}
				}
				else if (ui.getHolderClick() < 1) {
					ui.showToast('Please play at least one card.');
				}
			});
		},
		// Unbind the event listeners for #stockpile-holder and #player1-holder at every new game
		unbindCardClickListener : function() {
			$('#player1-holder').unbind('click');
			$('#stockpile-holder').unbind('click');
			$('#Pass').unbind('click');
		},
		bindCheatClickListener : function() {
			$('#Cheat').bind('click', function(event) {
				for (var i = 0; i < playerCount; i++) {
					if (game.getPlayerEnable(i) == 1 && i == playerPosition) {
						var cardObject = new Object();
						cardObject.id = 999;
						cardObject.typeId = 32;
						game.pushCheat(cardObject);
						ui.addCardToPlayerTray(cardObject);
						$('#Cheat').unbind;
						$('#Cheat').hide();
					}
				}
			});
		},
		addCardToWindowsTray : function(cardObject) {
			var holder = document.getElementById('card-holder');
			var node = document.createElement('li');
			node.id = 'card-' + cardObject.id;
			node.title = card.getTypeChar(cardObject.typeId);
			node.className = 'card-hoverable card';
			node.setAttribute('style', uiUtil.getCardBackgroundShiftStyle(cardObject));
			node.innerHTML = card.getTypeChar(cardObject.typeId);
			holder.appendChild(node);
		},
		// Append a card to player
		addCardToPlayerTray : function(cardObject) {
			var holder = document.getElementById('player1-holder');
			var node = document.createElement('li');
			node.id = 'card-' + cardObject.id;
			node.title = card.getTypeChar(cardObject.typeId);
			node.className = 'card-hoverable card';
			node.setAttribute('style', uiUtil.getCardBackgroundShiftStyle(cardObject));
			node.innerHTML = card.getTypeChar(cardObject.typeId);
			holder.appendChild(node);
			holder.style.width = 720 + 'px';
		},
		// Append card to other player
		initCardToOtherPlayerTray : function(playerId, cardNumber) {
			var map = playerMap[playerCount];
			var holder = document.getElementById('player' + map[playerId] + '-holder');
			for(var i = 0; i < cardNumber; i++) {
				var node = document.createElement('li');
				node.className = 'card-back-upside-down card';
				node.innerHTML = '&nbsp;';
				holder.appendChild(node);
			}
		},
		// Append a card to player
		addCardToOtherPlayerTray : function(playerId) {
			var currentPlayerPosition = playerPosition - 1;
			if (playerId > currentPlayerPosition)
				currentPlayerPosition = playerId - currentPlayerPosition;
			else
				currentPlayerPosition = playerId - currentPlayerPosition + parseInt(playerCount);
			var holder = document.getElementById('player' + currentPlayerPosition + '-cardNumber');
			$('#player' + currentPlayerPosition + '-cardNumber').slideUp('fast', function(){holder.innerHTML="X " + game.getPlayerCardNumber(playerId);})
			.slideDown('fast');
		},
		// Remove a card from player
		removeCardFromOtherPlayerTray : function(playerId) {
			var currentPlayerPosition = playerPosition - 1;
			if (playerId > currentPlayerPosition)
				currentPlayerPosition = playerId - currentPlayerPosition;
			else
				currentPlayerPosition = playerId - currentPlayerPosition + parseInt(playerCount);
			var holder = document.getElementById('player' + currentPlayerPosition + '-cardNumber');
			holder.innerHTML="X " + game.getPlayerCardNumber(playerId);
		},
		// Add a card to discard pile
		addCardToDiscardPile : function(cardObject) {
			var node = document.createElement('li');
			node.id = 'card-' + cardObject.id;
			node.title = card.getTypeChar(cardObject.typeId);
			node.className = 'card';
			node.setAttribute('style', uiUtil.getRandomRotateStyle() + uiUtil.getRandomCoordStyle() + uiUtil.getCardBackgroundShiftStyle(cardObject));
			node.innerHTML = card.getTypeChar(cardObject.typeId);
			document.getElementById('discardpile-holder').appendChild(node);
		},
		// Remove a card from stock pile
		removeCardFromStockPile : function() {
			var node = document.getElementById('stockpile-holder');
			node.removeChild(node.lastChild);
		},
		incrementHolderClick : function() {
			holderClickCounter++;
		},
		getHolderClick : function() {
			return holderClickCounter;
		},
		resetHolderClick : function() {
			holderClickCounter = 0;
		},
		getPass : function() {
			return pass;
		},
		setPassFalse : function() {
			pass = false;
		},
		addCardToPlayedCard : function(cardObject) {
			$('#player'+ 1 +'-playedCardHolder').empty();
			var holder = document.getElementById('player' + 1 + '-playedCardHolder');
			var node = document.createElement('li');
			node.id = 'card-' + cardObject.id;
			node.title = card.getTypeChar(cardObject.typeId);
			node.className = 'card-hoverable card';
			node.setAttribute('style', uiUtil.getCardBackgroundShiftStyle(cardObject));
			node.innerHTML = card.getTypeChar(cardObject.typeId);
			holder.appendChild(node);
		},
		addCardToPlayedCard2 : function(cardObject, currentPlayer) {
			$('#player'+ currentPlayer +'-playedCardHolder').empty();
			var holder = document.getElementById('player' + currentPlayer + '-playedCardHolder');
			var node = document.createElement('li');
			node.id = 'card-' + cardObject.id;
			node.title = card.getTypeChar(cardObject.typeId);
			node.className = 'card-hoverable card';
			node.setAttribute('style', uiUtil.getCardBackgroundShiftStyle(cardObject));
			node.innerHTML = card.getTypeChar(cardObject.typeId);
			holder.appendChild(node);
		},
		addCardToFunctionalArea : function(cardObject) {
			var currentPlayer;
			if (parseInt(playerPosition) + 1 == parseInt(playerCount))
				currentPlayer = 1;
			else
				currentPlayer = parseInt(playerPosition) + 1;
			var theCard = $('#player' + currentPlayer + '-playedCard');
			ui.addCardToPlayedCard(cardObject);
			if (currentPlayer == 1 ) {
				game.checkRubblishCollect(currentPlayer);
			} else {
				theCard.fadeIn('slow')
				.fadeOut('slow', function(){game.checkRubblishCollect(currentPlayer);});
			}
		},
		addCardToRubblishArea : function(cardObject) {
			var currentPlayer;
			for (var i = 0; i < playerCount; i++) {
				if (game.getPlayerEnable(i) == 1) {
					var currentPlayer = i;
					break;
				}
			}
			var theCard = $('#player' + 1 + '-playedCard');
			ui.addCardToPlayedCard(cardObject);
			switch(cardObject.typeId) {
			case 0:
			var rubblish = $('#battery-1');
			break;
			case 1:
			var rubblish = $('#battery-2');
			break;
			case 2:
			var rubblish = $('#battery-3');
			break;
			case 3:
			var rubblish = $('#oldStuff-1');
			break;
			case 4:
			var rubblish = $('#oldStuff-2');
			break;
			case 5:
			var rubblish = $('#oldStuff-3');
			break;
			case 6:
			var rubblish = $('#surplus-1');
			break;
			case 7:
			var rubblish = $('#surplus-2');
			break;
			case 8:
			var rubblish = $('#surplus-3');
			break;
			case 9:
			var rubblish = $('#metal-1');
			break;
			case 10:
			var rubblish = $('#metal-2');
			break;
			case 11:
			var rubblish = $('#metal-3');
			break;
			case 12:
			var rubblish = $('#metal-4');
			break;
			case 13:
			var rubblish = $('#metal-5');
			break;
			case 14:
			var rubblish = $('#paper-1');
			break;
			case 15:
			var rubblish = $('#paper-2');
			break;
			case 16:
			var rubblish = $('#paper-3');
			break;
			case 17:
			var rubblish = $('#paper-4');
			break;
			case 18:
			var rubblish = $('#paper-5');
			break;
			case 19:
			var rubblish = $('#plastics-1');
			break;
			case 20:
			var rubblish = $('#plastics-2');
			break;
			case 21:
			var rubblish = $('#plastics-3');
			break;
			case 22:
			var rubblish = $('#plastics-4');
			break;
			case 23:
			var rubblish = $('#plastics-5');
			break;
			}
			rubblish.fadeIn('fast', function(){game.checkRubblishCollect(playerPosition);});
			theCard.fadeIn(1000).fadeOut(1000, function(){rubblish.fadeIn('fast', function(){game.checkRubblishCollect(currentPlayer);});});
		},
		addCardToRubblishArea2 : function(cardObject) {
			var currentPlayer;
			for (var i = 0; i < playerCount; i++) {
				if (game.getPlayerEnable(i) == 1) {
					var currentPlayer = i;
					break;
				}
			}
			var currentPlayerPosition = playerPosition - 1;
			if (currentPlayer > currentPlayerPosition)
				currentPlayerPosition = currentPlayer - currentPlayerPosition;
			else
				currentPlayerPosition = currentPlayer - currentPlayerPosition + parseInt(playerCount);
			var theCard = $('#player' + currentPlayerPosition + '-playedCard');
			ui.addCardToPlayedCard2(cardObject, currentPlayerPosition);
			switch(cardObject.typeId) {
			case 0:
			var rubblish = $('#battery-1');
			break;
			case 1:
			var rubblish = $('#battery-2');
			break;
			case 2:
			var rubblish = $('#battery-3');
			break;
			case 3:
			var rubblish = $('#oldStuff-1');
			break;
			case 4:
			var rubblish = $('#oldStuff-2');
			break;
			case 5:
			var rubblish = $('#oldStuff-3');
			break;
			case 6:
			var rubblish = $('#surplus-1');
			break;
			case 7:
			var rubblish = $('#surplus-2');
			break;
			case 8:
			var rubblish = $('#surplus-3');
			break;
			case 9:
			var rubblish = $('#metal-1');
			break;
			case 10:
			var rubblish = $('#metal-2');
			break;
			case 11:
			var rubblish = $('#metal-3');
			break;
			case 12:
			var rubblish = $('#metal-4');
			break;
			case 13:
			var rubblish = $('#metal-5');
			break;
			case 14:
			var rubblish = $('#paper-1');
			break;
			case 15:
			var rubblish = $('#paper-2');
			break;
			case 16:
			var rubblish = $('#paper-3');
			break;
			case 17:
			var rubblish = $('#paper-4');
			break;
			case 18:
			var rubblish = $('#paper-5');
			break;
			case 19:
			var rubblish = $('#plastics-1');
			break;
			case 20:
			var rubblish = $('#plastics-2');
			break;
			case 21:
			var rubblish = $('#plastics-3');
			break;
			case 22:
			var rubblish = $('#plastics-4');
			break;
			case 23:
			var rubblish = $('#plastics-5');
			break;
			}
			rubblish.fadeIn('fast', function(){game.checkRubblishCollect(currentPlayer);});
			theCard.fadeIn(1000).fadeOut(1000, function(){rubblish.fadeIn('fast', function(){game.checkRubblishCollect(currentPlayer);});});
		},
		// Update crystal information
		updateCrystalArea : function () {
			var crystalNum;
			var landfillNum;
			pointer = parseInt(playerPosition);
			for (var i = 0; i < playerCount; i++) {
				if (pointer == parseInt(playerCount)) {
					pointer = 0;
				}
				crystalNum = game.getPlayerCrystal(pointer);
				landfillNum = game.getPlayerLandfill(pointer++);
				document.getElementById('player' + (i+1) + '-CrystalNum').innerHTML="x " + crystalNum;
				document.getElementById('player' + (i+1) + '-LandfillNum').innerHTML="x " + landfillNum;
			}
		},
		// Show the game result window
		showResult : function() {
			ui.showToast('Game ended. Press Home to back to main page.');

			// Unbind the card event listeners
			ui.unbindCardClickListener();

			// Remove the card hover effect
			$('#player1-holder li').each(function() {
				$(this).removeClass('card-hoverable');
			});

			// Get the game results
			var results = game.calculateScore();

			// Output the winner
			var bodyText = $('#result-body');
			bodyText.empty();
			var winnerNumber = results.winner.length;
			if (winnerNumber === 1) {
				// Only one winner
				bodyText.append($('<p>').text('The winner is ' + (game.getPlayerName(results.winner[0])) + '.'));
			} else {
				// More than one winners
				var winnerMsg = 'The winners are ';
				for(var i = 0; i < winnerNumber; i++) {
					if (i !== (winnerNumber - 1) && i !== (winnerNumber - 2)) {
						winnerMsg += (game.getPlayerName(results.winner[i])) + ', ';
					}
					else if (i === (winnerNumber - 2)) {
						winnerMsg += (game.getPlayerName(results.winner[i])) + ' and ';
					}
					else {
						winnerMsg += (game.getPlayerName(results.winner[i])) + '.';
					}
				}
				bodyText.append($('<p>').text(winnerMsg));
			}
			
			// Output a table listing number of crystals, landfill level and scores that player got
			var tableNode = $('<table>');
			tableNode.append($('<tr>').append($('<th>').text('Players'), $('<th>').text('Number of Crystals / Landfill level'), $('<th>').text('Scores')));
			for (var i = 0; i < playerCount; i++) {
				tableNode.append($('<tr>').append($('<td>').addClass('player').text(results.player[i]), $('<td>').addClass('player').text(results.crystal[i] + " / " + results.landfill[i]), $('<td>').addClass('player').text(results.scores[i])));
			}
			bodyText.append(tableNode);
			
			// Set winners name
			var winnerName = new Array();
			for (var i = 0; i < winnerNumber; i++) {
				winnerName[i] = game.getPlayerName(results.winner[i]);
			}
			
			// Update player win and lose record
			server.setWinLose(currentTable, winnerName, results.player);
			server.releaseTable(currentTable);

			// Show the popup
			ui.showPopup('result');
			var popup = $('#result-close');
			popup.click(function() {
				// Ask player confirm to close result windows or not
				var closeConfirm = confirm("If you close this windows, you cannot read the result again. Are you sure?");
				if (!closeConfirm) {
					return;
				}
				ui.hidePopup('result');
				popup.unbind('click');
				bodyText.empty();
				var node = document.getElementById("home");
				node.disabled = false;
				node = document.getElementById("logout");
				node.disabled = false;
			});
			$('body').keyup(function(event) {
				// Esc key
				if(event.keyCode === 27) {
					ui.hidePopup('result');
					$('body').unbind('keyup');
					bodyText.empty();
					var node = document.getElementById("home");
					node.disabled = false;
					node = document.getElementById("logout");
					node.disabled = false;
				}
			});
		},
		// Show the popup window
		showPopup : function(name) {
			var background = $('#popup-background');
			background.fadeIn('slow');
			$('#' + name + '-window').fadeIn('slow');

		},
		// Hide the popup window
		hidePopup : function(name) {
			$('#popup-background').fadeOut('slow');
			$('#' + name + '-window').fadeOut('slow');
		},
		// Show the toast message
		showToast : function(message) {
			var toast = $('#toast');
			toast.html(message);
			toast.hide().fadeIn('fast');
		},
		// Clear the toast message and hide the bar
		clearToast : function() {
			$('#toast').clearQueue().fadeOut('fast').html('&nbsp;');
		}
	};
})();

// UI Utilities
var uiUtil = (function() {
	return {
		// Return the style string for random rotation for cards in stockpile and discard pile
		getRandomRotateStyle : function() {
			var rotateAngle = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 20);
			return '-moz-transform: rotate(' + rotateAngle + 'deg); -webkit-transform: rotate(' + rotateAngle + 'deg); -o-transform: rotate(' + rotateAngle + 'deg); -ms-transform: rotate(' + rotateAngle + 'deg); transform: rotate(' + rotateAngle + 'deg);';
		},
		// Return the style string for random position for cards in stockpile and discard pile
		getRandomCoordStyle : function() {
			return 'top: ' + ((Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5) + card.getCentralZoneYOffset()) + 'px; left: ' + ((Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5) + card.getCentralZoneXOffset()) + 'px;';
		},
		// Return the style string for background shift of cards
		getCardBackgroundShiftStyle : function(cardObject) {
			var shiftX = -1 * card.getWidth() * cardObject.typeId;
			return 'background-position: ' + shiftX + 'px ';
		},
		// Return the width/height of the card holder based on the number of cards the player have
		getCardHolderWidth : function(playerId) {
			return (game.getPlayerCardNumber(playerId) - 1) * card.getShiftValue() + card.getWidth();
		}
	};
})();