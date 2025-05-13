import React from 'react';
import { render, screen } from '@testing-library/react';

import { ErrorView } from './ErrorView.jsx';

describe('ErrorView', function() {
  describe('default view', () => {
    beforeEach(() => {
      render(<ErrorView />);
    });

    it('should render the default title.', () => {
      expect(screen.getByText('Uh Oh!')).toBeInTheDocument();
    });

    it('should not render a message.', () => {
      expect(screen.queryByTestId('message')).toBeNull();
    });
  });

  describe('with a title', () => {
    const title = 'Foo Bar';

    beforeEach(() => {
      render(<ErrorView title={title} />);
    });

    it('should render the default title.', () => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('should not render a message.', () => {
      expect(screen.queryByTestId('message')).toBeNull();
    });
  });

  describe('with a title and content', () => {
    const title = 'Foo Bar';
    const content = 'There was a problem.';

    beforeEach(() => {
      render(
        <ErrorView title={title}>
          { content }
        </ErrorView>
      );
    });

    it('should render the default title.', () => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('should not render a message.', () => {
      expect(screen.getByTestId('message')).toBeInTheDocument();
    });
  });
});
