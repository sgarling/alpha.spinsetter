<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

	public function __construct()
       {
            parent::__construct();
            // Your own constructor code
			$this->load->model('UsersModel');
			
			$Token = $this->input->post('Token');
			$Username = $this->input->post('Username');
			
			if(!$this->UsersModel->checkToken($Username,$Token)){
				die(json_encode(array('error'=>'Bad token')));
			}
       }


}