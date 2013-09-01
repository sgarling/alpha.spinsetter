
var youTubeAudio = {};
function audioInit(){
	//Initialize Soundcloud API
	SC.initialize(
	{
		client_id: "7d1117f42417d715b28ef9d59af7d57c"
	});
	//Initialize youTube API
	youTubeAudio = new MediaElement("youTubePlayer", {
							enablePluginDebug: false,
							plugins: ['flash','silverlight'],
							// specify to force MediaElement to use a particular video or audio type
							type: '',
							src:this.url,
							pluginPath: base_url+'js/mediaelement/',
							flashName: 'flashmediaelement.swf',
							silverlightName: 'silverlightmediaelement.xap',
							defaultVideoWidth: 1,
							defaultVideoHeight: 1,
							pluginWidth: 1,
							pluginHeight: 1,
							// rate in milliseconds for Flash and Silverlight to fire the timeupdate event
							// larger number is less accurate, but less strain on plugin->JavaScript bridge
							timerRate: 250,
							// method that fires when the Flash or Silverlight object is ready
							success: function (mediaElement, domObject) { 
								 
								// add event listener
								/*
								mediaElement.addEventListener('timeupdate', function(e) {
									 
									
									
										player.updatePosition((e.currentTime / mediaElement.duration) * $('.song-progress-wrapper').width());
										
										if (player.currentPos == $('.song-progress-wrapper').width()) { player.skipFwd(); }
									
									 
								}, false);
								*/
								mediaElement.addEventListener('ended', function(e) {
									player.skipFwd(); 	 
								}, false);
								//mediaElement.play(); 
							},
							// fires when a problem is detected
							error: function () { 
								console.log('Youtube Error');
							}
						});
}

Audio = (function(){
	
	
	function Audio(metadata,container){
		
		this.type=metadata.TypeSource;
		this.url=metadata.UrlSong;
		this.source = {track:metadata,audio:null};
		this.container=container;
		
		
		//this.IdBlog=metadata.Source.IdBlog;
		
		
		this.init();
		//console.log(this.source.track);
	}
	

	
	Audio.prototype = {
		init:function(){
			var audio = this;
			var container = this.container;
			
			switch(this.type){
				case 'soundcloud':
					
					
					this.container.pushTrack(this);
					
					
				break;
				case 'youtube':
					
					//audio.source.track={};
					this.source.audio = youTubeAudio;
					this.container.pushTrack(this);
					
					
				break;
				
			}
		},
		getDuration:function(){
			switch(this.type){
				case 'soundcloud':
					return this.source.track.Duration;
					
				break;
				case 'youtube':
					return this.source.track.Duration;
					
				break;
			}
		},

		play:function(){
			
			
			
			switch(this.type){
				case 'soundcloud':
					
					
					if(this.source.audio!=null){
						this.source.audio.play();
					}
					else{
						console.log(this.source.track.UrlSong);
						soundCloudPlay(this.source);
					}
				break;
				case 'youtube':
					
					
					this.source.audio.setSrc(this.url);
					this.source.audio.load();
					this.source.audio.play();
					
				break;
				
			}
	},
		getMarqueeTitle:function(){
			switch(this.type){
				case 'soundcloud':
					
					return this.source.track.Author+' - '+this.source.track.Title;
					
				break;
				case 'youtube':
					
					return this.source.track.Title;
					
				break;
				
			}
		},
		pause : function(){
			switch(this.type){
				case 'soundcloud':
					//console.log('Soundcloud pause:'+this.source.track.id);
					this.source.audio.pause();
					
				break;
				case 'youtube':
					//console.log('Youtube pause');
					this.source.audio.pause();
				break;
			}
		},
		stop : function(){
			switch(this.type){
				case 'soundcloud':
					if(this.source.audio != null)
						this.source.audio.stop();
					
				break;
				case 'youtube':
					if(this.source.audio != null)
						this.source.audio.stop();
				break;
			}
		},
		setPosition:function(newPos){
			switch(this.type){
				case 'soundcloud':
					
					this.source.audio.pause();
					this.source.audio.setPosition(newPos);
					var audio = this;
					this.source.audio.play();
					//window.setTimeout(function(){audio.play();player.startProgressBar();},5000);
				break;
				case 'youtube':
					this.source.audio.setCurrentTime(newPos);
				break;
			}
		},
		getPosition:function(){
			switch(this.type){
				case 'soundcloud':
					if(this.source.audio==null)
						return 0;
					else
						return this.source.audio.position;
					
				break;
				case 'youtube':
					return this.source.audio.currentTime;
				break;
			}
		}
	
	};
	
	return Audio;
})();

function soundCloudPlay(audioSource){
	
	console.log(audioSource.track.IdSource);
	SC.stream('/tracks/' + audioSource.track.IdSource, {useConsole:true,debugMode:true,useHTML5Audio: true},function(audio)
	{
		audioSource.audio=audio;
		
		audio.play(
		{
			//Updates the progress bar div as the song plays
			/*
			whileplaying: function()
			{
			
				player.updatePosition(((audio.position / audioSource.track.Duration)) * $('.song-progress-wrapper').width());

			},
			*/
			onfinish: function() {
			  player.skipFwd();
			}
			
		});
	});
}