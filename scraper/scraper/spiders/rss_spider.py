import re
import json
import MySQLdb
import datetime
from scrapy.spider import BaseSpider
from scrapy.http import Request
from scraper.items import SongItem



class RSSSpider(BaseSpider):
    name = "rss_spider"
    id_blogs = {}

    urls_replace_dict_soundcloud = {'https://w.soundcloud.com/player/?url=': '',
                                    'http://w.soundcloud.com/player/?url=': '',
                                    '%3A': ':',
                                    '%2F': '/',
                                    '?feature=player': '',
                                    '?secret': '',
                                    '%3Fsecret': '',
                                    '?wmode=transparent': '',
                                    '/download': '',
                                    'http://w.soundcloud.com/player?url=': '',
                                    '/embed/': '/v/',
                                    'watch?v=': 'v/',
                                    '?feature=watch': '',
                                    '_embedded': '',
                                    '_detailpage': '',
                                    }

    urls_replace_dict_youtube = {'%3A': ':',
                                 '%2F': '/',
                                 '?feature=player': '',
                                 '?secret': '',
                                 '%3Fsecret': '',
                                 '?wmode=transparent': '',
                                 '/download': '',
                                 '/embed/': '/v/',
                                 'watch?v=': 'v/',
                                 '?feature=watch': '',
                                 '_embedded': '',
                                 '_detailpage': '',
                                 }


    def __init__(self):
        con = MySQLdb.connect('localhost', 'root', '11dejulio', 'spinsetter')
        cur = con.cursor()
        cur.execute('SELECT IdBlog, FeedBlog FROM blogs')
        rows = cur.fetchall()
        for i in rows:
            self.id_blogs[i[1]] = i[0] 
        self.start_urls = [i[1] for i in rows]
        print 'START URLS !!!!!'
        print self.start_urls


    def parse(self, response):
        content = response.body
        requests = []

        # soundcloud - find and clean urls, add resolve requests
        urls_soundcloud = re.findall(r'((https?\:)?//(w\.)?soundcloud\.com/[a-zA-Z0-9\+&@#\-\_/=\?%\.]+)', content)
        urls_soundcloud = [i[0] for i in urls_soundcloud]
        for i, j in self.urls_replace_dict_soundcloud.iteritems():
            urls_soundcloud = [k.replace(i, j) for k in urls_soundcloud]
        urls_soundcloud = [i.split('?')[0] for i in urls_soundcloud]
        urls_soundcloud = [i.split('&')[0] for i in urls_soundcloud]
        urls_soundcloud = [i.split('_')[0] for i in urls_soundcloud]
        for url in urls_soundcloud:
            if 'redirect_urls' in response.request.meta:
                id_blog = self.id_blogs[response.request.meta['redirect_urls'][0]]
            else:
                id_blog = self.id_blogs[response.request.url]
            requests.append(Request(url='http://api.soundcloud.com/resolve.json?url='+url+'&client_id=7d1117f42417d715b28ef9d59af7d57c&format=json&_status_code_map[302]=200', callback=self.parse_resolve_soundcloud, meta={'UrlSong': url, 'IdBlog': id_blog}))

        # youtube - find urls and ids, add metadata requests
        urls_youtube = re.findall(r'((https?\:)?//www\.youtube\.com/[a-zA-Z0-9\+&@#\-\_/=\?%\.]+)', content)
        urls_youtube = [i[0] for i in urls_youtube]
        for i, j in self.urls_replace_dict_youtube.iteritems():
            urls_youtube = [k.replace(i, j) for k in urls_youtube]
        urls_youtube = [i.split('?')[0] for i in urls_youtube]
        urls_youtube = [i.split('&')[0] for i in urls_youtube]
        urls_youtube = [i.split('_')[0] for i in urls_youtube]
        for i in range(len(urls_youtube)):
            if urls_youtube[i].find('youtube') >= 0:
                id = urls_youtube[i].split('outube.com/v/')
                id = id[1] if len(id) > 1 else ''
                id = id[0:12]
                if 'redirect_urls' in response.request.meta:
                    id_blog = self.id_blogs[response.request.meta['redirect_urls'][0]]
                else:
                    id_blog = self.id_blogs[response.request.url]
                requests.append(Request(url='http://gdata.youtube.com/feeds/api/videos/'+id+'?v=2&alt=jsonc', callback=self.parse_metadata_youtube, meta={'UrlSong': 'http://www.youtube.com/v/'+id, 'IdBlog': id_blog}))

        # return requests
        return requests


    def parse_resolve_soundcloud(self, response):
        content = response.body
        content_dict = json.loads(content)
        requests = []
        if content_dict['status'] == '302 - Found':
            requests.append(Request(url=content_dict['location'], callback=self.parse_metadata_soundcloud, meta=response.meta))
        return requests


    def parse_metadata_soundcloud(self, response):
        content = response.body
        content_dict = json.loads(content)
        item = SongItem()
        item['IdBlog'] = response.meta['IdBlog']
        item['UrlImage'] = None if not 'artwork_url' in content_dict else content_dict['artwork_url']
        item['UrlSong'] = response.meta['UrlSong']
        item['TypeSong'] = content_dict['kind']
        item['TypeSource'] = 'soundcloud'
        item['Title'] = 'unknown title' if not 'title' in content_dict else content_dict['title']
        item['Author'] = 'unknown author' if not 'user' in content_dict else content_dict['user']['username']
        item['Description'] = '' if not 'description' in content_dict else content_dict['description']
        item['Duration'] = '' if not 'duration' in content_dict else content_dict['duration']
        item['Genres'] = '' if not 'genre' in content_dict else content_dict['genre']
        item['Artwork'] = str(content_dict['id']) + '.jpg'
        item['IdSource'] = content_dict['id']
        item['PubDate'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return item


    def parse_metadata_youtube(self, response):
        content = response.body
        content_dict = json.loads(content)
        if 'title' in content_dict['data']:
            item = SongItem()
            item['IdBlog'] = response.meta['IdBlog']
            item['UrlImage'] = None if not 'thumbnail' in content_dict['data'] else content_dict['data']['thumbnail']['hqDefault']
            item['UrlSong'] = response.meta['UrlSong']
            item['TypeSong'] = 'track'
            item['TypeSource'] = 'youtube'
            item['Title'] = content_dict['data']['title']
            item['Author'] = content_dict['data']['uploader']
            item['Description'] = content_dict['data']['description']
            item['Duration'] = content_dict['data']['duration']
            item['Genres'] = content_dict['data']['category']
            item['Artwork'] = str(content_dict['data']['id']) + '.jpg'
            item['IdSource'] = content_dict['data']['id']
            item['PubDate'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            return item
    


