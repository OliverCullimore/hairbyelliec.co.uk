/* Instagram Feed */
async function populateInstagramFeed() {
  const feedElement = document.getElementById("instagramfeed");
  const feedUrl =
    "https://instagram-graph-cfworker.olivercullimore.workers.dev/hairbyellie.c";

  try {
    if (feedElement !== undefined) {
      const response = await fetch(feedUrl);
      if (!response.ok) throw new Error("Failed to fetch Instagram feed");

      const feed = await response.json();
      feed.data.slice(-6).forEach((item) => {
        const a = document.createElement("a");
        a.href = item.permalink;
        a.target = "_blank";
        const img = document.createElement("img");
        if (item.media_type == "VIDEO") {
          img.src = item.thumbnail_url;
        } else {
          img.src = item.media_url;
        }
        img.alt = item.caption || "";
        a.appendChild(img);
        feedElement.appendChild(a);
      });
      if (feedElement.innerHTML != "") {
        const a = document.createElement("a");
        a.href = "https://instagram.com/hairbyellie.c";
        a.target = "_blank";
        a.innerHTML = "@hairbyellie.c";
        feedElement.prepend(a);
        feedElement.style.display = "grid";
      }
    }
  } catch (error) {
    console.error("Error loading Instagram feed: ", error);
  }
}
populateInstagramFeed();
