<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Users extends MY_Controller {


	//This two are almost the same except that one is prepeared only for retriving data whereas
	//the other one renders a view
	public function get($Username){
		
		$this->load->model('UsersModel');
		
		$user = $this->UsersModel->getByUsername($Username);
		$user->Followings = $this->UsersModel->getFollowings($user->IdUser);
		$user->Followers = $this->UsersModel->getFollowers($user->IdUser);
		
		$user->Token = $this->input->post('Token');
		
		//This should be deleted after implementing the search...
		$user->Others = $this->UsersModel->getOthers($Username);
		
		echo json_encode($user);
	}
	public function getFriendById($IdUser){
		$this->load->model('UsersModel');
		
		$user = $this->UsersModel->getById($IdUser);
		
		$user->Followings = $this->UsersModel->getFollowings($user->IdUser);
		$user->Followers = $this->UsersModel->getFollowers($user->IdUser);
		
		unset($user->Token);
		unset($user->Password);
		
		echo json_encode($user);
		
	}
	public function search($Username){
	
		$this->load->model('UsersModel');
		
		echo json_encode($this->UsersModel->getOthers($Username));
	
	}
	public function reblogSong($IdUser,$IdSong){
	
		$this->load->model('UsersModel');
		
		echo json_encode($this->UsersModel->reblogSong($IdUser,$IdSong));
	}
	public function unReblogSong($IdUser,$IdSong){
	
		$this->load->model('UsersModel');
		
		echo json_encode($this->UsersModel->unReblogSong($IdUser,$IdSong));
	}
	public function invite(){
		$this->load->model('UsersModel');
		$Email=$this->input->post('Email');
		
		$Username=$this->input->post('Username');
		
		if($Username!='SG' && $Username!='nachourpi'){
			echo json_encode(array('msg'=>'Sorry. Your user ('.$Username.') is not authorized to do invitations yet.'));
			return;
		}
		
		if(!$this->UsersModel->inviteEmail($Email)){
			echo json_encode(array('msg'=>'Email or invitation already registered.'));
		}else{
			
			$this->load->library('email');
			$config['mailtype'] = 'html';

			$this->email->initialize($config);
			
			$this->email->from('no-reply@spinsetter.com', 'Spinsetter');
			$this->email->to($Email); 

			$this->email->subject('Spinsetter Alpha Invitation.');
			
			
			$message = '<html><body>';
			//$message .= '<img src="http://alpha.spinsetter.com/img/svg/spin-logo.svg" alt="Spinsetter" />';
			$message .= '<table rules="all" style="border-color: #666;" cellpadding="10">';
			$message .= "<tr><td><strong>Hey,<br><br>You have been invited to participate in Spinsetter&#39;s <a href='http://alpha.spinsetter.com/'>alpha</a> launch. Have a great time and email/call/SnapChat Samora with feedback.<br><br>Team Spinsetter</td></tr>";
			$message .= "</table>";
			$message .= "</body></html>";

			
			$this->email->message($message);	

			$this->email->send();

			
			echo json_encode(array('msg'=>'Your invitation has been sent! Thank you!'));
		}
	}
	public function followProfile($IdUser,$IdFollowed,$TypeFollowed){
		$this->load->model('UsersModel');
		
		echo json_encode($this->UsersModel->followProfile($IdUser,$IdFollowed,$TypeFollowed));
	}
	public function unfollowProfile($IdUser,$IdFollowed,$TypeFollowed){
		$this->load->model('UsersModel');
		
		echo json_encode($this->UsersModel->unfollowProfile($IdUser,$IdFollowed,$TypeFollowed));
	}

}
