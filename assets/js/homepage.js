let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");
let languageButtonsEl = document.querySelector("#language-buttons")

// URL = "https://api.github.com/users/octocat/repos"

let buttonClickHandler = function(event) {
    let language = event.target.getAttribute("data-language");
    if(language) {
        getFeaturedRepos(language);

        repoContainerEl.textContent = "";
    }
}

let formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input el

    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        repoContainerEl.textContent="";
        nameInputEl.value = "";
    }else {
        alert("Please enter a Github username")
    }
}

let getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        }else {
            alert('Error: ' + response.statusText);
        }
    });
}

let getUserRepos = function (user) {
    let apiUrl = "https://api.github.com/users/" + user + "/repos";
    //fetch the var, once fetches THEN response is called
    fetch(apiUrl).then(function(response) {   
        if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);
            });
        }else {
            alert("Error: Github User not found");
        }
    })
    .catch(function(error) {
        alert("Unable to connect to GitHub")
    })
};

// display search result
let displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repos found";
        return;
    }
    repoSearchTerm.textContent = searchTerm;

    for (let i = 0; i < repos.length; i++) {
        // format repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;   
        // create a container for each repo
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName)
        // create a span el to hold repo namea
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        // append to container
        repoEl.appendChild(titleEl)
        // create status elemnt
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        // check if current repo has issues
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =  "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append the status to conatiner
        repoEl.appendChild(statusEl);
        // append container to DOM
        repoContainerEl.append(repoEl);
    }
}

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);