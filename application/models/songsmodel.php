<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class SongsModel extends CI_Model {
    
	var $IdSong = '';
	var $UrlSong   = '';
	var $TypeSong ='';
	var $TypeSource ='';
	
	var $Title='';
	var $Author='';
	var $Description='';
	var $Duration='';
	var $Genres='';
	var $Artwork='';
	var $IdSource='';
	var $PubDate='';
	
    function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }
    private function getSongsTable(){
		return 'songs';
	}
	private function getSongsBlogsTable(){
		return 'songsblogs';
	}
    function get($q=false)
    {
		$this->db->order_by('IdSong','DESC');
		if($q){
			//$query = $this->db->get('songs',$q);
			$query = $this->db->get_where($this->getSongsTable(), array('TypeSong'=>'track'),$q);
		}else{
			$query = $this->db->get($this->getSongsTable(),array('TypeSong'=>'track'));
		}
        return $query->result();
    }
	function getFollowed($IdUser,$offset=0,$limit=500){
		/*
		SELECT s.*,sb.IdBlog FROM songs s 
		LEFT JOIN songsblogs sb ON s.IdSong=sb.IdSong 
		LEFT JOIN songsusers su ON s.IdSong=su.IdSong
		JOIN followings f ON (sb.IdBlog=f.IdFollowed OR su.IdUser=f.IdFollowed) 
		WHERE f.IdFollower='1'
		*/
		$this->db->select($this->getSongsTable().".*");
		$this->db->order_by($this->getSongsTable().'.PubDate','DESC');
		//$this->db->from($this->getSongsTable(),$limit,$offset);
		$this->db->join('songsblogs', $this->getSongsTable().'.IdSong = songsblogs.IdSong','left');
		$this->db->join('songsusers', $this->getSongsTable().'.IdSong = songsusers.IdSong','left');
		$this->db->join('followings f', "  songsblogs.IdBlog = f.IdFollowed AND f.TypeFollowed='blogs' OR songsusers.IdUser = f.IdFollowed AND f.TypeFollowed='users'");
		$this->db->where(array('f.IdFollower'=> $IdUser));
		$query = $this->db->get($this->getSongsTable(),$limit,$offset);
        return $query->result();
		
		
	}
	function getReblogged($IdUser,$offset=0,$limit=500){
		/*
		SELECT s.*,sb.IdBlog FROM songs s 
		LEFT JOIN songsblogs sb ON s.IdSong=sb.IdSong 
		LEFT JOIN songsusers su ON s.IdSong=su.IdSong
		JOIN followings f ON (sb.IdBlog=f.IdFollowed OR su.IdUser=f.IdFollowed) 
		WHERE f.IdFollower='1'
		*/
		$this->db->select($this->getSongsTable().".*");
		$this->db->order_by($this->getSongsTable().'.PubDate','DESC');
		//$this->db->from($this->getSongsTable());
		$this->db->join('songsusers', $this->getSongsTable().'.IdSong = songsusers.IdSong');
		$this->db->where(array('songsusers.IdUser'=> $IdUser));
		$query = $this->db->get($this->getSongsTable(),$limit,$offset);
        return $query->result();
		
		
	}
	function getSoundCloud()
    {
		$query = $this->db->get_where($this->getSongsTable(), array('TypeSource' => 'soundcloud','TypeSong'=>'track'),1);
		
        $result = $query->result();
		$result = $result[0];
		return $result;
    }
	function getYouTube()
    {
		$query = $this->db->get_where($this->getSongsTable(), array('TypeSource' => 'youtube','TypeSong'=>'track'),1);
		
        $result = $query->result();
		$result = $result[0];
		return $result;
    }
	function getByBlog($IdBlog,$offset=0,$limit=500)
    {
		$this->db->order_by($this->getSongsTable().'.PubDate','DESC');
		//$this->db->from($this->getSongsTable());
		$this->db->join('songsblogs', $this->getSongsTable().'.IdSong = songsblogs.IdSong');
		
		//This is baddly hardcoded to consolidate Pitchfork,Disco Naivete and This Song is Sick
		if($IdBlog==1){
			$where = 'songsblogs.IdBlog IN("1","2","5","6") AND songs.TypeSong="track" ';
			$this->db->where($where);
		}else{
			$this->db->where(array('songsblogs.IdBlog'=> $IdBlog,$this->getSongsTable().'.TypeSong'=>'track'));
		}
		
		
		$query = $this->db->get($this->getSongsTable(),$limit,$offset);
        return $query->result();
    }
	function getByGenre($name,$offset=0,$limit=500)
    {
		$this->db->order_by($this->getSongsTable().'.PubDate','DESC');
		$this->db->or_like(array('Title'=>$name,'Genres'=>$name)); 
		$query = $this->db->get($this->getSongsTable(),$limit,$offset);
        return $query->result();
    }
	function getSource($IdSong){
		
		$this->db->select('blogs.*');
		$this->db->join('blogs', $this->getSongsBlogsTable().'.IdBlog = blogs.IdBlog');
		
		$this->db->where(array($this->getSongsBlogsTable().'.IdSong'=> $IdSong));
		
		
		$query = $this->db->get($this->getSongsBlogsTable());
        $result = $query->result();
		return $result[0];
	}
    function insert($a)
    {
		
        $this->UrlSong   = $a->UrlSong;
		$this->TypeSong = $a->TypeSong;
		$this->TypeSource = $a->TypeSource;

		
		$this->Title=$a->Title;
		$this->Author=$a->Author;
		$this->Description=$a->Description;
		$this->Duration=$a->Duration;
		$this->Genres=$a->Genres;
		$this->Artwork=$a->Artwork;
		$this->IdSource=$a->IdSource;
		$this->PubDate=$a->PubDate;
		
        $this->db->insert($this->getSongsTable(), $this);
		
		$this->insertSongsBlogs($this->db->insert_id(),$a->IdBlog);
		
    }
	function insertSongsBlogs($IdSong,$IdBlog){
		
		$insert_query = $this->db->insert_string( $this->getSongsBlogsTable(),(object)array('IdSong'=>$IdSong,'IdBlog'=>$IdBlog));
		$insert_query = str_replace('INSERT INTO','INSERT IGNORE INTO',$insert_query);
		$this->db->query($insert_query);
		
	}
	function update($id,$data){
		$this->db->where('IdSong', $id);
		$this->db->update($this->getSongsTable(), $data); 
	}
	function getByUrl($url)
    {
            
		$query = $this->db->get_where($this->getSongsTable(), array('UrlSong' => $url));
		$count= $query->num_rows();    //counting result from query
		$result = $query->result();
		if($query->num_rows()==0){
			return false;
		}else{
			return $result[0];
		}
    } 
} 