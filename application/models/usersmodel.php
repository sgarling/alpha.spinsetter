<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class UsersModel extends CI_Model {
    
	var $IdUser = '';
	var $Username = '';
	var $Location ='';
	
    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    private function getUsersTable(){
		return 'users';
	}
	private function getReblogTable(){
		return 'songsusers';
	}
	private function getFollowingsTable(){
		return 'followings';
	}
	function getOthers($Username){
		$this->db->select('Username,IdUser');
		$this->db->where('Username !="'.$Username.'" AND Token IS NOT NULL');
		$query = $this->db->get($this->getUsersTable());
		
        $result = $query->result();
		
		return $result;
	}
    function getById($IdUser)
    {
		
		$query = $this->db->get_where($this->getUsersTable(), array('IdUser'=>$IdUser));
		
        $result = $query->result();
		$result = $result[0];
		return $result;
    }
	function getByUsername($Username)
    {
		
		$query = $this->db->get_where($this->getUsersTable(), array('Username'=>$Username));
		
        $result = $query->result();
		$result = $result[0];
		return $result;
		
    }
	
	function getFollowings($IdUser){

		$this->db->select("followings.*,(IF(blogs.NameBlog IS NULL,users.Username,blogs.NameBlog )) as Name");
		$this->db->join('blogs',"followings.IdFollowed=blogs.IdBlog AND followings.TypeFollowed='blogs'",'left');
		$this->db->join('users',"followings.IdFollowed=users.IdUser AND followings.TypeFollowed='users'",'left');
		$query = $this->db->get_where($this->getFollowingsTable(), array('followings.IdFollower'=>$IdUser));
		
        return $query->result();
	}
	function getFollowers($IdUser){

		$this->db->select("followings.*,(IF(blogs.NameBlog IS NULL,users.Username,blogs.NameBlog )) as Name");
		$this->db->join('blogs',"followings.IdFollower=blogs.IdBlog AND followings.TypeFollowed='blogs'",'left');
		$this->db->join('users',"followings.IdFollower=users.IdUser AND followings.TypeFollowed='users'",'left');
		$query = $this->db->get_where($this->getFollowingsTable(), array('followings.IdFollowed'=>$IdUser));
		
		return $query->result();
	}
	function reblogSong($IdSong,$IdUser){
		
		$query = $this->db->get_where($this->getReblogTable(), array('IdSong'=>$IdSong,'IdUser'=>$IdUser));
		
        $result = $query->result();
		$c = $query->num_rows();
		if($c==0){
			$this->db->insert($this->getReblogTable(), (object)array('IdSong'=>$IdSong,'IdUser'=>$IdUser,'PubDate'=>date('Y-m-d H:i:s')));
			return (object)array('IdSong'=>$IdSong,'IdUser'=>$IdUser,'PubDate'=>date('Y-m-d H:i:s'));
		}else{
			return false;
		}
        
		
	}
	function unReblogSong($IdSong,$IdUser){
		
        return $this->db->delete($this->getReblogTable(), array('IdSong'=>$IdSong,'IdUser'=>$IdUser));
		
	}
	function followProfile($IdUser,$IdFollowed,$TypeFollowed){
	
		$query = $this->db->get_where($this->getFollowingsTable(), array('IdFollower'=>$IdUser,'IdFollowed'=>$IdFollowed,'TypeFollowed'=>$TypeFollowed));
		
        $result = $query->result();
		$c = $query->num_rows();
		if($c==0){
			$this->db->insert($this->getFollowingsTable(), (object)array('IdFollower'=>$IdUser,'IdFollowed'=>$IdFollowed,'TypeFollowed'=>$TypeFollowed));
			
			if($TypeFollowed=='blogs'){
				$this->db->select('NameBlog AS Name');
				$query = $this->db->get_where('blogs', array('IdBlog'=>$IdFollowed));
				$result = $query->result();
				$name = $result[0]->Name;
			}elseif($TypeFollowed=='users'){
				$this->db->select('Username AS Name');
				$query = $this->db->get_where('users', array('IdUser'=>$IdFollowed));
				$result = $query->result();
				$name = $result[0]->Name;
			}else{
				$Name='New x';
			}
			
			
			return (object)array('IdFollower'=>$IdUser,'IdFollowed'=>$IdFollowed,'TypeFollowed'=>$TypeFollowed,'Name'=>$name);
		}else{
			return false;
		}
	}
	function unfollowProfile($IdUser,$IdFollowed,$TypeFollowed){
		$this->db->delete($this->getFollowingsTable(),array('IdFollower'=>$IdUser,'IdFollowed'=>$IdFollowed,'TypeFollowed'=>$TypeFollowed));
		return (object)array('IdFollower'=>$IdUser,'IdFollowed'=>$IdFollowed,'TypeFollowed'=>$TypeFollowed);
	}
	
	public function login($Username,$Password){
		
		$query = $this->db->get_where($this->getUsersTable(), array('Username'=>$Username,'Password'=>sha1($Password)));
		if($query->num_rows()>0){
			
			$result = $query->result();
			$result = $result[0];
			
			$token = $this->generateToken();
			
			$this->db->where('IdUser', $result->IdUser);
			$this->db->update($this->getUsersTable(), (object)array('Token'=>$token,'TimeToken'=>date('Y-m-d H:i:s')));
			
			return $token;
		}
		return false;
	}
	public function checkToken($Username,$Token){
		$query = $this->db->get_where($this->getUsersTable(), array('Username'=>$Username,'Token'=>$Token));
		if($query->num_rows()>0){
			return true;
		}else{
			return false;
		}
		
	}
	private function generateToken(){
		return md5(microtime().rand(100, 999));
	}
	public function emailInvited($Email){
		$this->db->select('IdUser');
		$query = $this->db->get_where($this->getUsersTable(), array('Username'=>$Email,'Email'=>$Email));
		if($query->num_rows()>0){
			$result = $query->result();
			$result = $result[0];
			return $result->IdUser;
		}else{
			return false;
		}
	}
	public function checkExistEmail($Email){
		$query = $this->db->get_where($this->getUsersTable(), array('Email'=>$Email));
		if($query->num_rows()>0){
			return true;
		}else{
			return false;
		}
	}
	public function checkExistUsername($Username){
		$query = $this->db->get_where($this->getUsersTable(), array('Username'=>$Username));
		if($query->num_rows()>0){
			return true;
		}else{
			return false;
		}
	}
	public function register($user){
		
		$this->db->where('IdUser', $user->IdUser);
		$query = $this->db->update($this->getUsersTable(), (object)array(
		'Username'=>$user->Username,
		'Password'=>sha1($user->Password),
		'Email'=>$user->Email,
		'Location'=>$user->Location
		));
		
		return $query;
		
	}
	public function inviteEmail($Email){
		if($this->checkExistEmail($Email)){
			return false;
		}else{
			$this->db->insert($this->getUsersTable(), (object)array('Username'=>$Email,'Email'=>$Email));
			return true;
		}
		
		
	}
	
	
	
	
	
	
	
	
	
} 