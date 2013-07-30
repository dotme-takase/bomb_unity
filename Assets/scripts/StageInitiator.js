static final var FADE_NONE = 0;
static final var FADE_IN = 1;
static final var FADE_OUT = 2;

var Player:GameObject;
var Enemy1:GameObject;

var Wall:GameObject;
var Pillar:GameObject;
var Floor:GameObject;
var DownStair:GameObject; 
var WoodenBox:GameObject;
var mapChipDownStair:GameObject;


var Sword:GameObject;
var Shield:GameObject;
var Thrown:GameObject;
var OtherItem:GameObject;

var Effect:GameObject;

var attack:AudioClip;
var bomb:AudioClip;
var defeat:AudioClip;
var downstair:AudioClip;
var heal:AudioClip;
var hit:AudioClip;
var parried:AudioClip;
var pickup:AudioClip;
 
var EnemyBody1:Material;
var EnemyFoot1:Material; 
var EnemyBody2:Material;
var EnemyFoot2:Material; 
var EnemyBody3:Material;
var EnemyFoot3:Material; 
var EnemyBody4:Material;
var EnemyFoot4:Material; 
var EnemyBody5:Material;
var EnemyFoot5:Material;
var EnemyBody6:Material;
var EnemyFoot6:Material;
var EnemyBody7:Material;
var EnemyFoot7:Material;
var EnemyBody8:Material;
var EnemyFoot8:Material;
var EnemyBody9:Material;
var EnemyFoot9:Material;  
var EnemyBody1_128:Material;
var EnemyFoot1_128:Material;  
var EnemyBody2_128:Material;
var EnemyFoot2_128:Material;  
 
var context = AppContext.getInstance();
var fadeCallback = function(){};
var fadeCountMax:float = 0;
var fadeCount:float = 0;
var fadeMode = FADE_NONE;
var blackTexture:Texture2D = null;

function OnGUI () { 
	if (!blackTexture) { 
		blackTexture=new Texture2D(32, 32, TextureFormat.RGB24, false);
		blackTexture.ReadPixels(Rect(0, 0, 32, 32), 0, 0, false);
		blackTexture.SetPixel(0, 0, Color.white);
		blackTexture.Apply();
	}
	
	if(fadeMode == FADE_IN) {
		fadeCount -= Time.deltaTime;
		GUI.color = new Color(0, 0, 0, fadeCount / fadeCountMax);
		GUI.DrawTexture( new Rect(0, 0, Screen.width, Screen.height ), blackTexture );   
		if(fadeCount <= 0.0) { 
			fadeMode = FADE_NONE;
			if (fadeCallback) { 
				fadeCallback();
				fadeCallback = function(){};
			}
		}
	} else if(fadeMode == FADE_OUT) {
		fadeCount -= Time.deltaTime;
		GUI.color = new Color(0, 0, 0, (fadeCountMax - fadeCount) / fadeCountMax);
		GUI.DrawTexture( new Rect(0, 0, Screen.width, Screen.height ), blackTexture );   
		if(fadeCount <= 0.0) { 
			if (fadeCallback) { 
				fadeCallback();
				fadeCallback = function(){};
			}
		}
	}
}

static function fadeIn(duration, callback){ 
	var initiator = GameObject.Find("Initialize").GetComponent(StageInitiator);
	initiator.fadeCallback = callback;
	initiator.fadeCountMax = initiator.fadeCount = duration;
	initiator.fadeMode = FADE_IN;
}

static function fadeOut(duration, callback){ 
	var initiator = GameObject.Find("Initialize").GetComponent(StageInitiator);
	initiator.fadeCallback = callback;
	initiator.fadeCountMax = initiator.fadeCount = duration;
	initiator.fadeMode = FADE_OUT;
}

