
var app = app || {};


app.PhysicsManager = function()
{

	function PhysicsManager()
	{   
		this.levelGroup = 1;

        
		
		this.collisionTypes = 
		{
			""                  :  0,
			"Player"			:  1,
			"AllCollide"        :  2,
			"TopCollide"        :  4,
			"LadderCollide"     :  8,
			"KillCollide"       : 16,
			"ForegroundCollide" : 32						
		};
    }	
	
	PhysicsManager.prototype =
	{
		CreatePhysicsWorld : function( bounds, collisions )
		{	
			/*
			var shape;
			// TODO add colliders on edges.
			shape = this.world.addStaticShape( new cp.SegmentShape( this.world.staticBody, cp.v(bounds.x, bounds.y), cp.v(bounds.x, bounds.y + bounds.height), 0.0));			
			shape.group = this.levelGroup;
			
			shape = this.world.addStaticShape( new cp.SegmentShape( this.world.staticBody, cp.v(bounds.x, bounds.y), cp.v(bounds.x + bounds.width, bounds.y ), 0.0));
			shape.group = this.levelGroup;
				
			shape = this.world.addStaticShape( new cp.SegmentShape( this.world.staticBody, cp.v(bounds.x, bounds.y + bounds.y + bounds.height),	cp.v(bounds.x + bounds.width, bounds.y + bounds.y + bounds.height), 0.0));
			shape.group = this.levelGroup;
			
			shape = this.world.addStaticShape( new cp.SegmentShape( this.world.staticBody, cp.v(bounds.x + bounds.width, bounds.y), cp.v(bounds.x + bounds.width, bounds.y + bounds.height), 0.0));
			shape.group = this.levelGroup;
			
			// TODO ngons!
		    
			for ( var obj in collisions.objects )
			{
                shape = this.world.addStaticShape(new cp.BoxShape2(this.world.staticBody, 
						cp.bb( 
						collisions.objects[obj].x,
						collisions.objects[obj].y,
						collisions.objects[obj].x + collisions.objects[obj].width,  
						collisions.objects[obj].y + collisions.objects[obj].height)));
				
				shape.setElasticity(0);
				shape.setFriction(0.8);                
				shape.group = this.levelGroup; // Sets the group to prevent the geometry from colliding with itself.
				shape.collision_type = this.collisionTypes[collisions.objects[obj].type]; // Set the layer for some customization down the road.
				shape.sensor = collisions.objects[obj].properties.hasOwnProperty("sensor");
			}
			*/
		},
		
		//XXX Clean up.
		SpawnObject : function( props, object, layer )
		{
			/*
			// TODO circles and ngons, rotatable objects
			var body = this.world.addBody(new cp.Body(1, Infinity));		
			body.setPos(cp.v(props.x + props.width/2, props.y + props.height/2));
			
            shape = this.world.addShape(new cp.BoxShape(body, props.width, props.height));
			
			// TODO make this configurable
            shape.setElasticity(0.5);
            shape.setFriction(0.4);
			shape.sensor = props.hasOwnProperty("sensor");
						
			return shape;
			*/
		},
        
        StartSimulation : function ()
        {
           
        },
        
        StopSimulation : function ()
        {
            
        },
        
        SetRendererWindow : function (id, width, height)
        {
			/*
            this.ctx = document.getElementById(id);
			this.ctx.width = width;
			this.ctx.height = height;
			this.ctx = this.ctx.getContext("2d");
			*/
        },
		
		DebugDraw: function()
		{
			/*
			this.world.step(.16);
			// Draw shapes
			this.ctx.strokeStyle = 'black';
			this.ctx.fillStyle = 'red';
			this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
			this.ctx.fillStyle = 'white';

			this.world.eachShape(function(shape) {
				shape.draw(this.ctx, 1, this.point2canvas);
			}.bind(this));
			*/
		},
		
		// Pre solves one way platforms.
		PreSolveTop : function ( arb, space )		
		{
			/*
			if( arb.getNormal(0).y <= 0 )
			{
				arb.ignore();
				return false;
			}
			
			return true;
			*/
		},
		
		// Pre solves one way platforms.
		BeginLadder : function ( arb, space )		
		{
			/*
			// This is a bit of a hack, but it allows for non player characters to even use the ladder and catches the edge case of not leaving the ladder.
			if( arb.a.data )
			{
				arb.a.data.ladder.x = .5 * (arb.b.bb_l + arb.b.bb_r);
				arb.a.data.ladder.bot = arb.b.bb_t;
				arb.a.data.ladder.top = arb.b.bb_b;
			}
			else if ( arb.b.data )
			{
				arb.b.data.ladder.x    = .5 * (arb.a.bb_l + arb.a.bb_r);
				arb.b.data.ladder.bot  = arb.a.bb_t;
				arb.b.data.ladder.top  = arb.a.bb_b;
			}
			
			return false;
			*/
		},
		
		SeparateLadder : function ( arb, space )		
		{
			/*
			if( arb.a.data )
			{
				arb.a.data.ladder.x = null;
			}
			else if ( arb.b.data )
			{
				arb.b.data.ladder.x = null;
			}
			
			return false;
			*/
		}
	}
	
	return new PhysicsManager();
}();