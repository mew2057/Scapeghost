var app = app || {};

//=================================================

app.Actor = function () 
{
	this.pos     = { "x":0.0, "y":0.0 };
	this.impulse = { "x":0.0, "y":0.0 }; // + right, - left // - up, + down	
	this.pVect;
}
	
app.Actor.prototype = 
{
	
}
