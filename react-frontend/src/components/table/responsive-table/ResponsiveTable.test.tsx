import React from 'react';
import { render } from '~/test';

import { ResponsiveTable } from './ResponsiveTable';
import { ResponsiveTablePO } from './ResponsiveTable.page-object';

describe('ResponsiveTable', function() {
  let component: typeof ResponsiveTablePO;

  describe('on a wide screen', () => {
    beforeEach(() => {
      component = ResponsiveTablePO({ testId: 'ResponsiveTable' });
      render(
        <ResponsiveTable
          data-testid="ResponsiveTable"
          data={[]}
          columns={[]}
        />
      );
    });

    it('should render.', async () => {
      await component.exists();
    });

    xit('should render as a standard table layout.', () => {});
    xit('should render all rows and all cells.', () => {});
    xit('should render the default header row.', () => {})
  });

  describe('on a narrow screen', () => {
    xit('should render a single column layout.', () => {});
    xit('should render column titles above each cell.', () => {});
    xit('should hide the cell headers from assitive technologies.', () => {});
    xit('should keep the table header row visible to assitive technologies.', () => {});
    xit('should hide the header row from sighted users.', () => {});
  });

  describe('with custom renderers', () => {
    xit('should render all rows and all cells.', () => {});
    xit('should render the customized headers.', () => {});
  });
});

