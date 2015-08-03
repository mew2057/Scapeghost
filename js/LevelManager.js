/* -------------
    LevelManager.js
    XXX explain exactly what this does.
    
	@author John Dunham
	@since  2014-10-19
	------------ */
	
//************Map*************

var app = app || {};

/**
 *	Caches all of the tilesets for the game locally.
 */
app.Level = function ()
{
    // A formal definition of a tileset that is stored in the Level tilesets object.
	function Tileset( image )
	{
		this.image = image;
        this.width  = 0;
        this.height = 0;
        
		//{ "x":0, "y":0, "w":0, "h":0 } 
		this.tiles = [ ];
	}
	
    //TODO document.
	function Level ( )
	{
		this.dir          = app.Config.tileSetDir;
		this.levelData 	  = {};
		this.spriteSheet  =  new app.SpriteSheet();
		this.focusedActor = {"x":0,"y":0};
		this.viewport     = app.Config.initViewport;
		
		// This image set is maintained consistently.
		this.tilesets = {};
		
		// Create the necessary canvases to render to.
		// viewport files.
		// 
		this.layers = [];
		
		// Canvases to reduce the number of objects drawn per frame.
		this.maxChunkSide  = 256; // This should be something more dynamically allocated.
		this.foregrounds = [];
		this.backgrounds = [];
		this.chunksHorizontal;
		this.chunksVertical;
        
		//
        this.levelBounds = {"x":0,"y":0,"width" : 0, "height":0};
		
	}
	
	Level.prototype = 
	{
        // Binds a viewport to the level.
        BindViewPort : function ( viewport )
        {
            this.viewport = viewport;

			// Add 1 to handle fringe cases.
			this.viewport.chunksX = Math.ceil( this.viewport.width  / this.maxChunkSide ) + 1;
			this.viewport.chunksY = Math.ceil( this.viewport.height / this.maxChunkSide ) + 1;
		},
        
        /**
         * Starts the level matching the supplied levelData.
         * Builds the tileset from the cached data and passes relevant data off to other managers (e.g. physics).
         * @param levelData : The Tiled level data.         
         */
		StartLevel : function ( levelData )
		{
            // Set the level data to match the supplied. 
			this.levelData = levelData;
            
			$.each( levelData.tilesets, function (index, tileset)
			{
				// TODO add a error check for not loaded tilesets.	
				this.spriteSheet.AppendSpriteSheet(this.tilesets[ tileset.image ].image, this.tilesets[ tileset.image ].tiles, tileset.firstgid );
			}.bind(this));
			
			this.spriteSheet.FinalizeSpriteSheet();
			
			// PreRender the level.
			var canvas = document.getElementById("test");
			
			canvas.height = this.viewport.height; 
			canvas.width  = this.viewport.width; 
			
            this.levelBounds.width = this.levelData.width * this.levelData.tilewidth;
            this.levelBounds.height = this.levelData.height * this.levelData.tileheight;
			
			this.PreRenderMap();
			
			this.viewport.staticView = this.levelBounds.width < this.viewport.width || this.levelBounds.height < this.viewport.height;

			// Set the viewport dimensions	

			// Load collisions.		

			app.PhysicsManager.CreatePhysicsWorld(this.levelBounds, this.levelData.collisions);
			
			// Load Spawns
			var obj;
			for( var spawn in this.levelData.spawns.objects )
			{
				app.ObjectTypes.SpawnObject(this.levelData.spawns.objects[spawn]);
			}
			
		},
	
		// This chunks the map for less draw calls per cycle.
		PreRenderMap : function ()
		{			
			var levelWidth  = this.levelData.width * this.levelData.tilewidth   / this.maxChunkSide;
			var levelHeight = this.levelData.height * this.levelData.tileheight / this.maxChunkSide;
			
			this.chunksHorizontal = ~~(levelWidth);
			this.chunksVertical   = ~~(levelHeight);

			var tilesPerSide = this.maxChunkSide / this.levelData.tilewidth;

			this.foregrounds = [];
			this.backgrounds = [];
			
			var scratchCanvas;
			for( var chunkY = 0; chunkY < levelHeight; ++chunkY )
			{
				for( var chunkX = 0; chunkX < levelWidth; ++chunkX )
				{
					scratchCanvas = document.createElement("canvas");
					scratchCanvas.width  = chunkX == this.chunksHorizontal ?  (levelWidth - this.chunksHorizontal) * this.maxChunkSide : this.maxChunkSide;
					scratchCanvas.height = chunkY == this.chunksVertical   ?  (levelHeight - this.chunksVertical)  * this.maxChunkSide : this.maxChunkSide ;
					scratchCanvas.id = chunkX + " " + chunkY;
					this.foregrounds.push(scratchCanvas);
					
					scratchCanvas = document.createElement("canvas");
					scratchCanvas.width  = chunkX == this.chunksHorizontal ?  (levelWidth - this.chunksHorizontal) * this.maxChunkSide : this.maxChunkSide;
					scratchCanvas.height = chunkY == this.chunksVertical   ?  (levelHeight - this.chunksVertical)  * this.maxChunkSide : this.maxChunkSide;
					scratchCanvas.id = chunkX + " " + chunkY;

					this.backgrounds.push(scratchCanvas);						
				}
			}
			
			this.chunksHorizontal = Math.ceil( levelWidth  );			
			this.chunksVertical   = Math.ceil( levelHeight );
			
			// This is a real slow initial load, it might be reasonable to do a dynamic load.
			var ctxFore, ctxBack, xOffset, yOffset;
			for( var index = 0; index < this.foregrounds.length; ++index )
			{
				ctxFore = this.foregrounds[index].getContext("2d");
				ctxBack = this.backgrounds[index].getContext("2d");

				xOffset = (index % this.chunksHorizontal) * tilesPerSide;
				yOffset = ~~(index / this.chunksHorizontal) * tilesPerSide;
				
				for( var y = 0; y < tilesPerSide; ++y )
				{
					for ( var x = 0; x < tilesPerSide; ++x )
					{
						tileIndex = ( xOffset + x ) + ( yOffset + y ) * this.levelData.width;
						
						// The y+1 accounts for the fact that html5 draws from the bottom.
						this.spriteSheet.DrawSprite(ctxBack, this.levelData.tileLayers[0].data[ tileIndex ], x * this.levelData.tilewidth, (y + 1) * this.levelData.tileheight );
						this.spriteSheet.DrawSprite(ctxBack, this.levelData.tileLayers[1].data[ tileIndex ], x * this.levelData.tilewidth, (y + 1) * this.levelData.tileheight );						
						this.spriteSheet.DrawSprite(ctxBack, this.levelData.tileLayers[2].data[ tileIndex ], x * this.levelData.tilewidth, (y + 1) * this.levelData.tileheight );

						this.spriteSheet.DrawSprite(ctxFore, this.levelData.tileLayers[3].data[ tileIndex ], x * this.levelData.tilewidth, (y + 1) * this.levelData.tileheight );
						this.spriteSheet.DrawSprite(ctxFore, this.levelData.tileLayers[4].data[ tileIndex ], x * this.levelData.tilewidth, (y + 1) * this.levelData.tileheight );
					}
				}
			}	
		},
		
		Draw : function ()
		{
			// XXX This code is dirty, maybe I should rethink how this draw is invoked/ where it gets data from.
			// TODO handle cases where tiles are twice size.
			// Calculating the starting tile id
			
			var startX = this.viewport.x / this.maxChunkSide;
			var sTileX = ~~( startX );
			startX = ~~((startX - sTileX) * this.maxChunkSide);		

			var startY = this.viewport.y / this.maxChunkSide;
			var sTileY = ~~( startY );
			startY = ~~((startY - sTileY) * this.maxChunkSide);

			// TODO replace with separate canvases.
			var canvas = document.getElementById( "test" );
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0,0, canvas.width, canvas.height);
			
			var index, viewX, viewY = - startY;
			for( var y = 0; y < this.viewport.chunksY && sTileY + y  < this.chunksVertical; ++y, viewY += this.maxChunkSide )
			{				
				viewX = -startX;
				
				for ( var x = 0; x < this.viewport.chunksX && sTileX + x < this.chunksHorizontal; ++x, viewX += this.maxChunkSide )
				{
					index = ( sTileX + x ) + ( sTileY + y ) * this.chunksHorizontal;
					ctx.drawImage( this.backgrounds[index], viewX, viewY );
					ctx.drawImage( this.foregrounds[index], viewX, viewY );					
				}
			}			
		},
		
        /**
         * Preloads the tile sets present in the game levels. Caches the images and positional data for use on level load.
         * @param levels A collection of levels with the levelData property ( contains tiled level data ).
         */
		PreloadTilesets : function ( levels )
		{
			var promises = [];
            var promise;
            
			for ( var level in levels )
			{
                // XXX can this loop be cleaned up?
				for ( var tileset in levels[level].levelData.tilesets )
				{           
                    promise = this.LoadTileset( levels[level].levelData.tilesets[tileset] );
                    
                    // Don't add the promise to the promise list if it doesn't exist.
                    if( promise )
                    {
                        promises.push( promise );
                    }
				}
			}

			return $.when.apply(undefined, promises).promise();
		},
		
        /**
         * Loads the tileset if not already loaded. Images and positional data are cached in the tilesets collection by image name (if loaded).
         * returns a deferred object for asynchronous loading.
         * @param tileset A tileset object containing the following properties: image, margin, tilewidth, tileheight, imagewidth and imageheight.
         */
		LoadTileset : function ( tileset )
		{
			// If the tileset has been loaded, don't attempt to reload it.
			if( this.tilesets[tileset.image] )
			{
				return;
			}
			
            // Create a deferred object.
   			var tileLoad = new $.Deferred();

            //  Load the image asynchronously.
            // XXX maybe move this to a utility function.
            // ====================================================================================
			this.tilesets[tileset.image] = new Tileset( new Image () );
			this.tilesets[tileset.image].image.onload = function(){ tileLoad.resolve( ); };
			this.tilesets[tileset.image].image.onerror = function(){ tileLoad.reject( ); };
			this.tilesets[tileset.image].image.src = this.dir + tileset.image;
            // ====================================================================================
            
            this.tilesets[tileset.image].width  = tileset.imagewidth;
            this.tilesets[tileset.image].height = tileset.imageheight;
            
			// Loads the positional data. This SHOULD be quick.
			for ( var y = 0; y < tileset.imageheight; y += tileset.tileheight + tileset.margin )
			{
				for ( var x = 0; x < tileset.imagewidth; x += tileset.tilewidth + tileset.margin )
				{
					this.tilesets[tileset.image].tiles.push( { "x":x,"y":y,"w":tileset.tilewidth, "h":tileset.tilewidth } );
				}
			}            
			
			return tileLoad;			
		}
	}
	
	return new Level();
}();

