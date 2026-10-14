const GITHUB_API_BASE = "https://api.github.com/users";
let githubToken = localStorage.getItem("dev_detective_token") || "";

const searchModeBtn = document.getElementById("searchModeBtn");
  const battleModeBtn = document.getElementById("battleModeBtn");
const singleSearchSection = document.getElementById("singleSearchSection");
 const battleModeSection = document.getElementById("battleModeSection");
const themeToggleBtn = document.getElementById("themeToggleBtn");
  const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");
 const tokenToggleBtn = document.getElementById("tokenToggleBtn");
const tokenBar = document.getElementById("tokenBar");
  const githubTokenInput = document.getElementById("githubTokenInput");
const saveTokenBtn = document.getElementById("saveTokenBtn");
  const clearTokenBtn = document.getElementById("clearTokenBtn");
const tokenStatusMsg = document.getElementById("tokenStatusMsg");

const searchForm = document.getElementById("searchForm");
 const usernameInput = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");
  const searchErrorHint = document.getElementById("searchErrorHint");
const loadingIndicator = document.getElementById("loadingIndicator");
 const errorState = document.getElementById("errorState");
const errorTitle = document.getElementById("errorTitle");
  const errorDescription = document.getElementById("errorDescription");
const errorRetryBtn = document.getElementById("errorRetryBtn");
 const profileContainer = document.getElementById("profileContainer");

const userAvatar = document.getElementById("userAvatar");
 const userName = document.getElementById("userName");
const userLoginLink = document.getElementById("userLoginLink");
  const userJoined = document.getElementById("userJoined");
const userBio = document.getElementById("userBio");
 const statRepos = document.getElementById("statRepos");
const statFollowers = document.getElementById("statFollowers");
  const statFollowing = document.getElementById("statFollowing");
const metaLocation = document.getElementById("metaLocation");
 const metaLocationWrapper = document.getElementById("metaLocationWrapper");
const metaBlog = document.getElementById("metaBlog");
 const metaBlogWrapper = document.getElementById("metaBlogWrapper");
const metaTwitter = document.getElementById("metaTwitter");
 const metaTwitterWrapper = document.getElementById("metaTwitterWrapper");
const metaCompany = document.getElementById("metaCompany");
 const metaCompanyWrapper = document.getElementById("metaCompanyWrapper");
const reposList = document.getElementById("reposList");
  const repoCountBadge = document.getElementById("repoCountBadge");
const quickChips = document.querySelectorAll(".chip-btn");

const battleForm = document.getElementById("battleForm");
 const battleUser1Input = document.getElementById("battleUser1Input");
const battleUser2Input = document.getElementById("battleUser2Input");
 const startBattleBtn = document.getElementById("startBattleBtn");
const battleLoading = document.getElementById("battleLoading");
  const battleError = document.getElementById("battleError");
const battleErrorTitle = document.getElementById("battleErrorTitle");
 const battleErrorDesc = document.getElementById("battleErrorDesc");
const battleResults = document.getElementById("battleResults");
  const battleAnnouncement = document.getElementById("battleAnnouncement");
const battleCardsContainer = document.getElementById("battleCardsContainer");

const LANGUAGE_COLORS = {
   JavaScript: "#f1e05a",
 TypeScript: "#3178c6",
   HTML: "#e34c26",
   CSS: "#563d7c",
 Python: "#3572A5",
   Java: "#b07219",
 "C++": "#f34b7d",
   C: "#555555",
 "C#": "#178600",
   PHP: "#4F5D95",
 Go: "#00ADD8",
   Rust: "#dea584",
 Ruby: "#701516",
   Swift: "#F05138",
 Kotlin: "#A97BFF",
   Dart: "#00B4AB",
 Shell: "#89e051"
};

function formatDate(isoString) {
   if (!isoString) return "Not available";
 const date = new Date(isoString);
   if (isNaN(date.getTime())) return "Invalid date";

 const day = date.getDate();
   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
 const month = months[date.getMonth()];
   const year = date.getFullYear();

 return day + " " + month + " " + year;
}

function getApiHeaders() {
   const headers = {
      "Accept": "application/vnd.github.v3+json"
   };
   if (githubToken && githubToken.trim() !== "") {
      headers["Authorization"] = "token " + githubToken.trim();
   }
   return headers;
}

