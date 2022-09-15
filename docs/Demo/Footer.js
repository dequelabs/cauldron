import React from 'react';
import { Link } from '@deque/cauldron-react/';

const Footer = props => {
  const year = new Date().getFullYear();

  return (
    <footer className="Footer">
      <ul className="Footer-links">
        <li>
          <Link href="https://www.deque.com/terms-of-use/">Terms of Use</Link>
        </li>
        <li>
          <Link href="https://www.mozilla.org/en-US/MPL/2.0/">
            MPL-2.0 License
          </Link>
        </li>
      </ul>
      <div className="Copyright">
        Copyright © {year}{' '}
        <Link href="https://deque.com/">Deque Systems Inc.</Link>
      </div>
    </footer>
  );
};

export default Footer;
