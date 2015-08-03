/* -------------
    Scapeghost.js
    
    
	@author John Dunham
	@since  2014-10-19
	------------ */
	
//************Map*************

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 16);
          };
})();


var app = app || {};

app.Scapeghost = function ()
{
	function Scapeghost()
	{
		this.viewport = new app.ViewPort();
        this.stats = new Stats();
	}
	
	Scapeghost.prototype = 
	{
		LoadGame : function ()
		{
			// TODO do SOMETHING visual here.
			var levelLoad = app.LevelManager.LoadLevels();
			
			$.when( levelLoad ).done(this.StartGame.bind(this));
		},
		
		// TODO CLEAN THIS CODE UP!
		StartGame : function ()
		{
			console.log("Light It Up!");
            
            // Stats Stuff
            //===========================
            this.stats.setMode(0); // 0: fps, 1: ms
						
            // Align top-left
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            
            document.body.appendChild( this.stats.domElement );
            //===========================
			// GUI Stuff
			var gui = new app.DebugGUI();
			gui.AddPlayer(app.Player);

			//
            
			// This is a bit of a hack to work around load times.
			app.ObjectTypes = new app.ObjectTypes();
			
			app.Controls.BindInputFlags ( app.Player );			
			app.Controls.BindElement ( "game" ); // Default binding to window.	
            
           	this.viewport.SetFocus( app.Player.actor.pos );
            this.viewport.SetWorldBounds( app.Level.levelBounds );
            
            // TODO bind this better.
            app.Level.BindViewPort( this.viewport );
			app.Player.viewport = this.viewport;
			
			app.LevelManager.StartLevel(1);
            
            app.PhysicsManager.SetRendererWindow("physics", app.Level.levelBounds.width, app.Level.levelBounds.height);
            app.PhysicsManager.StartSimulation();
			// Kick off the game.
			// This needs to be delayed by the earlier code.
			this.GameLoop();
		},
        
        GameLoop : function ()
        {
            this.stats.begin();
			window.requestAnimFrame( this.GameLoop.bind(this) );    
			
			this.Update();
			this.Draw();		
            this.stats.end();
        },
        
        Update : function()
        {		
			app.Player.Update();
			this.viewport.Update();
        },
        
        Draw : function()
        {
			app.Level.Draw();
			app.Player.Draw();
			app.PhysicsManager.DebugDraw();
        }
	}
	
	return new Scapeghost ();
}();