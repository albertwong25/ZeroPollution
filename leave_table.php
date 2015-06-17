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
	
	$query = "SELECT * FROM tables";
	
	// Connect to MySQL
	if (!($database = mysql_connect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	while ($table = mysql_fetch_assoc($result)) {
		$tableid[] = $table["table_id"];
		$playerlist[] = $table["playerlist"];
		$playercount[] = $table["playercount"];
		$status[] = $table["status"];
	}
	$search_pattern = "/".$player."/";
	$replace = "<li>".$player."</li>";
	
	if ($status[0] != "started" && preg_match($search_pattern, $playerlist[0])) {
		$playercount[0] = $playercount[0] - 1;
		$playerlist[0] = str_replace($replace, "", $playerlist[0]);
		
		$query = "UPDATE tables SET playerlist = '".$playerlist[0]."', playercount = ".$playercount[0];
		$query = $query." WHERE table_id = '".$tableid[0]."'";
		
		// query game database to update table status
		if (!($result = mysql_query($query, $database))) {
			echo "Could not execute action!";
		} // end if
		echo "left";
	} // end if
	
	if ($status[1] != "started" && preg_match($search_pattern, $playerlist[1])) {
		$playercount[1] = $playercount[1] - 1;
		$playerlist[1] = str_replace($replace, "", $playerlist[1]);
		
		$query = "UPDATE tables SET playerlist = '".$playerlist[1]."', playercount = ".$playercount[1];
		$query = $query." WHERE table_id = '".$tableid[1]."'";
		
		// query game database to update table status
		if (!($result = mysql_query($query, $database))) {
			echo "Could not execute action!";
		} // end if
		echo "left";
	} // end if
	
	mysql_close($database);
?>