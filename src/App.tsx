import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppDb from "./components/global/AppDb";
import AppThemeProvider from "./components/global/AppThemeProvider";
import AppWeb3Wallet from "./components/global/AppWeb3Wallet";
import {
  ACCOUNT,
  LOGIN,
  SEND_FUNDS,
  SETTINGS,
  TRANSACTIONS,
  UPDATE_ACCOUNT,
  WALLET,
} from "./routes/routes";
import Account from "./screens/customer/Account";
import Home from "./screens/customer/Home";
import SendFunds from "./screens/customer/SendFunds";
import Settings from "./screens/customer/Settings";
import Transactions from "./screens/customer/Transactions";
import Wallet from "./screens/customer/Wallet";
import ErrorPage from "./screens/ErrorPage";
import Roots from "./screens/Roots";
import Login from "./screens/session/Login";
import UpdateAccount from "./screens/session/UpdateAccount";
import SessionRoot from "./screens/SessionRoot";
import 'react-lazy-load-image-component/src/effects/blur.css';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: SEND_FUNDS,
        element: <SendFunds />,
      },
      {
        path: TRANSACTIONS,
        element: <Transactions />,
      },
      {
        path: WALLET,
        element: <Wallet />,
      },
      {
        path: SETTINGS,
        element: <Settings />,
      },
      {
        path: ACCOUNT,
        element: <Account />,
      },
    ],
  },
  {
    path: "session",
    element: <SessionRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: LOGIN,
        element: <Login />,
      },
      {
        path: UPDATE_ACCOUNT,
        element: <UpdateAccount />,
      },
    ],
  },
]);

const App = () => {
  return (
    <AppWeb3Wallet>
      <AppDb>
        <AppThemeProvider>
          <RouterProvider router={router} />
        </AppThemeProvider>
      </AppDb>
    </AppWeb3Wallet>
  );
};

export default App;
