    // static users
    
    var users ={
		Tracks:[],
		IdUser:0,
		Token:false,
		Username:'',
		Location:'',
		Followings:[],
		Followers:[],
		type:'users',
		currentUrl:'',
		offset:0,
		login: function(){
		
		
		},
		getToken: function(){
			return this.Token;
		},
		login: function(username,password){
			var user = this;
			$.secureAjax({
				url: base_url+"login/get/"+username+"/"+password,
				dataType:'json',
				async:false,
				context: document.body
			}).done(function(data)
			{
				if(!data.Token){
					console.log("Login Failed...");
				}else{
					user.Username=data.Username;
					user.Token=data.Token;
					user.Password=data.Password;
					
					user.getUser(user.Username);
				}
				
			});
			return this.Token;
			
		},
        getUser: function(username)
        {
           // var profileIndex = getProfileIndex(username);
            //return profiles[profileIndex];
			if(typeof username == 'undefined')
				username = this.Username;
				
			var user = this;
			$.secureAjax({
				url: base_url+"users/get/"+username,
				dataType:'json',
				async:false,
				context: document.body
			}).done(function(data)
			{
				user.IdUser=data.IdUser;
				user.Username=data.Username;
				user.Location=data.Location;
				user.Followings = data.Followings;
				user.Followers = data.Followers;
				
				stream.addSearchResult(data.Others);
				
				stream.addFollowings(user.Followings);
				
			});
			
			return this;
        },
		getFollowingsCount: function(){
			return this.Followings.length;
		},
		getFollowersCount: function(){
			return this.Followers.length;
		},
		getName: function(){
			return this.Username;
		},
		getLocation: function(){
			return this.Location;
		},
		empty: function(){
			this.Tracks=[];
		},
        //Returns an array of Soundcloud 'track' objects that correspond to the track urls in the 'profiles' object
        getFollowedTracks: function()
        {
			console.log('getTracks initialized...');
			
			
			this.empty();
			stream.empty();
			player.empty();
			$('.loading').show();
			this.currentUrl=base_url+"songs/getFollowed/"+this.IdUser;
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
				$('.loading').hide();
				var tracksInfo = data;
				
				console.log('data received:'+tracksInfo.length.toString());
				
				for(var i=0;i<tracksInfo.length ; i++)
				{
					var metadata = tracksInfo[i];
					
					//The Audio object after loading will call the container.PushTrack(this) 
					//In this case will be profiles.PushTracks(this)
					var track = new Audio(metadata,users);
					
				}
				callback();
			}); 
		},
		getRebloggedTracks: function()
        {
			console.log('getTracks initialized...');
			$('.loading').show();
			this.empty();
			stream.empty();
			player.empty();
			this.currentUrl=base_url+"songs/getReblogged/"+this.IdUser;
			this.getMoreTracks(0);
			
		
		},
		pushTrack: function(audio){
			
			this.Tracks.push(audio);
			
			stream.addTrack(audio);
		},
		addTracksToStream: function(){
			$('.loading').show();
			stream.empty();
			
			stream.tracksToAdd = this.Tracks.length;
			stream.tracksAdded = 0;
			
			stream.addTracks(this.Tracks);
		},
		reblog: function(IdSong){
			$.secureAjax({
				url: base_url+"users/reblogSong/"+IdSong+"/"+this.IdUser,
				dataType:'json',
				context: document.body
			}).done(function(data)
			{
				console.log(data);
				console.log("Song reblogged...");
				if(data == true){
					//alert("Debug: song reblogged");
				}
			});
		},
		unReblog: function(IdSong){
			$.secureAjax({
				url: base_url+"users/unReblogSong/"+IdSong+"/"+this.IdUser,
				dataType:'json',
				context: document.body
			}).done(function(data)
			{
				console.log("Song unReblogged...");
				//should we remove the song from the player if there?..
				
				console.log(stream.removeTrack(IdSong));
			});
		},
		invite: function(email){
			var msg='';
			$.secureAjax({
				url: base_url+"users/invite",
				data:{'Email':email},
				dataType:'json',
				async:false,
				context: document.body
			}).done(function(data)
			{
				msg=data.msg;
			});
			
			return msg;
		},
		removeTrack: function(IdSong){
			
			
			
		},
		followProfile: function(profile){
			if(profile.type=='blogs'){
				var TypeFollowed = profile.type;
				var IdFollowed = profile.IdBlog;
			}else{
				var TypeFollowed = 'users';
				var IdFollowed = profile.IdUser;
			}
			var user = this;
			$.secureAjax({
				url: base_url+"users/followProfile/"+this.IdUser+"/"+IdFollowed+"/"+TypeFollowed,
				dataType:'json',
				context: document.body
			}).done(function(data)
			{
				console.log(data);
				if(data!=false){
					//alert("Following a new profile...");
					user.Followings.push(data);
					loadProfile(data.IdFollowed,data.TypeFollowed);
					stream.addFollowings(user.Followings);
					console.log("Following Profile...");
				}
			});
		},
		unfollowProfile: function(profile){
			if(profile.type=='blogs'){
				var TypeFollowed = profile.type;
				var IdFollowed = profile.IdBlog;
			}else{
				var TypeFollowed = 'users';
				var IdFollowed = profile.IdUser;
			}
			
			var user = this;
			$.secureAjax({
				url: base_url+"users/unfollowProfile/"+this.IdUser+"/"+IdFollowed+"/"+TypeFollowed,
				dataType:'json',
				context: document.body
			}).done(function(data)
			{
				if(data!=false){
					//alert("Profile unfollowed");
					//user.Followings.push(data);
					
					
					for(var i = 0 ; i<user.Followings.length; i++){
						if(user.Followings[i].IdFollowed == data.IdFollowed && user.Followings[i].TypeFollowed==data.TypeFollowed){
							user.Followings.splice(i,1);
						}
					}
					loadProfile(data.IdFollowed,data.TypeFollowed);
					stream.addFollowings(user.Followings);
					console.log("Unfollowing Profile...");
				}
			});
		},
		isFollowing: function(profile){
			
			if(profile.type=='blogs'){
				var TypeFollowed = profile.type;
				var IdFollowed = profile.IdBlog;
			}else if(profile.type=='users'){
				var TypeFollowed = 'users';
				var IdFollowed = profile.IdUser;
			}else{
				return false;
			}
			
			return _.find(this.Followings, function(item){ return (item.IdFollowed == IdFollowed && item.TypeFollowed==TypeFollowed); });
		}
	
	};