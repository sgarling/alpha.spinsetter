<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Songs extends MY_Controller {


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
		//$useragent="Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.1) Gecko/20061204 Firefox/2.0.0.1";
		//curl_setopt($ch, CURLOPT_USERAGENT, $useragent);
		curl_setopt($ch, CURLOPT_URL, $page);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_exec($ch);
		curl_close($ch);
	}
	
	public function getFollowed($IdUser,$offset,$limit=10)
	{
		$this->load->model('BlogsModel');
		$this->load->model('SongsModel');
		
		$songs = $this->SongsModel->getFollowed($IdUser,$offset,$limit);
		
		$this->getSources($songs);
		
		echo json_encode($songs);
		
	}
	public function getReblogged($IdUser,$offset,$limit=10)
	{
		$this->load->model('BlogsModel');
		$this->load->model('SongsModel');
		
		$songs = $this->SongsModel->getReblogged($IdUser,$offset,$limit);
		
		$this->getSources($songs);
		
		echo json_encode($songs);
		
	}
	public function getByFriend($IdUser,$offset,$limit=10){
		$this->load->model('BlogsModel');
		$this->load->model('SongsModel');
		
		$songs = $this->SongsModel->getReblogged($IdUser,$offset,$limit);
		
		$this->getSources($songs);
		
		echo json_encode($songs);
		
	}
	public function getByBlog($id,$offset,$limit=10){
		$this->load->model('BlogsModel');
		$this->load->model('SongsModel');
		
		$blog = $this->BlogsModel->getById($id);
		
		$songs = $this->SongsModel->getByBlog($blog->IdBlog,$offset,$limit);
		
		$this->getSources($songs);
		
		echo json_encode($songs);
		
	}
	public function getByGenre($name,$offset,$limit=10){
		$this->load->model('SongsModel');
		
		
		$songs = $this->SongsModel->getByGenre($name,$offset,$limit);
		
		$this->getSources($songs);
		
		echo json_encode($songs);
		
	}
	private function getSources($songs){
		$this->load->model('SongsModel');
		
		foreach($songs as $k=>$song){
			$source = $this->SongsModel->getSource($song->IdSong);
			$songs[$k]->IdBlog=$source->IdBlog;
			$songs[$k]->NameBlog=str_replace("'","",$source->NameBlog);
		}
		return $songs;
	}
	public function card($type){
		$this->load->view('profileStream',array('type'=>$type));
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */