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
	$you = $obj->player;
	$host = $obj->host;
	
	$query = "SELECT * FROM tables WHERE table_id='".$table."'";
	
	// Connect to MySQL
	if (!($database = mysql_connect("localhost", "root", "")))
		echo "Could not connect to database!";
	
	// Open game database
	if (!mysql_select_db("zeropollution", $database))
		echo "Could not open game database!";
	
	// Query game database
	if (!($result = mysql_query($query, $database)))
		echo "Could not execute action!";
	
	$temp = mysql_fetch_assoc($result);
	$playerlist = $temp["playerlist"];
	$playercount = $temp["playercount"];
	
	$search_patten = "/<li>(.*?)<\/li>/";
	
	preg_match_all($search_patten, $playerlist, $array_result);
	
	for ($i = 0; $i < sizeof($array_result[0]); $i++) {
		$array_result[0][$i] = str_replace("<li>", "", $array_result[0][$i]);
		$array_result[0][$i] = str_replace("</li>", "", $array_result[0][$i]);
		// Query game database
		if (!(mysql_query("UPDATE ".$table." SET player_id = '".$array_result[0][$i]."' WHERE record_id = '".($i + 1)."' AND type = 'player'", $database)))
			echo "Could not execute action!";
	}
	
	// Lock table
	if (!(mysql_query("UPDATE tables SET joinenable = false WHERE table_id = '".$table."'", $database)))
		echo "Could not execute action!";
	
	if ($you == $host) {
		
		// Initial variable
		$shuffleTimes = rand(1, 128);
		$maxCard = 128;
		$stack = array();
		$player = array();
		$gametable = array();
		for ($i = 0; $i < $playercount; $i++)
			$player[$i] = array();
		$cardId;
		$repeated;
		
		// Shuffle the cards
		for ($i = 0; $i < $shuffleTimes; $i++) {
			for ($j = 0; $j < $maxCard; $j++) {
				do {
					$cardId = rand(0, ($maxCard-1));
					$repeated = false;
					for ($k = 0; $k < $j; $k++) {
						if ($cardId == $stack[$k])
							$repeated = true;
					}
					if (!$repeated) {
						$stack[$j] = $cardId;
						break;
					}
				} while ($repeated);
			}
		}
		
		$pointer = 0;
		// Deal cards to the players and place cards on table at the beginning of the game
		for ($i = 0; $i < 4; $i++) {
			for ($j = 0; $j < $playercount; $j++) {
				$player[$j][$i] = $stack[$pointer++];
			}
		}
		for ($i = 0; $i < $playercount; $i++) {
			for ($j = 0; $j < 4; $j++) {
				// Query game database
				if (!(mysql_query("UPDATE ".$table." SET cardlist = concat(cardlist, '#".$player[$i][$j]."#'), cardcount = 4 WHERE record_id = '".($i + 1)."' AND type = 'player'", $database)))
					echo "Could not execute action!";
			}
		}
		
		$dealt = 128 - $pointer;
		for ($i = $pointer; $i < 128; $i++) {
			// Query game database
			if (!(mysql_query("UPDATE ".$table." SET cardlist = concat(cardlist, '#".$stack[$pointer++]."#'), cardcount = '".$dealt."' WHERE record_id = '7' AND type = 'stack'", $database)))
				echo "Could not execute action!";
		}
		
		// Set total number of crystal
		if (!(mysql_query("UPDATE ".$table." SET crystal = '".($playercount * 5)."' WHERE type = 'stack' OR type = 'discard'", $database)))
				echo "Could not execute action!";
		
		// Random selection of first player
		$rand = rand(1, $playercount);
		if (!(mysql_query("UPDATE ".$table." SET play_card_enable = true WHERE record_id = ".$rand, $database)))
				echo "Could not execute action!";
		
	}
	
	mysql_close( $database );
?>