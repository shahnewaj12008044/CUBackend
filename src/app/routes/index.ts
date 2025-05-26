import { Router } from "express";
import { userRoutes } from "../module/user/user.route";

const router = Router()


const moduleRouter = [
    {
        path: "/users",
        route:userRoutes,
    },
    
]



moduleRouter.forEach(route => router.use(route.path, route.route));
export const routes = router;