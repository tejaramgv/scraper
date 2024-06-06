import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import express from 'express';
import cheerio from 'cheerio';
import cors from 'cors';

const app = express();
// Using cors to allow cross-origin requests
app.use(cors());
app.use(express.json());

let textContents = [];
let imgUrls = [];
let titles = [];
let dates = [];
let urls = [];

const extractTextContent = async (url) => {
  // Using puppeteer to scrape the data
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar',
    ),
    headless: chromium.headless,
    timeout: 300000, // Set the launch timeout to 5 minutes
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(300000); // Set the default navigation timeout to 5 minutes

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 300000 }); // Set the navigation timeout to 5 minutes
  } catch (error) {
    console.error(`Navigation to ${url} failed: ${error.message}`);
    await browser.close();
    throw error;
  }

  // Wait for the main content to be loaded
  try {
    await page.waitForSelector('main', { timeout: 300000 }); // Set the waitForSelector timeout to 5 minutes
  } catch (error) {
    console.error(`Selector 'main' not found: ${error.message}`);
    await browser.close();
    throw error;
  }

  const content = await page.content();
  const $ = cheerio.load(content);

  // Get text content of all elements within the 'main' section
  const mainElements = $('main');

  mainElements.each((index, element) => {
    textContents = [];
    imgUrls = [];
    titles = [];
    dates = [];
    urls = [];

    // Getting author names
    const paragraphs = $('article p');
    let check = true;
    const isDigit = (str) => /^\d+$/.test(str);

    paragraphs.each((index, element) => {
      const textContent = $(element).text().trim();

      if (textContents.length == 5) {
        return;
      }
      if (textContent === "in") {
        check = false;
      } else {
        if (check === true && !isDigit(textContent)) {
          textContents.push(textContent);
        } else {
          check = true;
        }
      }
    });
    console.log(textContents);

    // Getting articles titles
    const title = $('article h2');
    title.each((index, element) => {
      const titleContent = $(element).text().trim();
      if (titles.length == 5) {
        return;
      }
      titles.push(titleContent);
    });
    console.log(titles);

    // Getting published dates
    const published_date = $('article .h');
    published_date.each((index, element) => {
      const date = $(element).text().trim();
      const trimmedDate = date.match(/\d+\s+(?:hours ago|days ago|minutes ago)/i);
      if (dates.length == 5) {
        return;
      }
      if (trimmedDate) {
        dates.push(trimmedDate[0]);
      }
    });
    console.log(dates);

    // Getting article links
    const url = $('article div');
    url.each((index, element) => {
      const urlText = $(element).attr('data-href');
      if (urls.length == 5) {
        return;
      }
      if (!urls.includes(urlText) && urlText !== undefined) {
        urls.push(urlText);
      }
    });
    console.log(urls);

    // Getting author images
    const images = $('article .fz');
    images.each((index, element) => {
      const image = $(element).attr('src');
      if (imgUrls.length == 5) {
        return;
      }
      if (image !== undefined) {
        imgUrls.push(image);
      }
    });
    console.log(imgUrls);
  });

  await browser.close();
  return textContents;
};

// '/scrape'
app.post('/scrape', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.send({ error: 'Topic is required' });
  }

  try {
    const textContents = await extractTextContent(`https://medium.com/search?q=${topic}`);
    res.send({ success: true, message: "Scrape Success" });
  } catch (error) {
    console.error(error);
    res.send({ message: error.message });
  }
});

// '/articles'
app.get('/articles', async (req, res) => {
  res.send({ textContents, titles, dates, urls, imgUrls });
});

// Starting the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
