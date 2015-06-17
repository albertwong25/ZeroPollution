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
	
	if ($table == "table1")
		$subtable = "subtable1";
	else if ($table == "table2")
		$subtable = "subtable2";
	
	$query = "SELECT * FROM ".$subtable;
	
	// Connect to MySQL
	if (!($database = mysql_pconnect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";

	$type = array();
	while ($record = mysql_fetch_assoc($result)){
		$type[] = $record['existed'];
	}
	
	$query = "SELECT * FROM ".$table;
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$crystal = array();
	$landfill = array();
	$enable = array();
	while ($record = mysql_fetch_assoc($result)){
		$crystal[] = $record['crystal'];
		$landfill[] = $record['landfill'];
		$enable[] = $record['play_card_enable'];
	}
	
	$query = "SELECT * FROM ".$table." WHERE type = 'stack' OR type = 'discard'";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$cardlist = array();
	while ($record = mysql_fetch_assoc($result)){
		$cardlist[] = $record['cardlist'];
	}
	
	$obj['type'] = $type;
	$obj['crystal'] = $crystal;
	$obj['landfill'] = $landfill;
	$obj['enable'] = $enable;
	$obj['cardlist'] = $cardlist;
	
	echo json_encode($obj); // echo tables status to client
	
	mysql_close($database);
?>