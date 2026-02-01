import { createBrowserRouter } from "react-router";
import Tracker from "../components/tracker/Tracker";
import Quora from "../components/quora/Quora";
import LandingPage from "../components/LandingPage";
import PageNotFound from "../components/PageNotFound";
import AuthPage from "../components/Auth";
import NewQuestion from "../components/quora/NewQuestion";
import Question from "../components/quora/Question";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/quora",
        element: <Quora />,
        children:[
            {
                path:'new',
                element:<NewQuestion/>
            },
            {
                path:':id',
                element:<Question/>
            }
        ]
    },
    {
        path: "/tracker",
        element: <Tracker />
    },
    {
        path: "/auth",
        element: <AuthPage />
    },
    {
        path: "*",
        element: <PageNotFound />
    }
])

export default router;