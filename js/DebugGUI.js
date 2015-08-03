var app = app || {};

app.DebugGUI = function ()
{
	this.gui = new dat.GUI();	
}

app.DebugGUI.prototype = 
{
	AddPlayer : function ( player )
	{
		var f1 = this.gui.addFolder('Player');
		
		var f2;
		for ( var state in app.PlayerMovementStates)
		{
			f2 = f1.addFolder(state);
			f1.add( app.PlayerMovementStates[state], 'maxHorizSpeed' );
			f1.add( app.PlayerMovementStates[state], 'terminalSpeed' );
			f1.add( app.PlayerMovementStates[state], 'maxVertSpeed' );
			f1.add( app.PlayerMovementStates[state], 'horizImpulse' );
			f1.add( app.PlayerMovementStates[state], 'vertImpulse' );
			f1.add( app.PlayerMovementStates[state], 'gravityFactor' );
		}
	}
}



 
    
     