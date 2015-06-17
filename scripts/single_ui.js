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
	// Map the <div>/<ul> player IDs to the player IDs in JS
	var playerMap = new Array();
	playerMap[4] = [1, 2, 3, 4];
	var stockClickCounter = 0;
	var holderClickCounter = 0;
	var pass = false;
	// Music control of the game
	var playBGM = document.createElement('audio');
	playBGM.src = 'music/bgm.mp3';
	playBGM.loop = true;
	playBGM.controls = true;
	var mutedMusic = false;

	// Add play cards to all the stacks to the UI
	function initGameBoard() {
		var totalPlayer = game.getPlayerCount();
		$('.rubblish').hide();
		$('.rubblishBin').hide();		
		for(var i = 1; i < totalPlayer; i++) {
			$('#player'+ (i+1) +'-holder').hide();
			$('#player'+ (i+1) +'-cardNumber').hide();
			$('#player'+ (i+1) +'-CrystalArea').hide();
		}
		$('#player1-holder').hide();
		$('#player1-CrystalArea').hide();
		$('#Pass').hide();
		$('.rubblishBin').fadeIn(800);
		
		ui.lockNewGame(true);
		clearCardHolders();
		
		var map = playerMap[totalPlayer];

		// Set the player title on the game board
		var counter = 0;
		for(var i = 0; i < 4; i++) {
			var title = $('#player' + (i + 1) + '-title');
			if(i <= totalPlayer) {
				if(map[counter] === (i + 1)) {
					title.html('Player ' + (counter + 1));
					counter++;
				} else {
					title.html('');
				}
			} else {
				title.html('');
			}
		}

		addCardToStockPile();

		// Add cards for human player
		var cardArray = game.getPlayerCards(0);
		var cardNumber = cardArray.length;
		for(var i = 0; i < cardNumber; i++) {
			ui.addCardToHumanPlayerTray(cardArray[i]);
		}

		// Add 4 cards for computer players
		for(var i = 1; i < totalPlayer; i++) {
			ui.initCardToComputerPlayerTray(i, 4);
			var holder = document.getElementById('player' + map[i] + '-cardNumber');
			holder.innerHTML="X " + game.getPlayerCardNumber(i);
			var j = i - 1;
			$('#player'+ (i+1) +'-holder').delay(((i*800)+(j*800))).fadeIn(800);
			$('#player'+ (i+1) +'-cardNumber').delay(((i*800)+(j*800))).fadeIn(800);
			$('#player'+ (i+1) +'-CrystalArea').delay((((i*800)+800)+(j*800))).fadeIn(800);
		}

		ui.lockNewGame(false);
		$('#player1-holder').delay(5600).fadeIn(800);
		$('#player1-CrystalArea').delay(5600).fadeIn(800);
		$('#Pass').delay(5600).fadeIn(800);
		ui.showToast('Hello! It&rsquo;s your turn now. Please play a card.');
		$('#toast').hide();
		$('#toast').delay(6400).fadeIn('fast');
		
	}

	// Empty all the <ul> tags for holding the cards when a new game starts
	function clearCardHolders() {
		$('#player1-holder, #player2-holder, #player3-holder, #player4-holder').empty();
		$('#stockpile-holder, #discardpile-holder').empty();
	}

	// Add cards to the stock pile when the game starts
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
			// Bind the event listeners and handlers for the buttons in the control
			$('#home, #new-game, #profile, #chatroom, #game-rules, #about, #credit, #music, #logout').bind('click', function(event) {
				var id = event.target.id;
				if (id === 'new-game') {
					var selector = $('#player-selector');
					// Ask player confirm to start a new game
					var newConfirm = confirm("Do you want to start new game with number of players " + parseInt(selector.val()) + "?");
					if (!newConfirm) {
						return;
					}
					game.init(parseInt(selector.val()));
					playBGM.play();
					initGameBoard();
				} else if(id === 'home') {
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
		getPass : function() {
			return pass;
		},
		setPassFalse : function() {
			pass = false;
		},
		incrementStockClick : function() {
			stockClickCounter++;
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
		// Bind the event listeners for #stockpile-holder and #player1-holder at every new game
		bindCardClickListener : function() {
			// Bind the event listeners and handlers for the stockpile
			$('#stockpile-holder').bind('click', function(event) {
				var target = event.target;
				if(target.nodeName.toLowerCase() === 'li') {
					if(game.getStockpileClickEnabled()) {
						var cardArray = game.getPlayerCards(0);
						var cardNumber = cardArray.length;
							for(var j = 0; j < cardNumber; j++) {
								ui.addCardToWindowsTray(cardArray[j]);
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
									var cardObject = game.getPlayerCard(0, cardId);
									game.removePlayerCard(0, cardId);
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
						ui.bindCardClickListener();
					} else if(game.getCurrentPlayer() !== 0) {
						ui.showToast("It&rsquo;s not your turn now!");
					} else {
						ui.showToast("You still have card to play.");
					}
				}
			});
			// Bind the event listeners and handlers for the cards of human player
			$('#player1-holder').bind('mouseover mouseout', function(event) {
				var target = event.target;
				if(target.nodeName.toLowerCase() === 'li') {
					var cardId = parseInt(target.id.split('-', 2)[1]);
					var cardObject = game.getPlayerCard(0, cardId);
					ui.showToast(card.getCardDescription(cardObject));
					$('#context-windows').fadeIn('fast');
					document.getElementById('card-context').innerHTML = card.getCardContent(cardObject);
				}
			});
			$('#player1-holder').bind('click', function(event) {
				var target = event.target;
					if(target.nodeName.toLowerCase() === 'li') {
						// If player clicks a card
						if(game.getCurrentPlayer() === 0 && game.getPlayer1CardsClickEnabled()) {
							// If it is human player's turn
							// Get the card objcet behind that the user clicked
							var cardId = parseInt(target.id.split('-', 2)[1]);
							var cardObject = game.getPlayerCard(0, cardId);
							if(game.isLegalPlay(cardObject)) {
								ui.incrementHolderClick();
								var holder = document.getElementById('player1-holder');
								if(card.isFunctionalCard(cardObject)) {
									// If this card is a legal play, then remove it and add to discard pile
									game.addCardToDiscardPile(cardObject);
									game.removePlayerCard(0, cardId);
									ui.addCardToDiscardPile(cardObject);
									// Update the UI
									holder.removeChild(document.getElementById(target.id));
								} else {
									game.addCardToDiscardPile(cardObject);
									game.removePlayerCard(0, cardId);
									// Update the UI
									holder.removeChild(document.getElementById(target.id));
								}
								// set the width so that the cards can align center
								holder.style.width = 720 + 'px';
								ui.bindPassClickListener();
								game.playCardProcessor(cardObject);
							} else {
								ui.showToast("It&rsquo;s not a legal play!");
							}
						} else {
							ui.showToast("It&rsquo;s not your turn now!");
						}
					}
			});
		},	
		// Unbind the event listeners for #stockpile-holder and #player1-holder at every new game
		unbindCardClickListener : function() {
			$('#player1-holder').unbind('click');
			$('#stockpile-holder').unbind('click');
		},
		bindPassClickListener : function() {
			$('#Pass').bind('click', function(event) {
				if ((ui.getHolderClick() >= 1)) {
					pass = true;
					var cardObject = new Object();
					cardObject.typeId = 32;
					game.playCardProcessor(cardObject);
				}
			});
		},
		unbindPassClickListener : function() {
			$('#Pass').unbind('click');
		},
		
		// Lock the new game button and the player number selector when the computer players are playing
		lockNewGame : function(isLocked) {
			var playerSelector = $('#player-selector');
			var newGameBtn = $('#start-game');
			if(isLocked) {
				playerSelector.attr('disabled', 'disabled');
				newGameBtn.attr('disabled', 'disabled');
			} else {
				if(playerSelector.attr('disabled')) {
					playerSelector.removeAttr('disabled');
					newGameBtn.removeAttr('disabled');
				}
			}
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
		// Append a card to computer player
		initCardToComputerPlayerTray : function(playerId, cardNumber) {
			var totalPlayer = game.getPlayerCount();
			var map = playerMap[4];

			var holder = document.getElementById('player' + map[playerId] + '-holder');
			for(var i = 0; i < cardNumber; i++) {
				var node = document.createElement('li');
				node.className = 'card-back-upside-down card';
				node.innerHTML = '&nbsp;';
				holder.appendChild(node);
			}
		},
		// Append a card to computer player
		addCardToComputerPlayerTray : function(playerId) {
			var map = playerMap[game.getPlayerCount()];
			var holder = document.getElementById('player' + map[playerId] + '-cardNumber');
			$('#player' + map[playerId] + '-cardNumber').slideUp('fast', function(){holder.innerHTML="X " + game.getPlayerCardNumber(playerId);})
			.slideDown('fast');
		},
		// Remove a card from computer player
		removeCardFromComputerPlayerTray : function(playerId) {
			var map = playerMap[game.getPlayerCount()];
			var holder = document.getElementById('player' + map[playerId] + '-cardNumber');
			holder.innerHTML="X " + game.getPlayerCardNumber(playerId);
		},
		// Append a card to human player
		addCardToHumanPlayerTray : function(cardObject) {
			var holder = document.getElementById('player1-holder');
			var node = document.createElement('li');
			node.id = 'card-' + cardObject.id;
			node.title = card.getTypeChar(cardObject.typeId);
			node.className = 'card-hoverable card';
			node.setAttribute('style', uiUtil.getCardBackgroundShiftStyle(cardObject));
			node.innerHTML = card.getTypeChar(cardObject.typeId);
			holder.appendChild(node);
		},
		addCardToWindowsTray : function(cardObject) {
			$('#card-holder').empty;
			var holder = document.getElementById('card-holder');
			var node = document.createElement('li');
			node.id = 'card-' + cardObject.id;
			node.title = card.getTypeChar(cardObject.typeId);
			node.className = 'card-hoverable card';
			node.setAttribute('style', uiUtil.getCardBackgroundShiftStyle(cardObject));
			node.innerHTML = card.getTypeChar(cardObject.typeId);
			holder.appendChild(node);
		},
		addCardToPlayedCard : function(cardObject, currentPlayer) {
			currentPlayer = currentPlayer + 1;
			var holder = document.getElementById('player' + currentPlayer + '-playedCardHolder');
			var node = document.createElement('li');
			node.id = 'card-' + cardObject.id;
			node.title = card.getTypeChar(cardObject.typeId);
			node.className = 'card-hoverable card';
			node.setAttribute('style', uiUtil.getCardBackgroundShiftStyle(cardObject));
			node.innerHTML = card.getTypeChar(cardObject.typeId);
			holder.appendChild(node);
		},
		addCardToRubblishArea : function(cardObject) {
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
				rubblish.fadeIn('fast', function(){game.checkRubblishCollect(game.getCurrentPlayer());});
		},
		addCardToFunctionalArea : function(cardObject) {
			ui.addCardToPlayedCard(cardObject);
			if (currentPlayer === 1 ) {
				game.checkRubblishCollect(game.getCurrentPlayer());
			} else {
				theCard.fadeIn('slow')
				.fadeOut('slow', function(){game.checkRubblishCollect(game.getCurrentPlayer());});
			}
		},
		updateCrystalArea : function() {
			for( var i = 0; i < 4; i++) {
				document.getElementById('player' + (i+1) + '-CrystalNum').innerHTML="x " + game.getPlayerCrystal(i);
				document.getElementById('player' + (i+1) + '-LandfillNum').innerHTML="x " + game.getPlayerLandfill(i);
			}
		},
		// Show the game result window
		showResult : function() {
			ui.showToast('Game ended. Press &ldquo;New Game&rdquo; to start a new game.');

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
			if(winnerNumber === 1) {
				// Only one winner
				bodyText.append($('<p>').text('The winner is Player ' + (results.winner[0] + 1) + '.'));
			} else {
				// More than one winner
				var winnerMsg = 'The winners are ';
				for(var i = 1; i < winnerNumber; i++) {
					if(i === winnerNumber - 3) {
						winnerMsg += 'Player ' + (results.winner[0] + 1) + ', ';
					} else if(i === winnerNumber - 2) {
						winnerMsg += 'Player ' + (results.winner[0] + 1) + ' and ';
					} else {
						winnerMsg += 'Player ' + (results.winner[1] + 1) + '.';
					}
				}
				bodyText.append($('<p>').text(winnerMsg));
			}

			// Output a table listing all the cards for all players and the scores respectively
			var tableNode = $('<table>');
			tableNode.append($('<tr>').append($('<th>').text('Players'), $('<th>').text('Scores')));
			var playerNumber = game.getPlayerCount();
			for(var playerId = 0; playerId < playerNumber; playerId++) {
                            tableNode.append($('<tr>').append($('<td>').addClass('player').text('Player ' + (playerId + 1)), $('<td>').addClass('player').text(results.scores[playerId])));
			}
			bodyText.append(tableNode);

			// Show the popup
			ui.showPopup('result');
			var popup = $('#popup-background, #result-close');
			popup.click(function() {
				ui.hidePopup('result');
				popup.unbind('click');
				ui.lockNewGame(false);
				bodyText.empty();
			});
			$('body').keyup(function(event) {
				// Esc key
				if(event.keyCode === 27) {
					ui.hidePopup('result');
					$('body').unbind('keyup');
					ui.lockNewGame(false);
					bodyText.empty();
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
	};
})();

function get_profile() {
		var playername = document.getElementById("pname").value;
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