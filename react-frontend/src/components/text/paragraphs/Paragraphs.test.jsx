import React from 'react';
import { render, screen } from '@testing-library/react';

import { Paragraph, BoldParagraph } from './Paragraphs.jsx';

describe('Paragraphs', function() {
  it('should be able to render a paragraph.', () => {
    const text = 'My Text';
    render(<Paragraph>{ text }</Paragraph>);
    expect(screen.getByTestId('Paragraph')).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('should be able to render a bold paragraph.', () => {
    const text = 'My Text';
    render(<BoldParagraph>{ text }</BoldParagraph>);
    expect(screen.getByTestId('BoldParagraph')).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
