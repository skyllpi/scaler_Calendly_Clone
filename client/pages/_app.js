import { AdminCreateProvider } from '../context/AdminCreateContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <AdminCreateProvider>
      <Component {...pageProps} />
    </AdminCreateProvider>
  );
}

