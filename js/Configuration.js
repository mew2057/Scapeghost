var app = app || {};

// Designed as a one stop shop for configuring directory structures.
app.Config = function()
{
	function Config()
	{
		this.assetDir   = "assets/";
		this.levelDir   = this.assetDir + "levels/";
		this.tileSetDir = this.assetDir + "levels/";
		this.levelSequence = this.levelDir + "level-sequence.json";
		this.spriteSheets = this.assetDir + "spritesheets/";
		this.storageID    =  "LOTN";
		
		this.initViewport = {"x":0,"y":0,"w":900,"h":400};
		
		// Physics stuff.
		this.gravity = { "x":0, "y":10 };
	}
	
	
	
	return new Config();
}();