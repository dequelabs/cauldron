import React from 'react';
import { Link, Icon } from '@deque/cauldron-react/';

const Footer = props => {
  const year = new Date().getFullYear();

  return (
    <footer className="Footer">
      <ul className="Footer__links">
        <li>
          <Link
            href="https://www.deque.com/terms-of-use/"
            aria-label="Terms of Use - opens an external site"
          >
            Terms of Use
            <Icon type="external-link" />
          </Link>
        </li>
        <li>
          <Link
            href="https://www.mozilla.org/en-US/MPL/2.0/"
            aria-label="MPL-2.0 License - opens an external site"
          >
            MPL-2.0 License
            <Icon type="external-link" />
          </Link>
        </li>
      </ul>
      <div className="Copyright">
        Copyright © {year}{' '}
        <Link
          href="https://deque.com/"
          aria-label="Deque Systems, Inc. - opens an external site"
        >
          Deque Systems, Inc.
          <Icon type="external-link" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
