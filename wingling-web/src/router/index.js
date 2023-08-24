/* 路由器对象模块 */
import Vue from "vue";
import VueRouter from "vue-router";
import Login from '@/views/Login/index';
import Msite from '@/views/Msite/index.vue';
import Profile from '@/views/Profile/index.vue';
import Statistics from '@/views/Statistics/index.vue';
import Application from '@/views/Application/index.vue';
import DetailedProfile from '@/views/Profile/DetailedProfile/index.vue';
import store from '@/store/index';
import showNotice from "@/utils/notice";
import NotFound from '@/components/NotFound/index.vue';

// 声明使用插件
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    // 所有路由
    routes: [
        {
            path: '/msite',
            component: Msite,
            meta: {
                hideFooterGuide: false,
                requiresAuth: true
            }
        },
        {
            path: '/profile',
            component: Profile,
            meta: {
                hideFooterGuide: false,
                requiresAuth: true
            }
        },
        {
            path: '/settings',
            component: DetailedProfile,
            meta: {
                hideFooterGuide: true,
                requiresAuth: true
            }
        },
        {
            path: '/statistics',
            component: Statistics,
            meta: {
                hideFooterGuide: false,
                requiresAuth: true
            }
        },
        {
            path: '/login',
            component: Login,
            meta: {
                hideFooterGuide: true,
                requiresAuth: false
            }
        },
        {
            path: '/',
            redirect: '/login',
            meta: {
                hideFooterGuide: true,
                requiresAuth: false
            }
        },
        {
            path: '/application',
            component: Application,
            meta: {
                hideFooterGuide: true,
                requiresAuth: true
            }
        },
        {
            path: "*",
            component: NotFound,
            meta: {
                hideFooterGuide: true,
                requiresAuth: false
            }
        }
    ]
});

let dynamicRoutesAdded = false;

export const addAdminRoutes = () => {
    const isAdmin = store.getters.isAdmin;

    if (isAdmin) {
        const adminRoutes = [
            {
                path: '/userManagement',
                component: () => import('@/views/UserManagement/index.vue')
            },
            {
                path: '/clockManagement',
                component: () => import('@/views/ClockManagement/index.vue')
            }
        ];

        adminRoutes.forEach(route => {
            router.addRoute(route);
        });
        dynamicRoutesAdded = true;
    }
}

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (store.getters.token) {
            next();
        } else {
            showNotice('error', '无权限，请先登录');
            return next('/login');
        }
    } else {
        next();
    }
})

addAdminRoutes();
export default router;