# EPIC MAIL
Epic Mail is a web app that lets people exchange messages/information


### Table of Contents

1. [About the Project](#about-the-project)
1. [Project Status](#project-status)
1. [Getting Started](#getting-started)
    1. [Installation](#installation)
    1. [Testing](#running-test)
1. [Project Links](#project-links)
1. [REST API](#rest-api)
    1. [Overview](#api-overview)
    1. [Sign up](#sign-up)
    1. [Sign in](#sign-in)
1. [Acknowledgment](#Acknowledgement)

## About the project

Epic mail will aid communication between individuals or groups of people

## Project Status

[![Build Status](https://travis-ci.org/Tyak99/Epic_Mail.svg?branch=server)](https://travis-ci.org/Tyak99/Epic_Mail)
[![Coverage Status](https://coveralls.io/repos/github/Tyak99/Epic_Mail/badge.svg?branch=ch-setup-travis-164393078)](https://coveralls.io/github/Tyak99/Epic_Mail?branch=server)


**[Back to top](#table-of-contents)**

## Getting started

### Installation
```
# Get the latest snapshot
git clone https://github.com/Tyak99/Epic_Mail myproject

# Change directory
cd myproject

# Install NPM dependencies
npm install

# Then simply start your app
npm start
```
### Running Test
```
# Enter project directory
cd myproject

# Start test
npm test
```





## Project Links

* Gh-Pages Url 
`https://tyak99.github.io/Epic_Mail/Ui/Index.html`


**[Back to top](#table-of-contents)**

## REST API

### Api Overview
The API is generally RESTFUL and returns results in JSON.

### Sign up
* ##### URL
    `api/v1/auth/signup`

* ##### Method: 
    `POST`

* ##### Data Params
    ```
    {
        email,
        password,
        firstName,
        lastName
    }
    ```
* ##### Success Response 
    * Status: `200`
    * data: 
    ```
    {
        token: " "
    }
    ```

* ##### Error Response 
    * Status: `400`
    * error: `"Email already in use"`
    * error: `"All fields must be present"`


### Sign In
* ##### URL
    `api/v1/auth/login`

* ##### Method: 
    `POST`

* ##### Data Params
    ```
    {
        email,
        password
    }
    ```
* ##### Success Response 
    * Status: `200`
    * data: 
    ```
    {
        token: " "
    }
    ```

* ##### Error Response 
    * Status: `400`
    * error: `"Invalid email or password"`


# Author

[Babatunde Yakub](https://github.com/Tyak99/)


# Acknowledgement 

* [EmbeddedArtistry](https://github.com/embeddedartistry/templates) ( For pull request template and README format )
*  [Iros](https://gist.github.com/iros/3426278) ( For api *README* guideline)


**[Back to top](#table-of-contents)**
