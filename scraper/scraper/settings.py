# Scrapy settings for spinsetter project
#
# For simplicity, this file contains only the most important settings by
# default. All the other settings are documented here:
#
#     http://doc.scrapy.org/en/latest/topics/settings.html
#

BOT_NAME = 'scraper'

SPIDER_MODULES = ['scraper.spiders']
NEWSPIDER_MODULE = 'scraper.spiders'

# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = 'spinsetter (+http://www.yourdomain.com)'


LOG_LEVEL = 'INFO'
DEFAULT_ITEM_CLASS = 'scraper.items.SongItem'
ITEM_PIPELINES = ['scraper.pipelines.ScraperPipeline']
