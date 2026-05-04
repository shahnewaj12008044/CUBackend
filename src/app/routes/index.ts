import { Router } from "express";

import { alumniRoutes } from "../module/alumni/alumni.route";


import { UserRoutes } from "../module/user/user.route";
import { AuthRoutes } from "../module/auth/auth.route";
import { AdminRoutes } from "../module/admin/admin.route";

const router = Router()


const moduleRouter = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: "/alumni",
        route:alumniRoutes,
    },
    // {
    //      path: "/students",
    //      route: studentRoutes, // Assuming you have a student route similar to alumni
    // },
    {
        path: "/auth",  
        route:AuthRoutes
    },
    {
        path: "/admin",
        route: AdminRoutes
    }
]



moduleRouter.forEach(route => router.use(route.path, route.route));
export const routes = router;