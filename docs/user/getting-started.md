# Getting started

How to run contact-form-check-2 on your computer.

## Before you start

Install [Node.js](https://nodejs.org/) version 24 or newer.

## Run the site

1. Open a terminal in the project folder.
2. Install the project: `npm ci`
3. Build the site: `npm run build`
4. Start it: `npm start`
5. Open <http://localhost:4321> in your browser.

Stop the site with Ctrl+C.

## The home page

Opening <http://localhost:4321> shows the home page: a title, a short welcome text and a blue **Contact** button. The button leads to the contact form at `/contact`. The page adapts to phone and desktop screens.

## Where messages are saved

Messages sent through the contact form are saved in the `data` folder of the project, on the computer running the site. The form itself is not available yet.

For developers, see the [setup guide](../dev/setup.md).
