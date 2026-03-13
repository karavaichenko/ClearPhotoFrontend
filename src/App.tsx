import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css'
import Registration from './components/login/Registration';
import Login from './components/login/Login';
import { ProtectedRoute } from './HOC/ProtectedRoute';
import { useAppDispatch } from './Store/hooks';
import { useSelector } from 'react-redux';
import { selectUserState } from './Store/selectors';
import { authByCookiesThunk } from './Store/authReducer';
import ProcessHistory from './components/content/processHistory/ProcessHistory';
import ProcessPhoto from './components/content/processPhoto/ProcessPhoto';
import Account from './components/login/Account';
import PhotoFromHistory from './components/content/photoFromHistory/PhotoFromHistory';

const router = createBrowserRouter([
  {
    path: "/reg",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    // element: <Main />,
    element: <ProtectedRoute children={<ProcessPhoto />} />,

  },
  {
    path: "/process",
    element: <ProtectedRoute children={<ProcessPhoto />} />,
  },
  {
    path: "/history",
    element: <ProtectedRoute children={<ProcessHistory />} />,
  },
  {
    path: "/history/:photoId",
    element: <ProtectedRoute children={<PhotoFromHistory />} />,
  },
  {
    path: "/account",
    element: <ProtectedRoute children={<Account />} />,
  },
]);


function App() {

  const dispatch = useAppDispatch()
  const me = useSelector(selectUserState)
  if (me.resultCode === 0) {
    dispatch(authByCookiesThunk())
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
