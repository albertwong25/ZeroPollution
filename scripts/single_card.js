/* CC3206 Programming Project
Lecture Class: 203
Lecturer: Dr Simon WONG
Group Member: CHAN You Zhi Eugene (11036677A)
Group Member: FONG Chi Fai (11058147A)
Group Member: SO Chun Kit (11048455A)
Group Member: SO Tik Hang (111030753A)
Group Member: WONG Ka Wai (11038591A)
Group Member: YEUNG Chi Shing (11062622A) */

 // Card spec
var card = (function() {
	var maxCard = 256;
	var maxCardType = 32;
	var maxRubblishType = 24;
	var maxFunctionalType = 8;
	var maxRubblish = 192;
	var maxFunctional = 64;
	var maxCardId;
	var width = 66;
	var height = 110;
	// Shift value for player cards in holder
	var shift = 70;
	// Offset of cards in stockpile and discard pile
	var centralZoneXOffset = 135;
	var centralZoneYOffset = 115;
	var type = ['Battery - 1', 'Battery - 2', 'Battery - 3', 
				'Old stuff - 1', 'Old stuff - 2', 'Old stuff - 3', 
				'Surplus - 1', 'Surplus - 2', 'Surplus - 3', 
				'Metal - 1', 'Metal - 2', 'Metal - 3', 'Metal - 4', 'Metal - 5', 
				'Paper - 1', 'Paper - 2', 'Paper - 3', 'Paper - 4', 'Paper - 5', 
				'Plastics - 1', 'Plastics - 2', 'Plastics - 3', 'Plastics - 4', 'Plastics - 5',
				'Conversion', 'Dishonest Trader', 'Excess Landfill', 'High Teahnology',
				'Incinerator Failure', 'Incinerator', 'Junk Retrieving', 'Landfill Transfer',
				'I am a cheat'];
	var Description = [	'Battery - 1', 'Battery - 2', 'Battery - 3', 
						'Old stuff - 1', 'Old stuff - 2', 'Old stuff - 3', 
						'Surplus - 1', 'Surplus - 2', 'Surplus - 3', 
						'Metal - 1', 'Metal - 2', 'Metal - 3', 'Metal - 4', 'Metal - 5', 
						'Paper - 1', 'Paper - 2', 'Paper - 3', 'Paper - 4', 'Paper - 5', 
						'Plastics - 1', 'Plastics - 2', 'Plastics - 3', 'Plastics - 4', 'Plastics - 5',
						'Convert the points of Landfill pollution into Energy Crystals',
						'Stealing 1 Ennrgy Crystal from your oppenent, increasing 2 ponint of the Landfill',
						'Every player increase two points from the Landfill',
						'As part of any Trash combination',
						'Every player increase one point from the Landfill',
						'Deduct one point from the Landfill',
						'Get a card from your oppenent s hand',
						'Every player transfers their Landfill to next opponent in anti-clockwise',
						'I am a cheat'];
	var Content = [	'The Rechargeable Battery Recycling Programme, run by the EPD, industry and green groups, has collection points all over Hong Kong. So when your rechargeable battery finally dies, don\'t throw it away. Recycle it!<br><img src="images/Battery1_2_3.gif" width="100" height="100">',
					'The Rechargeable Battery Recycling Programme, run by the EPD, industry and green groups, has collection points all over Hong Kong. So when your rechargeable battery finally dies, don\'t throw it away. Recycle it!<br><img src="images/Battery1_2_3.gif" width="100" height="100">',
					'The Rechargeable Battery Recycling Programme, run by the EPD, industry and green groups, has collection points all over Hong Kong. So when your rechargeable battery finally dies, don\'t throw it away. Recycle it!<br><img src="images/Battery1_2_3.gif" width="100" height="100">', 
					'All collected used clothing and household goods will be donated to families in need or resale. All income will be spent on  environmental protection and helping others; A the same time, the plan offer numbers of full-time and part-time post so that the grass-roots workers can get jobs.<br><img src="images/OLD STUFF 1.jpg" width="100" height="100">',
					'There are more than 70,000 metric tons of computers and electrical appliances are thrown away every year. Some abandoned computers and electrical appliances are still functional well and they can be second hand appliances. In addition, these items contain useful parts and materials, including metals and plastics which can be recycled,reused or recycled.<br><img src="images/OLD STUFF 2.jpg" width="100" height="100">',
					'All locations of "Community Used Clothes Recycling Bank" are placed Home Affairs Department by the District Office to identify, including community halls / center entrance, sitting-out areas, parks, sports centers and libraries. If the owners\' corporation / property management companies agree, bins may be located in the common areas of private buildings / malls.<br><img src="images/OLD STUFF 3.jpg" width="100" height="100">', 
					'Orange trees are widely grown in tropical and subtropical climates for its sweet fruit, which can be eaten fresh or processed to obtain juice, and for its fragrant peel.[4] They have been the most cultivated tree fruit in the world since 1987, and sweet oranges account for approximately 70% of the citrus production.',
					'Carrot have full of vitamin A. Lack of vitamin A can cause poor vision, including night vision, and these can be restored by adding vitamin A to the diet. An urban legend states that eating large quantities of carrots will allow one to see in the dark.',
					'Peas are starchy, but high in fiber, protein, vitamins, minerals, and lutein. Dry weight is about one-quarter protein and one-quarter sugar. Pea seed peptide fractions have less ability to scavenge free radicals than glutathione, but greater ability to chelate metals and inhibit linoleic acid oxidation.',
					'Aluminum cans should be placed in the yellow separation bins.<br><img src="images/METAL 1.jpg" width="100" height="100">',
					'Clean metal cans simply. Try to remove the plastic part on the metal containers cans, like milk cans cover, and placed in brown separation bins.<br><img src="images/METAL 2，4 ，5.jpg" width="100" height="100">',
					'Government encourage producers to reduce unnecessary packaging. "Environmentally friendly packaging moon cake" and "Moon cake tins recovery action" event is a success They helped to raise public awareness to avoid excessive packaging. The government will consult the industry before the introduction of producer responsibility charges.<br><img src="images/METAL 3.jpg" width="100" height="100">',
					'Clean metal cans simply. Try to remove the plastic part on the metal containers cans, like milk cans cover, and placed in brown separation bins.<br><img src="images/METAL 2，4 ，5.jpg" width="100" height="100">',
					'Clean metal cans simply. Try to remove the plastic part on the metal containers cans, like milk cans cover, and placed in brown separation bins.<br><img src="images/METAL 2，4 ，5.jpg" width="100" height="100">',
					'By using the hydraulic pulper, paper fiber is separated from the used paper and it is the raw material of recycled paper.<br><img src="images/PAPER 1.jpg" width="100" height="100">',
					'Used newspaper was sent to the paper mill where there it will be melted, and then generate a new paper. Paper, other than the newspaper, can also be recovered or recycled. The magazine can become a box of shoes and detergent. Cardboard boxes can become a cardboard box again. Many trees manufacture paper, but if all newspaper used in 1 year is recycled, 1.5 diameters of 14 cm, height of 8 meters of trees can be saved.',
					'Making a piece of paper will make air and water pollution problems. In order to effectively reduce the use of paper, now actively promote second hand books plan. If you love books, the books should not be thrown away and donate to other people in need. Why not come to participate in the scheme, to promote the concept of environmental protection.<br><img src="images/PAPER 3.jpg" width="100" height="100">',
					'If the situation allowed (that is still intact, too old, too disabled, no wear, etc.), old envelope can be reused. If the old envelope affixed with stamps, we are not recommend you to force the stamp torn off (except for stamp collecting habits), because you may tore the envelope.',
					'Plastic bags, which escape the garbage collection process, often end up in streams, which then lead them to end up in the open ocean. Because they float, and resemble a jellyfish, plastic bags pose significant dangers to marine mammals, such as Turtles, when they enter their digestive track. Because plastic bags cause damage to ocean marine life, litter city streets, and contribute to carbon emissions in their manufacture and shipping, some towns in the United States have begun to ban or restrict the use of plastic bags, usually starting with plastic shopping bags.<br><img src="images/PAPER 5.jpg" width="100" height="100">', 
					'Plastic bottle tops are currently not recyclable, and as with plastic bags they often end up at the bottom of the ocean, and in the stomachs of a variety of animal species that mistake them for food. One albatross that was recently found dead on a Hawaiian island had a stomach full of 119 bottle caps.',
					'At present, the market price of the new plastic is not stable, which is the maximum limitation of the plastic waste recycling industry. The prices of new plastic are often influenced by political and economic factors, and indirectly affect the price of recycled plastic.',
					'At present, the market price of the new plastic is not stable, which is the maximum limitation of the plastic waste recycling industry. The prices of new plastic are often influenced by political and economic factors, and indirectly affect the price of recycled plastic.',
					'At present, the market price of the new plastic is not stable, which is the maximum limitation of the plastic waste recycling industry. The prices of new plastic are often influenced by political and economic factors, and indirectly affect the price of recycled plastic.',
					'At present, the market price of the new plastic is not stable, which is the maximum limitation of the plastic waste recycling industry. The prices of new plastic are often influenced by political and economic factors, and indirectly affect the price of recycled plastic.',
					'A waste converter is a machine used for the treatment and recycling of solid and liquid refuse material. A converter is a self-contained system capable of performing the following functions: pasteurization of organic waste; sterilization of pathogenic or biohazard waste; grinding and pulverization of refuse into unrecognizable output; trash compaction; dehydration.',
					'Some dishonest trader were exposed recycling of waste paper, mixed with carcinogenic chemicals bleaching and processed into napkins in Chengdu, Sichuan. Wholesalers sole those napkins to large quantities of restaurants to. Such napkins are rough and poor-quality. If human use them frequently, those napkins can seriously damage the human body, such as caused by diarrhea, kidney stones, and even affect the intellectual development of children. ',
					'One of the problems of landfills is pollution of the road from dirty wheels on vehicles when they leave the landfill. To reduce this, wheel washing systems are used to clean the wheels as the vehicle exits the landfill. Poisonous leachate can also leak from the landfill contaminating nearby soil and groundwater. Methane gases are flammable and explosive if exposed to heat.',
					'For years of development, there are many environmental protection high-tech enterprises which really possess comprehensive service abilities of systematic design, complete equipment, construction, installation, debugging and management in there countries.',
					'Although the plant ceased operation in 1997, it was not completely demolished then. The site was found to be contaminated with dioxin, furan, asbestos, heavy metals and petroleum hydrocarbons.',
					'Incineration is a waste treatment process that involves the combustion of organic substances contained in waste materials. Incineration and other high temperature waste treatment systems are described as "thermal treatment". Incineration of waste materials converts the waste into ash, flue gas, and heat.',
				    'Junk Retrieving is the collection, transport, processing or disposal, managing and monitoring of waste materials. The term usually relates to materials produced by human activity, and the process is generally undertaken to reduce their effect on health, the environment or aesthetics.',
					'Some organizations do not accept any clothes to the third world citizens for several reasons. One, if clothes are donated, then businesses in the local area lose business. Instead, they are trying to encourage women to have their own sewing business so they can support their families. Second, many of the clothes donated are inappropriate for the strictures of the local communities.'];	
	
	var merge = [[-1], [-1], [-1], [10], [-1], [14, 19, 22], [19], [-1], [-1], [16], [3], [-1], [-1], [-1], [5], [-1], [9], [-1], [-1], [6], [-1], [-1], [5], [-1]]
						

	return {
		getMaxCard : function() {
			return maxCard;
		},
		getMaxRubblish : function() {
			return maxRubblish;
		},
		getMaxFunctional : function() {
			return maxFunctional;
		},
		getMaxCardType : function() {
			return maxCardType;
		},
		getMaxRubblishType : function() {
			return maxRubblishType;
		},
		getMaxFunctionalType : function() {
			return maxFunctionalType;
		},
		getWidth : function() {
			return width;
		},
		getHeight : function() {
			return height;
		},
		getShiftValue : function() {
			return shift;
		},
		getCentralZoneXOffset : function() {
			return centralZoneXOffset;
		},
		getCentralZoneYOffset : function() {
			return centralZoneYOffset;
		},
		getTypeChar : function(Type_Id) {
			return type[Type_Id];
		},
		getCardDescription : function(cardObject) {
			return Description[cardObject.typeId];
		},
		getCardContent : function(cardObject) {
			return Content[cardObject.typeId];
		},
		getMerge : function(cardObject) {
			return merge[cardObject.typeId];
		},
		isFunctionalCard : function(cardObject) {
			if(cardObject.typeId > 23) {
				return true;
			} else {
				return false;
			}
		},
		isConversionCard : function(cardObject) {
			if(cardObject.typeId === 24) {
				return true;
			} else {
				return false;
			}
		},
		isDishonestTraderCard : function(cardObject) {
			if(cardObject.typeId === 25) {
				return true;
			} else {
				return false;
			}
		},
		isExcessLandfillCard : function(cardObject) {
			if(cardObject.typeId === 26) {
				return true;
			} else {
				return false;
			}
		},
		isHighTechnologyCard : function(cardObject) {
			if(cardObject.typeId === 27) {
				return true;
			} else {
				return false;
			}
		},
		isIncineratorFailureCard : function(cardObject) {
			if(cardObject.typeId === 28) {
				return true;
			} else {
				return false;
			}
		},
		isIncineratorCard : function(cardObject) {
			if(cardObject.typeId === 29) {
				return true;
			} else {
				return false;
			}
		},
		isJunkRetrievingCard : function(cardObject) {
			if(cardObject.typeId === 30) {
				return true;
			} else {
				return false;
			}
		},
		isLandfillTransferCard : function(cardObject) {
			if(cardObject.typeId === 31) {
				return true;
			} else {
				return false;
			}
		},
		isMergeCard : function(cardObject) {
			switch(cardObject.typeId) {
			case 6:
			case 19:
			case 5:
			case 22:
			case 14:
			case 3:
			case 9:
			case 16:
			case 10:
				return true;
				break;
			default:
				return false;
				break;
			}
		},
	};
})();

