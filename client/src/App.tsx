import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './misc/welcome-page';
import ProductsPage from './products/products-page';
import NewProductPage from './products/new-product-page';
import SignupPage from './auth/signup-page';
import LoginPage from './auth/login-page';
import NewTransactionPage from './transactions/new-transaction-page';

import { registerLocale, setDefaultLocale } from  "react-datepicker";
import uk from 'date-fns/locale/uk';
import TransactionsPage from './transactions/transactions-page';
import AnalyticsPage from './analytics/analytics-page';
import PredictionPage from './prediction/prediction-page';
registerLocale('ua', uk)

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<WelcomePage />} />
          <Route path="products" element={<ProductsPage/>} />
          <Route path="new-product" element={<NewProductPage/>} />
          <Route path='signup' element={<SignupPage/>}/>
          <Route path='login' element={<LoginPage/>}/>
          <Route path='new-transaction' element={<NewTransactionPage/>}/>
          <Route path='transactions' element={<TransactionsPage/>}/>
          <Route path='analytics' element={<AnalyticsPage/>}/>
          <Route path='prediction' element={<PredictionPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
