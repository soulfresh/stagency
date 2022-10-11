import {
  randAirline,
  randAirport,
  randFlightNumber,
} from '@ngneat/falso';

import {
  ResponsiveTable,
  ResponsiveTableProps,
  TableCell,
  TableCellProps,
} from './ResponsiveTable'

export default {
  title: 'Components/ResponsiveTable',
  component: ResponsiveTable,
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
  args: {},
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

interface Flight {
  name: string
  code: string
  city: string
  country: string
  airline: string
  flight: string
}

const randomFlight = (): Flight => ({
  ...randAirport(),
  airline: randAirline(),
  flight: randFlightNumber(),
})


// The first export will be used as the main story on the page.
export const Template = (props: ResponsiveTableProps<Flight>) => <ResponsiveTable {...props} />
Template.storyName = 'ResponsiveTable'
Template.args = {
  data: [
    randomFlight(),
    randomFlight(),
    randomFlight(),
  ],
  columns: [
    {key: "name"    , title: 'Airport Name'},
    {key: "code"    , title: 'Airport Code'},
    {key: "city"    , title: 'City'},
    {key: 'country' , title: 'Country'},
    {key: 'airline' , title: 'Airline'},
    {key: 'flight'  , title: 'Flight'},
  ],
  renderCell: ({column, row, ...props}: TableCellProps<Flight>) => (
    <TableCell
      column={column}
      row={row}
      {...props}
      children={(console.log('cell:', row, column.key), row[column.key])}
    />
  )
}
Template.parameters = {
  // Open the source code for the first story
  docs: {source: {state: 'open'}},
}

// If you want to customize the name:
// Template.storyName = 'ResponsiveTable'

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

