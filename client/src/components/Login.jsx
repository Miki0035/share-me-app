import { useNavigate } from "react-router-dom";
import { client } from "../client";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

const Login = () => {
  const navigate = useNavigate();
  //Google Login
  const responseGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      const accessToken = response.access_token;
      const user = await sendApiRequest(accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      const { name, picture, sub } = user;
      //User document
      const doc = {
        _id: sub,
        _type: "user",
        userName: name,
        image: picture,
      };

      client.createIfNotExists(doc).then(() => {
        navigate('/', {replace: true})
      })

    },

    onError: (err) => console.log("login faild", err),
  });

  const sendApiRequest = async (accessToken) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userCredentials = await response.json();
      return userCredentials;
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width={"130px"} alt="logo" />
          </div>
          <div className="shadow-2xl">
            <button
              type="button"
              className="bg-mainColor flex justif-center items-center p-3 rounded-lg cursor-pointer outline-none"
              onClick={() => responseGoogle()}
            >
              <FcGoogle className="mr-4" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
