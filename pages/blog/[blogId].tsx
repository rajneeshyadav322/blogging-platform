import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Firebase } from "../../firebase/firebase";

const Blog = () => {
  const router = useRouter();

  const [blog, setBlog] = useState<DocumentData>();
  const blogId: string = router.query.blogId as string;

  useEffect(() => {
    const getBlog = async () => {
      const response = await getDoc(doc(Firebase.db, "blogs", blogId));
      setBlog(response.data());
    };

    if (blogId) {
      getBlog();
    }
  }, [blogId]);

  return (
    <div className="flex flex-col items-center my-10">
      <div className="w-7/12">
        <div className="text-4xl font-bold">{blog?.title}</div>
        <div className="relative w-[40vw] h-[40vh] mt-4">
          <Image alt="Banner Image" src={blog?.bannerImage} fill />
        </div>
        <div className="p-1 text-sm px-4 bg-[#efefef] w-fit rounded-md">{blog?.category}</div>
        <div
          className="mt-12"
          dangerouslySetInnerHTML={{ __html: blog?.blog }}
        ></div>{" "}
      </div>
    </div>
  ); 
};

export default Blog;
