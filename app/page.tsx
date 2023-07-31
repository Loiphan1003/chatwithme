"use client"
import Image from 'next/image';
import LoginImage from '../assets/images/login.jpg';
import GoogleLogo from '../assets/images/Google.jpg';
import { auth } from '../config/firebaseConfig.ts';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AccountType } from '@/types.ts';
import { useRouter } from 'next/navigation'
import { addDocument, checkAccountExsitAndAdd, checkAccountIsExsit } from '@/utils/firestore.ts';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext.tsx';


const provider = new GoogleAuthProvider();

export default function Home() {

  const router = useRouter();

  const { currentUser } = useContext(AuthContext);

  const handleSignInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
        const { uid, displayName, email, photoURL } = result.user;
        const account: AccountType = {
          displayName,
          email,
          uid,
          avatar: photoURL,
        }
        checkAccountExsitAndAdd(account);

      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  useEffect(() => {
    if (currentUser.uid === '') return;
    return router.push('/chats');

  }, [currentUser])



  return (
    <main
      className="flex md:mx-auto max-w-[1160px] w-full h-screen
      bg-white flex-col items-center justify-center md:pt-[30px] desktop:px-[30px] box-border"
    >
      <div>
        <h1
          className="text-[##030303] text-[34px] font-medium not-italic leading-[1.02px] tracking-[1.02px] uppercase"
        >
          Wellcome back
        </h1>

        {/* <form
          className="mt-[20px]"
          action=""
        >
          <label
            htmlFor="email"
            className="text-[#181818] text-[14px] not-italic font-medium tracking-[0.42px]"
          >
            Email
          </label>
          <input
            className="mt-[6px] h-[41px] w-[313px] focus:outline-none block border px-1 py-2
            rounded-xl"
            type="email"
            name="email"
            id="email"
            placeholder='Enter your email'
          />

          <div
            className="mt-[21px]"
          >
            <label
              htmlFor="password"
              className="text-[#181818] text-[14px] not-italic font-medium tracking-[0.42px]"
            >
              Password
            </label>
            <input
              className="mt-[6px] h-[41px] w-[313px] focus:outline-none block border px-1 py-2
            rounded-xl"
              type="password"
              name="password"
              id="password"
              placeholder='Enter your password'
            />
          </div>

          <button
            className="mt-[11px] h-[41px] w-[313px] focus:outline-none block px-1 py-2
            rounded-xl bg-[#EA454C] text-white"
            type="submit"
          >
            Sign in
          </button>
        </form> */}

        <div
          className="mt-[22px] h-[41px] w-[313px] flex flex-row justify-center gap-2 items-center
          border rounded-xl hover:cursor-pointer"
          onClick={() => handleSignInWithGoogle()}
        >
          <Image
            src={GoogleLogo}
            alt='Google logo'
            priority={true}
          />
          <p>Sign in with Google</p>
        </div>
      </div>

      <Image
        src={LoginImage}
        className="w-auto h-auto md:h-[50%] md:w-[60%]"
        alt='login'
        width={0}
        height={0}
      />
    </main>
  )
}
