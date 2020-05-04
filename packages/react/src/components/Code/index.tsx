import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter, {
  SyntaxHighlighterProps
} from 'react-syntax-highlighter';
import theme from './theme';

interface Props extends SyntaxHighlighterProps {
  children: React.ReactNode;
}

const Code: React.ComponentType<Props> = ({ children, ...props }) => (
  <SyntaxHighlighter {...props} style={theme}>
    {children}
  </SyntaxHighlighter>
);

Code.displayName = 'Code';

Code.defaultProps = { language: 'javascript' };

Code.propTypes = {
  children: PropTypes.string.isRequired,
  language: PropTypes.string
};

export default Code;
