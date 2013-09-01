<!doctype html>
<html>
<head>
	<title>Spinsetter</title>
	<script> var base_url = '<?=base_url()?>'; </script>
    <script src="//connect.soundcloud.com/sdk.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	
	<script type="text/javascript" src="<?=base_url()?>js/mustache.js"></script>
	<script type="text/javascript" src="<?=base_url()?>js/jquery.scrollTo.min.js"></script>
	
	<script type="text/javascript" src="<?=base_url()?>js/underscore.js"></script>
    <script type="text/javascript" src="<?=base_url()?>js/underscore.observable.js"></script>
	
	
	<script type="text/javascript" src="<?=base_url()?>js/mediaelement/mediaelement-and-player.js"></script>
	
	
	<script type="text/javascript" src="<?=base_url()?>js/stream.js"></script>
	<script type="text/javascript" src="<?=base_url()?>js/users.js"></script>
	<script type="text/javascript" src="<?=base_url()?>js/friends.js"></script>
	<script type="text/javascript" src="<?=base_url()?>js/blogs.js"></script>
	<script type="text/javascript" src="<?=base_url()?>js/genres.js"></script>
	<script type="text/javascript" src="<?=base_url()?>js/player.js"></script>
	<script type="text/javascript" src="<?=base_url()?>js/audio.js"></script>
	
	<script type="text/javascript" src="<?=base_url()?>js/login.js"></script>
	
	<!--[if lt IE 9]>
		<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	
	<link rel="stylesheet" href="<?=base_url()?>js/mediaelement/mediaelementplayer.css" />
    <link rel="stylesheet" href="<?=base_url()?>css/style.css?t=<?=rand()?>">
	<link rel="stylesheet" href="<?=base_url()?>css/login.css?t=<?=rand()?>">
	
	
	
</head>

