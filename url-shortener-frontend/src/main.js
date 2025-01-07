// main.js
document.getElementById("shortenTab").addEventListener("click", () => {
  showSection("shorten");
});

document.getElementById("expandTab").addEventListener("click", () => {
  showSection("expand");
});

function showSection(section) {
  const shortenSection = document.getElementById("shortenSection");
  const expandSection = document.getElementById("expandSection");
  const shortenTab = document.getElementById("shortenTab");
  const expandTab = document.getElementById("expandTab");

  if (section === "shorten") {
    shortenSection.classList.remove("hidden");
    expandSection.classList.add("hidden");
    shortenTab.classList.add("active");
    expandTab.classList.remove("active");
  } else {
    expandSection.classList.remove("hidden");
    shortenSection.classList.add("hidden");
    expandTab.classList.add("active");
    shortenTab.classList.remove("active");
  }
}

// Shorten URL
document.getElementById("shortenBtn").addEventListener("click", async () => {
  const longUrl = document.getElementById("longUrl").value;
  if (!longUrl) {
    alert("Please enter a URL");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ long_url: longUrl }),
    });

    const data = await response.json();
    if (data.short_url) {
      document.getElementById(
        "shortenResult"
      ).innerHTML = `Shortened URL: <a href="http://localhost:8080/sh/${data.short_url}" target="_blank">http://localhost:8080/sh/${data.short_url}</a>`;
    } else {
      document.getElementById("shortenResult").innerHTML =
        "Error shortening URL.";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("shortenResult").innerHTML =
      "Failed to connect to the server.";
  }
});

// Expand URL
document.getElementById("expandBtn").addEventListener("click", async () => {
  const shortUrl = document.getElementById("shortUrl").value;
  if (!shortUrl) {
    alert("Please enter a short URL");
    return;
  }

  const shortUrlCode = shortUrl.split("/").pop();

  try {
    const response = await fetch(
      `http://localhost:8080/expand/${shortUrlCode}`
    );
    const data = await response.json();
    if (data.long_url) {
      document.getElementById(
        "expandResult"
      ).innerHTML = `Original URL: <a href="${data.long_url}" target="_blank">${data.long_url}</a>`;
    } else {
      document.getElementById("expandResult").innerHTML =
        "Error expanding URL.";
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("expandResult").innerHTML =
      "Failed to connect to the server.";
  }
});
