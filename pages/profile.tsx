import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import noUser from "../assets/user.png";
import { Firebase } from "../firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useStore } from "../store/store";
import { doc, DocumentData, getDoc, setDoc } from "firebase/firestore";
import { UserType } from "../types/UserType";

// const ProfileSchema = yup.object().shape({
//   name: yup.string().required("Name can't be empty"),
//   profile: yup.string().required("Profile picture is required"),
//   email: yup.string().required("Email can't be empty"),
//   country: yup.string(),
//   city: yup.string(),
//   isProfileCompleted: yup.boolean(),
// });

// const auth = getAuth();


const Profile = () => {
  const storageRef = ref(Firebase.storage, "profile-pictures");
  const { user } = useStore();
  const [userData, setUserData] = useState<DocumentData>();
  const [name, setName] = useState(userData?.name || "");
  const [profile, setProfile] = useState(userData?.profile || "");
  const [country, setCountry] = useState(userData?.country || "");
  const router = useRouter();
  const userRef = doc(Firebase.db, `users/${user?.uid}`);

  useEffect(() => {
    const getUserDetails = async () => {
      const response = await getDoc(userRef);
      setUserData(response.data())
    };

    getUserDetails();
  }, [userRef]);

  useEffect(() => {
    setName(userData?.name)
    setProfile(userData?.profile)
    setCountry(userData?.country)
  }, [userData])
  
  const handleProfilePicture = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const imageRef = ref(storageRef, uuidv4());

    const file = event.target.files?.[0];

    if (file) {
      const contentType = file.type;
      try {
        const snapshot = await uploadBytes(imageRef, file, { contentType });
        const downloadURL = await getDownloadURL(snapshot.ref);
        setProfile(downloadURL);
        return downloadURL;
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateUserDetails = async () => {
    if (!user) {
      toast.error("User not signed in");
      return;
    }
    await setDoc(
      userRef,
      {
        name: name,
        profile: profile,
        country: country,
      },
      { merge: true }
    );
  };

  const updateUser = async () => {
    if (!user) {
      toast.error("User not signed in");
      return;
    }
    await updateProfile(user, {
      displayName: name,
      photoURL: profile,
    });
  };

  const handleSubmit = async () => {
    if (name === "") {
      toast.error("Name can't be empty");
      return;
    }
    try {
      await Promise.all([updateUser(), updateUserDetails()]);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-10 mt-14">
        <div className="rounded-full border-2 w-32 h-32 relative ">
          <div className="overflow-hidden relative w-full h-full rounded-full">
            <Image alt="profile" fill src={profile ? profile : noUser} />
          </div>
          <label
            htmlFor="upload"
            className="absolute cursor-pointer w-8 h-8 bottom-0 bg-slate-100 rounded-full right-0"
          >
            <div className="text-3xl leading-7 font-light h-full text-center">
              +
            </div>
          </label>
          <input
            id="upload"
            name="upload"
            type="file"
            hidden
            onChange={handleProfilePicture}
          />
        </div>
        <div>
          <div className="p-2">
            <input
              placeholder="Name"
              value={name}
              name="name"
              id="name"
              onChange={(e) => setName(e.target.value)}
              className="border-2 px-2 py-2 rounded-md border-[#efefef] focus:outline-none"
            />
          </div>
          <div className="p-2">
            <input
              placeholder="Email"
              value={user?.email || ""}
              name="email"
              disabled={true}
              id="email"
              className="border-2 px-2 py-2 rounded-md border-[#efefef] focus:outline-none"
            />
          </div>
          <div className="p-2">
            <input
              placeholder="Country"
              value={country}
              name="country"
              id="country"
              onChange={(e) => setCountry(e.target.value)}
              className="border-2 px-2 py-2 rounded-md border-[#efefef] focus:outline-none"
            />
          </div>
          <div className="flex mt-8 justify-end">
            <button
              onClick={handleSubmit}
              className="bg-violet-500 py-1 hover:bg-violet-800 duration-100 px-4 rounded-md text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
