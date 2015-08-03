var app = app || {};

// Spawns objects from a level map.
app.ObjectTypes = function ()
{
	// Store an object, function pair for the creation of new spawnables (e.g. players, npcs, powerups...)
	this.spawnables = 
	{
		"Player"     : [ app.Player, app.Player.CreatePlayerInWorld ],   
		"Gear"       : [ app.LevelManager ],
         "Spring"    : [ app.Actor ],
         "Goal"      : [ app.Actor ],
         "iDrone"    : [ app.Actor ],
         "GUTS"      : [ app.Actor ],
         "NPC"       : [ app.Actor ],
	    "Motorcycle" : [ app.Actor ],
		"PowerLine"  : [ app.Actor ],
		"BarbedWire" : [ app.Actor ]
	} 
}		
	
app.ObjectTypes.prototype = 
{
	SpawnObject : function( object )
	{
		var spawn = this.spawnables[object.type];

		if( spawn && spawn[1] )
		{
			spawn[1].apply(spawn[0], [object]);
		}
	}		
}