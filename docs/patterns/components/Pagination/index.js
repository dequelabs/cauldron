import React from 'react';
import Demo from '../../../Demo';
import {
  Pagination,
  Code,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@deque/cauldron-react/';
import './index.css';

const PaginationDemo = () => {
  return (
    <Demo
      component={Pagination}
      states={[]}
      propDocs={{
        pageSize: {
          type: 'number',
          required: true,
          description: 'Page size as a whole number'
        },
        totalPages: {
          type: 'number',
          required: true,
          description: 'Total pages as a whole number'
        },
        totalItems: {
          type: 'number',
          required: true,
          description: 'Total items'
        },
        currentItemCount: {
          type: 'number',
          required: true,
          description: 'Number of items in the current page'
        },
        currentPage: {
          type: 'number',
          required: true,
          description: 'Current page number'
        },
        hasPrevious: {
          type: 'boolean',
          required: true,
          description: 'Is a previous page present?'
        },
        hasNext: {
          type: 'number',
          required: true,
          description: 'Is the next page present?'
        },
        mobileView: {
          type: 'boolean',
          required: false,
          description: 'Render mobile view'
        },
        handlePageSizeChange: {
          type: 'function',
          required: true,
          description: 'Function to call on page size change'
        },
        handlePageChange: {
          type: 'function',
          required: true,
          description: 'Function to call on page change'
        }
      }}
    >
      <div className="Pagination_Demo">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader scope="col">First Name</TableHeader>
              <TableHeader scope="col">Last Name</TableHeader>
              <TableHeader scope="col">Email</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Frank</TableCell>
              <TableCell>Zappa</TableCell>
              <TableCell>frank@zappa.io</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Pagination
          pageSize={1}
          totalPages={1}
          totalItems={1}
          currentItemCount={1}
          currentPage={1}
          hasPrevious={false}
          hasNext={false}
          mobileView={false}
          handlePageSizeChange={() => console.log('Test')}
          handlePageChange={() => console.log('Test2')}
        />
        <h2>Code Sample</h2>
        <Code language="javascript">
          {`
      import React from 'react';
      import {
        Pagination,
        Code
      } from '@deque/cauldron-react/';
     
      
      const PaginationDemo = () => {
        return(
        <div className="PaginationDemo">
          <h1>Pagination</h1>
          <Table>
          ....
          </Table>
          <Pagination 
              pageSize={10} 
              totalPages={2}
              totalItems={15} 
              currentItemCount={10} 
              currentPage={1} 
              hasPrevious = {false}
              hasNext = {true}
              mobileView={false}
              handlePageSizeChange={()=>console.log("Test")}
              handlePageChange={()=> console.log("Test2")} /> 
          </div>
        )
      }
    `}
        </Code>
      </div>
    </Demo>
  );
};

export default PaginationDemo;
