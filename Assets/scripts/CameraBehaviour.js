public static var BASE_HEIGHT:float = 40.0;
public static var BASE_ANGLE:float = 20;

var target : Transform; 
var targetOffset = Vector3.zero;
var autoMap:GameObject;

function Start () {
	autoMap.transform.localPosition = Vector3(0, 0, 10);
}

function LateUpdate () {
	if(target){
		var angle2:float = 90 - CameraBehaviour.BASE_ANGLE;
		var tanAngle:float = Mathf.Tan(CameraBehaviour.BASE_ANGLE * Mathf.PI / 180);
		transform.rotation = Quaternion.Euler(angle2,0,0);
		transform.position = target.position + targetOffset + (Vector3.up * CameraBehaviour.BASE_HEIGHT) + (Vector3.back * tanAngle * CameraBehaviour.BASE_HEIGHT);
	}
}