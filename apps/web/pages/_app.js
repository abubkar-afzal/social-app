import React from 'react';
import '../styles/globals.css';
import Navbar from '../../../packages/ui/src/components/web/Navbar';
import Footer from '../../../packages/ui/src/components/web/Footer';

export default function App({ Component, pageProps }) {
  return <>
  <Navbar />
  <Component {...pageProps} />
  <Footer />
  
  </>;
}
