import { parse } from 'csv-parse';
import fetch from 'node-fetch';
import fs from 'node:fs';

const csvFilePath = new URL('./report.csv', import.meta.url);

const readStream = fs.createReadStream(csvFilePath);

const csvParse = parse({
  dalimiter:',',
  skip_empty_lines: true,
  fromLine: 2
});

async function run() {
  const lineParse = readStream.pipe(csvParse);

  for await (const line of lineParse) {
    const [title, description] = line;

    await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
  }
}

run()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

