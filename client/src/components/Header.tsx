import { Ref } from 'react';
import logo from '../assets/logo.jpeg';
import { NavLink } from 'react-router';

export const Header = (props: { headerRef: Ref<HTMLElement> }) => {
  return (
    <header
      ref={props.headerRef}
      className='fixed z-[999] top-0 left-0 w-full bg-amber-600 flex items-center'
    >
      <div className='p-3'>
        <picture className='relative w-[50px] h-[50px] block rounded-xl overflow-hidden'>
          <img
            className='w-full h-full object-cover'
            src={logo}
            alt='Logotipo'
          />
        </picture>
      </div>
      <nav className='flex gap-1'>
        <NavLink to='/app'>Home</NavLink>
        <NavLink to='/app/login'>Login/Register</NavLink>
      </nav>
    </header>
  );
};
