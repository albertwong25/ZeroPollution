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
	</head>
	
	<body>
		<!-- Notice comes out when players did not enable JavaScript in their web browser -->
		<noscript>
			<p>
				In order to play this game, please enable JavaScript in your web browser.
			</p>
		</noscript>
		<form name="myform" method="POST" action="main.php">
			<input type="hidden" id="pname" name="pname" value="<?php echo $_POST['playerid1']; ?>" />
		</form>
		<div id="gameboard">
			<div id="game-logo"><img id="game-logo-img" src="images/logo.png" width="600" height="135"></div>
			<?php
				$action = $_POST['action'];
				
				if ($action == "login") {
					$playerid = $_POST['playerid1'];
					$password = $_POST['password1'];
				
					$query = "SELECT player_id, password FROM player WHERE player_id='$playerid'";
				}
				
				else if ($action == "register") {
					$playerid = $_POST['playerid2'];
					$password = $_POST['password2'];
					$email = $_POST['email'];
					$name = $_POST['name'];
					$phoneno = $_POST['phoneno'];
					$address = $_POST['address'];
					
					$query = "INSERT INTO player VALUES('$playerid', '$password', '$email', NOW(), 
														'$name', '$phoneno', '$address', 0, 0)";
				}
				
				// Connect to MySQL
				if (!($database = mysql_connect("localhost", "root", "")))
         	  	 die("<div id='connect'>Could not connect to database!
						<br>Redirecting to pervious page automatically within 3 seconds...</div>"
						.header("Refresh: 3; index.html"));
				
				// Open game database
				if (!mysql_select_db("zeropollution", $database))
        	    	die("<div id='connect'>Could not connect to database!
						<br>Redirecting to pervious page automatically within 3 seconds...</div>"
						.header("Refresh: 3; index.html"));
   				
				// Query game database
				if (!($result = mysql_query($query, $database))){
					die("<div id='connect'>Could not execute action!
           				<br>Redirecting to pervious page automatically within 3 seconds...</div>"
						.header("Refresh: 3; index.html"));
				}
				
				if ($action == "login") {
					$row = mysql_fetch_row($result);
					if ($playerid != null && $password != null && $playerid == $row[0] && $password == $row[1]) {
						print("<script>document.myform.submit()</script>");
					}
					else {
						print("<div id='connect'>Incorrect player name or password. Please try again.</div>"
								.header("Refresh: 3; index.html"));
					}
				}
				
				else if ($action == "register") {
					print("<div id='connect'>Player '".$playerid."' register successfully.<br>
						  <br>Player name: ".$playerid."
						  <br>Password: ".$password."
						  <br>E-mail: ".$email."
						  <br>Register date: ".date("Y-m-d")."<br>
						  <br>You may now login to the system and enjoy the game.
						  <br><a href='index.html' target='_self'>Back</a></div>");
				}
				
				mysql_close( $database );
			?>
		</div>
		<div id="control" class="clearfix">
			<div class="left">
				<h1>Zero Pollution</h1>
			</div>
		</div>
		<div id="footer">
			<p>Recommended browser: <a href="http://www.google.com/chrome" title="Download Google Chrome" target="_blank">Google Chrome</a> / <a href="http://www.mozilla.com/firefox/" title="Download Mozilla Firefox" target="_blank">Mozilla Firefox</a><font>Copyright &copy; 2013 reserved for <a href="http://www.hkcc-polyu.edu.hk" title="HKCC" target="_blank">HKCC</a></font></p>
		</div>
	</body>
</html>