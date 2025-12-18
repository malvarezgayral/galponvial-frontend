import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Home</div>, // Replace with App component
    children: routes,
  },
]);