async function fetchUserProfile(username) {
   const cleanUsername = username.trim();
 const url = GITHUB_API_BASE + "/" + encodeURIComponent(cleanUsername);

   const response = await fetch(url, {
      method: "GET",
      headers: getApiHeaders()
   });

   if (!response.ok) {
      if (response.status === 404) {
         const err = new Error("User not found");
         err.status = 404;
         throw err;
      } else if (response.status === 403) {
         const err = new Error("API rate limit exceeded");
         err.status = 403;
         throw err;
      } else {
         const err = new Error("API error: " + response.status);
         err.status = response.status;
         throw err;
      }
   }

   return await response.json();
}

async function fetchUserRepos(reposUrl) {
   const url = reposUrl + "?sort=updated&per_page=15";

   const response = await fetch(url, {
      method: "GET",
      headers: getApiHeaders()
   });

   if (!response.ok) {
      return [];
   }

   return await response.json();
}

function renderProfile(user) {
 userAvatar.src = user.avatar_url || "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
   userAvatar.alt = user.login;
 userName.textContent = user.name || user.login;
   userLoginLink.textContent = "@" + user.login;
 userLoginLink.href = user.html_url;

   userJoined.textContent = "Joined " + formatDate(user.created_at);

   if (user.bio && user.bio.trim() !== "") {
    userBio.textContent = user.bio;
      userBio.style.opacity = "1";
 } else {
    userBio.textContent = "This profile has no bio";
      userBio.style.opacity = "0.7";
   }

 statRepos.textContent = user.public_repos !== undefined ? user.public_repos.toLocaleString() : "0";
   statFollowers.textContent = user.followers !== undefined ? user.followers.toLocaleString() : "0";
 statFollowing.textContent = user.following !== undefined ? user.following.toLocaleString() : "0";

   if (user.location) {
    metaLocation.textContent = user.location;
      metaLocationWrapper.classList.remove("unavailable");
 } else {
    metaLocation.textContent = "Not Available";
      metaLocationWrapper.classList.add("unavailable");
   }

   if (user.blog && user.blog.trim() !== "") {
      let cleanUrl = user.blog.trim();
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
         cleanUrl = "https://" + cleanUrl;
      }
    metaBlog.textContent = user.blog;
      metaBlog.href = cleanUrl;
    metaBlogWrapper.classList.remove("unavailable");
 } else {
    metaBlog.textContent = "Not Available";
      metaBlog.removeAttribute("href");
    metaBlogWrapper.classList.add("unavailable");
   }

   if (user.twitter_username) {
    metaTwitter.textContent = "@" + user.twitter_username;
      metaTwitter.href = "https://twitter.com/" + user.twitter_username;
    metaTwitterWrapper.classList.remove("unavailable");
 } else {
    metaTwitter.textContent = "Not Available";
      metaTwitter.removeAttribute("href");
    metaTwitterWrapper.classList.add("unavailable");
   }

   if (user.company) {
    metaCompany.textContent = user.company;
      metaCompanyWrapper.classList.remove("unavailable");
 } else {
    metaCompany.textContent = "Not Available";
      metaCompanyWrapper.classList.add("unavailable");
   }
}

function renderRepositories(repos) {
   reposList.innerHTML = "";

   if (!repos || repos.length === 0) {
      reposList.innerHTML = '<div class="repo-empty-state"><p>No public repositories found.</p></div>';
      repoCountBadge.textContent = "0 Repos";
      return;
   }

 const top5Repos = repos.slice(0, 5);
   repoCountBadge.textContent = top5Repos.length + " Repos";

 top5Repos.forEach(function (repo) {
      const card = document.createElement("article");
      card.className = "repo-card";

      const langColor = LANGUAGE_COLORS[repo.language] || "#8b949e";
      const langDisplay = repo.language ? repo.language : "General";
      const descriptionText = repo.description ? repo.description : "No description provided.";
      const updatedFormatted = formatDate(repo.updated_at);

      card.innerHTML = `
        <div class="repo-top">
          <a class="repo-name-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            ${repo.name}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          <span class="repo-visibility">${repo.private ? "Private" : "Public"}</span>
        </div>

        <p class="repo-desc">${descriptionText}</p>

        <div class="repo-meta">
          <div class="repo-meta-item">
            <span class="lang-dot" style="background-color: ${langColor};"></span>
            <span>${langDisplay}</span>
          </div>

          <div class="repo-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>${repo.stargazers_count.toLocaleString()}</span>
          </div>

          <div class="repo-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="6" y1="3" x2="6" y2="15"></line>
              <circle cx="18" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M18 9a9 9 0 0 1-9 9"></path>
            </svg>
            <span>${repo.forks_count.toLocaleString()}</span>
          </div>

          <div class="repo-meta-item">
            <span>Updated ${updatedFormatted}</span>
          </div>
        </div>
      `;

      reposList.appendChild(card);
   });
}

