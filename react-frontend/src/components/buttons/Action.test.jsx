import React from 'react';
import { screen } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';

import { renderWithRouterAndAnalytics } from '~/test';
// import { Analytics } from '~/services/analytics';
import { ActionPageObject } from './Action.page-object.js';
import { Action } from './Action.jsx';

describe('Action', () => {
  let analytics, render;
  const category = "Media";
  const action = "Action";
  const label = "Label";

  beforeEach(() => {
    analytics = {
      trackEvent: jest.fn(),
      trackExternalLink: jest.fn(),
    };

    render = c => renderWithRouterAndAnalytics(c, {url: '', analytics});
  });

  it('should be able to render a button.', () => {
    render(<Action>My Button</Action>);
    expect(screen.getByText('My Button')).toBeInTheDocument();
  });

  it('should be able to render a routed link.', () => {
    const url = '/foo/bar';
    render(<Action to={url}>My Link</Action>);

    const action = screen.getByText('My Link');
    expect(action).toBeInTheDocument();
    expect(action).toHaveAttribute('data-router-link');
    expect(action).toHaveAttribute('href', url);
  });

  it('should be able to render an unrouted link.', () => {
    const url = '#some-anchor';
    render(<Action unrouted to={url}>My Link</Action>);

    const action = screen.getByText('My Link');
    expect(action).toBeInTheDocument();
    expect(action).not.toHaveAttribute('data-router-link');
    expect(action).toHaveAttribute('href', url);
  });

  it('should be able to render an external link.', () => {
    const url = 'http://www.foo.bar';
    render(<Action blank href={url}>My Link</Action>);

    const action = screen.getByText('My Link');
    expect(action).toBeInTheDocument();
    expect(action).not.toHaveAttribute('data-router-link');
    expect(action).toHaveAttribute('href', url);
    expect(action).toHaveAttribute('target', '_blank');
  });

  it('should be able to perform event tracking.', () => {
    const url = 'http://www.foo.bar';
    render(
      <Action
        href={url}
        category={category}
        action={action}
        label={label}
      >
        My Link
      </Action>,
      url,
      analytics
    );

    const link = screen.getByText('My Link');
    expect(link).toBeInTheDocument();

    fireEvent.click(link);

    expect(analytics.trackEvent).toHaveBeenCalledTimes(1);
    expect(analytics.trackEvent).toHaveBeenCalledWith(category, action, label, undefined);
  });

  it('should be able to perform external link tracking on a link.', () => {
    const url = 'http://www.foo.bar';
    render(
      <Action
        blank
        href={url}
      >
        My Link
      </Action>,
      url,
      analytics
    );

    const link = screen.getByText('My Link');
    expect(link).toBeInTheDocument();

    fireEvent.click(link);

    expect(analytics.trackExternalLink).toHaveBeenCalledTimes(1);
    expect(analytics.trackExternalLink).toHaveBeenCalledWith(url);
  });

  it('should be able to show a placeholder.', async () => {
    render( <Action placeholder="Placeholder Text" /> );

    await ActionPageObject().has({placeholder: 'Placeholder Text'});
  });

  it('should show the children rather than the placeholder if both are specified.', async () => {
    render(
      <Action placeholder="Placeholder Text">Click Me</Action>
    );
    await ActionPageObject().has({text: 'Click Me'});
  });
});

