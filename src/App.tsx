import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppDb from "./components/global/AppDb";
import AppThemeProvider from "./components/global/AppThemeProvider";
import ErrorPage from "./screens/ErrorPage";
import Roots from "./screens/Roots";
import SuspensionPage from "./screens/SuspensionPage";
// import { auth } from "./configs/firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Roots />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SuspensionPage />,
      },
    ],
  },
]);

const App = () => {
  return (
    <AppDb>
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>
    </AppDb>
  );
};

export default App;
