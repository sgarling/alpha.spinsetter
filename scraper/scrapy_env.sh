#!/bin/bash 

export DYLD_LIBRARY_PATH=/opt/local/lib/:$DYLD_LIBRARY_PATH
scrapy crawl rss_spider
