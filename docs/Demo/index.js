import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jsxStringify from 'react-element-to-jsx-string';
import { Code } from '@deque/cauldron-react';
import PropDocs from './PropDocs';
import './index.css';

const stringifyConfig = {
  showDefaultProps: false,
  showFunctions: true
};

class Demo extends Component {
  render() {
    const {
      states,
      component: Component,
      propDocs,
      children,
      customImport
    } = this.props;
    const { displayName, defaultProps = {} } = Component;

    return (
      <div className="Demo">
        <h1>{displayName}</h1>
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
                ...thinState
              } = state;
              const componentMarkup = this.renderState(thinState);
              const afterMarkup =
                DEMO_renderAfter &&
                jsxStringify(DEMO_renderAfter, stringifyConfig);

              return (
                <div key={componentMarkup}>
                  {DEMO_renderBefore}
                  <Component {...thinState} />
                  {DEMO_renderAfter}
                  <Code>
                    {`${componentMarkup}${
                      afterMarkup ? `\n${afterMarkup}` : ''
                    }`}
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
  }

  renderState = state => {
    const { displayName } = this.props.component;

    if (!displayName) {
      throw new Error('Component missing displayName');
    }

    const Tag = displayName;
    return jsxStringify(<Tag {...state} />, stringifyConfig);
  };
}

Demo.propTypes = {
  propDocs: PropTypes.object.isRequired,
  states: PropTypes.arrayOf(PropTypes.object).isRequired,
  component: PropTypes.func.isRequired,
  children: PropTypes.node,
  customImport: PropTypes.string
};

export default Demo;
