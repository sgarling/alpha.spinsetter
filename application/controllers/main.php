<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -  
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index(){
		
		$this->load->model('BlogsModel');
		$this->load->model('SongsModel');
		$this->load->model('UsersModel');
		
		$blogs = $this->BlogsModel->getAll();
		
		$blogs2=array();
		
		foreach($blogs as $k=>$blog){
			$blogs[$k]->Songs = count($this->SongsModel->getByBlog($blog->IdBlog));
			if($blogs[$k]->Songs>0){
				$blogs2[]=$blogs[$k];
			}
		}
		
		$this->load->view('main',array('blogs'=>$blogs2));
	}
	
	/*
	public function checkSoundCloud(){
		
		$url = $this->input->post('url');
		
		$page='http://api.soundcloud.com/resolve.json?url='.$url.'&client_id=7d1117f42417d715b28ef9d59af7d57c&format=json&_status_code_map[302]=200';
		$ch = curl_init();
		//$useragent="Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1";
		//curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
		curl_setopt($ch, CURLOPT_URL, $page);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_exec($ch);
		//print_r($response);
		//print_r($ch);
		curl_close($ch);
		
	}
	public function getYouTubeData($id){
		
		$page = 'http://gdata.youtube.com/feeds/api/videos/'.$id.'?v=2&alt=jsonc';
		$ch = curl_init();
		
		curl_setopt($ch, CURLOPT_URL, $page);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_exec($ch);
		curl_close($ch);
	}
	*/
	public function card($type){
		$this->load->view('profileStream',array('type'=>$type));
	}
	
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */