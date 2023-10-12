import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import $api from "../axios-setup";
import { Link } from "react-router-dom";
import { buttonStyle } from "../styles/button-styles";
import UnregistratedPage from "./unregistrated-page";
import { cardStyle } from "../styles/card-styles";

const WelcomePage = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies<any>([]);
    const [username, setUsername] = useState<string | undefined>();
    const [isAuth, setIsAuth] = useState<boolean>();

    useEffect(() => {
        const verifyCookie = async () => {
          if (!cookies.token) {
            setIsAuth(false);
            return;
          }
          const { data } = await $api.post(
            "/",
            {},
            { withCredentials: true }
          );
          const { status, user } = data;
          setUsername(user);
          setIsAuth(true);
          return status
            ? console.log("hello user")
            : (removeCookie("token"), navigate("/login"));
        };
        verifyCookie();
      }, [cookies, navigate, removeCookie]);

      const Logout = () => {
        removeCookie("token");
        navigate("/signup");
      };

    if(isAuth !== undefined) return <div className="flex flex-row justify-center">
      <div className={cardStyle + "flex flex-col justify-center mt-40 px-10 py-4"}>
        {isAuth && 
          <div className="text-center flex flex-col gap-3">
            <div className="text-xl">вітаємо, {username ?? "анонім"}</div>
            <div className="mb-2">
              <button type="button" className={buttonStyle} onClick={Logout}>вийти з облікового запису</button>
            </div>
          </div> 
        || 
        <UnregistratedPage/>}
      </div>
    </div>
    else return <div className="flex flex-col justify-center">
      <div className="text-3xl text-center mt-64">Завантаження...</div>
    </div>
}

export default WelcomePage;