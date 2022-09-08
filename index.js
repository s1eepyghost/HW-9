const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const http = require('http');
const PDFDocument = require('pdfkit');

const hostname = '127.0.0.1';
const port = 3000;

const axios = require("axios");

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

const questions = [{
        type: "input",
        name: "github",
        message: "Enter your GitHub Username"
    },
    {
        type: "input",
        name: "email",
        message: "Enter your e-mail address"
    },
    {
        type: "input",
        name: "repo",
        message: "Enter the name of your GitHub repository"
    },
    {
        type: "input",
        name: "projectTitle",
        message: "Enter the title of your project"
    }
];

inquirer.prompt(questions).then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
    getGitHubProfileInfo(answers.github, answers.email, answers.repo, answers.projectTitle);

});

async function getGitHubProfileInfo(user, email, repo, title) {

    const { data } = await axios.get(
        `https://api.github.com/users/${user}`
    );

    data.email = email;

    const repoURL = `https://github.com/${user}/${repo}`;

    console.log("Data: ", data);
    console.log("Reo URL: ", repoURL);
    console.log("Project title: ", title);

    const stringData = JSON.stringify(data, null, '  ');

    const result = `
# Title: ${title} 
## Description 
## Table of Contents
## Installation
## Usage
## License
## Contributing
## Tests
## Questions
* User GitHub profile picture:

![alt text](${data.avatar_url} "User GitHub Profile Picture")
* User GitHub profile username: [${data.login}](${data.html_url})
* User GitHub email: [${data.email}](mailto:${data.email})
* User GitHub repository: ${repoURL}
`;

    console.log(result);

    fs.writeFile("readmetemplate.md", result, function(err) {
        if (err) return console.log(err);
    });

    console.log(data.avatar_url);

    server.close();
}