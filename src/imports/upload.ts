import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

async function loadCSV(filePath: string): Promise<any[]> {
  const readCSVStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCSV = readCSVStream.pipe(parseStream);

  const lines: any[] | PromiseLike<any[]> = [];

  parseCSV.on('data', line => {
    lines.push(line);
  });

  await new Promise(resolve => {
    parseCSV.on('end', resolve);
  });

  return lines;
}

const csvFilePath = path.resolve(__dirname, 'import_template.csv');

const data = loadCSV(csvFilePath);

export default data;
