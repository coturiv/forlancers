import React from 'react';
import './Nav.scss';

type NavProps = {
  [key: string]: any;
};

const Nav: React.FC<NavProps> = () => {
  return <div>Hello, I am a Nav component.</div>;
};
export default Nav;
