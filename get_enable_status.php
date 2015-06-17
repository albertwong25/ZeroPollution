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
	
	$table = $_GET['table'];
	$player = $_GET['player'];
	
	$query = "SELECT play_card_enable FROM ".$table." WHERE record_id = ".($player + 1);
	
	// Connect to MySQL
	if (!($database = mysql_pconnect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";

	$record = mysql_fetch_assoc($result);
	$status = $record['play_card_enable'];
	
	echo $status;
	
	mysql_close($database);
?>