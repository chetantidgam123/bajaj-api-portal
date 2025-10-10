import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getKeyForTable, getTokenData } from '../Utils';
import { PageLoader } from '../Loader';
import HomeLayout from '../Components/user/layout/HomeLayout';
import AdminRoutes from './AdminRoutes';
import LandingPage from '../Components/Home/LandingPage';
import FaqList from '../Components/Home/FaqList';
import Profile from '../Components/user/Profile';
import Email from '../Components/Home/Email';
import { error_swal_toast } from '../SwalServices';
import TermsofServices from '../Components/Home/TermsofServices';
import SupportCenter from '../Components/Home/SupportCenter';
import Privacypolicy from '../Components/Home/Privacypolicy';
import Contactus from '../Components/Home/Contactus';
import ApiPlaygroundHistory from '../Components/user/ApiPlaygroundHistory';
const HomePageContent = lazy(() => import('../Components/user/HomePageContent'));
const PageNotFound = lazy(() => import('../Components/user/PageNotFound'));
const TryApiPage = lazy(() => import('../Components/user/TryApiPage'))
const ApiPlayGround = lazy(() => import('../Components/user/ApiPlayGround'))

function PrivateRoute({ children }) {
    const tokenData = getTokenData();
    if (!tokenData) {
        error_swal_toast('You are not logged in. Please log in to access this page.');
    }
    return tokenData ? children : <Navigate to="/" replace />;
}
PrivateRoute.propTypes = {
    children: PropTypes.any,
};


const routes = [
    { path: "/master/*", element: <AdminRoutes /> },
    { path: '/', element: <LandingPage /> },
    { path: '/email/:token', element: <Email /> },
    { path: '/faq', element: <FaqList /> },
    { path: "/TermsofServices", element: <TermsofServices /> },
    { path: "/SupportCenter", element: <SupportCenter /> },
    { path: "/Privacypolicy", element: <Privacypolicy /> },
    { path: "/Contactus", element: <Contactus /> },
    { path: "/try-api/:collection_id/:category_id/:api_id", element: <PrivateRoute><ApiPlayGround /></PrivateRoute> },

    {
        element: <HomeLayout />,
        children: [
            // { path: "/api", element: <HomePageContent /> },
            { path: "/get-started", element: <HomePageContent /> },

            { path: "/api/:collection_id", element: <HomePageContent /> },
            { path: "/collection-api/:collection_id/:api_id", element: <HomePageContent /> },
            { path: "/api/:collection_id/:category_id", element: <HomePageContent /> },
            { path: "/api/:collection_id/:category_id/:api_id", element: <HomePageContent /> },
            { path: "/user/reset-password/:token", element: <HomePageContent /> },
            { path: "/user/profile", element: <PrivateRoute><Profile /></PrivateRoute> },
            { path: "/page", element: <PrivateRoute><PageNotFound /></PrivateRoute> },
            { path: "/api-playground-history", element: <ApiPlaygroundHistory /> },
        ]
    }

];
function RouterElement() {
    return (
        <Routes>
            {routes.map((route, index) => {
                const { path, element, children, ...rest } = route;
                return <Route key={getKeyForTable('parent', index)} path={path} element={element} {...rest}>
                    {children?.map((child, idx) => (
                        <Route key={getKeyForTable('child', idx)} path={child.path}
                            element={
                                <Suspense fallback={<PageLoader />}>
                                    {child.element}
                                </Suspense>
                            }
                            {...child} />
                    ))}
                </Route>
            })}
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    )
}

export default RouterElement


