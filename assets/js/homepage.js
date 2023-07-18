var getUserRepos = (user) => {

    let apiUrl = "https://api.github.com/users/" + user + "/repos";

    fetch(apiUrl).then(function(response) {   //fetch the var, once fetches THEN response is called
        response.json().then(function(data) {
            console.log(data);
        })
    })
} 

// URL = "https://api.github.com/users/octocat/repos"