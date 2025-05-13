import React from 'react';

import { renderWithRouter } from '~/test';

import { RoutedMultistepFlow, findRouteIndex } from './RoutedMultistepFlow.jsx';
import { RoutedMultistepFlowPageObject } from './RoutedMultistepFlow.page-object';

describe('RoutedMultistepFlow', function() {
  let page, steps, renderA, renderB, renderC;

  beforeEach(() => {
    renderA = jest.fn(() => null);
    renderB = jest.fn(() => null);
    renderC = jest.fn(() => null);

    steps = [
      {title: 'Page A' , path: 'first'  , render: renderA} ,
      {title: 'Page B' , path: 'second' , render: renderB} ,
      {title: 'Page C' , path: 'third'  , render: renderC} ,
    ];
  });

  describe('findRouteIndex', () => {
    it('should be able to find the correct route index.', () => {
      expect(findRouteIndex('/', steps)).toEqual(0);
      expect(findRouteIndex('/fourth', steps)).toEqual(0);
      expect(findRouteIndex('/first', steps)).toEqual(0);
      expect(findRouteIndex('/second', steps)).toEqual(1);
      expect(findRouteIndex('/third', steps)).toEqual(2);
      expect(findRouteIndex('/second/third', steps)).toEqual(2);
      expect(findRouteIndex('/third/second', steps)).toEqual(1);
      expect(findRouteIndex('/deep/thing/second/foo', steps)).toEqual(1);
      expect(findRouteIndex('/deep/thing/third/second', steps)).toEqual(1);
    });
  });

  beforeEach(() => {
    page = RoutedMultistepFlowPageObject({testId: 'flow'});
    renderWithRouter(
      <RoutedMultistepFlow
        data-testid="flow"
        steps={steps}
      />
    );
  });

  it('should render', async () => {
    await page.exists();
  });

  it('should render the first page.', async () => {
    await page.has({title: 'Page A'});
    expect(renderA).toHaveBeenCalled();
    expect(renderB).not.toHaveBeenCalled();
    expect(renderC).not.toHaveBeenCalled();
  });

  xit('should default to the first page if the route does not include any of the step paths.', () => {});
  describe('after clicking the next button', () => {
    xit('should change the URL to the page B URL', () => {});
    xit('should render page B.', () => {});

    describe('and then clicking the previous button', () => {
      xit('should change the URL to the page A URL.', () => {});
      xit('should render page A.', () => {});
    });
  });
});
