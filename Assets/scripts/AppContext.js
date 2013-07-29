class PlayData {
	var HP = 0;
	var MHP = 0;
	var itemThrownMaxCount = 1;
	var rightArmName = null;
	var leftArmName = null;
	var floorNumber = 0;
	var lastEnemy:String = "";
}

class AppContext {	
	static var tileSize:float = 10;
	static var tileDepth:float = 1;
	static var instance: AppContext = null;	
	static var isLoading = true;
	static function getInstance() {
		if (instance == null) {
			instance = new AppContext();
		}
		return instance;
	}
	static var playData:PlayData = null;
	
	function initializePlayData(){
		if(!playData || playData.floorNumber <= 0) {
			playData = new PlayData();
			playData.floorNumber = 1;
			if (player) {
				player.equipRight("bombTimer");
				player.equipLeft("bronzeShield");
				player.onModifyData();
			}
		} else if(player){
			player.HP = playData.HP;
			player.MHP = playData.MHP;
			if(playData.rightArmName) {
				player.equipRight(playData.rightArmName);
			}
			if(playData.leftArmName) {
				player.equipLeft(playData.leftArmName);
			}
			player.itemThrownMaxCount = playData.itemThrownMaxCount;
		}
	}
	
	public var map:String[,];
	public var floorList:Vector2[];
	public var downStairPoint:Vector2;
	public var autoMap:GameObject[,];
	public var floorObjectList:GameObject[];
	public var dropItems:BaseItem[];
	public var heavyTasks:String[] = [];
	public var player:BaseCharacter = null;
	
	public var characters:BaseCharacter[] = [];
	function removeCharacter(o:BaseCharacter) {
        var self = this.characters;
        var array = new Array(this.characters);
        for (var k = 0; k < array.length; k++) {
        	if(o == self[k]) {
	       		array.RemoveAt(k);
	       	}
        }
        this.characters = array.ToBuiltin(BaseCharacter);
    }

    function addCharacter(o:BaseCharacter) {
        var array:Array;
        if (this.characters != null) {
        	array = new Array(this.characters);
        } else {
        	array = new Array();
        }
        array.push(o);
        this.characters = array.ToBuiltin(BaseCharacter);
    }
	
	function warpToRandom(o:BaseCharacter) {
        var dice = Mathf.FloorToInt(Random.value * (floorList.Length - 1));
        var v0 = floorList[dice];
        o.transform.position = Vector3(v0.x * tileSize, 2.0, v0.y * tileSize);
    }
	
	static function getMapPoint(obj:Vector3) {
        return Point2D(Mathf.RoundToInt(obj.x / tileSize), Mathf.RoundToInt(obj.z / tileSize));
    }
    
    static function S4() {
      	return (Mathf.CeilToInt((1 + Random.value) * 0x10000)).ToString("X").Substring(1);
    }
    
    static function uuid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    
    static function fixAngle(theta:float) {
    	var result = theta % 360;
    	if( result > 180 ){
    		result -= 360;
    	}
    	return result;
    }
}