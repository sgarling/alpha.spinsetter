
  

  

  var player = {
    autoPlay : false,
	playing : false,

	playlist : '',
	trackList : [],
	trackIndex : 0,

	currentTrack : null,
	currentSound : null,
	currentPos : 0,
	progressTimer:0,
	newPlaylistFlag:false,
	startProgressBar:function(){
		this.progressTimer=window.setInterval(function(){
		
			var pos=player.currentTrack.getPosition();
			var duration=player.currentTrack.getDuration();
			var newPos = (pos / duration) * $('.song-progress-wrapper').width();
			//console.log('Progress:'+pos);
			player.updatePosition(newPos);
			
		},1000);
	},
	stopProgressBar:function(){
		window.clearInterval(this.progressTimer);
	},
	updatePosition:function(pos){
		
		this.currentPos=pos;
		$('.song-progress').css('left', '' + this.currentPos + 'px');
		//console.log(pos);
	},
	setPosition:function(pos){
		this.stopProgressBar();
		this.updatePosition(pos);
		
		var newPos = Math.floor((pos/$('.song-progress-wrapper').width()) * this.currentTrack.getDuration());
		
		this.currentTrack.setPosition(newPos);
		//console.log('New Position:'+newPos);
		this.startProgressBar();
		
	},
    getCurrentTrack: function()
    {
      return player.currentTrack;
    },
    getTrackList: function() {
      return player.trackList;
    },
    empty: function(){
		//this.pause();
		this.playlist = '';
		this.trackList=[];
		this.trackIndex = 0;
		
	},
	//Setters
    setTrackList: function(tracks)
    {
      player.trackList = tracks;
	  trackIndex = 0;
    },

    updateTrackIndex: function()
    {
      if (player.currentTrack != null) { 
        player.trackIndex = _.indexOf(player.trackList, currentTrack); 
        console.log("playing track at index " + trackIndex);
      }
    },
	
	playById: function(id){
		
		//console.log(this.trackList);
		
		var index = 0;
		var track = _.find(this.trackList,function(item){
			index++;
			if(item.source.track == null){
				console.log("playById error");
				console.log(item);
				return false;
			}
			return item.source.track.IdSource==id;
		});
		index--;
		
		player.playPauseTrack(track,index);
	
		return;
	},
    //Player Control Logic || playFromPlayer could be made cleaner. call playPauseTrack(trackList[0], 0)
    playFromPlayer: function()
    {
		if(this.trackList.length === 0)
			return false;
			
		this.playPauseTrack(this.trackList[this.trackIndex],this.trackIndex);
		
		return true;
	
    },
    
    playPauseTrack: function(track, index)
    {
		if(track==null){
			console.log("Track error, index:"+index);
			$('.play-btn').removeClass('pause-btn');
			this.skipFwd();
		}
      if (player.currentTrack === track)
      {
        
        
		if (!player.playing)
        {
          player.play(player.currentTrack);
		//player.currentTrack.play();
          player.playing = true;
		  player.startProgressBar();
		  stream.selectTrack(player.currentTrack.source.track.IdSong);
		  $('.song-title marquee').html(player.currentTrack.getMarqueeTitle());
		  $('.play-btn').addClass('pause-btn');
        } else {
          player.currentTrack.pause();
          player.playing = false;
		  player.stopProgressBar();
		  stream.unSelectAllTracks();
		  $('.play-btn').removeClass('pause-btn');
		  
        }
		
      } else {
        
		$('.song-progress').css('left', '0px');
        if (player.playing)
        {
		  
          player.currentTrack.stop();
          player.playing = false;
		  player.stopProgressBar();
		  stream.unSelectAllTracks();
		  $('.play-btn').removeClass('pause-btn');
        }
		player.currentTrack=track;
		player.currentTrack.stop();
		player.play(player.currentTrack);
		//player.currentTrack.play();
		
		player.playing = true;
		player.startProgressBar();
		player.trackIndex = index;
		stream.selectTrack(player.currentTrack.source.track.IdSong);
		$('.song-title marquee').html(player.currentTrack.getMarqueeTitle());
		$('.play-btn').addClass('pause-btn');
		
		
        
		
      }
    },
	startPlaying:null,
	play: function(track){
		
		clearTimeout(this.startPlaying);
		this.startPlaying = setTimeout(function(){
			  track.play();
		},750);
		
	},
    pause: function()
    {
      if(player.currentTrack)
      {
        if (player.playing)
        {
          player.currentTrack.pause();
          player.playing = false;
		  $('.play-btn').removeClass('pause-btn');
        }
      }
    },
	
    skipFwd: function()
    {
		
		
		if (player.currentTrack)
			  {
				console.log(player.trackIndex);
				
				
				player.currentTrack.stop();
				player.currentTrack.playIconState = "play";
				player.playing = false;
				player.stopProgressBar();
				
				if(this.newPlaylistFlag){
					player.trackIndex=0;
					this.newPlaylistFlag=false;
				}else{
					player.trackIndex++;
				
				}
				if (player.trackIndex >= player.trackList.length) { player.trackIndex = 0; }
				var track = player.trackList[player.trackIndex];
				track.playIconState = "pause";
				
				player.playPauseTrack(track, player.trackIndex);

			  }
    },
    skipBack: function()
    {
      if (player.currentTrack)
      {
        player.currentTrack.stop();
        player.currentTrack.playIconState = "play";
        player.playing = false;
		player.stopProgressBar();
        
		if(this.newPlaylistFlag){
			player.trackIndex=0;
			this.newPlaylistFlag=false;
		}else{
			player.trackIndex--;
				
		}
		
        if (player.trackIndex === -1) { player.trackIndex = player.trackList.length - 1; }
        var track = player.trackList[player.trackIndex];
        track.playIconState = "pause";
        player.playPauseTrack(track, player.trackIndex);
		
		
      }
    }
  };