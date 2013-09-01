    // Stream manager (layout,player,stream sources(user profiles,blogs,top 100,etc),etc..)
    
    var stream ={
		tracksToAdd:0,
		tracksAdded:0,
		cards:[],
		cardIndex:0,
		templates:{},
		profile:null,
		
       //Adds track to a stream layout and push it into the player
	   //This should check by id if the track has been already rendered, in that case it shouldnt request the template again...
	   //Need to check for duplicate tracks in future implementations
        loadProfile: function(profile){
			$('body').scrollTo(0,500);
			
			this.profile = profile;
			
			$('.profile-nav-container').hide();
			$('.content-container').css({'margin-top':'70px'});
			$('.profile-nav .user-info').css({'background-image':'url("img/svg/profile-default.svg")'});
			if(this.profile.type!='genres'){
				$('.profile-nav-container .user-info .name').html(profile.getName());
				$('.profile-nav-container .user-info .location').html(profile.getLocation());
				
				if(this.profile.type=='blogs'){
					$('.profile-nav-container .user-info .location-link').attr('href',profile.getLocation());
					$('.profile-nav-container .stream-control .following').hide();
					
					$('.profile-nav .user-info').css({'background-image':'url("blogsLogos/'+profile.getName()+'.jpg")'});
					
				}else{
					$('.profile-nav-container .user-info .location-link').attr('href','');
					$('.profile-nav-container .stream-control .following').hide();
				}
				
				
				$('.profile-nav-container .stream-control .followers .amount').html(this.profile.getFollowersCount());
			
				$('.profile-nav-container .stream-control .posted .amount').html(profile.Tracks.length);
						
				
				if(users.isFollowing(this.profile)){
					$('.profile-nav-container .follow .edit-btn').hide();
					$('.profile-nav-container .follow .follow-btn').hide();
					$('.profile-nav-container .follow .done-btn').hide();
					$('.profile-nav-container .follow .unfollow-btn').show();
				}else{
					$('.profile-nav-container .follow .follow-btn').show();
					$('.profile-nav-container .follow .unfollow-btn').hide();
					$('.profile-nav-container .follow .edit-btn').hide();
					$('.profile-nav-container .follow .done-btn').hide();
				}
				
				$('.content-container').css({'margin-top':'140px'});
				$('.profile-nav-container')
				.show()
				.css({ 'top':-65 })
				.animate({'top': 0}, 800);
			}
			
			profile.getTracks();
			
			
		},
		loadUserProfile: function(){
			$('body').scrollTo(0,500);
			
			$('.profile-nav-container .user-info .name').html(users.getName());
			$('.profile-nav-container .user-info .location').html(users.getLocation());
			
			$('.profile-nav-container .follow .follow-btn').hide();
			$('.profile-nav-container .follow .unfollow-btn').hide();
			$('.profile-nav-container .follow .done-btn').hide();
			$('.profile-nav-container .follow .edit-btn').show();
			
			$('.profile-nav .user-info').css({'background-image':'url("img/svg/profile-default.svg")'});
			
			$('.content-container').css({'margin-top':'140px'});
			$('.profile-nav-container')
			.show()
			.css({ 'top':-65 })
			.animate({'top': 0}, 800);
			
			
			$('.profile-nav-container .stream-control .following').show();
			
			$('.profile-nav-container .stream-control .following .amount').html(users.getFollowingsCount());
			$('.profile-nav-container .stream-control .followers .amount').html(users.getFollowersCount());
			
			this.profile=users;
			player.newPlaylistFlag = true;
			this.profile.getRebloggedTracks();
			
		},
		loadMain: function(){
			$('body').scrollTo(0,500);
			
			$('.profile-nav-container').hide();
			$('.content-container').css({'margin-top':'70px'});
			this.profile=users;
			if(this.profile.getFollowingsCount()==0){
				loadGenre('pop');
			}else{
				this.profile.getFollowedTracks();
			}
		},
		
		loadMore: function(){
			this.profile.getMoreTracks(this.cards.length,function(){
				if($('.view-container .delete-btn').is(":visible")){
					$('.view-container .delete-btn').show();
				}
			});
		},
		editProfile:function(){
			$('.view-container .delete-btn').show();
		},
		doneEditProfile:function(){
			$('.view-container .delete-btn').hide();
		},
		addTrack: function(audio)
        {
			
			
			var track=audio.source.track;
			
			
			
			/*
			if(typeof audio.IdBlog !='undefined'){
				track.IdBlog=audio.IdBlog;
				console.log('back to source!'+audio.IdBlog);
			}
			*/
			
			var stream = this;
			
			var template=false;
			
			
			if(typeof this.templates[audio.type] == 'undefined'){
				$.secureAjax({
					url: base_url+"main/card/"+audio.type,
					dataType:'html',
					async:false,
					context: document.body
				}).done(function(data)
				{
					stream.templates[audio.type] = data;
					var output = Mustache.render(stream.templates[audio.type], track);
					
					player.trackList.push(audio);
					
					
					stream.addCard(output);
				});
			
			}else{
				var output = Mustache.render(stream.templates[audio.type], track);
				player.trackList.push(audio);
				

				this.addCard(output);
				
			}
			
			
        },
		addTracks: function(audios)
        {
			
			for(var i=0;i<audios.length;i++){
				this.addTrack(audios[i]);
				
			}
			
        },
		addCards: function(){
		
			for(var i=0;i<this.cards.length;i++){
				
				this.addCard(this.cards[i]);
			}
		},
		addCard: function(card){
			this.cards.push(card);
			var colsNum = layoutColumns();

			
			$('.view-container .col-'+this.cardIndex).append(card);
			
			
			this.cardIndex++;
			
			if(this.cardIndex>=colsNum){
				this.cardIndex=0;
			}
			
			return ;
		},
		
		addFollowings: function(followings){
			$('.nav-bar .following-btn .dropdown-ctrls ul').empty();
			for(var i=0;i<followings.length;i++){
				if(followings[i].TypeFollowed=='blogs'){
					$('.nav-bar .following-btn .dropdown-ctrls ul').append('<li onClick="loadProfile(\''+followings[i].IdFollowed+'\',\'blogs\')">'+followings[i].Name+'</li>');
				}else if(followings[i].TypeFollowed=='users'){
					$('.nav-bar .following-btn .dropdown-ctrls ul').append('<li onClick="loadProfile(\''+followings[i].IdFollowed+'\',\'users\')">'+followings[i].Name+'</li>');
				}
			}
		},
		addSearchResult: function(results){
			$('.nav-bar .search .dropdown-ctrls ul').empty();
			for(var i=0;i<results.length;i++){
				$('.nav-bar .search .dropdown-ctrls ul').append('<li onClick="loadProfile(\''+results[i].IdUser+'\',\'users\')">'+results[i].Username+'</li>');
				
			}
		},
		cardsContainerResize:function(){
			this.cardIndex=0;
			this.setCardsContainers();
			this.addCards();
			return;
		},
		cardsEmpty:function(){
			this.cardIndex=0;
			this.cards=[];
			this.setCardsContainers();
			return;
		},
		setCardsContainers:function(){
			var colsNum = layoutColumns();
			
			$('.view-container').empty();
			
			for(var i=0;i<colsNum;i++){
				$('.view-container').append("<div class='col col-"+i+"' ></div>");
			}
			
			$('.view-container').append('<div class="clear"></div>');
			
			return;
		},
		removeTrack:function(IdSong){
			
			$('#song'+IdSong).remove();
			this.tracksAdded--;
			//streamImagesLoaded();
			return true;
		},
		unSelectAllTracks:function(){
			$('.song-card').removeClass('song-card-selected');
		},
		selectTrack: function(id){
			this.unSelectAllTracks();
			
			$('#song'+id).addClass('song-card-selected');
			
			/* We should adjust the over parameter to a relative number in reference to the nav-bar*/
			$('body').scrollTo($('#song'+id),500,{over:-0.4});
		},
		empty: function(){
			
			//empty stream
			//$('.view-container').empty();
			this.cardsEmpty();
			
			
		}
	};



