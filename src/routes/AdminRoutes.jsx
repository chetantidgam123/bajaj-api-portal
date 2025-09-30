import { lazy, Suspense } from "react";
import PropTypes from "prop-types";
import { Navigate, Route, Routes } from "react-router-dom";
import { getKeyForTable, getTokenData } from "../Utils";
import { PageLoader } from "../Loader";
import { error_swal_toast } from "../SwalServices";
const AdminLayout = lazy(() =>
  import("../Components/admin/layout/AdminLayout")
);
const AdminDashboard = lazy(() => import("../Components/admin/Dashboard"));
const CategoryList = lazy(() => import("../Components/admin/CategoryList"));
const SubCategoryList = lazy(() =>
  import("../Components/admin/SubCategoryList")
);
const ApiList = lazy(() => import("../Components/admin/ApiList"));
const CreateApi = lazy(() => import("../Components/admin/CreateApi"));
const UserList = lazy(() => import("../Components/admin/UserList"));
const PageNotFound = lazy(() => import("../Components/admin/PageNotFound"));
const UserListDetails = lazy(() => import("../Components/admin/UserListDetails"))
const Reports = lazy(() => import("../Components/admin/Reports"))

/***  Master Entry Start ***/
const SuggestApi = lazy(() =>
  import("../Components/admin/contactus/SuggestApi")
);
const TermsCond = lazy(() =>
  import("../Components/admin/masterentry/TermCond")
);
const GetinTouch = lazy(() =>
  import("../Components/admin/contactus/GetinTouch")
);
const PrivacyPolicy = lazy(() =>
  import("../Components/admin/masterentry/PrivacyPolicy")
);
const RequestAccessList = lazy(() =>
  import("../Components/admin/RequestAccessList")
);
const Faq = lazy(() => import("../Components/admin/masterentry/Faq"));

function PrivateRoute({ children }) {
  const tokenData = getTokenData();
  if (!tokenData) {
    error_swal_toast(
      "You are not logged in. Please log in to access this page."
    );
    return <Navigate to="/" replace />;
  } else if (tokenData.role != 1) {
    error_swal_toast("You don't have access to this page.");
    return <Navigate to="/" replace />;
  } else {
    return tokenData ? children : <Navigate to="/" replace />;
  }
}
PrivateRoute.propTypes = {
  children: PropTypes.any,
};

const routes = [
  {
    element: <AdminLayout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/category-list",
        element: (
          <PrivateRoute>
            <CategoryList />
          </PrivateRoute>
        ),
      },
      {
        path: "/sub-category-list",
        element: (
          <PrivateRoute>
            <SubCategoryList />
          </PrivateRoute>
        ),
      },
      {
        path: "/api-list",
        element: (
          <PrivateRoute>
            <ApiList />
          </PrivateRoute>
        ),
      },
      {
        path: "/create-api",
        element: (
          <PrivateRoute>
            <CreateApi />
          </PrivateRoute>
        ),
      },
      {
        path: "/update-api/:api_id",
        element: (
          <PrivateRoute>
            <CreateApi />
          </PrivateRoute>
        ),
      },
      {
        path: "/user-list",
        element: (
          <PrivateRoute>
            <UserList />
          </PrivateRoute>
        ),
      },
      {
        path: "/user-list/details/:id",
        element: (
          <PrivateRoute>
            <UserListDetails />
          </PrivateRoute>
        ),
      },

      /***  Master Entry Start ***/
      {
        path: "/term-and-condition",
        element: (
          <PrivateRoute>
            <TermsCond />
          </PrivateRoute>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <PrivateRoute>
            <PrivacyPolicy />
          </PrivateRoute>
        ),
      },
      {
        path: "/suggest-an-api",
        element: (
          <PrivateRoute>
            <SuggestApi />
          </PrivateRoute>
        ),
      },
      {
        path: "/get-in-touch",
        element: (
          <PrivateRoute>
            <GetinTouch />
          </PrivateRoute>
        ),
      },

      {
        path: "/request-access-list",
        element: (
          <PrivateRoute>
            <RequestAccessList />
          </PrivateRoute>
        ),
      },
      {
        path: "/faq",
        element: (
          <PrivateRoute>
            <Faq />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        ),
      },
    ],
  },
];
function AdminRoutes() {
  return (
    <Routes>
      {routes.map((route, index) => {
        const { path, element, children, ...rest } = route;
        return (
          <Route
            key={getKeyForTable("parent", index)}
            path={path}
            element={element}
            {...rest}
          >
            {children?.map((child, idx) => (
              <Route
                key={getKeyForTable("child", idx)}
                path={child.path}
                element={
                  <Suspense fallback={<PageLoader />}>{child.element}</Suspense>
                }
                {...child}
              />
            ))}
          </Route>
        );
      })}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AdminRoutes;
