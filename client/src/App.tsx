import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./misc/welcome-page";
import ProductsPage from "./products/products-page";
import NewProductPage from "./products/new-product-page";
import SignupPage from "./auth/signup-page";
import LoginPage from "./auth/login-page";
import NewTransactionPage from "./transactions/new-transaction-page";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import uk from "date-fns/locale/uk";
import TransactionsPage from "./transactions/transactions-page";
import AnalyticsPage from "./analytics/analytics-page";
import PredictionPage from "./prediction/prediction-page";
import PairsPage from "./pairs/pairs-page";
import { Link } from "react-router-dom";
import { linkStyle } from "./styles/link-styles";
registerLocale("ua", uk);

function App() {
  return (
    <BrowserRouter>
      <header className="flex flex-row px-4 py-2 gap-4 justify-center">
        <Link to="products" className={linkStyle}>
          ТОВАРИ
        </Link>
        <Link to="transactions" className={linkStyle}>
          ТРАНЗАКЦІЇ
        </Link>
        <Link to="prediction" className={linkStyle}>
          АНАЛІЗ ПРОДАЖУ
        </Link>
        <Link to="analytics" className={linkStyle}>
          АНАЛІТИКА
        </Link>
        <Link to="pairs" className={linkStyle}>
          ШАБЛОНІ ПОКУПКИ
        </Link>
        <Link to="/" className={linkStyle}>
          ОБЛІКОВИЙ ЗАПИС
        </Link>
      </header>
      <Routes>
        <Route index element={<WelcomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="new-product" element={<NewProductPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="new-transaction" element={<NewTransactionPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="prediction" element={<PredictionPage />} />
        <Route path="pairs" element={<PairsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
