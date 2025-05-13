import React from 'react';
import { render, waitFor, act } from '@testing-library/react';

import { mostRecentCall } from '~/test';

import { MultistepFlow } from './MultistepFlow.jsx';
import { MultistepFlowPageObject } from './MultistepFlow.page-object.js';

describe('MultistepFlow', function() {
  let page, children, steps, onChange, renderNext, renderPrevious;

  beforeEach(() => {
    page = MultistepFlowPageObject({testId: 'Flow'});
    steps = ['First Page', 'Second Page', 'Third Page'];
    children = jest.fn();
    onChange = jest.fn();
    renderNext = jest.fn();
    renderPrevious = jest.fn();
  });

  describe('uncontrolled', () => {
    describe('by default', () => {
      beforeEach(() => {
        render(
          <MultistepFlow
            data-testid="Flow"
            steps={steps}
            onChange={onChange}
            children={children}
          />
        );
      });

      it('should render', async () => {
        await page.exists();
      });

      it('should render the children.', () => {
        expect(children).toHaveBeenCalledTimes(1);
        expect(children).toHaveBeenCalledWith({
          index: 0,
          last: steps.length - 1,
          step: steps[0],
          steps,
          data: expect.any(Array),
          onNext: expect.any(Function),
          onPrevious: expect.any(Function),
        });
      });

      describe('after clicking the next button', () => {
        beforeEach(async () => {
          children.mockReset();
          await page.clickNext();
        });

        it('should go to the next page.', async () => {
          await waitFor(() => {
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(children).toHaveBeenCalledTimes(1);
          });

          expect(onChange).toHaveBeenCalledWith({
            index: 1,
            last: steps.length - 1,
            step: steps[1],
            steps,
            data: expect.any(Array),
          });
          expect(children).toHaveBeenCalledWith({
            index: 1,
            last: steps.length - 1,
            step: steps[1],
            steps,
            data: expect.any(Array),
            onNext: expect.any(Function),
            onPrevious: expect.any(Function),
          });
        });

        describe('and then clicking the previous button', () => {
          beforeEach(async () => {
            onChange.mockReset();
            children.mockReset();
            await page.clickPrevious();
          });

          it('should go to the previous page.', async () => {
            await waitFor(() => {
              expect(onChange).toHaveBeenCalledTimes(1);
              expect(children).toHaveBeenCalledTimes(1);
            });

            expect(onChange).toHaveBeenCalledWith({
              index: 0,
              last: steps.length - 1,
              step: steps[0],
              steps,
              data: expect.any(Array),
            });
            expect(children).toHaveBeenCalledWith({
              index: 0,
              last: steps.length - 1,
              step: steps[0],
              steps,
              data: expect.any(Array),
              onNext: expect.any(Function),
              onPrevious: expect.any(Function),
            });
          });
        });
      });
    });

    describe('with a custom header', () => {
      beforeEach(() => {
        render(
          <MultistepFlow
            data-testid="Flow"
            steps={steps}
            onChange={onChange}
            children={children}
            renderNext={renderNext}
            renderPrevious={renderPrevious}
          />
        );
      });

      xit('should call the renderNext callback.', () => {});
      xit('should call the renderPrevious callback.', () => {});

      describe('after clicking the previous button', () => {
        xit('should go to the previous page.', () => {});
      });

      describe('after clicking the next button', () => {
        xit('should go to the next page.', () => {});
      });
    });
  });

  describe('controlled', () => {

    beforeEach(() => {

      render(
        <MultistepFlow
          data-testid="Flow"
          steps={steps}
          index={1}
          onChange={onChange}
          children={children}
        />
      );
    });

    it('should render the children with the correct index.', async () => {
      expect(children).toHaveBeenCalledTimes(1);
      await page.exists();
    });

    describe('after clicking the next button', () => {
      beforeEach(async () => {
        children.mockReset();
        await page.clickNext();
      });

      it('should call the setValue callback.', async () => {
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledTimes(1);
        });

        expect(onChange).toHaveBeenCalledWith({
          index: 2,
          last: steps.length - 1,
          step: steps[2],
          steps,
          data: expect.any(Array),
        });
      });

      it('should not rerender.', () => {
        expect(children).not.toHaveBeenCalled();
      });
    });

    describe('after clicking the previous button', () => {
      beforeEach(async () => {
        children.mockReset();
        await page.clickPrevious();
      });

      it('should call the setValue callback.', async () => {
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledTimes(1);
        });

        expect(onChange).toHaveBeenCalledWith({
          index: 0,
          last: steps.length - 1,
          step: steps[0],
          steps,
          data: expect.any(Array),
        });
      });

      it('should not rerender.', () => {
        expect(children).not.toHaveBeenCalled();
      });
    });

    describe('after calling the children.onPrevious prop', () => {
      let data;

      beforeEach(() => {
        data = {};
        const {onPrevious} = mostRecentCall(children)[0];
        act(() => onPrevious(data));
      });

      it('should call the setValue callback.', async () => {
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledTimes(1);
        });

        expect(onChange).toHaveBeenCalledWith({
          index: 0,
          last: steps.length - 1,
          step: steps[0],
          steps,
          data: expect.any(Array),
        });
      });
    });

    describe('after calling the children.onNext prop', () => {
      let data;

      beforeEach(() => {
        data = {};
        const {onNext} = mostRecentCall(children)[0];
        act(() => onNext(data));
      });

      it('should call the setValue callback.', async () => {
        await waitFor(() => {
          expect(onChange).toHaveBeenCalledTimes(1);
        });

        expect(onChange).toHaveBeenCalledWith({
          index: 2,
          last: steps.length - 1,
          step: steps[2],
          steps,
          data: expect.any(Array),
        });
      });
    });
  });
});

