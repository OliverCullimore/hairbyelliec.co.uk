/* Instagram Feed */
async function loadInstagramFeed() {
  const feedElement = document.getElementById("instagramfeed");
  try {
    if (feedElement !== undefined) {
      const response = await fetch("/instagram.html");
      if (!response.ok) throw new Error("Failed to fetch Instagram feed");
      const feed = await response.text();
      console.log(feed);
      feedElement.innerHTML = feed;
      if (feedElement.innerHTML != "") {
        feedElement.style.display = "grid";
      }
    }
  } catch (error) {
    console.error("Error loading Instagram feed: ", error);
  }
}
loadInstagramFeed();
