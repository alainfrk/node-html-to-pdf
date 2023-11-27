/*************
 *** SETUP ***
 *************/

const puppeteer = require("puppeteer");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const url = require("url");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pdfFolder = path.join(__dirname, "pdf");

// Puppeteer PDF options settings
let keepBackgroundColors = false;
let isLandscape = false;

/*****************
 *** FUNCTIONS ***
 *****************/

// Questions in the terminal to setup URL source and PDF options
function terminalPrompts() {
  rl.question("Enter the URL of the webpage: ", (pageURL) => {
    rl.question("Type true if you want to keep the backgrounds colors: ", (backgroundInput) => {
      keepBackgroundColors = backgroundInput === "true";
      rl.question("Type true if you want the orientation to be landscape: ", (landscapeInput) => {
        isLandscape = landscapeInput === "true";
        rl.close();
        htmlToPdf(pageURL);
      });
    });
  });
}

// Convert HTML to PDF
async function htmlToPdf(pageURL) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageURL, { waitUntil: "networkidle2" });

    const pdfPath = path.join(pdfFolder, convertFilename(pageURL));
    await page.pdf({ path: pdfPath, format: "A4", printBackground: keepBackgroundColors, landscape: isLandscape });

    await browser.close();
    console.log(`PDF saved at : ${pdfPath}`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(); // Exit the program
  }
}

// Convert filename from the URL to PDF
function convertFilename(webURL) {
  const parsedUrl = new URL(webURL);
  const pathname = parsedUrl.pathname;
  const filename = path.basename(pathname);
  // Regex : ? makes the preceding character optional (so .htm files are ok)
  return filename.replace(/\.html?$/, "") + ".pdf";
}

// Launch the program
terminalPrompts();
