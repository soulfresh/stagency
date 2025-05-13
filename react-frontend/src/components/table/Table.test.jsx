import React from 'react';
import { render } from '@testing-library/react';

import { Table } from './Table.jsx';
import { TablePageObject } from '~/test';

describe('Table', function() {
  let page;

  describe('with an aria-label', () => {
    beforeEach(() => {
      page = TablePageObject();
      render(
        <Table aria-label="Table Label">
          <thead>
            <tr>
              <th>Artist</th>
              <th>Venues</th>
              <th>Event Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lusine</td>
              <td>The Fillmore</td>
              <td>January</td>
            </tr>
            <tr>
              <td>Lusine</td>
              <td>The Fillmore</td>
              <td>January</td>
            </tr>
            <tr>
              <td>Lusine</td>
              <td>The Fillmore</td>
              <td>January</td>
            </tr>
          </tbody>
        </Table>
      );
    });

    it('should render the table', async () => {
      await page.exists();
      await TablePageObject('Table Label').exists();
    });

    it('should render the table data.', async () => {
      await page.has({columnCount: 3});
      await page.has({rowCount: 4});
      await page.has({dataCount: 3});

      await page.has({cellValues: [
        ['Artist' , 'Venues'       , 'Event Date'] ,
        ['Lusine' , 'The Fillmore' , 'January']    ,
        ['Lusine' , 'The Fillmore' , 'January']    ,
        ['Lusine' , 'The Fillmore' , 'January']    ,
      ]})
    });
  });

  describe('with an aria-labelledby', () => {
    beforeEach(() => {
      page = TablePageObject();
      render(
        <div>
          <h1 id="heading">Table Title</h1>
          <Table aria-labelledby="heading">
            <tbody>
              <tr>
                <td>Lusine</td>
                <td>The Fillmore</td>
                <td>January</td>
              </tr>
            </tbody>
          </Table>
        </div>
      );
    });

    it('should render the table', async () => {
      await TablePageObject('Table Title').exists();
    });

    it('should render the table data.', async () => {
      await page.has({columnCount: 3});
      await page.has({rowCount: 1});
      await page.has({dataCount: 1});

      await page.has({cellValues: [
        ['Lusine', 'The Fillmore', 'January'],
      ]})
    });
  });
});
