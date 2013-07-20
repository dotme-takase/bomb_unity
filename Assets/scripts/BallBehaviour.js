var Speed = 20.0;
function Start () {
}

function Update () {
	var cursor:Vector3;
	if(Input.touches.Length > 0){
		    var touch = Input.touches[0];
		    cursor = touch.position;

		} else {
			cursor = Input.mousePosition; 
		} 
		cursor.z = Camera.main.transform.position.y;
		transform.position = Camera.main.ScreenToWorldPoint(cursor);
		//transform.position.y = 5;
}