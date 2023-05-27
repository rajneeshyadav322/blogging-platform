import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "react-quill/dist/quill.snow.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import ReactQuill, { contextType, Quill } from "react-quill";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Firebase } from "../firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { BlogType } from "../types/BlogType";
import { getAllDocuments } from "../utils/getAllDocuments";
import { CategoryType } from "../types/CategoryType";
import { useStore } from "../store/store";

const BlogSchema = yup.object().shape({
  title: yup.string().required("Blog Title can't be empty"),
  bannerImage: yup.string().required("Banner Image is required"),
  category: yup.string().required("Blog Category can't be empty"),
  blog: yup.string().required("Blog content can't be empty"),
});

const CreateBlog = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BlogType>({
    resolver: yupResolver(BlogSchema),
  });

  const quillRef = useRef<ReactQuill>(null);
  const storageRef = ref(Firebase.storage, "images");
  const blogsCollectionRef = collection(Firebase.db, "blogs");
  const categoryCollectionRef = collection(Firebase.db, "category");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useStore();

  const ReactQuillEditor = dynamic(
    async () => {
      const { default: RQ } = await import("react-quill");

      const QuillJS = ({ forwardedRef, ...props }: any) => (
        <RQ ref={forwardedRef} {...props} />
      );
      return QuillJS;
    },
    { ssr: false }
  );

  useEffect(() => {
    const getAllCategories = async () => {
      const data = await getAllDocuments(categoryCollectionRef);
      setCategories(data);
    };

    getAllCategories();
  }, [categoryCollectionRef]);

  const handleImageUpload = async (file: File | null) => {
    const imageRef = ref(storageRef, uuidv4());

    if (file) {
      const contentType = file.type;
      try {
        const snapshot = await uploadBytes(imageRef, file, { contentType });
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files && input?.files[0];
      try {
        const downloadURL = await handleImageUpload(file);
        if (quillRef.current) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          if (range)
            quill.insertEmbed(range.index, "image", downloadURL, "user");
        }
      } catch (e) {
        console.log(e);
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const onSubmit = async (data: BlogType) => {
    const payload = {
      ...data,
      views: 0,
      createdBy: user?.uid,
      createdAt: serverTimestamp(),
      likes: 0,
    };
    await addDoc(blogsCollectionRef, payload);
    router.push("/");
  };

  const handleBannerImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const downloadURL = await handleImageUpload(file);
      if (downloadURL)
        setValue("bannerImage", downloadURL, { shouldValidate: true });
      setBannerImage(file?.name);
    }
  };

  return (
    <div className="flex flex-col my-6 justify-center items-center">
      <div className="text-2xl">
        <h2>Create Blog</h2>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex mt-4 flex-col space-y-4 w-full px-8 md:w-4/6 lg:w-3/6"
      >
        <div className="flex flex-col">
          <input
            placeholder="Title"
            {...register("title")}
            className="border-2 px-2 py-2 rounded-md border-[#efefef] focus:outline-none"
          />
          <span className="text-xs text-red-600">{errors?.title?.message}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <input
              className="flex-1 focus:outline-none p-2  border-2 border-[#efefef]"
              placeholder="Banner Image"
              value={bannerImage ?? ""}
              disabled
            />
            <div>
              <input
                type="file"
                hidden
                id="upload"
                onChange={handleBannerImage}
              />
              <label
                htmlFor="upload"
                className="p-3 w-fit text-white bg-violet-600"
              >
                Upload
              </label>
            </div>
          </div>
          <span className="text-xs text-red-600">
            {errors?.bannerImage?.message}
          </span>
        </div>
        <div className="flex flex-col">
          <select
            {...register("category")}
            className="border-2 px-2 py-2 rounded-md border-[#efefef] focus:outline-none"
          >
            <option disabled selected value="" className="appearance-none">
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-red-600">
            {errors?.category?.message}
          </span>
        </div>
        <div>
          {/* <select className="p-3 w-full focus:outline-none">
            <option selected disabled value="">
              <p>Select Blog category</p>
            </option>
            <option value="">Select Blog category</option>
          </select> */}
        </div>
        <div className="h-80 flex flex-col">
          <ReactQuillEditor
            modules={modules}
            theme="snow"
            onChange={(value: string) => setValue("blog", value)}
            value={getValues().blog}
            forwardedRef={quillRef}
            className="h-64"
          />
        </div>
        <span className="text-xs text-red-600">{errors?.blog?.message}</span>

        <div className="self-end ">
          <button
            className="w-fit  py-1 px-8 hover:bg-violet-500 duration-300 bg-violet-700 rounded-md text-white"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
