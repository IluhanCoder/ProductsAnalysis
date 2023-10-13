import $api from "../axios-setup";
import { credentials } from "./auth-types";
export default new (class AuthService {
  async SignUp(credentials: credentials) {
    await $api.post("/signup", { ...credentials });
  }
})();