function Start () { 
	StageInitiator.fadeIn(1, null);
	loadMasterData();
	var generator = new MapGenerator(); 
	var _floorNumber = 1; 
	if(context.playData) {
		_floorNumber = context.playData.floorNumber; 
	}
	var map:String[,] = generator.generate(2 + Mathf.RoundToInt(Random.value * Mathf.Min(5, _floorNumber / 5))
											, 2 + Mathf.RoundToInt(Random.value * Mathf.Min(5, _floorNumber / 5))); 
	var _floorList = new Array();
	var _floorObjectList = new Array();
	context.map = map; 
	context.autoMap = new GameObject[map.GetLength(0), map.GetLength(1)];
	var tileSize:float = context.tileSize;
	var tileDepth:float = context.tileDepth;

	var wallOffset:float = (tileSize / 2) - (tileDepth / 2); 
	var tempX = 0;
	var tempY = 0; 
	
	for (var x=0; x < map.GetLength(1); x++) {
	    for (var y=0; y < map.GetLength(0); y++) { 
	    	context.autoMap[y, x] = null;
	        var chip:String = map[y, x]; 
	        if (chip == null) {  
	        	tempX = x * tileSize; 
	        	tempY = y * tileSize;
	        	var floorObject:GameObject = Instantiate (Floor, Vector3(x * tileSize, -0.5, y * tileSize)
	        		, Quaternion.identity);
	        	if ( Mathf.FloorToInt(Random.value * 100)  < 10 ) {
	        		var boxObject:GameObject = Instantiate (WoodenBox, Vector3(x * tileSize, 3.5, y * tileSize)
	        		, Quaternion.identity);
	        	} else {
		        	_floorList.push(Vector2(x, y));
		        	_floorObjectList.push(floorObject);
	        	}
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
		        
		        if (chip == "w1_tl1") { 
		        	Instantiate (Pillar, Vector3(x * tileSize + wallOffset, 5, y * tileSize + wallOffset)
			        		, Quaternion.Euler(0, 0, 0));
		        } 
		        if (chip == "w1_tr1") { 
		        	Instantiate (Pillar, Vector3(x * tileSize - wallOffset, 5, y * tileSize + wallOffset)
			        		, Quaternion.Euler(0, 0, 0));
		        }
		        if (chip == "w1_bl1") { 
		        	Instantiate (Pillar, Vector3(x * tileSize + wallOffset, 5, y * tileSize - wallOffset)
			        		, Quaternion.Euler(0, 0, 0));
		        }
		        if (chip == "w1_br1") { 
		        	Instantiate (Pillar, Vector3(x * tileSize - wallOffset, 5, y * tileSize - wallOffset)
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
	context.floorObjectList = _floorObjectList.ToBuiltin(GameObject);
	
    var playerInstance:GameObject = Instantiate (Player, Vector3(tempX, 0.0, tempY), Quaternion.identity);
    var player = playerInstance.GetComponent(PlayerBehaviour);
    context.warpToRandom(player);
    var camera:CameraBehaviour = Camera.main.GetComponent(CameraBehaviour);
    camera.target = playerInstance.GetComponent(PlayerBehaviour).transform;
     
	var floorBonus = Mathf.FloorToInt(_floorNumber / 3);     
    var enemyNum:int = Mathf.RoundToInt(Mathf.Min(20, (_floorNumber + 1) / 2 + Random.value * _floorNumber));
    for(var e0 =0; e0 < enemyNum; e0++) {
    	var enemyInstance = Instantiate (Enemy1, Vector3(tempX, 0.0, tempY), Quaternion.identity);
    	var enemy = enemyInstance.GetComponent(Enemy1Behaviour);
    	context.warpToRandom(enemy);
    	
    	var enemyIndex = Mathf.FloorToInt(Random.value * 2.5) + Mathf.Min(floorBonus, enemyData.Length);
    	var enemyData:Hashtable = enemyData[enemyIndex]; 
    	createEnemy(enemyData, enemy);
    }
    createDownStair();
    
    var autoMap:GameObject = GameObject.Find("autoMap");
    var autoMapScript:AutoMap = autoMap.GetComponent("AutoMap");
    if(autoMap) {
    	var pos = Camera.main.ScreenToWorldPoint(Vector3(Screen.width * 0.5, Screen.height * 0.9, 10));
    	autoMap.transform.position = pos - Vector3(autoMapScript.chipSize * map.GetLength(0), autoMapScript.chipSize * map.GetLength(1), 0);
    }
    
    context.isLoading = false;
}

public function createEnemy(data:Hashtable, enemy:BaseCharacter) {
	if (data.ContainsKey("body")) { 
    	var body = enemy.GetComponentInChildren(BodyAnimation);
    	var matBody:Material = data["body"];
		body.renderer.material = matBody;
    } 
    
    if (data.ContainsKey("foot")) { 
    	var foot = enemy.GetComponentInChildren(LegAnimation);
		foot.renderer.material = data["foot"];
    } 
    
    if (data.ContainsKey("HP")) { 
    	enemy.MHP = enemy.HP = data["HP"];
    } 
    
    if (data.ContainsKey("speed")) { 
    	enemy.speed = data["speed"];
    } 
    
    if (data.ContainsKey("scale")) { 
    	enemy.scale = data["scale"];
    	enemy.transform.localScale = Vector3(enemy.transform.localScale.x * enemy.scale, enemy.transform.localScale.y, enemy.transform.localScale.z * enemy.scale); 
	    enemy.transform.position += Vector3.up * enemy.transform.position.y * enemy.scale;
    }
    
    if (data.ContainsKey("rightArm") && (data["rightArm"] != null)) { 
    	enemy.equipRight(data["rightArm"]);
    } 
    
    if (data.ContainsKey("leftArm") && (data["leftArm"] != null)) { 
    	enemy.equipLeft(data["leftArm"]);
    } 
    
    if (data.ContainsKey("dropItems") && (data["dropItems"] != null)) { 
    	enemy.dropList = data["dropItems"]; 
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
	} else if (forEquip && (type == BaseItem.TYPE_BOMB
               || type == BaseItem.TYPE_BOMB_REMOTE
               || type == BaseItem.TYPE_BOMB_TIMER)) {
		object = Instantiate (Thrown, Vector3(x, 0.0, y), Quaternion.identity);
	} else {  
		object = Instantiate (OtherItem, Vector3(x, 0.0, y), Quaternion.identity);
	}
	
	if (object != null) {
		item = object.GetComponent(BaseItem);
		item.initialize(options);
		var offsetX:float = 0.0;
		if (type == BaseItem.TYPE_SWORD) { 
			offsetX = item.frame / BaseItem.SWORDS_NUM_X;
			item.renderer.material.SetTextureOffset ("_MainTex", Vector2(offsetX, 0));
		} else if (type == BaseItem.TYPE_SHIELD) { 
			var offsetY:float = 0;
			if (forEquip == true) {
				offsetY = 0.5;
			} 
			offsetX = item.frame / BaseItem.SHIELDS_NUM_X;
			item.renderer.material.SetTextureOffset ("_MainTex", Vector2(offsetX, offsetY)); 
		} else { 
			offsetX = item.frame / BaseItem.ITEMS_NUM_X; 
			offsetY = (item.frame / BaseItem.ITEMS_NUM_X) / BaseItem.ITEMS_NUM_Y;
			item.renderer.material.SetTextureOffset ("_MainTex", Vector2(offsetX, offsetY));
		}
		return item;
	}
	return null; 
}  

public function createItemByName(x:float, y:float, itemName:String, forEquip:boolean) {   
	if (StageInitiator.ITEMS.ContainsKey(itemName)) { 
		var itemOption:Hashtable = StageInitiator.ITEMS[itemName];  
		var item:BaseItem = createItem(x, y, forEquip, itemOption);  
		item.itemName = itemName;
		return item; 
	}
	return null;
}

public function addEffectDelegate(x:float, y:float, name: String){
	var effectInstance = Instantiate (Effect, Vector3(x, 0.5, y), Quaternion.identity);
    var effect = effectInstance.GetComponent(EffectAnimation);
    effect.initialize(name);
    return effect;
}

public static function addEffect(x:float, y:float, name: String){
	var initiator = GameObject.Find("Initialize").GetComponent(StageInitiator);
	return initiator.addEffectDelegate(x, y, name);
}

public function playSoundDelegate(name: String){
	var sound:AudioClip = null;
	if( name == "attack"){
		sound = attack;
	} else if( name == "bomb"){
		sound = bomb;
	} else if( name == "defeat"){
		sound = defeat;
	} else if( name == "downstair"){
		sound = downstair;
	} else if( name == "heal"){
		sound = heal;
	} else if( name == "hit"){
		sound = hit;
	} else if( name == "parried"){
		sound = parried;
	} else if( name == "pickup"){
		sound = pickup;
	}
	if(sound != null){
		audio.PlayOneShot(sound, 1.0);
	}
}

public static function playSound(name: String){
	var initiator = GameObject.Find("Initialize").GetComponent(StageInitiator);
	initiator.playSoundDelegate(name);
}

function createDownStair(){
	var context:AppContext = AppContext.getInstance(); 
	if(context.floorObjectList && context.floorObjectList.Length > 0) {
    	var dice = Mathf.FloorToInt(Random.value * (context.floorObjectList.Length - 1));
    	var obj = context.floorObjectList[dice]; 
    	context.downStairPoint = context.floorList[dice]; 
    	
    	var pos:Vector3 = obj.transform.position;
    	Instantiate (DownStair, pos, Quaternion.identity);
    	Destroy(obj);   
    	
    	var boxObject:GameObject = Instantiate (WoodenBox, Vector3(pos.x, 3.5, pos.z)
	        		, Quaternion.identity);
    	 
    	var oldChipObj = context.autoMap[context.downStairPoint.y, context.downStairPoint.x];
    	if (oldChipObj) {
    		var newChipObj = Instantiate (mapChipDownStair, oldChipObj.transform.position, Quaternion.identity);
    		context.autoMap[context.downStairPoint.y, context.downStairPoint.x] = newChipObj; 
    		StageInitiator.playSound("downstair");
    		Destroy(oldChipObj);  
    	}
    }
}

public static var ITEMS = {
    "shortSword": {
        "type": BaseItem.TYPE_SWORD,
        "range": 20,
        "bonusPoint": 4,
        "speed": 1,
        "frame": 0
    },
    "longSword": {
        "type": BaseItem.TYPE_SWORD,
        "range": 28,
        "bonusPoint": 8,
        "speed": 0,
        "frame": 1
    },
    "fasterShortSword": {
        "type": BaseItem.TYPE_SWORD,
        "range": 20,
        "bonusPoint": 5,
        "speed": 2,
        "frame": 2
    },
    "handAxe": {
        "type": BaseItem.TYPE_SWORD,
        "range": 22,
        "bonusPoint": 16,
        "speed": -2,
        "frame": 3
    },
    "katana": {
        "type": BaseItem.TYPE_SWORD,
        "range": 28,
        "bonusPoint": 10,
        "speed": 1,
        "frame": 4
    },
    "ryuyotou": {
        "type": BaseItem.TYPE_SWORD,
        "range": 24,
        "bonusPoint": 13,
        "speed": -1,
        "frame": 5
    },
    "broadSword": {
        "type": BaseItem.TYPE_SWORD,
        "range": 32,
        "bonusPoint": 48,
        "speed": 0,
        "frame": 6
    },
    "woodenShield": {
        "type": BaseItem.TYPE_SHIELD,
        "HP": 30,
        "bonusPoint": 4,
        "frame": 0
    },
    "bronzeShield": {
        "type": BaseItem.TYPE_SHIELD,
        "HP": 60,
        "bonusPoint": 5,
        "frame": 1
    },
    "ironShield": {
        "type": BaseItem.TYPE_SHIELD,
        "HP": 120,
        "bonusPoint": 6,
        "frame": 2
    },
    "blueShield": {
        "type": BaseItem.TYPE_SHIELD,
        "HP": 80,
        "bonusPoint": 12,
        "frame": 3
    },
    "redShield": {
    	"type": BaseItem.TYPE_SHIELD,
        "HP": 90,
        "bonusPoint": 16,
        "frame": 4
    },
    "aidBox": {
        "type": BaseItem.TYPE_MISC,
        "onUse": function (character:BaseCharacter, target:BaseCharacter) { 
        	var context:AppContext = AppContext.getInstance();
            var aid = 10;
            StageInitiator.addEffect(character.x(), character.y(),
                'heal');
            StageInitiator.playSound("heal");
            character.HP += Mathf.Min(character.MHP - character.HP,
                aid);
        },
        "frame": 16
    },
    "thrownPlus": {
        "type": BaseItem.TYPE_MISC,
        "onUse": function (character:BaseCharacter, target:BaseCharacter) { 
            StageInitiator.playSound("pickup");
            if(character.rightArm && character.rightArm.isThrowWeapon()){ 
            	character.itemThrownMaxCount = Mathf.Min (10, character.itemThrownMaxCount + 1);
            }
        },
        "frame": 0
    },
    "grenade": {
        "type": BaseItem.TYPE_BOMB,
        "range2d": [0, 1],
        "bonusPoint": 12,
        "speed": 24,
        "frame": 1
    },
    "crossGrenade": {
        "type": BaseItem.TYPE_BOMB,
        "range2d": [64,4],
        "bonusPoint": 12,
        "speed": 24,
        "frame": 3
    },
    "grenade2x": {
        "type": BaseItem.TYPE_BOMB,
        "range2d": [64,9],
        "bonusPoint": 24,
        "speed": 24,
        "frame": 5
    },
    "crossGrenade2x": {
        "type": BaseItem.TYPE_BOMB,
        "range2d": [128,4],
        "bonusPoint": 20,
        "speed": 24,
        "frame": 7
    },
    "bombTimer": {
        "type": BaseItem.TYPE_BOMB_TIMER,
        "range2d": [32,6],
        "bonusPoint": 12,
        "speed": 24,
        "leftTime": 20,
        "frame": 2
    },
    "crossBombTimer": {
        "type": BaseItem.TYPE_BOMB_TIMER,
        "range2d": [64,4],
        "bonusPoint": 16,
        "speed": 32,
        "leftTime": 20,
        "frame": 4
    },
    "bombTimer2x": {
        "type": BaseItem.TYPE_BOMB_TIMER,
        "range2d": [96,9],
        "bonusPoint": 28,
        "speed": 28,
        "leftTime": 20,
        "frame": 6
    },
    "crossBombTimer2x": {
        "type": BaseItem.TYPE_BOMB_TIMER,
        "range2d": [160,4],
        "bonusPoint": 24,
        "speed": 42,
        "leftTime": 20,
        "frame": 8
    }
};

var enemyData:Hashtable[] = null;

function loadMasterData(){
	enemyData = [
	    {
	        'body': EnemyBody1,
	        'foot': EnemyFoot1,
	        'name': 'Militia',
	        'HP': 10,
	        'speed': 5,
	        'scale': 1.0,
	        'rightArm': 'grenade',
	        'leftArm': null,
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody1,
	        'foot': EnemyFoot1,
	        'name': 'Militia',
	        'HP': 10,
	        'speed': 5,
	        'scale': 1.0,
	        'rightArm': 'grenade',
	        'leftArm': 'woodenShield',
	       	'dropItems': { 
	       			'grenade':3,
	       			'woodenShield': 1,
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody1,
	        'foot': EnemyFoot1,
	        'name': 'Militia',
	        'HP': 10,
	        'speed': 5,
	        'scale': 1.0,
	        'rightArm': 'bombTimer',
	        'leftArm': 'woodenShield',
	       	'dropItems': {
	       			'bombTimer': 8,
	                'aidBox': 1
	        }
	    },
	    {
	        'body': EnemyBody2,
	        'foot': EnemyFoot2,
	        'name': 'SilverGuard',
	        'HP': 30,
	        'speed': 4,
	        'scale': 1.0,
	        'rightArm': 'grenade',
	        'leftArm': null,
	       	'dropItems': {
	       			'crossBombTimer':5,
	                'thrownPlus': 3
	        }
	    },
	    {
	        'body': EnemyBody1,
	        'foot': EnemyFoot1,
	        'name': 'Militia',
	        'HP': 10,
	        'speed': 5,
	        'scale': 1.0,
	        'rightArm': 'crossGrenade',
	        'leftArm': null,
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody1,
	        'foot': EnemyFoot1,
	        'name': 'Militia',
	        'HP': 10,
	        'speed': 5,
	        'scale': 1.0,
	        'rightArm': 'crossBombTimer',
	        'leftArm': null,
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody3,
	        'foot': EnemyFoot3,
	        'name': 'Musha',
	        'HP': 20,
	        'speed': 6,
	        'scale': 1.2,
	        'rightArm': 'katana',
	        'leftArm': null,
	       	'dropItems': {
	       			'katana': 1,
	       			'thrownPlus': 3,
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody1,
	        'foot': EnemyFoot1,
	        'name': 'Militia',
	        'HP': 25,
	        'speed': 6,
	        'scale': 1.0,
	        'rightArm': 'bombTimer2x',
	        'leftArm': 'ironShield',
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody1,
	        'foot': EnemyFoot1,
	        'name': 'Militia',
	        'HP': 25,
	        'speed': 6,
	        'scale': 1.0,
	        'rightArm': 'crossGrenade',
	        'leftArm': 'ironShield',
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody4,
	        'foot': EnemyFoot4,
	        'name': 'MilitiaHead',
	        'HP': 20,
	        'speed': 6,
	        'scale': 1.05,
	        'rightArm': 'grenade2x',
	        'leftArm': null,
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody5,
	        'foot': EnemyFoot5,
	        'name': 'Ninja',
	        'HP': 20,
	        'speed': 8,
	        'scale': 1,
	        'rightArm': 'fasterShortSword',
	        'leftArm': 'redShield',
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody5,
	        'foot': EnemyFoot5,
	        'name': 'Ninja',
	        'HP': 20,
	        'speed': 8,
	        'scale': 1,
	        'rightArm': 'katana',
	        'leftArm': 'redShield',
	       	'dropItems': {
	                'aidBox': 5
	        }
	    }, 
	    {
	        'body': EnemyBody2,
	        'foot': EnemyFoot2,
	        'name': 'SilverGuard',
	        'HP': 50,
	        'speed': 4,
	        'scale': 1.1,
	        'rightArm': 'grenade',
	        'leftArm': 'ironShield',
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody6,
	        'foot': EnemyFoot6,
	        'name': 'Barbarian',
	        'HP': 30,
	        'speed': 5,
	        'scale': 1.1,
	        'rightArm': 'handAxe',
	        'leftArm': 'ironShield',
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody7,
	        'foot': EnemyFoot7,
	        'name': 'TannedBarbarian',
	        'HP': 40,
	        'speed': 6,
	        'scale': 1.15,
	        'rightArm': 'crossGrenade',
	        'leftArm': 'ironShield',
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody8,
	        'foot': EnemyFoot8,
	        'name': 'BlueGuard',
	        'HP': 60,
	        'speed': 5,
	        'scale': 1.2,
	        'rightArm': 'grenade2x',
	        'leftArm': 'blueShield',
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody1_128,
	        'foot': EnemyFoot1_128,
	        'name': 'Spider',
	        'HP': 80,
	        'speed': 6,
	        'scale': 1.4,
	        'rightArm': 'crossBombTimer2x',
	        'leftArm': null,
	       	'dropItems': {
	                'aidBox': 5
	        }
	    },
	    {
	        'body': EnemyBody2_128,
	        'foot': EnemyFoot2_128,
	        'name': 'Minotaur',
	        'HP': 255,
	        'speed': 5,
	        'scale': 1.5,
	        'rightArm': 'broadSword',
	        'leftArm': null,
	       	'dropItems': {
	                'aidBox': 5
	        }
	    }
	];
}