


var profile;
var tracks = [];

$('body').scrollTo(0,500);

function initMain(){

	//Initialize the players for Audio class from audio.js
	audioInit();
	
	
	/*
	* This click listener allows the user to click on the song progress bar to
	* change the position in the currently playing track.
	*/
	$(document).on('click', '.song-progress-wrapper', function(e)
	{
		var pos = e.pageX - $(this).offset().left;
		player.setPosition(pos);
		
	});
	
	$('.nav-container').show()
			.css({ 'top':-65 })
			.animate({'top': 0}, 800);
	
	//Some responsive sizes:
	fontResize();
	
	//Endless Scroll:
	$(window).scroll(function() {
		clearTimeout($.data(this, 'scrollTimer'));
		$.data(this, 'scrollTimer', setTimeout(function() {
			
			if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
				
				stream.loadMore();
			}
		}, 250));
	});
		
}

jQuery.fn.extend($,{
secureAjax :  function(options) {
        
            //Do stuff
			var token = users.getToken();
			var username = users.getName();
			//console.log(token);
			$.ajaxSetup({
				type:"POST",
				data:{"Token":token,"Username":username}
			});
			
			
			return $.ajax(options);
		
    }
});
function createUser(form){
	
	var newUser ={};
	newUser.Username = form[0].value;
	newUser.Password = form[1].value;
	newUser.Repeat = form[2].value;
	newUser.Email = form[3].value;
	newUser.Location = form[4].value;
	
	var msg = "";
	var noProblem=true;
	
	if(!(newUser.Username.indexOf(' ') === -1 )){
		msg+='Please, try to avoid using blank spaces in the Username.<br>';
		noProblem=false;
	}
	
	if(newUser.Password!=newUser.Repeat || newUser.Password==''){
		msg+='Password error. Please Try Again.<br>';
		noProblem=false;
	}
	
	
	
	if(!noProblem){
		$('#register .msg').html(msg);
		return;
	}
	
	$.ajax({
		type:'POST',
		data:newUser,
		url: base_url+"login/create",
		dataType:'json',
		async:false,
		context: document.body
	}).done(function(data)
	{
		if(typeof data.error  != 'undefined'){
			msg+=data.error+'<br>';
			return;
		}else{
			newUser.Username=data.Username;
			newUser.Password=data.Password;
			newUser.Token=data.Token;
			
			loadUser(newUser.Username,newUser.Password);
		}
		
	});
	
	$('#register .msg').html(msg);
	
	
}
function loadUser(user,pass){
	
	if(typeof user == 'undefined' || typeof pass == 'undefined'){
		
		users.getUser(users.Username);
		stream.loadMain();
		return;
	}
	if(users.login(user,pass)){
		$('.login-create').hide();
		initMain();
		
		stream.loadMain();
	}else{
		$('#login .msg').html('Username or Password incorrects. Please Try Again');
	}
}

function loadProfile(id,type){
	if(type=='blogs'){
		var profile = blogs.getBlog(id);
		
	}else if(type=='users'){
		var profile = friends.getUser(id);
	}
	
	player.newPlaylistFlag = true;
	stream.loadProfile(profile);
}

function loadGenre(name){
	var genre = genres.getGenre(name);
	
	player.newPlaylistFlag = true;
	stream.loadProfile(genre);
}
function loadCalendar(){
	$('.view-container').empty();
	
	$('body').scrollTo(0,500);
			
	$('.profile-nav-container').hide();
	$('.content-container').css({'margin-top':'70px'});
	
	$('.view-container').append('<div style="width:100%;text-align:center;"><span style="font-size:3em;font-weight:bold;padding:4px;">Coming Soon...</span><br><br><img src="'+base_url+'img/dummy-calendar.jpg" ></div>');
}
function layoutColumns(){
	var colW = 262;
	// check if columns has changed
    var currentColumns = Math.floor( ( $('.view-container').width() ) / colW );
    
	return currentColumns;
}

function playPause(){
	
	
	player.playFromPlayer();

}
function playFromCard(id){
	player.newPlaylistFlag = false;
	player.playById(id);
}
function skipFwd(){
	player.skipFwd();

}

function skipBack(){
	player.skipBack();
}

var windowWidth = $(window).width();
var lastWindowWidth;
function fontResize(){
		
		
		var oldWindowWidth = windowWidth;
		windowWidth = $(window).width();
		
		$('body').css({'font-size':(windowWidth/oldWindowWidth)*parseFloat($('body').css('font-size'))+'px'});
		
		centerText($('.following-btn-txt'), $('.following-btn'));
		centerText($('.blogs-btn-txt'), $('.blogs-btn'));
		centerText($('.genres-btn-txt'), $('.blogs-btn'));
		centerText($('.popular-btn-txt'), $('.blogs-btn'));
		var navBarHeight = $('.nav-bar').css('padding-bottom');
		
		//$('.nav-bar').css('width', '100%');
		$('.dropdown-ctrls').css('top', parseInt(navBarHeight));
			
		function centerText(textDiv, containerDiv) {

			var fTextWidth = textDiv.css('width');
			var fTextHeight = textDiv.css('height');
			
			textDiv.css('margin-left', '-'+(parseFloat(fTextWidth)/2).toString()+'px');
			textDiv.css('margin-top', '-'+(parseFloat(fTextHeight)/2).toString()+'px');
			
		}	
		
		
}