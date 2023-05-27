import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="flex justify-center py-8 bg-[#efefef] mb-0 h-60">
      <div>
        <p className="text-2xl">Blogging</p>
        <p>Made in India.</p>
        <div>
          <Link href={"/"}>Home</Link>
          <Link href={"/createBlog"}>Create Blog</Link>
          <Link href={"/about"}>About</Link>
          <p>Made in India.</p>
        </div>
      </div>

      {/* <div>
          <p>
            
          </p>
        </div> */}
    </div>
  );
};

export default Footer;
