var app = app || {};

app.PlayerMovementStates = function ()
{
	var KeyBindings =
	{
		"Up"    : 0,
		"Left"  : 1,
		"Right" : 2,
		"Down"  : 3,
		"Jump"  : 4
	}
		
	// ===================
	// BASE STATE
	// ===================
	function PlayerMovementState ()
	{
		this.maxHorizSpeed  = 40;
		this.terminalSpeed  = 100;
		this.maxVertSpeed   = -Infinity;
		this.horizImpulse     = 1.5; 
		this.vertImpulse      = 1.5; 
		this.gravityFactor    = 1;
	}

	PlayerMovementState.prototype =
	{
		Update : function ( owner ){},
		UpdateAnim : function ( owner ) {},
		Enter  : function ( owner ){},
		Exit   : function ( owner ){}
	}
	// ===================

	// ===================
	// STANDING STATE
	// ===================
	var Standing = function () { };
	
	Standing.prototype = new PlayerMovementState();	
	
	Standing.prototype.constructor =  Standing;
	
	Standing.prototype.Enter = function ( owner ) 
	{
		owner.state.Exit(owner);
		owner.state = this;
	}
	
	Standing.prototype.Update = function ( owner )
	{
		// Jump
		if( owner.inputFlags[ KeyBindings.Jump ]  || !owner.grounded ) 
		{		
			// GOTO JUMPING
			Jumping.Enter( owner );
			return;
		}
		
		// Left || Right
		if( owner.inputFlags[ KeyBindings.Left ] ||  owner.inputFlags[ KeyBindings.Right ] )
		{
			// GOTO RUNNING
			Running.Enter( owner );
			return;
		}
				
		// Up || Down
		if( ( owner.inputFlags[ KeyBindings.Down ] || owner.inputFlags[ KeyBindings.Up ] ) && owner.ladder.x )
		{
			// GOTO CLIMBING
			Climbing.Enter( owner );
			return;
		}
	}
	
	Standing = new Standing();
	// ===================
	
	// ===================
	// RUNNING STATE
	// ===================
	var Running = function () { };
	
	Running.prototype = new PlayerMovementState();	
	
	Running.prototype.constructor =  Running;
	
	Running.prototype.Enter = function ( owner )
	{
		owner.state.Exit( owner );
		owner.state = this;
	}
	
	Running.prototype.Update = function ( owner )
	{
		// Jump
		if( owner.inputFlags[ KeyBindings.Jump ]  || !owner.grounded ) 
		{
			// GOTO JUMPING
			Jumping.Enter( owner );
			return;
		}
	
		// Left
		if( owner.inputFlags[ KeyBindings.Left ] )
		{
			owner.actor.impulse.x  -= this.horizImpulse;
		}
		
		// Right
		if( owner.inputFlags[ KeyBindings.Right ] )
		{
			owner.actor.impulse.x += this.horizImpulse;
		}
				
		// Up || Down
		if( ( owner.inputFlags[ KeyBindings.Down ] || owner.inputFlags[ KeyBindings.Up ] ) && owner.ladder.x )
		{
			// GOTO CLIMBING
			Climbing.Enter( owner );
			return;
		}
		
		if(	owner.actor.impulse.x == 0 )
		{
			owner.physicsBody.vx = 0;
			// GOTO STANDING
			Standing.Enter( owner );
			return;
		}
		else if ( owner.actor.impulse.x * owner.physicsBody.vx  < 0 ) // The speed and direction are different.
		{
			owner.physicsBody.vx = 0;
		}
	}
	
	Running = new Running();
	// ===================
	
	// ===================
	// JUMPING STATE
	// ===================
	var Jumping = function () 
	{	
		this.vertImpulse = 50;
		this.horizImpulse = .75;
	};
	
	Jumping.prototype = new PlayerMovementState();
	
	Jumping.prototype.constructor =  Jumping;
	
	Jumping.prototype.Enter = function( owner )
	{
		owner.state.Exit( owner );
		
		if( owner.inputFlags[ KeyBindings.Jump ] )
		{		
			owner.actor.impulse.y -= this.vertImpulse;
		}
		
		owner.state = this;
	}
	
	Jumping.prototype.Update = function ( owner )
	{
		// Left
		if( owner.inputFlags[ KeyBindings.Left ] )
		{
			owner.actor.impulse.x -= this.horizImpulse;
		}
		
		// Right
		if( owner.inputFlags[ KeyBindings.Right ] )
		{
			owner.actor.impulse.x += this.horizImpulse;
		}
		
		if(	owner.actor.impulse.x == 0 )
		{
		//	owner.physicsBody.vx = 0;
		}
	
		// Jump 
		if( owner.grounded ) 
		{
			// GOTO STANDING
			if( owner.physicsBody.vx == 0 )
			{
				Standing.Enter( owner );
			}
			else
			{
				Running.Enter( owner );
			}
			return;
		}		
		
		// Up && Down
		if( ( owner.inputFlags[ KeyBindings.Down ] || owner.inputFlags[ KeyBindings.Up ] ) && owner.ladder.x )
		{
			// GOTO CLIMBING
			Climbing.Enter( owner );
			return;
		}
	}
	
	Jumping = new Jumping();
	// ===================
	
	// ===================
	// CLIMBING STATE
	// ===================
	var Climbing = function () 
	{ 
		this.vertImpulse   =  10; 
		this.horizImpulse  = 1;
		this.terminalSpeed =  5;
		this.maxVertSpeed  =  -5;
		this.maxHorizSpeed  =  2;
		this.gravityFactor =  0;
	};

	Climbing.prototype =  new PlayerMovementState();

	Climbing.prototype.Enter = function( owner )
	{
		owner.state.Exit( owner );
		owner.physicsBody.vy = 0;
		owner.physicsBody.vx = 0;
		owner.physicsBody.p.x = owner.ladder.x;
	
		// Down
		if( owner.inputFlags[ KeyBindings.Down ] && owner.physicsShape.bb_t <= owner.ladder.bot)
		{
			// If the "bottom" of the player is above the top, then we need to punch through the one way.
			if(  ~~(owner.physicsShape.bb_t)  <= owner.ladder.top )
			{				
				owner.physicsBody.p.y = owner.ladder.top;
			}
			else
			{
				owner.actor.impulse.y += this.vertImpulse;
			}
		}
		
		// Up Only trigger if below the top.
		if( owner.inputFlags[ KeyBindings.Up ] && owner.physicsShape.bb_b > owner.ladder.top )
		{
			owner.actor.impulse.y -= this.vertImpulse;
		}
				
		owner.state = this;
	}
	
	Climbing.prototype.Exit = function( owner )
	{
	}	
	
	Climbing.prototype.Update = function ( owner )
	{
		
		// Jump
		if( owner.inputFlags[ KeyBindings.Jump ] ) 
		{
			// GOTO JUMPING 
			// TODO Jumping from this state should be... less.
			Jumping.Enter( owner );
			return;
		}
		
		// Dismount
		if( owner.grounded || !owner.ladder.x )
		{
			// GOTO STANDING
			Standing.Enter( owner );
			return;
		}
			
		// Down
		if( owner.inputFlags[ KeyBindings.Down ] )
		{
			owner.actor.impulse.y += this.vertImpulse;
		}
		
		// Up
		if( owner.inputFlags[ KeyBindings.Up ] )
		{
			owner.actor.impulse.y -= this.vertImpulse;
		}
		
		if( owner.actor.impulse.x == 0 )
		{
			owner.physicsBody.vx = 0;
		}
		if( owner.actor.impulse.y == 0 )
		{
			owner.physicsBody.vy = 0;
		}
		
	}
	Climbing = new Climbing();
	// ===================
	// TODO Crouching!

	return { 'Standing' : Standing, 'Running' : Running, 'Jumping' : Jumping, 'Climbing' : Climbing};
}();

//================================================