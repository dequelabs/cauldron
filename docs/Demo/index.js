import React from 'react';
import PropTypes from 'prop-types';
import jsxStringify from 'react-element-to-jsx-string';
import { Code } from '@deque/cauldron-react';
import PropDocs from './PropDocs';
import './index.css';

const stringifyConfig = {
  showDefaultProps: false,
  showFunctions: true
};

const Demo = props => {
  const {
    states,
    component: Component,
    propDocs,
    children,
    customImport,
    componentDescription
  } = props;

  const { displayName, defaultProps = {} } = Component;

  const renderState = state => {
    const { displayName } = Component;

    if (!displayName) {
      throw new Error('Component missing displayName');
    }

    const Tag = displayName;
    return jsxStringify(<Tag {...state} />, stringifyConfig);
  };

  return (
    <div className="Demo">
      <h1>{displayName}</h1>
      <h2>Component Description</h2>
      <p>{componentDescription}</p>
      <h2>Demo</h2>
      <Code>
        {customImport ||
          `import { ${displayName} } from '@deque/cauldron-react'`}
      </Code>
      {states.length ? (
        <div className="Demo-states">
          <h2>Examples</h2>
          {/* setting children to null in the key to avoid stringify choking on potential jsx children */}
          {states.map(state => {
            const {
              DEMO_renderAfter,
              DEMO_renderBefore,
              DEMO_hide_renderAfterBefore = false,
              DEMO_key,
              ...thinState
            } = state;
            const componentMarkup = renderState(thinState);
            const key = DEMO_key || componentMarkup;
            const afterMarkup =
              DEMO_renderAfter &&
              !DEMO_hide_renderAfterBefore &&
              jsxStringify(DEMO_renderAfter, stringifyConfig);

            return (
              <div key={key}>
                {DEMO_renderBefore}
                <Component {...thinState} />
                {DEMO_renderAfter}
                <Code role="region" tabIndex={0}>
                  {`${componentMarkup}${afterMarkup ? `\n${afterMarkup}` : ''}`}
                </Code>
              </div>
            );
          })}
          {children}
        </div>
      ) : (
        children
      )}
      <div className="Demo-props">
        <h2>Props</h2>
        <PropDocs docs={propDocs} defaultProps={defaultProps} />
      </div>
    </div>
  );
};

Demo.propTypes = {
  propDocs: PropTypes.object.isRequired,
  states: PropTypes.arrayOf(PropTypes.object).isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  children: PropTypes.node,
  customImport: PropTypes.string
};

export default Demo;
