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

	// header("Content-Type: application/json", "Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
	header('Access-Control-Allow-Headers: Content-Type');
	
	$query = "SELECT * FROM tables";
	
	// Connect to MySQL
	// mysql_pconnect (persistent) is a bit more efficient than mysql_connect
	// recreate "root" user and give simpler privileges. Using simpler permissions
	// when you issue GRANT statements enables MySQL to reduce permission-checking
	// overhead when clients execute statements.  This especically when client is using
	// polling to access data status from the server.  E.g. you may use the following grant statement:
	// grant select, insert, update, delete on Game.* to 'root'@'localhost';
	if (!($database = mysql_pconnect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	while ($r = mysql_fetch_assoc($result)){
		$rows[] = $r;
	}
	echo json_encode($rows); // echo tables status to client
	
	mysql_close($database);
?>