var target : Transform; 
var targetOffset = Vector3.zero;
var autoMap:GameObject;
function Start () {
	//autoMap.transform.localPosition = Vector3(0, 0, 10);
}

function LateUpdate () {
	if(target){
		transform.rotation = Quaternion.Euler(90,0,0);
		transform.position = target.position + targetOffset + (Vector3.up * (48.0 - target.position.y));
	}
}