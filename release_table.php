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
	
	// read JSon input
	$obj = json_decode(file_get_contents('php://input'));
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header('Access-Control-Allow-Headers: Content-Type');
	$table = $obj->table;
	
	if ($table == "table1")
		$subtable = "subtable1";
	else if ($table == "table2")
		$subtable = "subtable2";
	
	$query = "UPDATE ".$table." SET player_id = NULL, play_card_enable = 0 WHERE type = 'player'";
	
	// Connect to MySQL
	if (!($database = mysql_connect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$query = "UPDATE ".$table." SET cardlist = '', cardcount = 0, crystal = 0, landfill = 0";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$query = "UPDATE ".$subtable." SET existed = 0";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$query = "UPDATE tables SET playerlist = '', playercount = 0, status = 'pending', joinenable = 1 WHERE table_id = '".$table."'";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	mysql_close( $database );
?>