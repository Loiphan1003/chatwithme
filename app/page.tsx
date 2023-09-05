"use client"
import { useCallback, useState } from 'react';
import Image from 'next/image';
import LoginImage from '../assets/images/login.jpg';
import GoogleLogo from '../assets/images/Google.jpg';
import { auth } from '../config/firebaseConfig.ts';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { User } from '@/types.ts';
import { useRouter } from 'next/navigation'
import { addDocument, checkAccountIsExsit } from '@/utils/firestore.ts';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext.tsx';
import { Spin } from 'antd';


const provider = new GoogleAuthProvider();

export default function Home() {

  const router = useRouter();

  const { currentUser } = useContext(AuthContext);
  const [isSpin, setIsSpin] = useState(false);

  const handleSignInWithGoogle = async () => {
    if(currentUser.uid !== '') return;
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        const { uid, displayName, email, photoURL } = result.user;
        const user: User = {
          displayName,
          email,
          uid,
          avatar: photoURL,
          dateUse: new Date().toUTCString(),
          isActive: true
        }

        setIsSpin(true);
        // Kiểm tra xem tài khoản đã có trong csdl hay chưa
        // Hàm trả 'true' là đã có 'false' là chưa
        const alreadyExistAccount = await checkAccountIsExsit(user);

        if (alreadyExistAccount === false) {
          await addDocument("users", user);
        }
        setIsSpin(false);
        router.push('/chats')

      }).catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  }

  const handleWaitToGetAccount = useCallback(() => {
    setIsSpin(true);
    setTimeout(() => {
      const isLogin = currentUser;
      if(isLogin.uid === ''){
        return setIsSpin(false);
      } 
      router.push('/chats');
      return setIsSpin(false);

    }, 1000);
  }, [currentUser, router])

  useEffect(() => {
    handleWaitToGetAccount()
  }, [currentUser, handleWaitToGetAccount])

  return (
    <Spin tip="Loading" spinning={isSpin} >
      <main
        className="flex md:mx-auto max-w-[1160px] w-full h-screen
        bg-white flex-col items-center justify-center md:pt-[30px] desktop:px-[30px] box-border"
      >
        <div className="flex flex-col items-center" >
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
            className="mt-[30px] h-[41px] w-[313px] flex flex-row justify-center gap-2 items-center
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
    </Spin>

  )
}
