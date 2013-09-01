/*
Prototype Profile:
IdUser
Username
type
Tracks
currentUrl
offset
getName()
getLocation()
getFollowersCount()
getTracks()

*/
    var friends ={
		Tracks:[],
		IdUser:0,
		Username:'',
		Followers:[],
		type:'users',
		currentUrl:'',
		offset:0,
        //Returns an array of Soundcloud 'track' objects that correspond to the track urls in the 'blog' object
        getUser: function(username){
			
			var friend = this;
			$.secureAjax({
				url: base_url+"users/getFriendById/"+username,
				dataType:'json',
				async:false,
				context: document.body
			}).done(function(data)
			{
				friend.IdUser=data.IdUser;
				friend.Username=data.Username;
				friend.Followers = data.Followers;
				
			});
			
			return this;
		},
		getFollowersCount: function(){
			return this.Followers.length;
		},
		getName: function(){
			return this.Username;
		},
		getLocation: function(){
			return '';
		},
		getTracks: function()
        {
			console.log('getFriendTracks initialized...');
			this.Tracks=[];
			//this shouldnt be:
			$('.loading').show();
			stream.empty();
			player.empty();
			
			this.currentUrl=base_url+"songs/getByFriend/"+this.IdUser;
			this.getMoreTracks(0);
		
		},
		getMoreTracks: function(offset,callback){
			
			
			if(offset==this.offset && offset!=0){
				return;
			}
			callback = typeof callback !== 'undefined' ? callback : function(){};
			this.offset=offset
			$.secureAjax({
				url: this.currentUrl+"/"+this.offset,
				dataType:'json',
				async:false,
				context: document.body
			}).done(function(data)
			{
				var tracksInfo = data;
				
				console.log('data received:'+tracksInfo.length.toString());
				
				$('.loading').hide();
				
				for(var i=0;i<tracksInfo.length ; i++)
				{
					var metadata = tracksInfo[i];
					
					
					var track = new Audio(metadata,blogs);
					
				
					
				}
				callback();
			}); 
		},
	   //Adds respun track to given profile
	   //Need to check for duplicate tracks in future implementations
        addTrackToStream: function(audio)
        {

			this.Tracks.push(audio);
			
			stream.addTrack(audio);
			
        },
		pushTrack: function(audio){
			this.Tracks.push(audio);
			stream.addTrack(audio);
		},
		addTracksToStream: function(){
			stream.empty();
			stream.addTracks(this.Tracks);
		}
        
	};