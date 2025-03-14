import { Fragment, useLayoutEffect, useRef } from 'react';
import { Outlet } from 'react-router';
import { Header } from './components';

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
      <Header {...{ headerRef }} />
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
}
