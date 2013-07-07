var Speed = 20.0;
function Start () {
	rigidbody.AddForce(
		( transform.forward + transform.right ) * Speed,
		ForceMode.VelocityChange );
}

function Update () {

}