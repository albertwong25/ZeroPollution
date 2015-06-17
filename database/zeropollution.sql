USE zeropollution;

DROP TABLE IF EXISTS player;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS table1;
DROP TABLE IF EXISTS subtable1;
DROP TABLE IF EXISTS table2;
DROP TABLE IF EXISTS subtable2;
DROP TABLE IF EXISTS chatroom;

CREATE TABLE IF NOT EXISTS  player(
   player_id   varchar(30)   NOT NULL,
   password   varchar(30)   NOT NULL,
   e_mail   varchar(40)   NOT NULL,
   register_date   date   NOT NULL,
   real_name   varchar(30),
   phone_no   int(20),
   address   varchar(100),
   win_count   int(4),
   lose_count   int(4),
   PRIMARY KEY (player_id)
);

CREATE TABLE IF NOT EXISTS  tables(
   table_id   varchar(6)   NOT NULL,
   playerlist   varchar(255),
   playercount   int(3),
   status   varchar(8),
   joinenable   boolean,
   PRIMARY KEY (table_id)
);

CREATE TABLE IF NOT EXISTS table1(
   record_id   int(2)   NOT NULL   AUTO_INCREMENT,
   player_id   varchar(30),
   type   varchar(7),
   cardlist   text(900),
   cardcount   int(3),
   crystal   int(3),
   landfill   int(3),
   play_card_enable   boolean,
   timer   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (record_id)
);

CREATE TABLE IF NOT EXISTS subtable1(
   type_id   int(3)   NOT NULL   AUTO_INCREMENT,
   existed   boolean,
   PRIMARY KEY (type_id)
);

CREATE TABLE IF NOT EXISTS table2(
   record_id   int(2)   NOT NULL   AUTO_INCREMENT,
   player_id   varchar(30),
   type   varchar(7),
   cardlist   text(900),
   cardcount   int(3),
   crystal   int(3),
   landfill   int(3),
   play_card_enable   boolean,
   timer   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (record_id)
);

CREATE TABLE IF NOT EXISTS subtable2(
   type_id   int(3)   NOT NULL   AUTO_INCREMENT,
   existed   boolean,
   PRIMARY KEY (type_id)
);

CREATE TABLE IF NOT EXISTS chatroom(
   record_id   int(3)   NOT NULL   AUTO_INCREMENT,
   player_id   varchar(30),
   message   text(1000),
   time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (record_id)
);

INSERT INTO player VALUES (
'test1', 'password1', 'test1@yahoo.com.hk', '2013-01-01', 'test 1', 91234567, 'test1 address', 0, 0);

INSERT INTO player VALUES (
'test2', 'password2', 'test2@yahoo.com.hk', '2013-02-03', 'test 2', 91234568, 'test2 address', 1, 1);

INSERT INTO player VALUES (
'test3', 'password3', 'test3@yahoo.com.hk', '2013-03-05', 'test 3', 91234569, 'test3 address', 2, 2);

INSERT INTO player VALUES (
'test4', 'password4', 'test4@yahoo.com.hk', '2012-04-07', 'test 4', 91234570, 'test4 address', 3, 3);

INSERT INTO player VALUES (
'test5', 'password5', 'test5@yahoo.com.hk', '2012-05-09', 'test 5', 91234571, 'test5 address', 4, 4);

INSERT INTO player VALUES (
'test6', 'password6', 'test6@yahoo.com.hk', '2012-06-11', 'test 6', 91234572, 'test6 address', 5, 5);

INSERT INTO player VALUES (
'test7', 'password7', 'test7@yahoo.com.hk', '2011-07-13', 'test 7', 91234573, 'test7 address', 6, 6);

INSERT INTO player VALUES (
'test8', 'password8', 'test8@yahoo.com.hk', '2011-08-15', 'test 8', 91234574, 'test8 address', 7, 7);

INSERT INTO player VALUES (
'test9', 'password9', 'test9@yahoo.com.hk', '2011-09-17', 'test 9', 91234575, 'test9 address', 8, 8);

INSERT INTO player VALUES (
'test0', 'password0', 'test0@yahoo.com.hk', '2011-10-19', 'test 0', 91234576, 'test0 address', 1000, 0);

INSERT INTO tables VALUES (
'table1', '', 0, 'pending', TRUE);

INSERT INTO tables VALUES (
'table2', '', 0, 'pending', TRUE);

INSERT INTO table1(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table1(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table1(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table1(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table1(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table1(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table1(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
'Stack', 'stack', '', 0, 0, 0, NULL);

INSERT INTO table1(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
'Discard', 'discard', '', 0, 0, 0, NULL);

INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);
INSERT INTO subtable1(existed) VALUES (false);

INSERT INTO table2(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table2(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table2(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table2(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table2(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table2(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
NULL, 'player', '', 0, 0, 0, FALSE);

INSERT INTO table2(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
'Stack', 'stack', '', 0, 0, 0, NULL);

INSERT INTO table2(player_id, type, cardlist, cardcount, crystal, landfill, play_card_enable) VALUES (
'Discard', 'discard', '', 0, 0, 0, NULL);

INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);
INSERT INTO subtable2(existed) VALUES (false);