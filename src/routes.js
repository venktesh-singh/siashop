import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    path: '*',
    guard: ProtectedRoute, // Use ProtectedRoute as the guard for protected routes
    layout: AdminLayout,
    routes: [
      {
        path: '/app/dashboard/default',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        path: '/product/product-list',
        element: lazy(() => import('./views/Product/list'))
      },
      {
        path: '/product/product-detail',
        element: lazy(() => import('./views/Product/product-detail'))
      },
      {
        path: '/product/add',
        element: lazy(() => import('./views/Product/add'))
      },
      {
        path: '/product/edit/:id',
        element: lazy(() => import('./views/Product/edit'))
      },
      {
        path: '/category/list',
        element: lazy(() => import('./views/Category/list'))
      },
      {
        path: '/category/detail',
        element: lazy(() => import('./views/Category/detail'))
      },
      {
        path: '/category/add',
        element: lazy(() => import('./views/Category/add'))
      },
      {
        path: '/category/edit/:id',
        element: lazy(() => import('./views/Category/edit'))
      },
      {
        path: '/subcategory/list',
        element: lazy(() => import('./views/Subcategory/list'))
      },
      {
        path: '/subcategory/detail',
        element: lazy(() => import('./views/Subcategory/detail'))
      },
      {
        path: '/subcategory/add',
        element: lazy(() => import('./views/Subcategory/add'))
      },
      {
        path: '/subcategory/edit/:id',
        element: lazy(() => import('./views/Subcategory/edit'))
      },
      {
        path: '/user/list',
        element: lazy(() => import('./views/User/list'))
      },
      {
        path: '/user/detail',
        element: lazy(() => import('./views/User/detail'))
      },
      {
        path: '/user/add',
        element: lazy(() => import('./views/User/add'))
      },
      {
        path: '/user/edit/:id',
        element: lazy(() => import('./views/User/edit'))
      },
      {
        path: '/order/list',
        element: lazy(() => import('./views/Order/list'))
      },
      {
        path: '/order/detail',
        element: lazy(() => import('./views/Order/detail'))
      },
      {
        path: '/order/add',
        element: lazy(() => import('./views/Order/add'))
      },
      {
        path: '/order/edit/:id',
        element: lazy(() => import('./views/Order/edit'))
      },
      {
        path: '/review/list',
        element: lazy(() => import('./views/Review/list'))
      },
      {
        path: '/review/detail',
        element: lazy(() => import('./views/Review/detail'))
      },
      {
        path: '/pincode/list',
        element: lazy(() => import('./views/Pincode/list'))
      },
      {
        path: '/pincode/detail',
        element: lazy(() => import('./views/Pincode/detail'))
      },
      {
        path: '/pincode/add',
        element: lazy(() => import('./views/Pincode/add'))
      },
      {
        path: '/pincode/edit/:id',
        element: lazy(() => import('./views/Pincode/edit'))
      },
    ]
  }
];

export default routes;
