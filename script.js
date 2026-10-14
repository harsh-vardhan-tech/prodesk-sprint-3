const searchModeBtn = document.getElementById("searchModeBtn");
  const battleModeBtn = document.getElementById("battleModeBtn");
const singleSearchSection = document.getElementById("singleSearchSection");
 const battleModeSection = document.getElementById("battleModeSection");

const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

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
const quickChips = document.querySelectorAll(".chip");

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

function formatDate(isoDate) {
   if (!isoDate) return "N/A";
   const d = new Date(isoDate);
   if (isNaN(d.getTime())) return "N/A";

   const day = d.getDate();
 const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   const month = months[d.getMonth()];
 const year = d.getFullYear();

   return day + " " + month + " " + year;
}

async function getUser(username) {
   const res = await fetch("https://api.github.com/users/" + encodeURIComponent(username.trim()));

   if (!res.ok) {
      const err = new Error("Fetch error");
      err.status = res.status;
      throw err;
   }

   return await res.json();
}

async function getRepos(reposUrl) {
   try {
      const res = await fetch(reposUrl + "?sort=updated&per_page=15");
      if (!res.ok) return [];
      return await res.json();
   } catch (e) {
      return [];
   }
}

function showProfile(user) {
   userAvatar.src = user.avatar_url || "https://avatars.githubusercontent.com/u/583231?v=4";
 userName.textContent = user.name || user.login;
   userLoginLink.textContent = "@" + user.login;
 userLoginLink.href = user.html_url;

   userJoined.textContent = "Joined " + formatDate(user.created_at);

   if (user.bio && user.bio.trim() !== "") {
      userBio.textContent = user.bio;
    userBio.style.opacity = "1";
   } else {
      userBio.textContent = "This profile has no bio";
    userBio.style.opacity = "0.6";
   }

 statRepos.textContent = user.public_repos !== undefined ? user.public_repos : "0";
   statFollowers.textContent = user.followers !== undefined ? user.followers : "0";
 statFollowing.textContent = user.following !== undefined ? user.following : "0";

   if (user.location) {
    metaLocation.textContent = user.location;
      metaLocationWrapper.style.opacity = "1";
 } else {
    metaLocation.textContent = "Not Available";
      metaLocationWrapper.style.opacity = "0.5";
   }

   if (user.blog && user.blog.trim() !== "") {
      let url = user.blog.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
         url = "https://" + url;
      }
    metaBlog.textContent = user.blog;
      metaBlog.href = url;
    metaBlogWrapper.style.opacity = "1";
 } else {
    metaBlog.textContent = "Not Available";
      metaBlog.removeAttribute("href");
    metaBlogWrapper.style.opacity = "0.5";
   }

   if (user.twitter_username) {
    metaTwitter.textContent = "@" + user.twitter_username;
      metaTwitter.href = "https://twitter.com/" + user.twitter_username;
    metaTwitterWrapper.style.opacity = "1";
 } else {
    metaTwitter.textContent = "Not Available";
      metaTwitter.removeAttribute("href");
    metaTwitterWrapper.style.opacity = "0.5";
   }

   if (user.company) {
    metaCompany.textContent = user.company;
      metaCompanyWrapper.style.opacity = "1";
 } else {
    metaCompany.textContent = "Not Available";
      metaCompanyWrapper.style.opacity = "0.5";
   }
}

