import $api, { setHeader } from "../axios-setup";
import { credentials } from "./auth-types";
export default new (class AuthService {
  async SignUp(credentials: credentials) {
    const token = (await $api.post("/signup", { ...credentials })).data;
    localStorage.setItem("token", token);
    setHeader();
  }

  async login(inputValue: credentials) {
    const token = (await $api.post("/login", inputValue)).data;
    return token;
  }
})();
