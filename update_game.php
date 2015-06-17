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
	$stack = $obj->stack;
	$discard = $obj->discard;
	$totalcrystal = intval($obj->totalcrystal);
	$cardlist = array();
	$cardcount = array();
	$ctystal = array();
	$landfill = array();
	$playerenable = array();
	$cardtypeisexist = array();
	for ($i = 0; $i < sizeof($obj->playerinfo); $i++) {
		$cardlist[] = $obj->playerinfo[$i]->cardlist;
		$cardcount[] = intval($obj->playerinfo[$i]->cardcount);
		$crystal[] = intval($obj->playerinfo[$i]->crystal);
		$landfill[] = intval($obj->playerinfo[$i]->landfill);
		$playerenable[] = $obj->playerinfo[$i]->playerenable;
	}
	for ($i = 0; $i < sizeof($obj->cardtype); $i++) {
		$cardtypeisexist[] = $obj->cardtype[$i]->cardtypeisexist;
	}
	if ($table == "table1")
		$subtable = "subtable1";
	else if ($table == "table2")
		$subtable = "subtable2";
	
	// Connect to MySQL
	if (!($database = mysql_connect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Update stack and number of crystal remainded
	$query = "UPDATE ".$table." SET cardlist = '".$stack."', crystal = ".$totalcrystal." WHERE type = 'stack'";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	// Update discard
	$query = "UPDATE ".$table." SET cardlist = '".$discard."' WHERE type = 'discard'";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	//Update player information
	for ($i = 0; $i < sizeof($obj->playerinfo); $i++) {
		// Query game database
		if (!($result = mysql_query("UPDATE ".$table." SET cardlist = '".$cardlist[$i]."', cardcount = ".$cardcount[$i].", crystal = ".$crystal[$i].", landfill = ".$landfill[$i].", play_card_enable = ".$playerenable[$i]." WHERE record_id = ".($i + 1), $database)))
			echo "Could not execute action!";
	}
	
	//Update table information
	for ($i = 0; $i < sizeof($obj->cardtype); $i++) {
		// Query game database
		if (!($result = mysql_query("UPDATE ".$subtable." SET existed = ".$cardtypeisexist[$i]." WHERE type_id = ".($i + 1), $database)))
			echo "Could not execute action!";
	}
	
	// Get stack and discard from table
	$query = "SELECT * FROM ".$table." WHERE type = 'stack' OR type = 'discard'";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$record = mysql_fetch_assoc($result);
	$stack_result = $record['cardlist'];
	$discard_result = $record['cardlist'];
	
	// Put card to stack from discard when no card in stack
	if ($stack_result == "" || $stack_result == NULL) {
		$stack_result = $discard_result;
		$discard_result = "";
	
		$query = "UPDATE ".$table." SET cardlist = '".$stack_result."' WHERE type = 'stack'";
		
		// Query game database
		if (!($result = mysql_query($query, $database)))
			echo "Could not execute action!";
		
		$query = "UPDATE ".$table." SET cardlist = '".$discard_result."' WHERE type = 'discard'";
		
		// Query game database
		if (!($result = mysql_query($query, $database)))
			echo "Could not execute action!";
	}
	
	mysql_close($database);
?>