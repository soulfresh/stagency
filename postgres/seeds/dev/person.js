const { faker } = require('@faker-js/faker');
const path = require('path');
const fs = require('fs');
const utils = require('../utils.js');

const people = utils.listOf(
  faker.datatype.number({min: 30, max: 100}),
  (i) => {
    return {
      name: faker.name.fullName(),
      image: {
        url: faker.image.avatar(),
      }
    }
  }
)

headers = ['name', 'image']

rows = people.map((p) => {
  return `${p.name}\t${utils.toJSON(p.image)}`;
})

const fileContent = `${headers.join('\t')}\n${rows.join('\n')}`
const filename = path.parse(__filename).name + '.tsv'

fs.writeFileSync(path.join(__dirname, filename), fileContent);

console.log(`✔ ${filename}`)

