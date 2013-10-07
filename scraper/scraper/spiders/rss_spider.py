import re
import json
from scrapy.spider import BaseSpider
from scrapy.http import Request


class RSSSpider(BaseSpider):
    name = "rss_spider"
    #allowed_domains = ["anewbandaday.com"]
    start_urls = [
        "http://www.anewbandaday.com/feed",
        "http://feeds.feedburner.com/allthingsgomusic",
        "http://blahblahblahscience.com/feed",
        "http://buzzbands.la/feed/",
        "http://www.secretdecoder.net/feeds/posts/default?alt=rss",
        ]

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

    def parse(self, response):
        content = response.body
        requests = []

        # soundcloud
        urls_soundcloud = re.findall(r'((https?\:)?//(w\.)?soundcloud\.com/[a-zA-Z0-9\+&@#\-\_/=\?%\.]+)', content)
        urls_soundcloud = [i[0] for i in urls_soundcloud]
        for i, j in self.urls_replace_dict_soundcloud.iteritems():
            urls_soundcloud = [k.replace(i, j) for k in urls_soundcloud]
        urls_soundcloud = [i.split('?')[0] for i in urls_soundcloud]
        urls_soundcloud = [i.split('&')[0] for i in urls_soundcloud]
        urls_soundcloud = [i.split('_')[0] for i in urls_soundcloud]
        #print urls_soundcloud
        for url in urls_soundcloud:
            requests.append(Request(url='http://api.soundcloud.com/resolve.json?url='+url+'&client_id=7d1117f42417d715b28ef9d59af7d57c&format=json&_status_code_map[302]=200', callback=self.parse_metadata_soundcloud, meta={'url': url}))

        # youtube
        urls_youtube = re.findall(r'((https?\:)?//www\.youtube\.com/[a-zA-Z0-9\+&@#\-\_/=\?%\.]+)', content)
        urls_youtube = [i[0] for i in urls_youtube]
        for i, j in self.urls_replace_dict_youtube.iteritems():
            urls_youtube = [k.replace(i, j) for k in urls_youtube]
        urls_youtube = [i.split('?')[0] for i in urls_youtube]
        urls_youtube = [i.split('&')[0] for i in urls_youtube]
        urls_youtube = [i.split('_')[0] for i in urls_youtube]
        for i in range(len(urls_youtube)):
            if urls_youtube[i].find('youtube') >= 0:
                url = urls_youtube[i].split('outube.com/v/')
                url = url[1] if len(url) > 1 else ''
                url = 'http://www.youtube.com/v/'+url[0:12]
                urls_youtube[i] = url
        print urls_youtube

        # return metadata requests
        return requests

    def parse_metadata_soundcloud(self, response):
        content = response.body
        print json.loads(content)
        #print response.meta['url']
        
