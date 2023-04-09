import { useRouter } from "next/router";
import React from "react";
import Navbar from "./Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Firebase } from "../firebase/firebase";
import { User } from "firebase/auth";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useRouter();
  const isAuthPage = ["/login", "/signup"].includes(pathname);

  return (
    <>
      <div className="min-h-screen">
        {!isAuthPage && <Navbar />}
        <main>{children}</main>
        <ToastContainer />
      </div>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default Layout;
