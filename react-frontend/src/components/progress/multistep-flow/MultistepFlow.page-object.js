import { HTMLPageObject, Button, including } from '~/test';

import { elementText } from '~/test';

export const MultistepFlowPageObject = HTMLPageObject.extend('multistep flow')
  .filters({
    title: el => elementText(el.querySelector('[data-testid=MultistepFlowTitle]')), //elementText(el),
  })
  .actions({
    // This is only guaranteed to work if the component is uncontrolled.
    clickPrevious: async (interactor) => {
      await interactor.find(Button(including('Previous'))).click();
    },
    // This is only guaranteed to work if the component is uncontrolled.
    clickNext: async (interactor) => {
      await interactor.find(Button(including('Next'))).click();
    },
  })

