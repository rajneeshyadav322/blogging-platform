import { useRouter } from "next/router";
import React from "react";
import Navbar from "./Navbar";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Firebase } from "../firebase/firebase";
import { User } from "firebase/auth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const {pathname} = useRouter();

  return (
    <>
      {pathname !== "/login" && pathname !== '/signup' && <Navbar />}
      <main>{children}</main>
      <ToastContainer />
    </>
  );
};

export default Layout;
