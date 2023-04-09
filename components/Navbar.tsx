import React, { useEffect, useState } from "react";
import { useStore } from "../store/store";
import noUser from "../assets/user.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { Firebase } from "../firebase/firebase";

const Navbar = () => {
  const { user, reset, getUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    getUser()
  }, [])

  const handleLogout = async () => {
    try {
      await Firebase.auth.signOut();
      router.push("/login");
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex bg-[#efefef] py-4 px-8 justify-between">
        <div className="flex gap-4">
          <p
            onClick={() => router.push("/")}
            className="px-2 py-1 hover:bg-violet-400 hover:text-white rounded-md"
          >
            Home
          </p>
          <p
            onClick={() => router.push("/createBlog")}
            className="px-2 py-1 hover:bg-violet-400 hover:text-white rounded-md"
          >
            Create Blog
          </p>
          <p
            onClick={() => router.push("/about")}
            className="px-2 py-1 hover:bg-violet-400 hover:text-white rounded-md"
          >
            About
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => router.push('/profile')}>
            <Image width="40" height="42" className="rounded-full" src={user?.photoURL ?? noUser} alt="user" />
            <p className="ml-2">{user?.displayName}</p>
          </div>
          <p className="cursor-pointer" onClick={handleLogout}>
            Logout
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
