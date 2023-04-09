import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { BsEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/router";
import { Firebase } from "../firebase/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Firstname is a required field."),
  lastName: yup.string().required("Lastname is a required field."),
  email: yup.string().required("Email is a required field.").email(),
  password: yup.string().required("Password is a required field.").min(6),
  confirmPassword: yup
    .string()
    .required("Confirm Password is a required Field.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const updateUser = async (data: SignUpForm, user) => {
    await updateProfile(user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });
  };

  const updateUserDetails = async (data: SignUpForm, user) => {
    const userRef = doc(Firebase.db, `users/${user.uid}`);
    await setDoc(userRef, {
      email: data.email,
      name: `${data?.firstName} ${data?.lastName}`,
      joined: serverTimestamp(),
      profile: "",
    });
  };

  const onSubmit = async (data: SignUpForm) => {
    const { user } = await createUserWithEmailAndPassword(
      Firebase.auth,
      data.email,
      data.password
    );

    await Promise.all([updateUser(data, user), updateUserDetails(data, user)]);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="overflow-hidden relative border-2 p-8"
      >
        <div className="absolute w-full text-center z-10  text-white text-sm left-0 mt-4">
          <p className="text-2xl mb-2">Sign Up</p>
          <p>Create a new account</p>
        </div>
        <div className="rounded-full absolute bg-violet-700 w-[440px] h-[400px] top-[-220px] left-0"></div>
        <div className="space-y-3 mt-44">
          <div className="flex space-x-3">
            <div className="flex flex-col w-40">
              <label htmlFor="firstName" className="text-sm">
                First Name
              </label>
              <input
                id="firstName"
                {...register("firstName")}
                className="p-2 rounded-md bg-primary focus:outline-none"
                placeholder="First name"
              />
              {errors?.firstName && (
                <span className="text-xs text-red-600">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-40">
              <label htmlFor="lastName" className="text-sm">
                Last Name
              </label>
              <input
                id="lastName"
                {...register("lastName")}
                className="p-2 rounded-md bg-primary focus:outline-none"
                placeholder="Last name"
              />
              {errors?.lastName && (
                <span className="text-xs text-red-600">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm">
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
            <label htmlFor="password" className="text-sm">
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
          <div className="flex flex-col relative">
            <label htmlFor="confirmPassword" className="text-sm">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              {...register("confirmPassword")}
              className="p-2 rounded-md bg-primary focus:outline-none"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
            />
            <div
              className="absolute top-8 right-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <BsEyeFill /> : <BsFillEyeSlashFill />}
            </div>
            {errors?.confirmPassword && (
              <span className="text-xs text-red-600">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-violet-700  hover:bg-violet-500 shadow-lg shadow-violet-400 mt-8 py-2 duration-300 w-full rounded-full text-white center"
        >
          Create Account
        </button>
        <div className="mt-6 text-center">
          <p>
            Already have an account ?{" "}
            <span className="text-violet-700 cursor-pointer">
              &nbsp; <Link href="/login">Login</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
