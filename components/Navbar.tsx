import React, { useEffect, useState } from "react";
import { useStore } from "../store/store";
import noUser from "../assets/user.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { Firebase } from "../firebase/firebase";
import Link from "next/link";
import {navItems} from '../constant'

const Navbar = () => {
  const { user, reset, getUser } = useStore();
  const router = useRouter();
  const path = router.pathname;

  useEffect(() => {
    getUser();
  }, [getUser]);

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
      <div className="flex py-4 px-8 justify-between">
        <div className="flex gap-4 items-center">
          {navItems?.map((val) => (
            <Link
              href={val.path}
              className={`p-2 h-fit hover:bg-secondary hover:text-black duration-200 cursor-pointer rounded-md first-letter`}
            >
              {val.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <Image
              width="40"
              height="42"
              className="rounded-full"
              src={user?.photoURL ?? noUser}
              alt="user"
            />
            <p className="ml-2 text-white">{user?.displayName}</p>
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
