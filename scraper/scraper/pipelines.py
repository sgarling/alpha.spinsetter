import MySQLdb
import urllib
import shutil

class ScraperPipeline(object):
    con = None
    img_default = '/var/www/alpha/public/img/default-player-artwork.png'
    img_path = 'artwork/'
    songs_table = 'songs_scrapy'
    songsblogs_table = 'songsblogs_scrapy'

    def __init__(self):
        self.con = MySQLdb.connect('localhost', 'root', '11dejulio', 'spinsetter', charset='utf8', use_unicode=True)

    def process_item(self, item, spider):
        cur = self.con.cursor()
        cur.execute("SELECT * FROM " + self.songs_table + " where UrlSong='" + item['UrlSong'] + "'")
        rows = cur.fetchall()
        if len(rows) == 0:
            if item['UrlImage'] != None:
                urllib.urlretrieve(item['UrlImage'], self.img_path+item['Artwork'])
                print 'Download Image: ' + item['UrlImage']
            else:
                shutil.copy(self.img_default, self.img_path+item['Artwork'])
                #print 'Copy Artwork: ' + self.img_path+item['Artwork']
            print 'Insert Song: ' + item['UrlSong']
            cur.execute("INSERT INTO " + self.songs_table + " (UrlSong, TypeSong, TypeSource, Title, Author, Description, Duration, Genres, Artwork, IdSource, PubDate) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", \
                            (item['UrlSong'], item['TypeSong'], item['TypeSource'], item['Title'], item['Author'], item['Description'], item['Duration'], item['Genres'], item['Artwork'], item['IdSource'], item['PubDate']))
            self.con.commit()
            cur.execute("SELECT IdSong from " + self.songs_table + " WHERE UrlSong='" + item['UrlSong'] + "'")
            rows = cur.fetchall()
            if len(rows) > 0:
                id_song = str(rows[0][0])
                cur.execute("INSERT INTO " + self.songsblogs_table + " (IdSong, IdBlog) VALUES (%s,  %s)", (id_song, item['IdBlog']))
                self.con.commit()
        return item
