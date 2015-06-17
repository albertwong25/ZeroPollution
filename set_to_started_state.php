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
	// header("Content-Type: application/json", "Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header('Access-Control-Allow-Headers: Content-Type');
	// $player = $obj->name;
	$table = $obj->table;
	//echo $player . " " . $table;
	
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
	
	$playercount = mysql_result($result, 0, "playercount");
	
	$query = "UPDATE tables SET status = 'started' WHERE table_id = '".$table."'";
	
	// query game database to set table status
	if ($playercount >= 2) {
		if (!($result = mysql_query($query, $database))) {
			echo "Could not execute action!";
		} // end if
	}
	
	mysql_close( $database );
?>