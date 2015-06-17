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
	
	$query = "SELECT * FROM ".$table;
	
	// Connect to MySQL
	if (!($database = mysql_pconnect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";

	while ($record = mysql_fetch_assoc($result)){
		$row[] = $record;
	}
	
	echo json_encode($row); // echo tables status to client
	
	mysql_close($database);
?>