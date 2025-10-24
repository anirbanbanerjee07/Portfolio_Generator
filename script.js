const generateBtn = document.getElementById("generateBtn");
const portfolioDiv = document.getElementById("portfolio");
const downloadBtn = document.getElementById("downloadBtn");
const themeToggle = document.getElementById("themeToggle");

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  themeToggle.textContent = document.body.classList.contains("light-mode") ? "🌞" : "🌙";
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-mode") ? "light" : "dark"
  );
});

window.addEventListener("load", () => {
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "🌞";
  }
});

// Generate portfolio from GitHub
generateBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("⚠️ Enter a GitHub username!");

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error("User not found");
    const user = await userRes.json();

    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=8`
    );
    const repos = await repoRes.json();

    portfolioDiv.innerHTML = `
      <div class="profile-card">
        <img src="${user.avatar_url}" alt="${user.name}">
        <h2>${user.name || "No name"}</h2>
        <p>@${user.login}</p>
        <p>${user.bio || "No bio available"}</p>
        <p>👥 ${user.followers} Followers | 🔥 ${user.following} Following</p>
        <p>📍 ${user.location || "Unknown"}</p>
        <a href="${user.html_url}" target="_blank" class="project-card">Visit GitHub Profile</a>
      </div>
      <h3>🧩 Top Repositories</h3>
      <div class="projects">
        ${repos
          .map(
            (repo) => `
          <div class="project-card">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || "No description"}</p>
            <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  } catch (err) {
    portfolioDiv.innerHTML = `<p style="color:red;">❌ ${err.message}</p>`;
  }
});

// Download portfolio as PDF
downloadBtn.addEventListener("click", async () => {
  if (!portfolioDiv.innerHTML.trim()) return alert("⚠️ Generate a portfolio first!");

  try {
    const canvas = await html2canvas(portfolioDiv, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "pt", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const username = document.getElementById("username").value.trim() || "portfolio";
    pdf.save(`${username}-portfolio.pdf`);
  } catch (err) {
    alert("❌ Failed to generate PDF: " + err.message);
  }
});
