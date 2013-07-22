#pragma strict

function Start () {
	
}

function Update () {
	var context:AppContext = AppContext.getInstance();
	if(context.player && context.playData) {
		guiText.text = "B" + context.playData.floorNumber + " HP " + Mathf.Max(context.player.HP, 0) + "/" + context.player.MHP;
	}
}