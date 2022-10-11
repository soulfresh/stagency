import React from 'react'
import {fromGraphQL} from '~/services'
import {generateGraphQL} from '~/services/mocks'

import { Finished, FinishedProps } from './Finished'

export default {
  title: 'Pages/DealFlow/Finished',
  component: Finished,
  // You can use argTypes to further customize the controls
  // in the storybook if you need.
  // https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // If your component exposes any Styled System props, you can
    // uncomment the appropriate lines below.
    // ...spaceArgTypes,
    // ...layoutArgTypes,
    // ...positionArgTypes,

    // If you want to group props together, you can use the following:
    // foo: {table: {category: 'Group Name'}},
    // Or use this if you need subgrouping:
    // foo: {table: {category: 'Group Name', subcategory: 'Subgroup Name'}},

    // Don't forget to document props that you apply to the root component
    // via ...rest
    // 'Root Component Name': {
    //   description: 'You can also pass any props of [XXX](https://xxx).',
    //   table: {
    //     category: 'Root Node'
    //   }
    // },
  },
  // Default props for your stories.
  // https://storybook.js.org/docs/react/writing-stories/args
  args: {
    deal: fromGraphQL.app_deal(generateGraphQL.app_deal()),
  },
  parameters: {
    // If you need to change the default layout for stories, you can use
    // one of 'centered', 'fullscreen', 'padded', 'flex'.
    // layout: 'centered',
    // If using the 'flex' layout, you can also pass the `layoutHeight`
    // parameter to set a specific height for your example.
    // layoutHeight: 200,
    // If you experience issues with the positioning of modal components,
    // you can force rendering of components in an iframe.
    // This can have performance impacts if you have a lot of variations.
    // If you experience performance issues, move this customization down
    // to the variations where you need it or break the variations into
    // multiple `.stories` files.
    // docs: { inlineStories: false, iframeHeight: 600 },
  },
}

// The first export will be used as the main story on the page.
export const Template = (props: FinishedProps) => <Finished {...props} />
Template.storyName = 'Finished'
Template.parameters = {
  // Open the source code for the first story
  docs: {source: {state: 'open'}},
}

// If you want to customize the name:
// Template.storyName = 'Finished'

// If you need specific decorators
// Template.decorators = [centered]

//// VARIATIONS ////

// If your component has multiple variations, please duplicate the template below.
// export const Variation = Template.bind({})
// Variation.parameters = {
//   docs: {
//     description: {
//       story: 'Describe this variation'
//     }
//   }
// }

// You can customize the args for this variation:
// Variation.args = {}

// If you want to customize the name or the decorators:
// Variation.storyName = 'Variation'
// Variation.decorators = [centered]

