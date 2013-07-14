var Player:GameObject;
var Enemy1:GameObject;

var Wall:GameObject;
var Floor:GameObject;
var DownStair:GameObject;

var Sword:GameObject;
var Shield:GameObject;

var context = AppContext.getInstance();
 

function Start () {
	var generator = new MapGenerator();
	var map:String[,] = generator.generate(2, 2); 
	var _floorList = new Array();
	context.map = map;
	var tileSize:float = context.tileSize;
	var tileDepth:float = context.tileDepth;

	var wallOffset:float = (tileSize / 2) - (tileDepth / 2); 
	var tempX = 0;
	var tempY = 0; 
	
	for (var x=0; x < map.GetLength(1); x++) {
	    for (var y=0; y < map.GetLength(0); y++) {
	        var chip:String = map[y, x]; 
	        if (chip == null) {  
	        	tempX = x * tileSize; 
	        	tempY = y * tileSize;
	        	Instantiate (Floor, Vector3(x * tileSize, -0.5, y * tileSize)
	        		, Quaternion.identity);
	        		
	        	_floorList.push(Vector2(x, y));
	        } else {
		        if ((chip == "w1_t1") || (chip == "w1_tr2") || (chip == "w1_tl2")) { 
		        	Instantiate (Wall, Vector3(x * tileSize, 5, y * tileSize + wallOffset)
		        		, Quaternion.Euler(0, 0, 0));
		        } 
		        if ((chip == "w1_l1") || (chip == "w1_bl2") || (chip == "w1_tl2")) { 
		        	Instantiate (Wall, Vector3(x * tileSize + wallOffset, 5, y * tileSize)
			        		, Quaternion.Euler(0, 90, 0));
		        } 
		        if ((chip == "w1_r1") || (chip == "w1_br2") || (chip == "w1_tr2")) { 
			        Instantiate (Wall, Vector3(x * tileSize - wallOffset, 5, y * tileSize)
				        		, Quaternion.Euler(0, 90, 0));
		        } 
		        if ((chip == "w1_b1") || (chip == "w1_br2") || (chip == "w1_bl2")) { 
			        Instantiate (Wall, Vector3(x * tileSize, 5, y * tileSize - wallOffset)
			        		, Quaternion.Euler(0, 0, 0));
		        } 
		        if (chip == "s1") { 
		        	Instantiate (DownStair, Vector3(x * tileSize, -0.5, y * tileSize)
		        			, Quaternion.identity);
		        }
	        }
	    }
	}
	context.floorList = _floorList.ToBuiltin(Vector2);
	
    var playerInstance:GameObject = Instantiate (Player, Vector3(tempX, 2.0, tempY), Quaternion.identity);
    var camera:CameraBehaviour = Camera.main.GetComponent(CameraBehaviour);
    camera.target = playerInstance.GetComponent(PlayerBehaviour).transform;
    
    for(var e0 =0; e0 < 2; e0++) {
    	var enemyInstance = Instantiate (Enemy1, Vector3(tempX, 20, tempY), Quaternion.identity);
    	context.warpToRandom(enemyInstance.GetComponent(Enemy1Behaviour));
    }
}

public function createItem(x:float, y:float, forEquip:boolean, options:Hashtable) {
	var type:String = options["type"];
	var object:GameObject = null;
	var item:BaseItem = null;
	if (type == BaseItem.TYPE_SWORD) {
		object = Instantiate (Sword, Vector3(x, 0.0, y), Quaternion.identity);
		
	} else if (type == BaseItem.TYPE_SHIELD) {
		object = Instantiate (Shield, Vector3(x, 0.0, y), Quaternion.identity);
	}
	
	if (object != null) {
		item = object.GetComponent(BaseItem);
		item.initialize(options);
		if (type == BaseItem.TYPE_SWORD) { 
			item.renderer.material.SetTextureOffset ("_MainTex", Vector2(item.frame / BaseItem.SWORDS_NUM_X, 0));
		} else if (type == BaseItem.TYPE_SHIELD) { 
			var offsetY:float = 0;
			if (forEquip == true) {
				offsetY = 0.5;
			} 
			item.renderer.material.SetTextureOffset ("_MainTex", Vector2(item.frame / BaseItem.SHIELDS_NUM_X, offsetY)); 
		}	 
		return item;
	}
	return null; 
}  

