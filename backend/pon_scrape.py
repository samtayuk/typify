import asyncio
import sys
import signal
import logging
import httpx
import asyncio
import os
import time
from itertools import chain
from logging.handlers import TimedRotatingFileHandler
from asyncio import AbstractEventLoop
from bs4 import BeautifulSoup

import re

ingredient_list = []
url_complete = []
skipped_urls = []
recipe_urls = []



class WebScraper:
    def __init__(self) -> None:
        pass

    async def run(self, number_workers: int) -> None:
        pass


class WebItem:
    def __init__(self, url: str, processor):
        self.url: str = url
        self.processor = processor

    def process(self, queue: asyncio.Queue, client: httpx.AsyncClient) -> None:
        pass

class HTTPError(Exception):
    pass


class WorkItem:
    def __init__(self, url: str, processor):
        self.url: str = url
        self.processor = processor


async def fetch(client: httpx.AsyncClient, url: str) -> BeautifulSoup:
    try:
        r = await client.get(url)
    except Exception as e:
        raise HTTPError(e)

    if r.status_code != 200:
        raise HTTPError(f"{r.status_code} for {url}")

    return BeautifulSoup(r.text, 'html.parser')


async def get_category_urls(queue: asyncio.Queue, client: httpx.AsyncClient, url: str) -> None:
    try:
        r = await fetch(client, url)
    except HTTPError as e:
        return

    results = r.find_all("div", class_="pon-box-grid")

    for cat in results:
        queue.put_nowait(WorkItem(cat.find("a")["href"], get_cat_recipes_urls))

def get_page_number(title: str) -> int:
    return int(re.findall(r"\(page ([0-9]+) of ([0-9]+)\)", title)[0][0])


def get_total_pages(title: str) -> int:
    return int(re.findall(r"\(page ([0-9]+) of ([0-9]+)\)", title)[0][1])

async def get_cat_recipes_urls(queue: asyncio.Queue, client: httpx.AsyncClient, url: str) -> None:
    #self.logger.info(f"Started grabbing {url}")
    try:
        r = await fetch(client, url)
    except HTTPError as e:
        print(f"HTTP Error: {e}")
        return

    results = r.find(id="pon-category-container")
    title = results.find("h3", class_="pon-recipe-category-carousel-title").text

    if get_page_number(title) == 1:
        for i in range(2, int(get_total_pages(title)) + 1):
            queue.put_nowait(WorkItem(f"{url}page/{i}", get_cat_recipes_urls))

    if results is not None:
        for result in results.find_all("div", class_="pon-recipe-thumbnail-image"):
            recipe_url = result.find("a")["href"]

            if recipe_url not in recipe_urls:
                recipe_urls.append(recipe_url)
                queue.put_nowait(WorkItem(recipe_url, get_recipe))


async def get_recipe(queue: asyncio.Queue, client: httpx.AsyncClient, url: str) -> None:
    try:
        r = await fetch(client, url)
    except HTTPError as e:
        return

    elem_ingredients = r.find_all('li', class_='wprm-recipe-ingredient')

    for elem_ingredient in elem_ingredients:
        ingredient = elem_ingredient.find('span', class_='wprm-recipe-ingredient-name').text
        if ingredient not in ingredient_list:
            ingredient_list.append(ingredient)


async def worker(worker_id: int, queue: asyncio.Queue, client: httpx.AsyncClient):
    print(f'Worker {worker_id}')
    while True:
        work_item: WorkItem = await queue.get()
        if work_item.url in url_complete:
            print(f"Worker {worker_id}: Skipping {work_item.url}")
            skipped_urls.append(work_item.url)
        else:
            print(f"Worker {worker_id}: Processing {work_item.url}")
            await work_item.processor(queue, client, work_item.url)
            print(f"Worker {worker_id}: Finished {work_item.url}")
            url_complete.append(work_item.url)

        queue.task_done()
        print(f"Queue size: {queue.qsize()} of {len(url_complete)} {len(skipped_urls)}")


async def main():
    url_queue = asyncio.Queue()
    url_queue.put_nowait(WorkItem("https://pinchofnom.com/recipes/", get_category_urls))

    transport = httpx.AsyncHTTPTransport(retries=1)
    async with httpx.AsyncClient(transport=transport, follow_redirects=True) as client:
        workers = [asyncio.create_task(worker(i, url_queue, client)) for i in range(100)]

        #while not url_queue.empty():
        #    print(f"Queue size: {url_queue.qsize()}")

        await url_queue.join()
        [w.cancel() for w in workers]

    import csv
    with open('ingredients.csv', 'w', newline='') as csvfile:
        csv_write = csv.writer(csvfile)
        csv_write.writerow(["Ingredient"])
        for ingredient in list(set(ingredient_list)):
            csv_write.writerow([ingredient])

    print(f"Skipped {len(skipped_urls)} urls")


if __name__ == "__main__":
    start_time = time.time()
    print("Starting")
    asyncio.run(main())
    print("--- %s seconds ---" % (time.time() - start_time))