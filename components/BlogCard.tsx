import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { BlogType } from "../types/BlogType";
import eye from "../assets/eye.svg";
import like from "../assets/like.svg";

type PropTypes = {
  blog: BlogType;
};

const BlogCard = (props: PropTypes) => {
  const { blog } = props;
  const router = useRouter();

  return (
    <>
      <div className="p-0" onClick={() => router.push(`blog/${blog.id}`)}>
        <div className="flex gap-8 mt-8 w-full">
          <div className="relative w-[250px]">
            <Image alt="Banner Image" src={blog.bannerImage} fill />
          </div>
          <div className="w-full cursor-pointer">
            <div className="text-2xl font-bold">{blog.title}</div>
            <div
              className="font-light h-12 text-ellipsis overflow-hidden"
              dangerouslySetInnerHTML={{ __html: blog.blog }}
            ></div>
            <div className="flex w-full justify-between mt-2">
              <div className="py-[2px] px-4 text-center bg-[#f3ebeb] rounded-md text-sm">
                {blog.category}
              </div>
            </div>
            <div className="mt-4 flex ">
              <div className="flex items-center mr-12">
                <Image src={eye} alt="Views" width={24} />
                <div className="ml-1 font-light">{blog.views}</div>
              </div>
              <div className="flex items-center">
                <Image src={like} alt="Likes" width={24} />
                <div className="ml-1 font-light">{blog.likes}</div>
              </div>
            </div>
          </div>
        </div>
        <hr className="mt-8" />
      </div>
    </>
  );
};

export default BlogCard;
