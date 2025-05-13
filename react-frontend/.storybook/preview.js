import '../src/index.scss';

// Import stylesheets that allow us to use the sass-theming
// storybook components.
import '@thesoulfresh/sass-theming/components.scss';

export const parameters = {
  layout: 'fullscreen',
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    sort: 'requiredFirst',
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  grid: { cellSize: 8 },
  backgrounds: {
    default: 'white',
    values: [
      {
        name: 'white',
        value: '#ffffff',
      },
      {
        name: 'light',
        value: '#f5f6fa',
      },
      {
        name: 'dark',
        value: '#555',
      },
    ],
  },
}

const FlexDecorator = (Story, context) => {
  if (context?.parameters?.layout !== 'flex') return <Story />

  const flexDirection = context?.parameters?.flexDirection || 'column'
  const height = context?.parameters?.layoutHeight || '100%'

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        minHeight: height,
        height: '100%',
      }}
    >
      <Story />
    </div>
  )
}

// Define global decorators.
// https://storybook.js.org/docs/react/writing-stories/decorators
export const decorators = [FlexDecorator]
