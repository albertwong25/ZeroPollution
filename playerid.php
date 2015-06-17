<?php
	/* CC3206 Programming Project
	Lecture Class: 203
	Lecturer: Dr Simon WONG
	Group Member: CHAN You Zhi Eugene (11036677A)
	Group Member: FONG Chi Fai (11058147A)
	Group Member: SO Chun Kit (11048455A)
	Group Member: SO Tik Hang (111030753A)
	Group Member: WONG Ka Wai (11038591A)
	Group Member: YEUNG Chi Shing (11062622A) */
	
	$id = $_GET["id"];
	
	$query = "SELECT player_id FROM player WHERE player_id='$id'";
	
	// Connect to MySQL
	if (!($database = mysql_connect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$record = mysql_fetch_array($result);
	$record = $record['player_id'];
	if($id != null && $id == $record) {
		print("Player name '".$id."' existed");
	}
	else {
		print("");
	}
	
	mysql_close($database);
?>