public function createItemByName(x:float, y:float, itemName:String, forEquip:boolean) {   
	if (StageInitiator.ITEMS.ContainsKey(itemName)) { 
		var itemOption:Hashtable = StageInitiator.ITEMS[itemName];  
		var item:BaseItem = createItem(x, y, forEquip, itemOption);  
		item.itemName = name;
		return item; 
	}
	return null;
}

public static var ITEMS = {
    "shortSword": {
        "type": BaseItem.TYPE_SWORD,
        "range": 20,
        "bonusPoint": 4,
        "speed": 1
    },
    "longSword": {
        "type": BaseItem.TYPE_SWORD,
        "range": 28,
        "bonusPoint": 8,
        "speed": 0
    },
    "fasterShortSword": {
        "type": BaseItem.TYPE_SWORD,
        "range": 20,
        "bonusPoint": 5,
        "speed": 2
    },
    "handAxe": {
        "type": BaseItem.TYPE_SWORD,
        "range": 22,
        "bonusPoint": 16,
        "speed": -2
    },
    "katana": {
        "type": BaseItem.TYPE_SWORD,
        "range": 28,
        "bonusPoint": 10,
        "speed": 1
    },
    "ryuyotou": {
        "type": BaseItem.TYPE_SWORD,
        "range": 24,
        "bonusPoint": 13,
        "speed": -1
    },
    "broadSword": {
        "type": BaseItem.TYPE_SWORD,
        "range": 32,
        "bonusPoint": 12,
        "speed": 0
    },
    "woodenShield": {
        "type": BaseItem.TYPE_SHIELD,
        "HP": 30,
        "bonusPoint": 4
    },
    "bronzeShield": {
        "type": BaseItem.TYPE_SHIELD,
        "HP": 60,
        "bonusPoint": 5
    },
    "ironShield": {
        "type": BaseItem.TYPE_SHIELD,
        "HP": 120,
        "bonusPoint": 6
    },
    "blueShield": {
        "type": BaseItem.TYPE_SHIELD,
        "HP": 80,
        "bonusPoint": 12
    },
    "redShield": {
    	"type": BaseItem.TYPE_SHIELD,
        "HP": 90,
        "bonusPoint": 16
    },
    "aidBox": {
        "type": BaseItem.TYPE_MISC,
        "onUse": function (character:BaseCharacter, target:BaseCharacter) { 
        	var context:AppContext = AppContext.getInstance();
            var aid = 10;
            context.addEffect(character.x(), character.y(),
                'heal');
            context.playSound("heal");
            character.HP += Mathf.Min(100 - character.HP,
                aid);
        }
    },
    "grenade": {
        "type": BaseItem.TYPE_BOMB,
        "range2d": "0x1",
        "bonusPoint": 12,
        "speed": 24
    },
    "crossGrenade": {
        "type": BaseItem.TYPE_BOMB,
        "range2d": "64x4",
        "bonusPoint": 12,
        "speed": 24
    },
    "grenade2x": {
        "type": BaseItem.TYPE_BOMB,
        "range2d": "64x9",
        "bonusPoint": 24,
        "speed": 24
    },
    "crossGrenade2x": {
        "type": BaseItem.TYPE_BOMB,
        "range2d": "128x4",
        "bonusPoint": 20,
        "speed": 24
    },
    "bombTimer": {
        "type": BaseItem.TYPE_BOMB_TIMER,
        "range2d": "32x6",
        "bonusPoint": 12,
        "speed": 24,
        "leftTime": 20
    },
    "crossBombTimer": {
        "type": BaseItem.TYPE_BOMB_TIMER,
        "range2d": "64x4",
        "bonusPoint": 16,
        "speed": 24,
        "leftTime": 20
    },
    "bombTimer2x": {
        "type": BaseItem.TYPE_BOMB_TIMER,
        "range2d": "96x9",
        "bonusPoint": 28,
        "speed": 24,
        "leftTime": 20
    },
    "crossBombTimer2x": {
        "type": BaseItem.TYPE_BOMB_TIMER,
        "range2d": "160x4",
        "bonusPoint": 24,
        "speed": 24,
        "leftTime": 20
    }
};