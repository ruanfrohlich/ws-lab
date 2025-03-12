import { createRoot } from 'react-dom/client';
import { App } from './App';
import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Home, Test } from './pages';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/app' element={<App />}>
            <Route index element={<Home />} />
            <Route path='test/:token' element={<Test />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>,
  );
}
