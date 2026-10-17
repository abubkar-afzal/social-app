import React from 'react';
import '../styles/globals.css';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import Footer from '../../../packages/ui/src/components/web/Footer';
import { ThemeProvider } from '../../../packages/ui/src/utils/ThemeContext';

export default function App({ Component, pageProps }) {
    const img = `/my_logo_remove.png`;
  return <>
      <ThemeProvider>

  <Navbar img={img} />
  <Component {...pageProps} />
  <Footer />
      </ThemeProvider>

  </>;
}
