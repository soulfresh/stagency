import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ResizeObserver from "resize-observer-polyfill";

import { wrapWithAnalytics } from '~/test';
import { Select, SelectTrigger, SelectOption } from './Select.jsx';

import { getSelectMenuByTriggerText, getSelectMenuOptionByTriggerText } from './Select.page-object';

describe('Select', function() {
  let options, onChange;

  beforeEach(() => {
    options = ['Apple', 'Orange', 'Cat'];

    onChange = jest.fn();

    render(wrapWithAnalytics(
      <Select
        options={options}
        content={(item) => <SelectOption>{ item }</SelectOption>}
        layerOptions={{ResizeObserver}}
        onChange={onChange}
      >
      {(props, item) =>
        <SelectTrigger {...props}>
          { item ? item : 'Select a Fruit'}
        </SelectTrigger>
      }
      </Select>
    ));
  });

  it('should render the trigger only', () => {
    const trigger = screen.getByText('Select a Fruit');
    expect(trigger).toBeInTheDocument();
    expect(trigger).not.toHaveAttribute('aria-expanded', 'true');
  });

  it('should render the options for the select.', () => {
    expect(getSelectMenuByTriggerText(document.body, 'Select a Fruit'))
      .toBeInTheDocument();
  });

  describe('after clicking on the trigger', () => {
    beforeEach(() => {
      fireEvent.click(
        screen.getByText('Select a Fruit')
      );
    });

    it('should show the menu.', () => {
      expect(screen.getByText('Select a Fruit')).toHaveAttribute('aria-expanded', 'true');
    });

    describe('and then selecting an option', () => {
      beforeEach(() => {
        fireEvent.click(
          getSelectMenuOptionByTriggerText(
            document.body,
            'Select a Fruit',
            'Orange'
          )
        );
      });

      it('should call the onChange callback.', () => {
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith('Orange', expect.any(Object));
      });
    });
  });
});

