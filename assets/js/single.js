let issueContainerEl = document.querySelector("#issues-container");
let limitWarningEl = document.querySelector("#limit-warning");
let repoNameEl = document.querySelector("#repo-name");


var getRepoName = function() {
    let queryString = document.location.search;
    let repoName = queryString.split("=")[1];
    
    if (repoName) {
        repoNameEl.textContent=repoName;
        getRepoIssues(repoName);
        
    }else {
        // if reponame doesn't exist go back to home page
        document.location.replace('./index.html')
    }

}


var getRepoIssues = function(repo) {
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
    
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayIssues(data);

            if(response.headers.get("Link")) {
                displayWarning(repo);
            }
            });
        }
        else {
            // lead to homepage
            document.location.replace('./index.html');
        }
    })
  };
// display issues on screen
var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    
    for (let i = 0; i < issues.length; i++) {
        // create link el to take users to issue on github
        let issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank")      
        
        // create span to hold issue title
        let titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        
        // append to container
    issueEl.appendChild(titleEl);
    
    // create a type element
    let typeEl = document.createElement("span");
    // check if the issue is an actual issue or pull req
    if(issues[i].pull_request) {
        typeEl.textContent = "(Pull Request)";
    }else {
        typeEl.textContent = "(Issue)"
    }
    issueEl.appendChild(typeEl);
    issueContainerEl.appendChild(issueEl);
    }
}

let displayWarning = function(repo) {
    limitWarningEl.textContent = "To see more than 30 issues, visit: ";
    // link el to see the other issues
    let linkEl = document.createElement("a");
    linkEl.textContent = "Github.com"
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to container
    limitWarningEl.appendChild(linkEl);
}



getRepoName();