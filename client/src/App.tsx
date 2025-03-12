import { Fragment, useLayoutEffect, useRef } from 'react';
import { NavLink, Outlet } from 'react-router';
import logo from './assets/logo.jpeg';

export function App() {
  const headerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;

    if (header) {
      const headerSize = header.getBoundingClientRect().height;

      document.body.style.paddingTop = `${headerSize}px`;
    }
  }, []);

  return (
    <Fragment>
      <header
        ref={headerRef}
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
          <NavLink to='/app' end>
            Home
          </NavLink>
          <NavLink to='/app/test/1234' end>
            Test
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
}
