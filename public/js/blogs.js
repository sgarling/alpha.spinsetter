    // static profiles
    
    var blogs ={
		Tracks:[],
		IdBlog:0,
		NameBlog:'',
		UrlBlog:'',
		type:'blogs',
		currentUrl:'',
		Followers:[],
		offset:0,
        //Returns an array of Soundcloud 'track' objects that correspond to the track urls in the 'blog' object
        getBlog: function(id){
			
			var blog = this;
			$.secureAjax({
				url: base_url+"blogs/get/"+id,
				dataType:'json',
				async:false,
				context: document.body
			}).done(function(data)
			{
				blog.IdBlog=data.IdBlog;
				blog.NameBlog=data.NameBlog;
				blog.UrlBlog=data.UrlBlog;
				
				blog.Followers = data.Followers;
				
			});
			
			return this;
		},
		getFollowersCount: function(){
			return this.Followers.length;
		},
		getName: function(){
			return this.NameBlog;
		},
		getLocation: function(){
			return this.UrlBlog;
		},
		getTracks: function()
        {
			console.log('getBlogTracks initialized...');
			this.Tracks=[];
			//this shouldnt be:
			$('.loading').show();
			stream.empty();
			player.empty();
			
			this.currentUrl=base_url+"songs/getByBlog/"+this.IdBlog;
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