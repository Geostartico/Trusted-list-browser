# Trusted list server browser
Application written in Typescript and React, whose purpose is to show the user a list of trusted servers based on the parameters selected by himself.

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#visuals">Visuals</a></li>
    <li><a href="#authors">Authors</a></li>
    <li><a href="#external-packages">External package</a></li> 
    <li><a href="#license">License</a></li>
  </ol>
</details>

## Getting Started

### Prerequisites
#### Windows
#### MacOS
#### Debian/Ubuntu

* Node.js
  ```sh
  curl -fsSL https://deb.nodesource.com/setup_18.x && sudo apt install -y nodejs
  ```
    Also try command
  ```sh
  node --version
  ```
    to verify Node installed correctly
    
* npm 
    ```sh
    sudo apt install npm
    ```
    
* typescript
  ```sh
  npm install -g typescript
  ```
  
* yarn
  ```sh
  npm install --g yarn
  ```
### Installation

#### Windows
#### MacOS
#### Debian/Ubuntu

1. Open terminal and move (command `mv` ) to Trusted-list-browser/src/trusted_list/ folder
2. run command 
    ```sh
    yarn install
    ```
## Usage
1. Move to Trusted-list-browser/src/trusted_list/ folder, then start program using `yarn start` command.
   Now application should start automatically on your default browser.
   If not, open your browser manually then type in the address bar:
   ```
   localhost
   ```
   And you should be connected to the server.
2. From GUI you can select and deselect items from the checkbox list that appears and application will show you a server trusted list based on your previous filter selection 

## Visuals

<p align="center">
  <img src="Screenshots/Mappa_skyrim.jpg" width="350"/>
</p>

## Authors
* [Giovanni Artico](https://github.com/Geostartico)
* [Giulio Codutti](https://github.com/giulpig)
* [Gabriele Miotti](https://github.com/gabriele-0201)
* [Andrea Lupo](https://github.com/LK-parrot)

## External packages
+ Added react-tostify
    + Used to manage on screen notification, like request goes wrong or something like that
+ https://www.npmjs.com/package/allotment
    + Used to manage split view panel
+ test: https://create-react-app.dev/docs/running-tests/
    + yarn add @testing-library/react @testing-library/jest-dom

## License
Distributed under the GPL License. See LICENSE.txt for more information.

## Table of Contents
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Usage](#usage)
* [Visuals](#visuals)
* [Authors](#authors)
* [External Packages](#external-packages)
* [License](#license)
