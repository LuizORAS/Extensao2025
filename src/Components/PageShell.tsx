import React from 'react';
import Header from './Header';
import Footer from './Footer';

const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <div className="app-container">
        {children}
      </div>
      <Footer />
    </>
  );
};

export default PageShell;
