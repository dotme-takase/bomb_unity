var Player:GameObject;
var Wall:GameObject;
var Floor:GameObject;
var DownStair:GameObject;
var context = AppContext.getInstance();
var tileSize:float = 10;
var tileDepth:float = 1; 

function Start () {
	var generator = new MapGenerator();
	var map:String[,] = generator.generate(10, 10); 
	
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
	
    var playerInstance:GameObject = Instantiate (Player, Vector3(tempX, 1.0, tempY), Quaternion.identity);
    var camera:CameraBehaviour = Camera.main.GetComponent(CameraBehaviour);
    camera.target = playerInstance.GetComponent(PlayerBehaviour).transform;
}
