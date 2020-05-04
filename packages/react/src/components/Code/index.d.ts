import React from 'react';
import { SyntaxHighlighterProps } from 'react-syntax-highlighter';
interface Props extends SyntaxHighlighterProps {
  children: React.ReactNode;
}
declare const Code: React.ComponentType<Props>;
export default Code;
