import { createBrowserRouter, RouterProvider } from 'react-router';
import './App.css'
import Registration from './components/login/Registration';
import Login from './components/login/Login';
import { ProtectedRoute } from './HOC/ProtectedRoute';
import Main from './components/content/main/Main';
import { useAppDispatch } from './Store/hooks';
import { useSelector } from 'react-redux';
import { selectUserState } from './Store/selectors';
import { authByCookiesThunk } from './Store/authReducer';

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
    element: <Main />,
  },
  {
    path: "/process",
    element: <ProtectedRoute children={<Main />} />,
  },
  {
    path: "/history",
    element: <ProtectedRoute children={<Main />} />,
  },
  {
    path: "/account",
    element: <ProtectedRoute children={<Main />} />,
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
