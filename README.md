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
   1. [Create Email](#create-email)
   1. [Get received Email](#get-received-emails)
   1. [Get sent Email](#get-sent-emails)
   1. [Get specific Email](#get-specific-email)


1. [Acknowledgment](#Acknowledgement)

## About the project

Epic mail will aid communication between individuals or groups of people

## Project Status

[![Build Status](https://travis-ci.org/Tyak99/Epic_Mail.svg?branch=server)](https://travis-ci.org/Tyak99/Epic_Mail)
[![Coverage Status](https://coveralls.io/repos/github/Tyak99/Epic_Mail/badge.svg?branch=ch-setup-travis-164393078)](https://coveralls.io/github/Tyak99/Epic_Mail?branch=server)
[![Maintainability](https://api.codeclimate.com/v1/badges/6e364ff913f4c2ec6580/maintainability)](https://codeclimate.com/github/Tyak99/Epic_Mail/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6e364ff913f4c2ec6580/test_coverage)](https://codeclimate.com/github/Tyak99/Epic_Mail/test_coverage)

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
npm run dev
```

### Running Test

```
# Enter project directory
cd myproject

# Start test
npm test
```

### Running Build

```
# Enter project directory
cd myproject

# Start test
npm run build
```

## Project Links

- Gh-Pages Url
  `https://tyak99.github.io/Epic_Mail/Ui/Index.html`
- Api documentation 
  `https://intense-thicket-60071.herokuapp.com/docs`
**[Back to top](#table-of-contents)**

## REST API

### Api Overview

The API is generally RESTFUL and returns results in JSON.

### Sign up

- ##### URL

  `api/v1/auth/signup`

- ##### Method:

  `POST`

- ##### Data Params
  ```
  {
      email,
      password,
      firstName,
      lastName
  }
  ```
- ##### Success Response

  - Status: `200`
  - data:

  ```
  {
      token: " "
  }
  ```

- ##### Error Response
  - Status: `400`
  - error: `"Email already in use"`
  - error: `"All fields must be present"`

### Sign In

- ##### URL

  `api/v1/auth/login`

- ##### Method:

  `POST`

- ##### Data Params
  ```
  {
      email: supeuser@mail.com
      password: secret
  }
  ```
- ##### Success Response

  - Status: `200`
  - data:

  ```
  {
      token: " "
  }
  ```

- ##### Error Response
  - Status: `400`
  - error: `"Invalid email or password"`

### Create Email

- ##### URL

  `api/v1/messages`

- ##### Method:

  `POST`

- ##### Data Params
  ```
  {
      subject: required
      message: required
      emailTo: nullable
      senderId: nullable
      parentMessageId: nullable
  }
  ```
- ##### Success Response

  - Status: `201`
  - data:

  ```
  {
      id,
      subject,
      message,
      status,
      createdOn,
      receiverId,
      senderId,
      parentMessageId
  }
  ```

- ##### Error Response
  - Status: `400`
  - error: `"Please input all required fields"`
  - Status: `404`
  - error: `"Email not found"`

**[Back to top](#table-of-contents)**


### Get received emails

- ##### URL

  `api/v1/messages`

- ##### Method:

  `GET`

- ##### Body Params
  ```
  receiverId: required
  ```
- ##### Success Response
  - Status: `200`
  - data:
  ```
  [
      {
          id,
          subject,
          message,
          createdOn,
          status,
          receiverId,
          senderId,
          parentMessageId
      },
  ]
  ```

### Get sent emails

- ##### URL

  `api/v1/messages/sent`

- ##### Method:

  `GET`

- ##### Data Params
  ```
  senderId: required
  ```
- ##### Success Response
  - Status: `200`
  - data:
  ```
  [
      {
          id,
          subject,
          message,
          createdOn,
          status,
          receiverId,
          senderId,
          parentMessageId
      },
  ]
  ```

**[Back to top](#table-of-contents)**

### Get specific email

- ##### URL

  `api/v1/messages/:id`

- ##### Method:

  `GET`

- ##### Data Params
  ```
  messageId: required
  ```
- ##### Success Response

  - Status: `200`
  - data:

  ```
  {
          id,
          subject,
          message,
          createdOn,
          status,
          receiverId,
          senderId,
          parentMessageId
    },
  ```

- ##### Error Response
  - Status: `400`
  - error: `"Email with id not found"`

# Author

[Babatunde Yakub](https://github.com/Tyak99/)

# Acknowledgement

- [EmbeddedArtistry](https://github.com/embeddedartistry/templates) ( For pull request template and README format )
- [Iros](https://gist.github.com/iros/3426278) ( For api _README_ guideline)

**[Back to top](#table-of-contents)**
