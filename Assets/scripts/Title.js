#pragma strict

function Start () {
	if(Input.multiTouchEnabled){
		guiText.text = "Tap screen to start";
	} else {
		guiText.text = "Click to start";
	}
}

function Update () {
	var click = false;
	if (Input.GetMouseButtonUp(0)) {
		click = true;
	} else if(Input.touches.Length > 0){
		var touch = Input.touches[0];
		if (touch.phase == TouchPhase.Ended) {
			click = true;
		}
	}
	
	guiText.material.SetColor("_Color", Vector4(1, 1, 1, 0.5 + 0.5 * Mathf.Sin(Time.time)));
	
	if(click) {
		Application.LoadLevel('dungeon');
	}
}