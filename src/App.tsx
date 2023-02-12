import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppDb from "./components/global/AppDb";
import AppThemeProvider from "./components/global/AppThemeProvider";
import AppWeb3Wallet from "./components/global/AppWeb3Wallet";
import {
  ACCOUNT,
  LOGIN,
  MANAGE_MOMO_DEPOSIT,
  MANAGE_MOMO_WITHDRAW,
  MANAGE_WITHDRAW_REQUEST,
  SEND_FUNDS,
  SESSION_HOME,
  SETTINGS,
  SIGN_UP,
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
import "react-lazy-load-image-component/src/effects/blur.css";
import MGTRoot from "./screens/MGTRoot";
import ManageWithdrawRequest from "./screens/mgt/ManageWithdrawRequest";
import SessionHome from "./screens/session/SessionHome";
import SignUp from "./screens/session/SignUp";
import ManageMoMoDeposits from "./screens/mgt/ManageMoMoDeposits";
import ManageMoMoWithdrawRequest from "./screens/mgt/ManageMoMoWithdrawRequest";
// import { auth } from "./configs/firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots />,
    errorElement: <ErrorPage />,
    // loader:()=>{
    //   if(auth.currentUser === null){
    //     throw redirect(`/session/${LOGIN}`)
    //   }
    //   return null
    // },
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
        path: SESSION_HOME,
        element: <SessionHome />,
      },
      {
        path: LOGIN,
        element: <Login />,
      },
      {
        path: UPDATE_ACCOUNT,
        element: <UpdateAccount />,
      },
      {
        path: SIGN_UP,
        element: <SignUp />,
      },
    ],
  },
  {
    path: "mgt",
    element: <MGTRoot />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: MANAGE_WITHDRAW_REQUEST,
        element: <ManageWithdrawRequest />,
      },
      {
        path: MANAGE_MOMO_DEPOSIT,
        element: <ManageMoMoDeposits />,
      },
      {
        path: MANAGE_MOMO_WITHDRAW,
        element: <ManageMoMoWithdrawRequest />,
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
