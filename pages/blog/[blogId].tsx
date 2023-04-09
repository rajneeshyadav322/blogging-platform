import {
  doc,
  DocumentData,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import eye from "../../assets/eye.svg";
import user from "../../assets/user.png";
import like from "../../assets/like.svg";
import { Firebase } from "../../firebase/firebase";
import { UserType } from "../../types/UserType";
import { timeStamp } from "console";

const Blog = () => {
  const router = useRouter();

  const [blog, setBlog] = useState<DocumentData>();
  const blogId: string = router.query.blogId as string;
  const [userData, setUserData] = useState<DocumentData>();
  const joined = userData?.joined?.toDate().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    if (blogId) {
      const blogRef = doc(Firebase.db, "blogs", blogId);
      const incrementViews = async () => {
        await setDoc(
          blogRef,
          {
            views: increment(1),
          },
          { merge: true }
        );

        const response = await getDoc(blogRef);
        setBlog(response.data());
      };

      incrementViews();
    }
  }, [blogId]);

  useEffect(() => {
    const getBlogWriter = async () => {
      console.log(blog?.createdBy);
      const userRef = doc(Firebase.db, `users`, blog?.createdBy);
      const response = await getDoc(userRef);
      setUserData(response?.data());
    };

    if (blog && blog?.createdBy) {
      getBlogWriter();
    }
  }, [blog]);

  return (
    <div className="flex mx-36 justify-between my-10">
      <div className="mr-12">
        <div className="text-4xl font-bold">{blog?.title}</div>
        <div className="relative w-[40vw] h-[40vh] mt-4">
          <Image alt="Banner Image" src={blog?.bannerImage} fill />
        </div>
        <section className="flex mt-12 justify-between">
          <div className="p-1  text-sm px-4 bg-[#efefef] w-fit rounded-md">
            {blog?.category}
          </div>
          <div className="flex ">
            <div className="flex items-center mr-12">
              <Image src={like} alt="Likes" width={24} />
              <div className="ml-2">{blog?.likes}</div>
            </div>
            <div className="flex items-center mr-8">
              <Image src={eye} alt="Views" width={24} />
              <div className="ml-2">{blog?.views}</div>
            </div>
          </div>
        </section>
        <div
          className="mt-12 max-w-5xl"
          dangerouslySetInnerHTML={{ __html: blog?.blog }}
        ></div>{" "}
      </div>
      <div>
        <p className="font-medium text-xl text-center">Author</p>
        <div className="w-56 border-1 rounded-md relative mt-2">
          <div className="h-20 bg-violet-400 rounded-t-md m-0"></div>
          <div className="absolute w-full">
            <Image
              className="m-auto mt-[-32px] rounded-full "
              src={userData?.profile.length > 0 ? userData?.profile : user}
              alt="profile"
              width={60}
              height={64}
            />
          </div>
          <div className="bg-[#efefef] rounded-b-md">
            <p className="text-center pt-12 font-light">
              Name - {userData?.name}
            </p>
            <hr className="mt-2 mx-4" />
            <p className="text-center py-2 font-light">
              Country - {userData?.country ?? "N/A"}
            </p>
            <hr className="mt-2 mx-4" />
            <p className="text-center py-2 pb-6 font-light">
              Joined - {joined}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