function showRepos(repos) {
   reposList.innerHTML = "";

   if (!repos || repos.length === 0) {
      reposList.innerHTML = '<p style="color:var(--text-dim); text-align:center;">No public repositories found.</p>';
      repoCountBadge.textContent = "0 Repos";
      return;
   }

 const top5 = repos.slice(0, 5);
   repoCountBadge.textContent = top5.length + " Repos";

 top5.forEach(function (repo) {
      const item = document.createElement("div");
      item.className = "repo-item";

      const desc = repo.description ? repo.description : "No description.";
      const dateStr = formatDate(repo.updated_at);
      const lang = repo.language || "General";

      item.innerHTML = `
        <div class="repo-title-row">
          <a class="repo-link" href="${repo.html_url}" target="_blank">
            <i class="fa-solid fa-book-bookmark"></i> ${repo.name}
          </a>
          <span class="repo-vis">${repo.private ? "Private" : "Public"}</span>
        </div>
        <p class="repo-desc">${desc}</p>
        <div class="repo-footer">
          <span><i class="fa-solid fa-code"></i> ${lang}</span>
          <span><i class="fa-solid fa-star"></i> ${repo.stargazers_count}</span>
          <span><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</span>
          <span>Updated ${dateStr}</span>
        </div>
      `;

      reposList.appendChild(item);
   });
}

async function searchUser(username) {
   if (!username || username.trim() === "") return;

   const cleanName = username.trim();

   searchErrorHint.classList.add("hidden");
   errorState.classList.add("hidden");
   profileContainer.classList.add("hidden");
   loadingIndicator.classList.remove("hidden");
   searchBtn.disabled = true;

   try {
      const userData = await getUser(cleanName);
      showProfile(userData);

      let repos = [];
      if (userData.repos_url) {
         repos = await getRepos(userData.repos_url);
      }
      showRepos(repos);

      loadingIndicator.classList.add("hidden");
      profileContainer.classList.remove("hidden");
   } catch (err) {
      loadingIndicator.classList.add("hidden");
      errorState.classList.remove("hidden");
      searchErrorHint.classList.remove("hidden");

      if (err.status === 404) {
         errorTitle.textContent = "User Not Found";
         errorDescription.textContent = 'No user found for "' + cleanName + '". Please check spelling.';
         searchErrorHint.textContent = "No results";
      } else if (err.status === 403) {
         errorTitle.textContent = "Rate Limit Reached";
         errorDescription.textContent = "GitHub 60 requests/hr limit reached. Please wait a little.";
         searchErrorHint.textContent = "Rate limit";
      } else {
         errorTitle.textContent = "Error";
         errorDescription.textContent = "Could not fetch user data. Check network connection.";
         searchErrorHint.textContent = "Error";
      }
   } finally {
      searchBtn.disabled = false;
   }
}

async function getAllRepos(username) {
   try {
      const res = await fetch("https://api.github.com/users/" + encodeURIComponent(username.trim()) + "/repos?per_page=100");
      if (!res.ok) return [];
      return await res.json();
   } catch (e) {
      return [];
   }
}

async function getBattleData(username) {
   const user = await getUser(username);
   const repos = await getAllRepos(username);

   const totalStars = repos.reduce(function (total, r) {
      return total + (r.stargazers_count || 0);
   }, 0);

   return {
      user: user,
      totalStars: totalStars
   };
}

function makeBattleCard(data, isWinner, isTie) {
   const u = data.user;
   const stars = data.totalStars;

   let cardClass = "";
   let badgeHtml = "";

   if (isTie) {
      cardClass = "";
      badgeHtml = '<span class="badge-status" style="background:#f59e0b; color:#fff;">TIE</span>';
   } else if (isWinner) {
      cardClass = "winner";
      badgeHtml = '<span class="badge-status win">🏆 WINNER</span>';
   } else {
      cardClass = "loser";
      badgeHtml = '<span class="badge-status lose">RUNNER UP</span>';
   }

   return `
     <div class="battle-card ${cardClass}">
       ${badgeHtml}
       <img class="battle-avatar" src="${u.avatar_url}" alt="${u.login}">
       <h4 class="battle-name">${u.name || u.login}</h4>
       <a class="battle-handle" href="${u.html_url}" target="_blank">@${u.login}</a>

       <div class="battle-stats-box">
         <div class="battle-stat-row">
           <span>Total Stars:</span>
           <span class="star-val">⭐ ${stars}</span>
         </div>
         <div class="battle-stat-row">
           <span>Followers:</span>
           <span>${u.followers}</span>
         </div>
         <div class="battle-stat-row">
           <span>Public Repos:</span>
           <span>${u.public_repos}</span>
         </div>
       </div>
     </div>
   `;
}

