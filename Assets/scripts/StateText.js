#pragma strict

var fps:int = 0;
var delta:int = 0;
var time: float = 0;

function Start () {
	
}

function Awake () {
	Application.targetFrameRate = 30;
}


function Update () {
	time += Time.deltaTime;
	delta++;
	if (time >= 1.0) {
		fps = delta;
		time = 0.0;
		delta = 0;
	}

	var context:AppContext = AppContext.getInstance();
	if(context.player && context.playData) {
		guiText.text = "FPS:" + fps + " B" + context.playData.floorNumber + " HP " + Mathf.Max(context.player.HP, 0) + "/" + context.player.MHP;
	}
}