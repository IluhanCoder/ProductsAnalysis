import { Link } from "react-router-dom"
import { linkStyle } from "../styles/link-styles";

const UnregistratedPage = () => {
    return <div>
        Щоб корстуватися системою, вам необхідно <Link to="/signup" className={linkStyle}>Зареєструватися</Link>, або  <Link to="/login" className={linkStyle}>увійти в обліковий запис</Link> 
    </div>
}

export default UnregistratedPage;