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
	$player = $obj->name;
	$table = $obj->table;
	
	$query = "SELECT * FROM tables WHERE table_id = '".$table."'";
	
	// Connect to MySQL
	if (!($database = mysql_connect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$table = mysql_fetch_assoc($result);
	$playerlist = $table["playerlist"];
	$playercount = $table["playercount"];
	$status = $table["status"];
	$search_pattern = "/".$player."/";
	
	// A player can join the table before there are 6 players.
	// When the game is started, a player can no longer join the table.
	if ($playercount < 6 && $status != "started" && !preg_match($search_pattern, $playerlist)) {
		$playercount = $playercount + 1;
		$tableid = $table["table_id"];
		$playerlist = $table["playerlist"];
		$playerlist = $playerlist."<li>".$player."</li>";
		
		// echo $tableid . " " . $playerlist . " " . $playercount;
		
		$query = "UPDATE tables SET playerlist = '".$playerlist."', playercount = '".$playercount."'";
		if ($playercount == 6) $query = $query.", status = 'started'";
		$query = $query." WHERE table_id = '".$tableid."'";
		// echo $query;
		
		// query game database to update table status
		if (!($result = mysql_query($query, $database))) {
			echo "Could not execute action!";
		} // end if
		echo "joined";
	} // end if
	
	mysql_close($database);
?>