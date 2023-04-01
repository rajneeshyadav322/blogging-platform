import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { BlogType } from "../types/BlogType";

type PropTypes = {
  blog: BlogType
};

const BlogCard = (props: PropTypes) => {
  const { blog } = props;
  const router = useRouter()

  return (
    <>
      <div className="p-0 w-1/2" onClick={() => router.push(`blog/${blog.id}`)}>
        <div className="flex gap-8 mt-8 w-full">
          <div className="relative w-[200px]">
            <Image alt="Banner Image" src={blog.bannerImage} fill />
          </div>
          <div className="w-full cursor-pointer">
            <div className="text-2xl font-bold">{blog.title}</div>
            <div
              className="font-light h-12 text-ellipsis overflow-hidden"
              dangerouslySetInnerHTML={{ __html: blog.blog }}
            ></div>
            <div className="flex w-full justify-between mt-8">
              <div className="py-[2px] px-4 text-center bg-[#f3ebeb] rounded-md text-sm">
                {blog.category}
              </div>
              {/* <button class>Read more</button> */}
            </div>
          </div>
        </div>
        <hr className="mt-8" />
      </div>
    </>
  );
};

export default BlogCard;
