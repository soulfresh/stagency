import React from 'react'

import Examples from './MultistepFlow.mdx';
import { PreviousAction, Action } from '../../buttons';
import { MultistepFlow } from './MultistepFlow.jsx';


const steps = [
  "Let's Get Started...",
  'Almost Done!',
  'Finished 👏'
];

export default {
  title: 'Components/Progress/MultistepFlow',
  component: MultistepFlow,
  argTypes: { },
  args: {
    steps: steps,
    children: ({index, last}) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        This is step {index + 1} of {last + 1}
      </div>
    ),
  },
  parameters: {
    docs: {
      page: Examples,
    },
  },
}

export const Template = ({
  index: i = 0,
  onChange,
  ...props
}) => {
  const [index, setIndex] = React.useState(i);
  return (
    <MultistepFlow
      index={index}
      onChange={(props) => {
        onChange(props);
        setIndex(props.index)
      }}
      {...props}
    />
  );
}
Template.storyName = 'MultistepFlow'
Template.parameters = {
  docs: {
    source: {
      code: `
<MultistepFlow
  steps={['a', 'b', 'c']}
>
  {({index, last}) =>
    <div>This is step {index + 1} of {last + 1}</div>
  }
</MultistepFlow>
      `
    }
  }
}


export const CustomHeader = ({index, ...props}) => (
  <MultistepFlow
    {...props}
    renderPrevious={({index, onPrevious}) => {
      return (
        <PreviousAction
          display="link"
          feel="primary"
          onClick={() => console.log('Cancel!')}
        >
          Cancel
        </PreviousAction>
      );
    }}

    renderNext={({index, last, onNext}) => {
      const next = index < last;
      return (
        <Action
          disabled={!next}
          style={{visibility: !next ? 'hidden' : 'visible'}}
          display="link"
          feel="primary"
          onClick={() => console.log("Let's get outta here!")}
        >
          Save and Exit
        </Action>
      );
    }}
  >
    {
      ({index, last, onNext, onPrevious}) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#efefef',
          }}
        >
          <div style={{textAlign: 'center'}}>This is step {index + 1} of {last + 1}</div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: 50,
            }}
          >
            <Action solid onClick={() => onPrevious(`From Page ${index} to Page ${index - 1}`)}>Previous</Action>
            <Action solid feel="primary" onClick={() => onNext(`From Page ${index} to Page ${index + 1}`)}>Next</Action>
          </div>
        </div>
      )
    }
  </MultistepFlow>
);
CustomHeader.parameters = {
  docs: {
    source: {
      type: 'code'
    }
  }
}

export const Controlled = ({onChange, ...props}) => {
  const [index, setIndex] = React.useState(1);
  return (
  <MultistepFlow
    {...props}
    index={index}
    onChange={(props) => {
      setIndex(props.index);
      onChange(props);
    }}
  >
    {
      ({index, last, onNext, onPrevious}) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: '#efefef',
          }}
        >
          This is step {index + 1} of {last + 1}
        </div>
      )
    }
  </MultistepFlow>
  );
}
Controlled.parameters = {
  docs: {
    source: {
      type: 'code'
    }
  }
}
