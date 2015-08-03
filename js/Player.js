var app = app || {};



app.Player = function()
{
	function Player()
	{	
		// up, left, right, down, actions...
		this.inputFlags  = [];
		
		this.viewport;
		
		this.actor = new app.Actor();
				
		this.physicsBody;
		this.physicsShape;
				
		this.heightJumped = 0; // TODO
		this.maxJumpHeight = 40; // TODO	
		
		// Collision driven.
		this.ladder = {};
		this.grounded = false;
		
		// The currentState.
		this.state = app.PlayerMovementStates.Standing;
	}

	Player.prototype = 
	{		
		Update : function ()
		{
			this.actor.impulse.x = 0;
			this.actor.impulse.y = 0;
			
			this.state.Update( this );
			
			//this.physicsBody.applyImpulse( this.actor.impulse, this.actor.rot );
			
			// I keep the physics decoupled from the rendering, as rendering can scale.
			this.actor.pos.x = this.physicsBody.p.x;
			this.actor.pos.y = this.physicsBody.p.y;
		},
		
		Draw : function ()
		{
			// TODO replace
			var canvas = document.getElementById( "test" );
			var ctx = canvas.getContext("2d");
			ctx.save();
			
			ctx.strokeStyle = 'white';
			
			ctx.fillRect(this.actor.pos.x - this.viewport.x -16, this.actor.pos.y - this.viewport.y - 16, 32,32);
			ctx.strokeRect(this.actor.pos.x - this.viewport.x -16, this.actor.pos.y - this.viewport.y -16, 32,32);
			ctx.restore();
		},
		
		CreatePlayerInWorld : function ( props )
		{
			// EARLY RETURN!
			if ( !props )
			{
				return;
			}
			
			this.state = app.PlayerMovementStates.Standing;
			
			//this.physicsShape = app.PhysicsManager.SpawnObject(props, this);
			//this.physicsShape.collision_type  = app.PhysicsManager.collisionTypes.Player;
			//this.physicsShape.data = this;
			
			//this.physicsBody = this.physicsShape.body;
			//this.physicsBody.velocity_func = this.CalculateVelocity.bind(this);
		},
				
		CalculateVelocity : function ( gravity, damping, dt)
		{
		
			// Check for grounded.
			var groundNormal = cp.vzero;
			this.physicsBody.eachArbiter(
				function(arb) {
					if( arb.contacts)
					{
						// Get the normal of the ground from the arbiter.
						var n = arb.getNormal(0);
						
						// If the normal of the contact is "up" set it to be the ground normal.
						if( n.y > groundNormal.y )
						{
							groundNormal = n
						} 
					}
				});
			
			this.grounded = groundNormal.y > 0.0;

			// Compute the velocity. TODO check if the scaling is strictly necessary.
			// =======================			
			var vx = this.physicsBody.vx * damping + (gravity.x + this.physicsBody.f.x * this.physicsBody.m_inv) * dt;
			var vy = this.physicsBody.vy * damping + (gravity.y * this.state.gravityFactor + this.physicsBody.f.y * this.physicsBody.m_inv) * dt;
			
			this.physicsBody.vx = app.Utils.Clamp( vx, -this.state.maxHorizSpeed, this.state.maxHorizSpeed );
			this.physicsBody.vy = app.Utils.Clamp( vy,   this.state.maxVertSpeed, this.state.terminalSpeed );

			this.physicsBody.sanityCheck();
			//========================
			
		}		
	}
	
	return new Player();
	
}();
