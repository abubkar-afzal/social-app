import React from 'react';
import '../styles/globals.css';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import Footer from '../../../packages/ui/src/components/web/Footer';
import { ThemeProvider } from '../../../packages/ui/src/utils/ThemeContext';

export default function App({ Component, pageProps }) {
  return <>
      <ThemeProvider>

  <Navbar />
  <Component {...pageProps} />
  <Footer />
      </ThemeProvider>

  </>;
}
