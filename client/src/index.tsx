import { createRoot } from 'react-dom/client';
import { AppRoutes } from './components';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<AppRoutes />);
}
