import { Router } from "express";
import { userRoutes } from "../module/user/user.route";
import { alumniRoutes } from "../module/alumni/alumni.route";
import { studentRoutes } from "../module/student/student.routes";

const router = Router()


const moduleRouter = [
    {
        path: "/users",
        route:userRoutes,
    },
    {
        path: "/alumni",
        route:alumniRoutes,
    },
    {
        path: "/students",
        route: studentRoutes, // Assuming you have a student route similar to alumni
    }
]



moduleRouter.forEach(route => router.use(route.path, route.route));
export const routes = router;