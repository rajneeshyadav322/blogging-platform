import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { BsFillEyeSlashFill, BsEyeFill } from "react-icons/bs";
import {
  AuthCredential,
  OAuthCredential,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { User } from "@firebase/auth-types";
import { Firebase } from "../firebase/firebase";
import firebase, { FirebaseError } from "firebase/app";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const validationSchema = yup.object().shape({
  email: yup.string().required("Email is a required field.").email(),
  password: yup.string().required("Password is a required field.").min(6),
});

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const { user } = await signInWithEmailAndPassword(
        Firebase.auth,
        data.email,
        data.password
      );

      const { accessToken }: any = user;
      localStorage.setItem("token", accessToken);
      router.push("/");
    } catch (error: any ) {
      switch (error.code) {
        case "auth/wrong-password":
          toast.error("Password is wrong");
          break;
        case "auth/user-not-found":
          toast.error("User not fround");
          break;
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-hidden relative border-2 p-8"
      >
        <div className="absolute w-full text-center z-10  text-white text-sm left-0 mt-4">
          <p className="text-2xl mb-2">Login</p>
          <p>Please Login to continue</p>
        </div>
        <div className="rounded-full absolute bg-violet-700 w-[350px] h-[390px] top-[-220px] left-0"></div>
        <div className="space-y-3 mt-40">
          <div className="flex flex-col">
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="p-2 rounded-md bg-primary focus:outline-none"
              placeholder="Enter your email"
            />
            {errors?.email && (
              <span className="text-xs text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col relative">
            <label className="text-sm" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              {...register("password")}
              className="p-2 rounded-md bg-primary focus:outline-none"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <div
              className="absolute top-8 right-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BsEyeFill /> : <BsFillEyeSlashFill />}
            </div>
            {errors?.password && (
              <span className="text-xs text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-violet-700  hover:bg-violet-500 shadow-lg shadow-violet-400 mt-8 py-2 duration-300 w-full rounded-full text-white center"
        >
          Login
        </button>
        <div className="mt-6 text-center">
          <p>
            Create a new account ?{" "}
            <span className="text-violet-700 cursor-pointer">
              &nbsp; <Link href="/signup">Sign Up</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
