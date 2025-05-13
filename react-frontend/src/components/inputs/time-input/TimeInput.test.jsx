import { render, ResizeObserver } from '~/test';

import { TimeInput } from './TimeInput.jsx';
import { TimeInputPO } from './TimeInput.page-object.js';

describe('TimeInput', function() {
  let component;

  beforeEach(() => {
    component = TimeInputPO({ testId: 'TimeInput' });
  });

  describe('by default', () => {
    beforeEach(() => {
      render(
        <TimeInput
          locale="en-US"
          value="00:00:00"
          data-testid="TimeInput"
          ResizeObserver={ResizeObserver}
        />
      );
    });

    it('should render.', async () => {
      await component.exists();
    });

    it('should show the time in the users locale format.', async () => {
      await component.has({text: '12:00 AM'});
    });

    it('should show the meridiem column.', async () => {
      await component.click();
      await component.has({meridiemColumn: true})
    });

    it('should not render the seconds column.', async () => {
      await component.is({open: false});

      await component.click();
      await component.is({open: true});

      await component.has({secondsColumn: false});
    });
  });

  describe('with seconds', () => {
    beforeEach(async () => {
      render(
        <TimeInput
          locale="en-US"
          value="00:00:00"
          withSeconds
          data-testid="TimeInput"
          ResizeObserver={ResizeObserver}
        />
      );

      await component.click();
    });

    it('should show the expected time.', async () => {
      await component.has({text: '12:00:00 AM'});
    });

    it('should show the seconds column.', async () => {
      await component.has({secondsColumn: true});
    });
  });

  describe('with 24 hour time', () => {
    beforeEach(async () => {
      render(
        <TimeInput
          locale="en-US"
          value="00:00:00"
          h24
          data-testid="TimeInput"
          ResizeObserver={ResizeObserver}
        />
      );

      await component.click();
    });

    it('should show the expected time.', async () => {
      await component.has({text: '12:00 AM'});
    });

    it('should show 24 hour selectors.', async () => {
      await component.is({h24: true});
      await component.has({hourCount: 24});
    });

    it('should not show the am/pm column.', async () => {
      await component.has({meridiemColumn: false});
    });
  });

  describe('with a duration inpu', () => {
    beforeEach(async () => {
      render(
        <TimeInput
          locale="en-US"
          value="00:00:00"
          duration
          data-testid="TimeInput"
          ResizeObserver={ResizeObserver}
        />
      );

      await component.click();
    });

    it('should show the expected time.', async () => {
      await component.has({text: '00:00'});
    });

    it('should not show the am/pm column.', async () => {
      await component.has({meridiemColumn: false});
    });

    it('should show 24 hour selectors.', async () => {
      await component.has({hourCount: 24});
    });

    it('should not show the seconds column.', async () => {
      await component.has({secondsColumn: false});
    })
  });

  describe('as a duration with seconds', () => {
    beforeEach(async () => {
      render(
        <TimeInput
          locale="en-US"
          value="00:00:00"
          duration
          withSeconds
          data-testid="TimeInput"
          ResizeObserver={ResizeObserver}
        />
      );

      await component.click();
    });

    it('should show the expected time.', async () => {
      await component.has({text: '00:00:00'});
    });

    it('should show the seconds column.', async () => {
      await component.has({secondsColumn: true});
    });
  })
});

