	from bs4 import BeautifulSoup as bs
from selenium import webdriver
import pandas as pd
import requests

options = webdriver.ChromeOptions()
options.binary_location = '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
options.add_argument('window-size=800x841')
options.add_argument('headless')

def scrape1():
	#Mars News.
	driver1 = webdriver.Chrome(chrome_options=options)
	url1 = "https://mars.nasa.gov/news/"
	response1 = driver1.get(url1)
	html1 = driver1.page_source
	soup1 = bs(html1, "html.parser")
	try:
		news_title = soup1.find("div", class_="bottom_gradient").text
		news_p = soup1.find("div", class_="article_teaser_body").text
	except AttributeError as e:
		print(e)
	driver1.quit()

	#JPL Featured Image.
	driver2 = webdriver.Chrome(chrome_options=options)
	url2 = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
	resposne2 = driver2.get(url2)
	html2 = driver2.page_source
	soup2 = bs(html2, "html.parser")
	try:
		f_image = str(soup2.find("article", class_="carousel_item"))
		f_image_start = f_image.find("('")
		f_image_end = f_image.find("')")
		f_image_url = f_image[f_image_start+2: f_image_end]
		featured_image_url = f"https://www.jpl.nasa.gov{f_image_url}"
	except AttributeError as e:
		print (e)
	driver2.quit()

	#Mars Weather.
	driver3 = webdriver.Chrome(chrome_options=options)
	url3 = "https://twitter.com/marswxreport?lang=en"
	response3 = driver3.get(url3)
	html3 = driver3.page_source
	soup3 = bs(html3, "html.parser")
	try:
		mars_weather = soup3.find("div", class_="js-tweet-text-container").text
	except AttributeError as e:
		print(e)
	driver3.quit()

	#Mars Facts.
	url = "https://space-facts.com/mars/"
	tables = pd.read_html(url)
	try:
		df = tables[0]
		df.columns = [" ", "Values"]
		df = df.set_index([" "])
	except AttributeError as e:
		print (e)
	html_table = df.to_html()
	html_table.replace("\n", "")

	#Mars Hemispheres.
	driver4 = webdriver.Chrome(chrome_options=options)
	url4 = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
	response4 = driver4.get(url4)
	html4 = driver4.page_source
	soup4 = bs(html4, "html.parser")
	first_findall = soup4.find_all("div", class_="description")
	hemisphere_image_urls = []
	for first in first_findall:
		try:
			title = first.a.text
			link = first.a["href"]
			linker = f"https://astrogeology.usgs.gov{link}"
			response = requests.get(linker)
			soup = bs(response.text, "html.parser")
			jpegs = soup.find_all("div", class_="downloads")
			for jpeg in jpegs:
				mars_view = jpeg.a["href"]
				if (title and mars_view):
					post = {
					"title": title, 
					"img_url": mars_view
					}
					hemisphere_image_urls.append(post)
		except AttributeError as e:
			print (e)
	driver4.quit()


	mars_db = {}
	mars_db["news_title"] = news_title
	mars_db["news_text"] = news_p
	mars_db["featured_image"] = featured_image_url
	mars_db["mars_weather"] = mars_weather
	mars_db["mars_facts"] = html_table
	mars_db["mars_images"] = hemisphere_image_urls
	return mars_db

from splinter import Browser
def init_browser():
	executable_path = {"executable_path", "/user/local/bin/chromedriver"}
	return Browser("chrome", **executable_path, headless = False)