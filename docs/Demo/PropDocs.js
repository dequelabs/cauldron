import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableRow,
  TableHeader,
  TableHead,
  TableCell,
  DataList,
  DataListItem,
  DataKey,
  DataValue
} from '@deque/cauldron-react';

const defaultPropTypes = {
  docs: PropTypes.object.isRequired,
  defaultProps: PropTypes.object
};

const DataListDocs = ({ docs, defaultProps = {}, collapsed = false }) => (
  <ul className="semantic-only">
    {Object.entries(docs).map(([name, data]) => {
      const defaultProp =
        data.defaultValue || defaultProps[name] || data.default;

      return (
        <li key={`${name}-datalist`}>
          <DataList collapsed={collapsed}>
            <DataListItem>
              <DataKey>Name</DataKey>
              <DataValue>{name}</DataValue>
            </DataListItem>
            <DataListItem>
              <DataKey>Type</DataKey>
              <DataValue>{data.type}</DataValue>
            </DataListItem>
            <DataListItem>
              <DataKey>Required</DataKey>
              <DataValue>{`${!!data.required}`}</DataValue>
            </DataListItem>
            <DataListItem>
              <DataKey>Description</DataKey>
              <DataValue>{data.description}</DataValue>
            </DataListItem>
            <DataListItem>
              <DataKey>Default</DataKey>
              <DataValue>
                {typeof defaultProp !== 'undefined' &&
                  (typeof defaultProp === 'object'
                    ? JSON.stringify(defaultProp)
                    : `${defaultProp}`)}
              </DataValue>
            </DataListItem>
          </DataList>
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
      <DataListDocs docs={docs} defaultProp={defaultProps} />
    </div>
    <div className="collapsed">
      <DataListDocs docs={docs} defaultProp={defaultProps} collapsed />
    </div>
  </>
);

PropDocs.propTypes = defaultPropTypes;
PropDocs.displayName = 'PropDocs';
export default PropDocs;
