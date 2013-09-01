<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends CI_Controller {

	public function get($Username,$Password=false){
		
		$this->load->model('UsersModel');
		
		//Maybe we shouldnt retrieve the password
		echo json_encode(array('Username'=>$Username,'Password'=>$Password,'Token'=>$this->UsersModel->login($Username,$Password)));
		
		
	}
	
	
	public function create(){
		$this->load->model('UsersModel');
		
		$user=(object)array();
		$user->Username=$this->input->post('Username');
		$user->Password=$this->input->post('Password');
		$user->Email=$this->input->post('Email');
		$user->Location=$this->input->post('Location');
		
		$user->IdUser=$this->UsersModel->emailInvited($user->Email);
		if(!$user->IdUser){
			
			echo json_encode(array('error'=>'Email not invited.'));
			return false;
		}
		
		if($this->UsersModel->checkExistUsername($user->Username)){

			echo json_encode(array('error'=>'Username/Password incorrect. Please try again.'));
			return false;
		}
		
		$this->UsersModel->register($user);
		
		
		echo json_encode(array('Username'=>$user->Username,'Password'=>$user->Password,'Token'=>$this->UsersModel->login($user->Username,$user->Password)));
		
		return true;
	}
	
	
}
