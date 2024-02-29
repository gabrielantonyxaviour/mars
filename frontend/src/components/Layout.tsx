import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  let [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted && (
      <div className="mx-8 my-4">
        <Navbar />
        {children}
        <Footer />
      </div>
    )
  );
};

export default Layout;