async function handleUserSearch(username) {
   if (!username || username.trim() === "") return;

   const targetUser = username.trim();

   searchErrorHint.classList.add("hidden");
   errorState.classList.add("hidden");
   profileContainer.classList.add("hidden");
   loadingIndicator.classList.remove("hidden");
   searchBtn.disabled = true;

   try {
      const userData = await fetchUserProfile(targetUser);
      renderProfile(userData);

      let reposData = [];
      if (userData.repos_url) {
         reposData = await fetchUserRepos(userData.repos_url);
      }

      renderRepositories(reposData);

      loadingIndicator.classList.add("hidden");
      profileContainer.classList.remove("hidden");
   } catch (err) {
      loadingIndicator.classList.add("hidden");
      errorState.classList.remove("hidden");
      searchErrorHint.classList.remove("hidden");

      if (err.status === 404) {
         errorTitle.textContent = "User Not Found";
         errorDescription.textContent = 'No GitHub account found with username "' + targetUser + '".';
         searchErrorHint.textContent = "No results";
      } else if (err.status === 403) {
         errorTitle.textContent = "Rate Limit Exceeded";
         errorDescription.textContent = "GitHub API limit reached. You can add a token in settings or wait.";
         searchErrorHint.textContent = "Rate limit";
      } else {
         errorTitle.textContent = "Error";
         errorDescription.textContent = err.message || "Failed to load data.";
         searchErrorHint.textContent = "Error";
      }
   } finally {
      searchBtn.disabled = false;
   }
}

async function fetchAllReposForUser(username) {
   try {
      const url = GITHUB_API_BASE + "/" + encodeURIComponent(username) + "/repos?per_page=100&sort=pushed";
      const response = await fetch(url, {
         method: "GET",
         headers: getApiHeaders()
      });
      if (!response.ok) return [];
      return await response.json();
   } catch (e) {
      return []; }
}

async function fetchFullChallengerBundle(username) {
   const profile = await fetchUserProfile(username);
   const repos = await fetchAllReposForUser(username);

   const totalStars = repos.reduce(function (sum, repo) {
      return sum + (repo.stargazers_count || 0);
   }, 0);

   let topRepo = null;
   if (repos.length > 0) {
      topRepo = repos.reduce(function (prev, curr) {
         return curr.stargazers_count > prev.stargazers_count ? curr : prev;
      }, repos[0]);
   }

   return {
      profile: profile,
      repos: repos,
      totalStars: totalStars,
      topRepo: topRepo
   };
}

