const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require('html-pdf');

class DoMyHomework {
  constructor() {
    this.githubUserName = null;
    this.color = null;
  }

  promptUser() {
    return inquirer.prompt([
      {
        message: 'What is your user name',
        name: 'githubUserName',
       
      }
    ]).then(({ githubUserName }) => {
      this.githubUserName = githubUserName;
      this.makeApiRequest();
    })
  }

  makeApiRequest() {
    return Promise.all(
      [
        axios.get(`https://api.github.com/users/${this.githubUserName}`),
        axios.get(`https://api.github.com/users/${this.githubUserName}/starred`)
      ])
      .then((
        [
          {
            data:
            {
              avatar_url,
              location,
              name,
              blog,
              bio,
              public_repos,
              followers,
              following
            }
          },
          {
            data:
            {
              length
            }
          }
        ]
      ) => {
        this.avatar_url = avatar_url;
        this.location = location;
        this.name = name;
        this.blog = blog;
        this.bio = bio;
        this.public_repos = public_repos;
        this.followers = followers;
        this.following = following;
        this.stars = length;
        console.log(this);
        this.createHtml();
      })
  }

  createHtml() {
    this.html = `
    <html>
    <head>
    <style>
    body{
     ;
    }

    ul{
        list-style-type:none;
    }
    .card {
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        max-width: 300px;
        margin: auto;
        text-align: center;
      }
      
      .title {
        color: grey;
        font-size: 18px;
      }
      
      button {
        border: none;
        outline: 0;
        display: inline-block;
        padding: 8px;
        color: white;
        background-color: #000;
        text-align: center;
        cursor: pointer;
        width: 100%;
        font-size: 18px;
      }
      
      a {
        text-decoration: none;
        font-size: 22px;
        color: black;
      }
      
      button:hover, a:hover {
        opacity: 0.7;
      }
    </style>
    </head>
    
    
    <body>

    <div class="card">
    <img src="${this.avatar_url}" alt="John" style="width:100%">
    <h1>${this.name}</h1>
    <ul class="title">
    <li>Followers: ${this.followers}</li>
    <li>Following: ${this.following}</li>
    <li>Stars: ${this.stars}</li>
    <li>Repos: ${this.public_repos}</li>
    </ul>
    
    
    <p><button>${this.location}</button></p>
  </div>

  <div><p>${this.bio}</p></div>
  
  
    </body>
    
    </html>
    `;
    console.log(this);
    this.createPdf();
  }

  createPdf() {
    pdf.create(this.html).toFile('index.pdf', function (err, res) {
      if (err) return console.log(err);
      console.log(res);
    });
  }

}

var newHomework = new DoMyHomework();
newHomework.promptUser();
