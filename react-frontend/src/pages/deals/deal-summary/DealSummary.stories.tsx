import {fromGraphQL} from '~/services'
import {generateGraphQL} from '~/services/mocks'

import { DealSummary, DealSummaryProps } from './DealSummary'

export default {
  title: 'Components/DealSummary',
  component: DealSummary,
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
    style: {
      margin: 40,
    }
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
export const Template = (props: DealSummaryProps) => <DealSummary {...props} />
Template.storyName = 'DealSummary'
Template.parameters = {
  // Open the source code for the first story
  docs: {source: {state: 'open'}},
}

