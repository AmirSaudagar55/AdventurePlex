const axios = require('axios');
const cheerio = require('cheerio');

function slugify(activityName) {
  return activityName.toLowerCase().trim().replace(/\s+/g, '-');
}

async function scrapeActivityDetails(activityName) {
  const slug = slugify(activityName);
  const url = `https://playarena.in/activity/${slug}/`;
  console.log(`Scraping details for "${activityName}" at ${url}`);

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const details = {};
    const imageUrls = [];

    // Scrape activity details
    $('.meta-data-wrapper .content-wrap .row').each((i, row) => {
      const pHTML = $(row).find('p').html() || '';
      const parts = pHTML.split('<br>');
      if (parts.length === 2) {
        const value = cheerio.load(parts[0])('strong').text().trim();
        const label = cheerio.load(parts[1]).text().trim();
        if (label) {
          details[label] = value;
        }
      }
    });

    // Scrape activity images
    $('.activity-single-page-slider img').each((i, img) => {
      const imgUrl = $(img).attr('src');
      if (imgUrl) {
        imageUrls.push(imgUrl);
      }
    });

    return { details, imageUrls };
  } catch (error) {
    console.error(`Error scraping details for ${activityName} at ${url}:`, error.message);
    return null;
  }
}

async function main() {
  const activityNames = [
    'Car Simulator',
    'Cricket Simulator',
    'Lazermaze',
    '7D Theatre',
    'VR Escape',
    'VR Coaster',
    'Archery',
    'Rope Course',
    'Rocket Ejector',
    'Climbing',
    'Trampoline Park',
    'Shooting',
    'Carnival Games',
    'The Field',
    'Badminton',
    'Basketball',
    'Cricket Nets',
    'Swimming Pool',
    'Skate Park',
    'Gym',
    'Gokarting',
    'Bowling',
    'Lasertag',
    'Paintball',
    'Off Road ATV',
    'Bumper Cars',
    'Virtual Verve',
    'Little Gym',
    'Soft Play'
  ];

  const results = {};

  for (const activity of activityNames) {
    const result = await scrapeActivityDetails(activity);
    results[activity] = result;
  }

  console.log('Scraped Activity Data:', results);
}

main();