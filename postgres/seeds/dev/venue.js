const { faker } = require('@faker-js/faker');
const path = require('path');
const fs = require('fs');
const utils = require('../utils.js');

const venues = [
  'Bluebird Theater',
  'Gothic Theater',
  'Hi Dive',
  'Larimer Lounge',
  'Meadowlark',
  'Ogden Theater',
  'Paramount Theater',
  'Red Rocks',
].map((name) => {
    return {
      name,
      image: {
        url: faker.image.business(),
      }
    }
  }
)

headers = ['name', 'image']

rows = venues.map((p) => {
  return `${p.name}\t${utils.toJSON(p.image)}`;
})

const fileContent = `${headers.join('\t')}\n${rows.join('\n')}`
const filename = path.parse(__filename).name + '.tsv'

fs.writeFileSync(path.join(__dirname, filename), fileContent);

console.log(`✔ ${filename}`)

