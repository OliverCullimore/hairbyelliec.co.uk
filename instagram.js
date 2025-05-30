const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Config
const instagramProfile = "hairbyellie.c";
const numPosts = 6;
const downloadDirectory = "images/instagram";
const jsonFeedPath = `https://instagram-graph-cfworker.olivercullimore.workers.dev/${instagramProfile}`;

// Function to download & resize the image to a square
async function downloadImage(url, outputPath, size) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    await sharp(response.data)
      .resize(size, size, { fit: "cover" }) // Resize to a square
      .toFile(outputPath);
    console.log(`Resized and saved: ${outputPath}`);
  } catch (error) {
    console.error(`Failed to resize image:`, error.message);
  }
}

// Main function to process the feed and download images
async function run() {
  if (fs.existsSync(downloadDirectory)) {
    fs.rmSync(downloadDirectory, { recursive: true });
  }
  fs.mkdirSync(downloadDirectory, { recursive: true });

  // Load the JSON feed
  let jsonData;
  try {
    const response = await axios.get(jsonFeedPath);
    jsonData = response.data;
  } catch (error) {
    console.error("Failed to load the JSON feed:", error.message);
    return;
  }

  // Get latest {numPosts} posts
  const data = jsonData.data.slice(0, numPosts);

  // Download post images & add HTML
  let html = "";
  data.forEach((item) => {
    const outputPath = path.join(downloadDirectory, `${item.id}.png`);
    // Caption
    const caption = (item.caption || "").trim();
    const shortCaption = caption
      .replace(/(?:\r\n|\r|\n)/g, " ")
      .replace(/([^a-z0-9 .#:/\\]+)/gi, "")
      .replace(/\s+/g, " ");
    // Use thumbnail if video
    if (item.media_type == "VIDEO") {
      item.media_url = item.thumbnail_url;
    }
    // Download image
    downloadImage(item.media_url, outputPath, 400);
    // Add post to HTML
    html += `<a href="${item.permalink}" title="${shortCaption}" target="_blank"><img src="/${outputPath}" alt="${shortCaption}" /><div>${caption}</div></a>`;
  });
  // Update HTML file?
  if (html != "") {
    html =
      `<a href="https://instagram.com/${instagramProfile}" title="@${instagramProfile}" target="_blank"><span class="iconify" data-icon="simple-icons:instagram"></span>&nbsp;${instagramProfile}</a>` +
      html;

    // Update homepage HTML
    let pageHtml = fs.readFileSync("index.tpl");
    pageHtml = pageHtml.toString();
    pageHtml = pageHtml.replace("{{instagramfeed}}", html);
    fs.writeFileSync("index.html", pageHtml);

    // Update sitemap XML
    const date = new Date();
    let sitemapDate = date.toISOString().split("T")[0];
    let sitemap = fs.readFileSync("sitemap.tpl");
    sitemap = sitemap.toString();
    sitemap = sitemap.replaceAll("{{date}}", sitemapDate);
    fs.writeFileSync("sitemap.xml", sitemap);

    console.log("Instagram feed updated");
  } else {
    console.log("Instagram feed empty!");
  }
}

// Run
run();
