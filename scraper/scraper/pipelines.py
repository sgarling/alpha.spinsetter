import MySQLdb
import urllib


class ScraperPipeline(object):
    con = None
    img_default = '/var/www/alpha/public/img/default-player-artwork.png'
    img_path = 'artwork/'

    def __init__(self):
        self.con = MySQLdb.connect('localhost', 'root', '11dejulio', 'spinsetter')

    def process_item(self, item, spider):
        cur = self.con.cursor()
        cur.execute("SELECT * FROM songs where UrlSong='" + item['UrlSong'] + "'")
        rows = cur.fetchall()
        if len(rows) == 0:
            if item['UrlImage'] != '':
                urllib.urlretrieve(item['UrlImage'], self.img_path+item['Artwork'])
            print 'UrlImage: ' + item['UrlImage']
            
        return item
