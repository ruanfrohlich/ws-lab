import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { AppRoutes } from './components';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>,
  );
}
