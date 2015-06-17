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
	$winner = array();
	$player = array();
	for ($i = 0; $i < sizeof($obj->winnerinfo); $i++) {
		$winner[] = $obj->winnerinfo[$i]->winner;
	}
	for ($i = 0; $i < sizeof($obj->playerinfo); $i++) {
		$player[] = $obj->playerinfo[$i]->player;
	}
	
	// Connect to MySQL
	if (!($database = mysql_connect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	
	// Update winner count
	for ($i = 0; $i < sizeof($winner); $i++) {
		// Query game database
		if (!($result = mysql_query("UPDATE player SET win_count = win_count + 1 WHERE player_id = '".$winner[$i]."'", $database)))
			echo "Could not execute action!";
	}
	
	// Update loser count
	for ($i = 0; $i < sizeof($player); $i++) {
		$isLoser = true;
		for ($j = 0; $j < sizeof($winner); $j++) {
			if ($player[$i] == $winner[$j]) {
				$isLoser = false;
			}
		if ($isLoser == true) {
			// Query game database
			if (!($result = mysql_query("UPDATE player SET lose_count = lose_count + 1 WHERE player_id = '".$player[$i]."'", $database)))
				echo "Could not execute action!";
		}
	}
	
	mysql_close($database);
?>