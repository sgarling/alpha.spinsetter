import MySQLdb
import urllib
import shutil

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
            if item['UrlImage'] != None:
                urllib.urlretrieve(item['UrlImage'], self.img_path+item['Artwork'])
                print 'Download UrlImage: '+item['UrlImage']
            else:
                shutil.copy(self.img_default, self.img_path+item['Artwork'])
                print 'Copy Artwork: '+self.img_path+item['Artwork']
        return item
