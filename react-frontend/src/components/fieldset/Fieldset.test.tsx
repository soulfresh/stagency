import React from 'react';
import { render } from '~/test';

import { Fieldset } from './Fieldset';
import { FieldsetPO } from './Fieldset.page-object';

describe('Fieldset', function() {
  let component: typeof FieldsetPO;

  beforeEach(() => {
    component = FieldsetPO({ testId: 'Fieldset' });
    render(
      <Fieldset
        data-testid="Fieldset"
      />
    );
  });

  it('should render.', async () => {
    await component.exists();
  });

  xit('should render all of its children.', () => {})
  xit('should render a legend element.', () => {})
  xit('should be able to show a delete button.', () => {})
  xit('should call the onDelete callback after clicking the delete button.', () => {})
});

