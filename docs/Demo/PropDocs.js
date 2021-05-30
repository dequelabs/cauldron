import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableHead,
  TableCell,
  DescriptionList,
  DescriptionListItem,
  DescriptionTerm,
  DescriptionDetails
} from '@deque/cauldron-react';

const defaultPropTypes = {
  docs: PropTypes.object.isRequired,
  defaultProps: PropTypes.object
};

const DescriptionListDocs = ({
  docs,
  defaultProps = {},
  collapsed = false
}) => (
  <ul className="semantic-only">
    {Object.entries(docs).map(([name, data]) => {
      const defaultProp =
        data.defaultValue || defaultProps[name] || data.default;

      return (
        <li key={`${name}-datalist`}>
          <DescriptionList collapsed={collapsed}>
            <DescriptionListItem>
              <DescriptionTerm>Name</DescriptionTerm>
              <DescriptionDetails>{name}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Type</DescriptionTerm>
              <DescriptionDetails>{data.type}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Required</DescriptionTerm>
              <DescriptionDetails>{`${!!data.required}`}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Description</DescriptionTerm>
              <DescriptionDetails>{data.description}</DescriptionDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionTerm>Default</DescriptionTerm>
              <DescriptionDetails>
                {typeof defaultProp !== 'undefined' &&
                  (typeof defaultProp === 'object'
                    ? JSON.stringify(defaultProp)
                    : `${defaultProp}`)}
              </DescriptionDetails>
            </DescriptionListItem>
          </DescriptionList>
        </li>
      );
    })}
  </ul>
);

const PropDocs = ({ docs, defaultProps = {} }) => (
  <>
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Required</TableHeader>
          <TableHeader>Description</TableHeader>
          <TableHeader>Default</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(docs).map(([name, data]) => {
          const defaultProp =
            data.defaultValue || defaultProps[name] || data.default;

          return (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>{data.type}</TableCell>
              <TableCell>{`${!!data.required}`}</TableCell>
              <TableCell>{data.description}</TableCell>
              <TableCell>
                {typeof defaultProp !== 'undefined' &&
                  (typeof defaultProp === 'object'
                    ? JSON.stringify(defaultProp)
                    : `${defaultProp}`)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    <div className="not-collapsed">
      <DescriptionListDocs docs={docs} defaultProp={defaultProps} />
    </div>
    <div className="collapsed">
      <DescriptionListDocs docs={docs} defaultProp={defaultProps} collapsed />
    </div>
  </>
);

PropDocs.propTypes = defaultPropTypes;
PropDocs.displayName = 'PropDocs';
export default PropDocs;
