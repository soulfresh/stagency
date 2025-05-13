import React from 'react';
import { render, act, waitFor } from '@testing-library/react';

import { TextField, HTML, mostRecentCall } from '~/test';

import {
  useAutoSaveForm,
  useInputHasValue,
  useInput,
} from './forms';

describe('utils/hooks', () => {
  let children;

  beforeEach(() => {
    children = jest.fn();
  });

  describe('useAutoSaveForm', () => {
    let onChange, children;
    const name = 'Jimi Hendrix';
    const email = 'jimi@rocklegends.com';

    const ErrorMessage = HTML.extend('error message').selector('p');

    function AutoSaveExample({onChange, children}) {
      const result = useAutoSaveForm(onChange);
      children(result);
      return (
        <form>
          <label>Name:
            <input {...result.register('name')} />
          </label>
          {result.formState?.errors?.name &&
            <p>Name is invalid</p>
          }
          <label>Email:
            <input {...result.register('email', {pattern: /.+@rocklegends\.com/})} />
          </label>
          {result.formState?.errors?.email &&
            <p>Email is invalid</p>
          }
        </form>
      );
    }

    beforeEach(() => {
      onChange = jest.fn();
      children = jest.fn();

      render(
        <AutoSaveExample
          onChange={onChange}
          children={children}
        />
      );

      return waitFor(() => expect(children).toHaveBeenCalled());
    })

    it('should return the useForm API.', () => {
      expect(children).toHaveBeenCalledWith(expect.objectContaining({
        // There's more to this API but these are the basic things we care about.
        watch: expect.any(Function),
        register: expect.any(Function),
        formState: expect.objectContaining({
          isDirty: false,
          isValid: true,
          isValidating: false,
          errors: {}
        })
      }));
    });

    it('should not have called the onChange callback yet.', () => {
      expect(onChange).not.toHaveBeenCalled();
    });

    describe('after changing the values', () => {
      beforeEach(async () => {
        onChange.mockClear();
        await TextField(/Name/).fillIn(name);
      });

      it('should emit an onChange event with the updated values.', () => {
        expect(onChange).toHaveBeenCalledTimes(name.length);
        expect(onChange).toHaveBeenCalledWith({
          name: name,
          email: ''
        })
      });

      describe('and then tabbing through fields', () => {
        beforeEach(async () => {
          onChange.mockClear();
          await TextField(/Name/).blur();
        });

        it('should not emit the onChange event.', () => {
          expect(onChange).not.toHaveBeenCalled();
        });
      });
    });

    describe('after setting invalid data', () => {
      beforeEach(async () => {
        await act(async () => {
          await TextField(/Email/).fillIn('jimi');
          await TextField(/Email/).blur();
          await ErrorMessage("Email is invalid");
        })
      });

      it('should not emit the onChange event.', () => {
        expect(onChange).not.toHaveBeenCalled();
      });

      it('should return the errors object.', () => {
        const state = mostRecentCall(children)[0];
        expect(state).toEqual(expect.objectContaining({
          formState: expect.objectContaining({
            isDirty: true,
            isValid: false,
            isValidating: false,
            errors: {
              email: expect.any(Object),
            }
          })
        }));
      });

      describe('and then tabbing through fields', () => {
        beforeEach(async () => {
          onChange.mockClear();
          await TextField(/Email/).blur();
          await TextField(/Name/).focus();
          await TextField(/Name/).blur();
        });

        it('should not emit the onChange event.', () => {
          expect(onChange).not.toHaveBeenCalled();
        });
      });

      describe('and then fixing the data', () => {
        beforeEach(async () => {
          onChange.mockClear();
          await act(async () => {
            await TextField(/Email/).fillIn(email);
            await TextField(/Email/).blur();
          })
        });

        it('should emit the onChange event.', () => {
          expect(onChange).toHaveBeenCalled();

          const lastValue = mostRecentCall(onChange)[0];
          expect(lastValue).toEqual({
            name: '',
            email,
          })
        });

        it('should not have any errors.', async () => {
          await ErrorMessage('Email is invalid').absent();
          await ErrorMessage('Name is invalid').absent();
        });
      });
    });
  });

  describe('useInputHasValue', () => {
    function HasValueExample(props) {
      const result = useInputHasValue(props.defaultValue, props.value, props.onChange);
      props.children(result);
      return null;
    }

    it('should be able to tell if a value is set initially.', () => {
      children.mockClear();
      render(<HasValueExample value="foo" children={children} />);
      expect(children).toHaveBeenCalledWith([true, expect.any(Function)]);

      children.mockClear();
      render(<HasValueExample defaultValue="foo" children={children} />);
      expect(children).toHaveBeenCalledWith([true, expect.any(Function)]);

      children.mockClear();
      render(<HasValueExample children={children} />);
      expect(children).toHaveBeenCalledWith([false, expect.any(Function)]);
    });

    it('should be able to tell if a value is set on change.', async () => {
      render(<HasValueExample children={children} />);

      const calls = children.mock.calls;
      const lastCall = calls[calls.length - 1][0];
      const onChange = lastCall[1];

      // Initially it should have never had a value.
      expect(onChange).toEqual(expect.any(Function));
      expect(children).not.toHaveBeenCalledWith([true, expect.any(Function)]);

      await act(async () => {
        // After calling onChange without a value, it should recognize there is still no value.
        onChange({target: {value: undefined}});
      });

      expect(children).not.toHaveBeenCalledWith([true, expect.any(Function)]);

      await act(async () => {
        // After calling onChange with a value it should recognize the value.
        onChange({target: {value: 'foo'}});
      });

      // This will rerender on the next tick.
      await waitFor(() => {
        expect(children).toHaveBeenCalledWith([true, expect.any(Function)]);
      });
    });

    it('should be able to tell if the value changes externally', () => {
      const {rerender} = render(<HasValueExample children={children} />);
      expect(children).not.toHaveBeenCalledWith([true, expect.any(Function)]);

      // After rerendering with a value it should recognize the value.
      rerender(<HasValueExample value="foo" children={children} />);
      expect(children).toHaveBeenCalledWith([true, expect.any(Function)]);
    });
  });

  describe('useInput', () => {
    function InputExample(props) {
      const result = useInput(props, '');
      props.children(result);
      return null;
    }

    it('should set the "hasValue" class if a value is set initially.', () => {
      render(<InputExample children={children} />);
      expect(children).not.toHaveBeenCalledWith(expect.objectContaining({
        className: expect.stringContaining('hasValue'),
      }));

      render(<InputExample value="foo" children={children} />);
      expect(children).toHaveBeenCalledWith(expect.objectContaining({
        className: expect.stringContaining('hasValue'),
      }));
    });

    it('should set the "hasValue" class if a value is set on change.', async () => {
      render(<InputExample children={children} />);

      const calls = children.mock.calls;
      const lastCall = calls[calls.length - 1];
      const props = lastCall[0];
      const onChange = props.onChange;

      // Initially it should have never had a value.
      expect(onChange).toEqual(expect.any(Function));
      expect(children).not.toHaveBeenCalledWith(expect.objectContaining({
        className: expect.stringContaining('hasValue'),
      }));

      await act(async () => {
        // After calling onChange with a value it should recognize the value.
        onChange({target: {value: 'foo'}});
      });

      // This will rerender on the next tick.
      await waitFor(() => {
        expect(children).toHaveBeenCalledWith(expect.objectContaining({
          className: expect.stringContaining('hasValue'),
        }));
      });
    });

    it('should set the "hasValue" class if a value is set externally.', () => {
      const {rerender} = render(<InputExample children={children} />);
      expect(children).not.toHaveBeenCalledWith(expect.objectContaining({
        className: expect.stringContaining('hasValue'),
      }));

      // After rerendering with a value it should recognize the value.
      rerender(<InputExample value="foo" children={children} />);
      expect(children).toHaveBeenCalledWith(expect.objectContaining({
        className: expect.stringContaining('hasValue'),
      }));
    });

    it('should set the "narrow" class if the narrow prop is set.', () => {
      render(<InputExample narrow children={children} />);
      expect(children).toHaveBeenCalledWith(expect.objectContaining({
        className: expect.stringContaining('narrow'),
      }));
    });
  });
});

