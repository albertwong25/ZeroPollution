<!-- CC3206 Programming Project
Lecture Class: 203
Lecturer: Dr Simon WONG
Group Member: CHAN You Zhi Eugene (11036677A)
Group Member: FONG Chi Fai (11058147A)
Group Member: SO Chun Kit (11048455A)
Group Member: SO Tik Hang (111030753A)
Group Member: WONG Ka Wai (11038591A)
Group Member: YEUNG Chi Shing (11062622A) -->

<!-- Change those browsers which support DOCTYPE into standard mode
Using the instruction of W3C to read CSS and XHTML -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<!-- Text coding type is utf-8 -->
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>Zero Pollution</title>
		<!-- Heading icon -->
		<link rel="shortcut icon" href="icon.png" />
		<!-- Reference stylesheet -->
		<link rel="stylesheet" href="styles/style.css" />
		<!-- Reference jquery library -->
		<script type="application/javascript" src="scripts/jquery-1.9.1.js"></script>
		<!-- Reference javascript -->
		<script type="application/javascript" src="scripts/main.js"></script>
	</head>
	
	<body>
		<!-- Notice comes out when players did not enable JavaScript in their web browser -->
		<noscript>
			<p>
				In order to play this game, please enable JavaScript in your web browser.
			</p>
		</noscript>
		<div id="gameboard">
			<div id="game-logo"><img id="game-logo-img" src="images/logo.png" width="600" height="135"></div>
			<div id="table1" class="table" title="Join table 1">
				<h4>Table 1</h4>
				<table>
					<tr>
						<td style="vertical-align:top; text-align:right;">
							<ul>
								<li>(HOST) Player 1:</li>
								<li>Player 2:</li>
								<li>Player 3:</li>
								<li>Player 4:</li>
								<li>Player 5:</li>
								<li>Player 6:</li>
							</ul>
						</td>
						<td style="vertical-align:top; text-align:left;"><ul id="table1_playerlist"></ul></td>
					</tr>
				</table>
			</div>
			<button id="table1_button" class="button">Start the Game</button>
			<div id="table2" class="table" title="Join table 2">
				<h4>Table 2</h4>
				<table>
					<tr>
						<td style="vertical-align:top; text-align:right;">
							<ul>
								<li>(HOST) Player 1:</li>
								<li>Player 2:</li>
								<li>Player 3:</li>
								<li>Player 4:</li>
								<li>Player 5:</li>
								<li>Player 6:</li>
							</ul>
						</td>
						<td style="vertical-align:top; text-align:left;"><ul id="table2_playerlist"></ul></td>
					</tr>
				</table>
			</div>
			<button id="table2_button" class="button">Start the Game</button>
            <button id="leave_button" class="button">Leave Table</button>
			<form name="myform" method="POST" action="multi_game.php">
				<input type="hidden" id="selected_table" name="tablename" value=""/>
                <input type="hidden" id="pname" name="pname" value="<?php echo $_POST['pname']; ?>" />
			</form>
			<form name="myform1" method="POST" action="main.php">
				<input type="hidden" id="pname" name="pname" value="<?php echo $_POST['pname']; ?>" />
			</form>
			<form name="myform3" method="POST" action="chatroom.php" target="_blank">
				<input type="hidden" id="pname" name="pname" value="<?php echo $_POST['pname']; ?>" />
			</form>
			<div id="profile-window" class="window">
				<h2>Profile</h2>
				<button id="profile-close" class="window-close-btn">
					Close
				</button>
				<div class="window-body">
					<div id="profile"></div>
				</div>
			</div>
			<div id="rule-window" class="window">
				<h2>Game Rules</h2>
				<button id="rule-close" class="window-close-btn">
					Close
				</button>
				<div class="window-body">
					<p>Game Cards</p>
					<ul>
						<li>63 Trash Cards: 15 Metal Cards, 15 Paper Cards, 15 Plastics Cards, 6 Battery Cards, 6 Old Stuff Cards and 6 Leftover Cards.</li>
						<li>13 Function Cards: 3 Incinerator Cards, 2 Contention Cards, 2 High Technology Cards, 2 Junk Retrieving Cards, 1 Resources Allocation Card and 1 Landfill Transfer Card.</li>
						<li>3 Trash Cumulation Cards: 1 Landfill Full Card and 2 Incinerator Fail Cards.</li>
						<li>12 Landfill Cards: 6 Landfill and 6 Cover Cards.</li>
					</ul>
					
					<p>Set Up</p>
					<ol>
						<li>Deal the Landfill Card.</li>
						<li>Put the Trash Cards, the Function Cards and Trash Cumulation Cards, together and shuffle. Deal 5 to each player, face down.</li>
						<li>ut the remaining cards face down in the center to create the draw pile.</li>
						<li>4.	Prepare the Energy Crystals.(10 pieces for two players, 15 pieces for three players, 20 pieces for players, 25 pieces for five players and 30 for six players)</li>
						<li>5.	Decide who goes first (you may start from the youngest player).</li>
					</ol>
					
					<p>Game Process</p>
					<ol>
						<li>Distribute one Landfill Card and one Cover Card to each player. The Cover card covers the Landfill Card 
for the calculation of pollution level.</li>
						<li>Start the game from the first player. Other players play the game in clockwise direction.</li>
						<li>Play the cards in your hand. Every player can play 1 to 3 cards (at least one). If a trash card is played, it is put on the corresponding position on the board. The played card must be different from the cards currently on the board. If a Function Card is played,
 follow the instruction on that card.</li>
						<li>Collect the Trash Cards in the Recycle Bin. The player who collects 
