#pragma strict

var mapChipPlayer:GameObject;
var mapChipFloor:GameObject;
var mapChipDownStair:GameObject;
public var chipSize = 0.15;

function Start () {

}

function Update () {
	var context:AppContext = AppContext.getInstance();
	var text = "";
	if( context.map && context.player ) {
 
		var mapPoint = context.getMapPoint(context.player.transform.position);
        var mapHeight = context.map.GetLength(0);
        var mapWidth = context.map.GetLength(1);		
		for (var i = -2; i <= 2; i++) {
			for (var j = -2; j <= 2; j++) {
                var x = mapPoint.x + i;
                var y = mapPoint.y + j;
                if ((y <= 0) || (y >= mapHeight)
                    || (x <= 0) || (x >= mapWidth)
                    || (context.map[y, x] != null)) {
                    continue;
                } 
                if (!context.autoMap[y, x]) {
                	var chip:Vector3 = Vector3(x * chipSize, y * chipSize, 0.5);
                	var chipObj:GameObject = null;
                	if (context.downStairPoint != null
	            	 && (context.downStairPoint.x == x)
	            	 && (context.downStairPoint.y == y)) {
                		chipObj = Instantiate (mapChipDownStair, Vector3(0, 0, 0), Quaternion.identity);
                	} else {
                		chipObj = Instantiate (mapChipFloor, Vector3(0, 0, 0), Quaternion.identity);
                	}
                	chipObj.transform.parent = transform;
                	chipObj.transform.localPosition = chip;
                	
                	context.autoMap[y, x] = chipObj;
                }
			}
        }  
	    mapChipPlayer.transform.localPosition = Vector3(mapPoint.x * chipSize, mapPoint.y * chipSize, 0.5);
	}

}