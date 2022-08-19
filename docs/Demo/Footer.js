import React from 'react';
import logo from '../assets/img/logo.svg';
import darkLogo from '../assets/img/dark-logo.svg';
import { Link, Offscreen } from '@deque/cauldron-react/';

// deque logo not cauldron logo
// sidebar is being blocked
// doublecheck image in link with offscreen is ok

const Footer = props => {
  return (
    <footer className="Footer">
      <Link className="MenuItem__logo" href="https://deque.com/">
        <img src={props.theme === 'dark' ? logo : darkLogo} alt="" />
        <Offscreen>Deque Systems</Offscreen>
      </Link>
      <Link href="https://www.mozilla.org/en-US/MPL/2.0/">Terms of Use</Link>
    </footer>
  );
};

export default Footer;