function createChallengerCardHtml(challenger, statusClass, badgeText, badgeClass) {
   const profile = challenger.profile;
   const totalStars = challenger.totalStars;
   const topRepo = challenger.topRepo;

   const topRepoHtml = topRepo && topRepo.stargazers_count > 0 ? `
     <div class="battle-top-repo">
       <span>Top Repo: <strong>${topRepo.name}</strong> (${topRepo.stargazers_count.toLocaleString()} ★)</span>
     </div>
   ` : `
     <div class="battle-top-repo">
       <span>Top Repo: None</span>
     </div>
   `;

   return `
     <div class="battle-card ${statusClass}">
       <span class="battle-status-badge ${badgeClass}">${badgeText}</span>
       
       <div class="battle-user-info">
         <img class="battle-avatar" src="${profile.avatar_url}" alt="${profile.login}">
         <h3 class="battle-user-name">${profile.name || profile.login}</h3>
         <a class="battle-user-handle" href="${profile.html_url}" target="_blank" rel="noopener noreferrer">@${profile.login}</a>
       </div>

       <div class="battle-metrics">
         <div class="metric-row">
           <span class="metric-name">
             <svg width="15" height="15" viewBox="0 0 24 24" fill="#fbbf24">
               <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
             </svg>
             Total Stars
           </span>
           <span class="metric-val metric-highlight">${totalStars.toLocaleString()} ★</span>
         </div>

         <div class="metric-row">
           <span class="metric-name">
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
               <circle cx="9" cy="7" r="4"></circle>
               <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
               <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
             </svg>
             Followers
           </span>
           <span class="metric-val">${profile.followers.toLocaleString()}</span>
         </div>

         <div class="metric-row">
           <span class="metric-name">
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
               <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
             </svg>
             Public Repos
           </span>
           <span class="metric-val">${profile.public_repos.toLocaleString()}</span>
         </div>
       </div>

       ${topRepoHtml}
     </div>
   `;
}

async function handleBattleShowdown(user1, user2) {
   if (!user1 || !user2) return;

   battleError.classList.add("hidden");
   battleResults.classList.add("hidden");
   battleLoading.classList.remove("hidden");
   startBattleBtn.disabled = true;

   try {
      const results = await Promise.all([
         fetchFullChallengerBundle(user1),
         fetchFullChallengerBundle(user2)
      ]);

      const challenger1 = results[0];
      const challenger2 = results[1];

      const stars1 = challenger1.totalStars;
      const stars2 = challenger2.totalStars;

      let announcementText = "";
      let announcementSub = "";
      let c1Status = "", c1Badge = "", c1BadgeClass = "";
      let c2Status = "", c2Badge = "", c2BadgeClass = "";

      if (stars1 > stars2) {
         announcementText = "🏆 " + (challenger1.profile.name || challenger1.profile.login) + " Wins!";
         announcementSub = "Winner has " + (stars1 - stars2).toLocaleString() + " more stars!";
         c1Status = "is-winner";
         c1Badge = "🏆 WINNER";
         c1BadgeClass = "winner-badge";
         c2Status = "is-loser";
         c2Badge = "RUNNER UP";
         c2BadgeClass = "loser-badge";
      } else if (stars2 > stars1) {
         announcementText = "🏆 " + (challenger2.profile.name || challenger2.profile.login) + " Wins!";
         announcementSub = "Winner has " + (stars2 - stars1).toLocaleString() + " more stars!";
         c2Status = "is-winner";
         c2Badge = "🏆 WINNER";
         c2BadgeClass = "winner-badge";
         c1Status = "is-loser";
         c1Badge = "RUNNER UP";
         c1BadgeClass = "loser-badge";
      } else {
         if (challenger1.profile.followers > challenger2.profile.followers) {
            announcementText = "🏆 " + (challenger1.profile.name || challenger1.profile.login) + " Wins!";
            announcementSub = "Tied on stars but won on followers!";
            c1Status = "is-winner";
            c1Badge = "🏆 WINNER";
            c1BadgeClass = "winner-badge";
            c2Status = "is-loser";
            c2Badge = "RUNNER UP";
            c2BadgeClass = "loser-badge";
         } else if (challenger2.profile.followers > challenger1.profile.followers) {
            announcementText = "🏆 " + (challenger2.profile.name || challenger2.profile.login) + " Wins!";
            announcementSub = "Tied on stars but won on followers!";
            c2Status = "is-winner";
            c2Badge = "🏆 WINNER";
            c2BadgeClass = "winner-badge";
            c1Status = "is-loser";
            c1Badge = "RUNNER UP";
            c1BadgeClass = "loser-badge";
         } else {
            announcementText = "Tie Match!";
            announcementSub = "Both users have same stars and followers.";
            c1Status = "is-tie";
            c1Badge = "TIE";
            c1BadgeClass = "tie-badge";
            c2Status = "is-tie";
            c2Badge = "TIE";
            c2BadgeClass = "tie-badge";
         }
      }

      battleAnnouncement.innerHTML = `
        <div class="announcement-winner-text ${c1Status === 'is-tie' ? 'tie' : ''}">${announcementText}</div>
        <div class="announcement-sub">${announcementSub}</div>
      `;

      battleCardsContainer.innerHTML = `
        ${createChallengerCardHtml(challenger1, c1Status, c1Badge, c1BadgeClass)}
        <div class="battle-vs-badge">
          <span>VS</span>
        </div>
        ${createChallengerCardHtml(challenger2, c2Status, c2Badge, c2BadgeClass)}
      `;

      battleLoading.classList.add("hidden");
      battleResults.classList.remove("hidden");
   } catch (err) {
      battleLoading.classList.add("hidden");
      battleError.classList.remove("hidden");

      if (err.status === 404) {
         battleErrorTitle.textContent = "User Not Found";
         battleErrorDesc.textContent = "One or both users could not be found on GitHub.";
      } else {
         battleErrorTitle.textContent = "Error";
         battleErrorDesc.textContent = "Failed to run battle mode. Please check connection.";
      }
   } finally {
      startBattleBtn.disabled = false;
   }
}

