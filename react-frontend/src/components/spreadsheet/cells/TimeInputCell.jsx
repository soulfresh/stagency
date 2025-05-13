import React from 'react';
import { SelectableCell } from './SelectableCell';
import { TimeInput } from '../../inputs';

export const TimeInputCell = React.forwardRef(({
  duration,
  withSeconds,
  h24,
  minuteIncrement,
  secondIncrement,
  placeholder,
  locale,
  ...props
}, ref) =>
  <SelectableCell {...props} ref={ref}>
    {({optionToString, options, ...selectProps}, {optionToString: _, ...triggerProps}, triggerRef) => (
      <TimeInput
        {...selectProps}
        {...triggerProps}
        duration={duration}
        withSeconds={withSeconds}
        h24={h24}
        minuteIncrement={minuteIncrement}
        secondIncrement={secondIncrement}
        placeholder={placeholder}
        locale={locale}
        ref={triggerRef}
      />
    )
    }
  </SelectableCell>
);
