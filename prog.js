import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const name = process.argv[2];
const chapter = process.argv[3];
const urlTemplate = 'https://lelscanfr.com/manga/';
const url = urlTemplate + name + '/' + chapter;

console.log('URL:', url);

async function executeSnippet(url, snippet, outputPath) {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		page.on('response', async (response) => {
			const contentType = response.headers()['content-type'];
			if (contentType && contentType.startsWith('image/webp')) {
				const buffer = await response.buffer();
				const file = path.join(outputPath, `image_${Date.now()}.webp`);
				fs.writeFileSync(file, buffer);
				console.log(`Downloaded: ${file}`);
			}
		});

		await page.goto(url);
		await page.evaluate(snippet);
		await browser.close();

	} catch (error) {
		console.error('Error:', error);
	}
}

const snippet = `
	console.log('test');
	function downloadWebpImages() {
		var imgElements = document.querySelectorAll('img[src$=".webp"]');
		console.log('Found', imgElements.length, 'webp images on the page');

		imgElements.forEach(function(img, index) {
			var imageUrl = img.src;
			fetch(imageUrl)
				.then(response => response.blob())
				.then(blob => {
					var anchor = document.createElement('a');
					anchor.href = window.URL.createObjectURL(blob);
					anchor.download = index + '.webp';
					anchor.click();
				});
		});
	}
`;

const outputPath = '/home/rr/Scraping/' + name + '/chap_' + chapter;
console.log('Output Path:', outputPath);

executeSnippet(url, snippet, outputPath);