<body>
<div style="overflow:hidden;width:1px;height:1px;position:absolute;top:100%;right:0;">
<video id="youTubePlayer" type='video/youtube' src='http://www.youtube.com/watch?v=q6XoSzmLcZs'></video>
</div>
    <div class="container">
        <div class="nav-container">
            <div class="nav-bar" >
                <div class="logo" onClick="loadUser();" style="cursor:pointer;"></div>
                <div class="following-btn">
					<div class="following-btn-txt" onClick="loadUser();" >Following</div>
					<div class="dropdown-ctrls">
					<ul>
					
					</ul>
					</div>
				</div>
                <div class="blogs-btn">
					<div class="blogs-btn-txt">Blogs</div>
					<div class="dropdown-ctrls">
					<ul>
					<? foreach($blogs as $k=>$blog): ?>
					<li onClick="loadProfile('<?=$blog->IdBlog?>','blogs')"><?=$blog->NameBlog?></li>
					
					<? endforeach;?>
					</ul>
					</div>
				</div>
                <div class="genres-btn">
					<div class="genres-btn-txt">Genres</div>
					<div class="dropdown-ctrls">
						<ul>
							<li onClick="loadGenre('indie');">Indie/Alternative</li>
							<li onClick="loadGenre('electr');">Electronica/Dance</li>
							<li onClick="loadGenre('hip');">Hip Hop/Rap</li>
						</ul>
					</div>
				</div>
                <div class="popular-btn"><div class="popular-btn-txt" onClick="loadGenre('pop');">Popular</div></div>
				
				<div class="profile-btn"  >
					<div onClick="stream.loadUserProfile();" class="profile-btn-link"> </div>
                    <!--<div class="notification-circle profile"><p>4</p></div>-->
					<div class="dropdown-ctrls" >
						<form onSubmit="$(this).find('.msg').html(users.invite($(this).serializeArray()[0].value));return false;" action="">
							<input type="text" name="Email" placeholder="Invitation Email" /> <input type="submit" value="Invite" class="button" />
							<p class="msg"></p>
						</form>
					</div>
                </div>
				<div class="calendar-btn" onClick="loadCalendar();">
                   <!-- <div class="notification-circle calendar"><p>3</p></div>-->
                </div>
				<div class="nav-bar-ctrls" ng-controller="PlayerCtrl">
                    <div class="rwd-btn" onClick="skipBack();"></div>
                    <div class="play-btn" onClick="playPause();"></div>
                    <div class="ffwd-btn" onClick="skipFwd()"></div>
                    <div class="dropdown-ctrls" >
                        <div class="song-title">
                            <marquee behavior="scroll" direction="left" scrollAmount="2" scrolldelay="1"></marquee></div>
                        <div class="progress-section">
                            <div class="song-progress-wrapper">
                                <div class="progress-bar"></div>
                                <div class="song-progress"></div>
                            </div>
                        </div>
                        <div class="like-btn" ng-click="like()"></div>
                    </div>
                </div>
				<div class="search">
					<div class="search-btn" ></div>
					<div class="search-input" ><input type="text" placeholder="Search a user..." ></div>
					<div class="dropdown-ctrls" >
						<ul>
							<li>Functionality not implemented yet...</li>
						</ul>
					</div>
                </div>
                
                
                
            </div>
        
			<div class="profile-nav-container">
				<div class="profile-nav">
					<div class="user-info">
						<p class="name"></p>
						<a class="location-link" target="_blank"><p class="location"></p></a>
					</div>
					
					<div class="stream-control">
						<div class="follow">
							<div class="follow-btn" Onclick='users.followProfile(stream.profile);$(this).hide();$(this).next().show();'>Follow</div>
							<div class="unfollow-btn" Onclick='users.unfollowProfile(stream.profile);$(this).hide();$(this).prev().show();'>Unfollow</div>
							<div class="edit-btn" Onclick='stream.editProfile();$(this).hide();$(this).next().show();'>Edit</div>
							<div class="done-btn" Onclick='stream.doneEditProfile();$(this).hide();$(this).prev().show();'>Done</div>
						</div>
						<!--
						<div class="posted" ><p class="type">Stream</p><p class="amount">0</p></div>
						<div class="likes" ng-click="viewLikes()"><p class="type">Likes</p><p class="amount">0</p></div>
						<div class="playlists"><p class="type">Playlists</p><p class="amount">0</p></div>
						-->
						<div class="followers" ><p class="type">Followers</p><p class="amount">0</p></div>
						<div class="following"><p class="type">Following</p><p class="amount">0</p></div>
					</div>
				</div>
			</div>
		
		</div>
        
		<div class="clear"></div>
		<div class="loading">
			<img src="<?=base_url()?>img/loading.gif" />
		</div>
        <div class="content-container" >
	        <div class="login-create">
				<div class="flat-form">
					<ul class="tabs">
						<li>
							<a href="#login" class="active">Login</a>
						</li>
						<li>
							<a href="#register">Sign Up</a>
						</li>
					</ul>
					<div id="login" class="form-action show">
						<h1>Login to Spinsetter</h1>
						<p class="msg">
							Alpha version. By Invite Only.
						</p>
						<form action="" onSubmit="loadUser($(this).serializeArray()[0].value,$(this).serializeArray()[1].value);return false;">
							<ul>
								<li>
									<input type="text" name="Username" placeholder="Username" />
								</li>
								<li>
									<input type="password" name="Password" placeholder="Password" />
								</li>
								<li>
									<input type="submit" value="Login" class="button" />
								</li>
							</ul>
						</form>
					</div>
					<!--/#login.form-action-->
					<div id="register" class="form-action hide">
						<h1>Sign Up</h1>
						<p class="msg">
						(*) Required
						</p>
						<form onSubmit="createUser($(this).serializeArray());return false;" action="#">
							<ul>
								<li>
									<input type="text" name="Username" placeholder="Username* (one word only)" />
								</li>
								<li>
									<input type="password" name="Password" placeholder="Password*" />
								</li>
								<li>
									<input type="password" name="Repeat" placeholder="Repeat Password*" />
								</li>
								<li>
									<input type="text" name="Email" placeholder="Email*" />
								</li>
								<li>
									<input type="text" name="Location" placeholder="Location*" />
								</li>
								<li>
									<input type="submit" value="Sign Up" class="button" />
								</li>
							</ul>
						</form>
					</div>

					<!--/#register.form-action-->
				</div>
			</div>
			<div class="view-container" >
			
			<div class="clear"></div>
			</div>
        </div>
    </div>
	
	
	<script type="text/javascript" src="<?=base_url()?>js/main.js"></script>
</body>
</html>