app.LevelManager = function()
{
	function LevelManager()
	{
		this.levels = [];	// A collection of levels.
		//this.physicsWorld;	// Manages the actual physics of the world.
		this.currentLevel = 0;
		this.directory = app.Config.levelDir;
		this.levelSequence = app.Config.levelSequence;
	}	
	
	LevelManager.prototype =
	{
		/**
		 * Loads the level list, generally from a precooked json file.
		 * Assumed to be properly formatted and in the assets/levels directory.		 
		 * A next level of -1 brings the user to the main menu.
		 *  [ { "file" :  "filename.json", "next" : <number in array>, "levelName" : "name", "levelDesc" : "desc"} .. ] 
		 */
		LoadLevels : function ( )
		{
			// First get the levels, then get the level data, finally get the tilesets.
			var loading = $.getJSON(this.levelSequence)
				.then(app.LevelManager.ProcessLevelList.bind(this))
                .then( function() { return app.Level.PreloadTilesets( this.levels ); }.bind(this) );

			return loading.promise();
		},
		
		// Stores the level list and begins the process to cache the levels in session storage.
		ProcessLevelList : function ( levelList, status )
		{
			if(status != "success")
			{
				// Error goes here
				console.log( "The Level List Failed to Load!");
			}
					
			this.levels = levelList;
            
            // Create a collection of promises for each level being loaded.
			var promises = [];
			
			// Iterate over each level and cache the level data in the levels collection.
			// If the level is not in session storage get the json for the objects from the server.
			$.each( this.levels, function (index, level)
			{
                // If the level is in storage, don't make any promises and just load the level.
                // Else create an ajax query push the deferred object.
				if( sessionStorage[app.Config.storageID + level.levelName] )
				{
					level.levelData = JSON.parse( sessionStorage[app.Config.storageID + level.levelName]);
				}
				else
				{
					promises.push( 
						$.getJSON(this.directory + level.file).done(
							function ( json )
							{
								// Split the layers into something easier to access later.
								json.tileLayers   = [];
								json.collisions   = {};								
								json.spawns       = {};
								for (var layer in json.layers ) 
								{
									if( json.layers[ layer ].type === "tilelayer" )
									{
										json.tileLayers.push(json.layers[ layer ]);
									}
									else if( json.layers[ layer ].name === "collisions" ) // TODO make this not hardcoded!
									{									
										json.collisions = json.layers[ layer ];
									}
									else if( json.layers[ layer ].name === "spawns" ) 
									{
										json.spawns = json.layers[ layer ];
									}
								}
								
								// Remove the old layer
								delete json.layers;								
								
								this.levels[index].levelData = json; 
								sessionStorage[app.Config.storageID + level.levelName] = JSON.stringify(json);
							}.bind(this)));
				}
			}.bind(this));
			
			return $.when.apply(undefined, promises).promise();
		},
        
        StartLevel : function ( level )
        {
            this.currentLevel = level;
            app.Level.StartLevel( this.levels[this.currentLevel].levelData );
        }
	}
	
	return new LevelManager();
}();
