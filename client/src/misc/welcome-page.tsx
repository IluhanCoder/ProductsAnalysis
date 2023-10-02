import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import $api from "../axios-setup";
import { Link } from "react-router-dom";

const WelcomePage = () => {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies<any>([]);
    const [username, setUsername] = useState<string | undefined>();
    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
        const verifyCookie = async () => {
          if (!cookies.token) {
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

    return <div>
        {isAuth && <div>вітаємо, {username ?? "анонім"}
        <button type="button" onClick={Logout}>вийти</button></div> || 
        <div>
            Щоб корстуватися системою, вам необхідно <Link to="/signup">Зареєструватися</Link>, або  <Link to="/login">увійти в обліковий запис</Link> 
        </div>}
    </div>
}

export default WelcomePage;