class AppContext {	
	static var instance: AppContext = null;	
	static function getInstance() {
		if (instance == null) {
			instance = new AppContext();
		}
		return instance;
	}
	
	public var map:String[,];
	public var dropItems:BaseItem[];
	public var heavyTasks:String[] = [];
	public var tileSize = 4;
	
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
        var array = new Array(this.characters);
        array.push(o);
        this.characters = array.ToBuiltin(BaseCharacter);
    }
	
	function addEffect(x:float, y:float, name: String){
		//ToDo
	}
	
	function playSound(name: String) {
		//ToDo
	}
	
	function warpToRandom(o:BaseCharacter) {
        //ToDo
    }
	
	static function getMapPoint(obj:Vector3) {
        return Point2D(Mathf.FloorToInt(obj.x / 4), Mathf.FloorToInt(obj.z / 4));
    }
    
    static function S4() {
      	return (Mathf.CeilToInt((1 + Random.value) * 0x10000)).ToString("X").Substring(1);
    }
    
    static function uuid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}