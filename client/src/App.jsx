import React from 'react'
import {RouterProvider , createBrowserRouter} from 'react-router-dom';
import Login from './Login';
import Home from './Home';

const App = () => {
  const router = createBrowserRouter([
    {
      path : '/',
      element : <Login />
    },
    {
      path : '/home/:userName',
      element : <Home />
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App