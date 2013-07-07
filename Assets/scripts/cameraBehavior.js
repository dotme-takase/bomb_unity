var target : Transform; 
var targetOffset = Vector3.zero;
function Start () {
}

function LateUpdate () {
	if(target){
		transform.rotation = Quaternion.Euler(90,0,0);
		transform.position = target.position + targetOffset + (Vector3.up * 20);
	}
}