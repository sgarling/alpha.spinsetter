# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy.item import Item, Field

# class SpinsetterItem(Item):
    # define the fields for your item here like:
    # name = Field()
#    pass

class SongItem(Item):
    IdBlog = Field()
    UrlImage = Field()

    #IdSong = Field()   autoincremented
    UrlSong = Field() 
    TypeSong  = Field() 
    TypeSource  = Field() 
    Title = Field() 
    Author = Field() 
    Description = Field() 
    Duration = Field() 
    Genres = Field() 
    Artwork = Field() 
    IdSource = Field() 
    PubDate = Field() 

