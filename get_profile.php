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
	$id = $obj->name;
	
	$query = "SELECT * FROM player WHERE player_id='$id'";
	
	// Connect to MySQL
	if (!($database = mysql_connect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$record = mysql_fetch_row($result);
	if($id != null && $id == $record[0]) {
		print("<table><tr><td>Player name:</td><td>".$record[0]."</td></tr>
				<tr><td>Real name:</td><td>".$record[4]."</td></tr>
				<tr><td>E-mail:</td><td>".$record[2]."</td></tr>
				<tr><td>Phone number:</td><td>".$record[5]."</td></tr>
				<tr><td>Address:</td><td>".$record[6]."</td></tr>
				<tr><td>Total win:</td><td>".$record[7]."</td></tr>
				<tr><td>Total lose:</td><td>".$record[8]."</td></tr>
				<tr><td>Register date:</td><td>".$record[3]."</td></tr></table>");
	}
	
	mysql_close($database);
?>