async function runBattle(u1, u2) {
   if (!u1 || !u2) return;

   battleError.classList.add("hidden");
   battleResults.classList.add("hidden");
   battleLoading.classList.remove("hidden");
   startBattleBtn.disabled = true;

   try {
      const results = await Promise.all([
         getBattleData(u1),
         getBattleData(u2)
      ]);

      const p1 = results[0];
      const p2 = results[1];

      let win1 = false;
      let win2 = false;
      let tie = false;

      if (p1.totalStars > p2.totalStars) {
         win1 = true;
         battleAnnouncement.innerHTML = '<span class="winner-text">🏆 ' + (p1.user.name || p1.user.login) + ' Wins!</span>';
      } else if (p2.totalStars > p1.totalStars) {
         win2 = true;
         battleAnnouncement.innerHTML = '<span class="winner-text">🏆 ' + (p2.user.name || p2.user.login) + ' Wins!</span>';
      } else {
         if (p1.user.followers > p2.user.followers) {
            win1 = true;
            battleAnnouncement.innerHTML = '<span class="winner-text">🏆 ' + (p1.user.name || p1.user.login) + ' Wins by followers!</span>';
         } else if (p2.user.followers > p1.user.followers) {
            win2 = true;
            battleAnnouncement.innerHTML = '<span class="winner-text">🏆 ' + (p2.user.name || p2.user.login) + ' Wins by followers!</span>';
         } else {
            tie = true;
            battleAnnouncement.innerHTML = '<span class="winner-text" style="color:#f59e0b;">It is a Tie!</span>';
         }
      }

      battleCardsContainer.innerHTML = `
        ${makeBattleCard(p1, win1, tie)}
        ${makeBattleCard(p2, win2, tie)}
      `;

      battleLoading.classList.add("hidden");
      battleResults.classList.remove("hidden");
   } catch (err) {
      battleLoading.classList.add("hidden");
      battleError.classList.remove("hidden");
      if (err.status === 404) {
         battleErrorTitle.textContent = "User Not Found";
         battleErrorDesc.textContent = "One or both users could not be found.";
      } else {
         battleErrorTitle.textContent = "Error";
         battleErrorDesc.textContent = "Failed to run battle. Please try again.";
      }
   } finally {
      startBattleBtn.disabled = false;
   }
}

function setMode(mode) {
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

function setTheme(theme) {
   document.documentElement.setAttribute("data-theme", theme);
   if (theme === "dark") {
      themeIcon.className = "fa-solid fa-sun";
    themeText.textContent = "Light";
 } else {
      themeIcon.className = "fa-solid fa-moon";
    themeText.textContent = "Dark";
   }
   localStorage.setItem("dev_detective_theme", theme);
}

function initTheme() {
   const saved = localStorage.getItem("dev_detective_theme") || "dark";
   setTheme(saved);
}

function initListeners() {
   themeToggleBtn.addEventListener("click", function () {
      const cur = document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(cur === "dark" ? "light" : "dark");
   });

   searchModeBtn.addEventListener("click", function () { setMode("search"); });
   battleModeBtn.addEventListener("click", function () { setMode("battle"); });

   searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const val = usernameInput.value.trim();
      if (val) searchUser(val);
   });

   errorRetryBtn.addEventListener("click", function () {
      usernameInput.value = "octocat";
      searchUser("octocat");
   });

   quickChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
         const u = chip.getAttribute("data-user");
         usernameInput.value = u;
         searchUser(u);
      });
   });

   battleForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const u1 = battleUser1Input.value.trim();
      const u2 = battleUser2Input.value.trim();
      if (u1 && u2) runBattle(u1, u2);
   });
}

document.addEventListener("DOMContentLoaded", function () {
   initTheme();
   initListeners();
   searchUser("octocat");
});
