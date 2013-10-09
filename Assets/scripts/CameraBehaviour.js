public static var BASE_HEIGHT:float = 40.0;
public static var BASE_ANGLE_YZ:float = 25;
public static var BASE_ANGLE_XZ:float = 45;

var target : Transform; 
var targetOffset = Vector3.zero;
var autoMap:GameObject;

function Start () {
	autoMap.transform.localPosition = Vector3(0, 0, 10);
}

function LateUpdate () {
	if(target){
		var angleYZ:float = 90 - CameraBehaviour.BASE_ANGLE_YZ;
		var angleXZ:float = CameraBehaviour.BASE_ANGLE_XZ;
		var tanAngleYZ:float = Mathf.Tan(CameraBehaviour.BASE_ANGLE_YZ * Mathf.PI / 180);
		
		var cosAngleXZ:float = Mathf.Sin(CameraBehaviour.BASE_ANGLE_XZ * Mathf.PI / 180);
		var sinAngleXZ:float = Mathf.Cos(CameraBehaviour.BASE_ANGLE_XZ * Mathf.PI / 180);
		
		var radius = tanAngleYZ * CameraBehaviour.BASE_HEIGHT;
		transform.rotation = Quaternion.Euler(angleYZ , angleXZ, 0);
		transform.position = target.position + targetOffset
							 + (Vector3.up * CameraBehaviour.BASE_HEIGHT)
							 + (Vector3.back * radius * sinAngleXZ)
							 + (Vector3.left * radius * cosAngleXZ); 
	}
}