a whole set of trash can get one Energy Crystal.</li>
						<li>If a player cannot play any card in a turn, the player shoes all the cards in hand to all players, chooses at most 2 cards in hand to discard and draw the same number of cards. Then, the next player started.</li>
						<li>Take two cards from the draw pile each round and put it in the cards in your hand. Then, the next player plays. If you have more than seven cards in your hand at the end of your turn, each extra card will increase the stated pollution level of the Landfill.</li>
						<li>When a player gets a trash cumulation card, show it immediately and all players increase the stated pollution level.</li>
						<li>If a player has no cards in hand, draw 5 cards immediately. Then, the next player plays.</li>
						<li>If all cards are drawn in the draw pile, collect all discarded Trash cards, Function cards and Trash cumulation cards and shuffle.</li>
					</ol>

					<p>When will the Game End</p>
					<ul>
						<li>When all Energy Crystals are distributed, the game ends.</li>
					</ul>

					<p>How to win</p>
					<ul>
						<li>For every 2 pollution points a player has, remove one Energy crystal. The player who has the most Energy Crystals wins!
If players have the same number of Energy Crystals, the player who has lower pollution points wins.</li>
					</ul>
				</div>
			</div>
			<div id="about-window" class="window">
				<h2>About</h2>
				<button id="about-close" class="window-close-btn">
					Close
				</button>
				<div class="window-body">
					<p>About the game</p>
					<p>Every year, there are over six million municipal solid wastes produced in Hong Kong. In other words, over 18,000 tons of municipal solid wastes are produced every day, which is equivalent to six standard swimming pools. Although the pollution problems are becoming more serious, we can save the Earth! By changing your lifestyles, classifying the waste and reducing the trash.
You can save the environment! ACT NOW!</p>
					
					<p>Your Mission</p>
					<p>Your mission is to collect and classify the Trash Cards, and then place them in different Recycling Bins. By using the Trash Cards and Function Cards, you can convert the Trash into Energy Crystal! Through cooperating and competing with your opponents, you can reach the final goal – convert waste to energy! 
Let’s create a better world together.</p>
				</div>
			</div>
			<div id="credit-window" class="window">
				<h2>Credit</h2>
				<button id="credit-close" class="window-close-btn">
					Close
				</button>
				<div class="window-body">
					<p>This web-base game is designed by the year 2 students of Hong Kong Community College, who study Associate in Information Technology in 2013. The purpose of this web-base game is for learning computer technology in subject CC3206 Programming Project ONLY. This game is NOT for sale. Those multimedia sources used inside this game is reserved for the owners of those media.</p>
					
					<p>Design</p>
					<p><ul><li>The blueprint of this game is based on a board game named as the same as this web-base game "Zero Pollution". The board game is designed by Cynthia Botelho, Peggy Leung, Carmen Wan and Cindy Wong, who are the students of Hong Kong Community College. It is published by Hong Kong Polytechnic University and Hong Kong Community College. All rights reserved by PEOPLE ON BOARD.</li></ul></p>
					
					<p>Coding</p>
					<p><ul><li>The programming codes of this game are based on HTML5, CSS3, PHP, SQL and Javascript with JQuery library version 1.9.1. The HTML instruction is supported by World Wide Web Consortium.</li></ul></p>
					
					<p>Tools</p>
					<p><ul><li>The design environment is based on Microsoft Windows 7, with Microsoft Office 2010, Adobe Photoshop CS5, Adobe Dreamweaver CS4 and Notepad++ supported.</li><li>The testing environment is based on Google Chrome, Mozilla Firefox and Opera. Ineternet Explorer can not fully support in coding of this game.</li><li>The web server used in this game is no-ip.org, which is based on Apache as web server and MySQL as database server. The server setting and testing are supported by XAMPP and phpMyAdmin.</li></ul></p>
					
					<p>Multimedia sources</p>
					<p><ul><li>Green Tips:<br>The information of green tips are researched from different websites. The detail of reference list is wirtten in the final report of this game.</li><li>Card Images:<br>Those card images are the source images of the board game, which got from the tutors of the original designers, with the approve of the original designers.</li><li>Background Music:<br>The background music is named "Feeling Position", which is composed by Matthias Harris.</li></ul></p>
				</div>
			</div>
		</div>
		<div id="control" class="clearfix">
			<div class="left">
				<h1>Zero Pollution</h1>
			</div>
			<div class="right">
				<ul>
					<li><a href="#">Setting</a>
						<ul>
                        	<li><button class="menubutton" id="home">Home</button></li>
							<li><button class="menubutton" id="profile">Profile</button></li>
                            <li><button class="menubutton" id="chatroom">Chat Room</button></li>
							<li><button class="menubutton" id="game-rules">Game Rules</button></li>
							<li><button class="menubutton" id="about">About</button></li>
							<li><button class="menubutton" id="credit">Credit</button></li>
							<li><button class="menubutton" id="logout">Logout</button></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<div id="footer">
			<p>Recommended browser: <a href="http://www.google.com/chrome" title="Download Google Chrome" target="_blank">Google Chrome</a> / <a href="http://www.mozilla.com/firefox/" title="Download Mozilla Firefox" target="_blank">Mozilla Firefox</a><font>Copyright &copy; 2013 reserved for <a href="http://www.hkcc-polyu.edu.hk" title="HKCC" target="_blank">HKCC</a></font></p>
		</div>
		<div id="popup-background"></div>
	</body>
</html>