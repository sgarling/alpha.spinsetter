	
	
		<div class="song-card"  id="song{{IdSong}}">
			<div class="delete-btn" onClick="users.unReblog('{{IdSong}}');"></div>
			<div class="song-title" >{{Title}}</div>
			<div class="card-prof-pic" onClick="loadProfile('{{IdBlog}}','blogs');" title="{{NameBlog}}" style="background-image:url('blogsLogos/{{NameBlog}}.jpg');">
			
			</div>
            <div class="song-artist" >{{Author}}</div>
            <div class="clear"></div>
            <div class="buttons">
				<!--
				<div class="listens"></div>
				<div class="like-btn" data-content="likes"></div>
				<div class="comment-btn" data-content="comments"></div>	
				-->
				<div class="respin-btn" onClick="users.reblog('{{IdSong}}')"></div>
			</div>
			<div class="song-artwork" >
				<img src="artwork/{{Artwork}}" >
				<a href="{{UrlSong}}" target="_blank" class="card-logo"><img src="img/{{TypeSource}}-logo.png"/></a>
				<div class="card-play-pause" onClick="playFromCard('{{IdSource}}')"><img src="img/card-play-icon.png" /></div>
			</div>
		</div>
	