function switchMode(mode) {
   if (mode === "search") {
    searchModeBtn.classList.add("active");
      battleModeBtn.classList.remove("active");
    singleSearchSection.classList.remove("hidden");
      battleModeSection.classList.add("hidden");
 } else {
    battleModeBtn.classList.add("active");
      searchModeBtn.classList.remove("active");
    battleModeSection.classList.remove("hidden");
      singleSearchSection.classList.add("hidden");
   }
}

function initTheme() {
   const savedTheme = localStorage.getItem("dev_detective_theme") || "dark";
   applyTheme(savedTheme);
}

function applyTheme(theme) {
   document.documentElement.setAttribute("data-theme", theme);
   const themeText = themeToggleBtn.querySelector(".theme-text");
   if (theme === "dark") {
    themeText.textContent = "LIGHT";
      sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
 } else {
    themeText.textContent = "DARK";
      sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
   }
   localStorage.setItem("dev_detective_theme", theme);
}

function toggleTheme() {
   const current = document.documentElement.getAttribute("data-theme") || "dark";
   applyTheme(current === "dark" ? "light" : "dark");
}

function initToken() {
   if (githubToken) {
      githubTokenInput.value = githubToken;
      tokenStatusMsg.textContent = "Token saved";
      tokenStatusMsg.className = "token-status success";
   }
}

function saveToken() {
   const val = githubTokenInput.value.trim();
   if (val) {
      githubToken = val;
      localStorage.setItem("dev_detective_token", val);
      tokenStatusMsg.textContent = "Token saved";
      tokenStatusMsg.className = "token-status success";
   } else {
      clearToken();
   }
}

function clearToken() {
   githubToken = "";
   localStorage.removeItem("dev_detective_token");
   githubTokenInput.value = "";
   tokenStatusMsg.textContent = "Token cleared";
   tokenStatusMsg.className = "token-status info";
}

function initEvents() {
   themeToggleBtn.addEventListener("click", toggleTheme);

   searchModeBtn.addEventListener("click", function () { switchMode("search"); });
   battleModeBtn.addEventListener("click", function () { switchMode("battle"); });

   tokenToggleBtn.addEventListener("click", function () {
      tokenBar.classList.toggle("hidden");
   });
   saveTokenBtn.addEventListener("click", saveToken);
   clearTokenBtn.addEventListener("click", clearToken);

   searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = usernameInput.value.trim();
      if (query) {
         handleUserSearch(query);
      }
   });

   errorRetryBtn.addEventListener("click", function () {
      usernameInput.value = "octocat";
      handleUserSearch("octocat");
   });

   quickChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
         const user = chip.getAttribute("data-user");
         usernameInput.value = user;
         handleUserSearch(user);
      });
   });

   battleForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const u1 = battleUser1Input.value.trim();
      const u2 = battleUser2Input.value.trim();
      if (u1 && u2) {
         handleBattleShowdown(u1, u2);
      }
   });
}

document.addEventListener("DOMContentLoaded", function () {
   initTheme();
   initToken();
   initEvents();
   handleUserSearch("octocat");
});
