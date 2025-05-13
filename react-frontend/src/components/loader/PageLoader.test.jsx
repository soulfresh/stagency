import React from 'react';
import { render, screen } from '@testing-library/react';

import { PageLoader } from './PageLoader.jsx';

class Selectors {
  get loader() {
    return screen.getByTestId('pageLoader');
  }
}
const selectors = new Selectors();

describe('PageLoader', function() {
  let rerender;

  /** @param {*} props */
  const Example = ({children}) => (
    <div>
      {/* Unfortunately we can't import the loader svg file
          because it gets mocked by Create React App. As a result
          we have to duplicate the basics of the implementation here. */}
      <svg id="page-loader" className="loader page stop" data-testid="pageLoader">
        <title>Loading...</title>
      </svg>
      { children }
    </div>
  );

  describe('in immediate mode', () => {
    beforeEach(() => {
      ({rerender} = render(
        <Example />
      ));
    });

    it('should start with the loader hidden.', () => {
      expect(selectors.loader).toBeInTheDocument();
      expect(selectors.loader).toHaveClass('stop');
    });

    describe('after starting the page loader', () => {
      beforeEach(function() {
        rerender(
          <Example>
            <PageLoader immediate />
          </Example>
        );
      });

      it('should show the loader.', () => {
        expect(selectors.loader).toBeInTheDocument();
        expect(selectors.loader).not.toHaveClass('stop');
      });

      describe('and then destroying the page loader', () => {
        beforeEach(function() {
          rerender(
            <Example />
          );
        });

        it('should immediately hide the loader.', () => {
          expect(selectors.loader).toBeInTheDocument();
          expect(selectors.loader).toHaveClass('stop');
        });
      });
    });
  });
});
