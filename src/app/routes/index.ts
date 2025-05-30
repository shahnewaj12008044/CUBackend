import { Router } from "express";
import { userRoutes } from "../module/user/user.route";
import { alumniRoutes } from "../module/alumni/alumni.route";

const router = Router()


const moduleRouter = [
    {
        path: "/users",
        route:userRoutes,
    },
    {
        path: "/alumni",
        route:alumniRoutes,
    }
]



moduleRouter.forEach(route => router.use(route.path, route.route));
export const routes = router;