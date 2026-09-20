import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home.vue')
    },
    {
        path: '/products',
        name: 'products',
        component: () => import('../views/products/index.vue')
    },
    {
        path: '/products/create',
        name: 'products-create',
        component: () => import('../views/products/create.vue')
    },
    {
        path: '/products/edit/:id',
        name: 'products-edit',
        component: () => import('../views/products/edit.vue')
    },
    {
        path: '/categories',
        name: 'categories',
        component: () => import('../views/categories/index.vue')
    },
    {
        path: '/categories/create',
        name: 'categories-create',
        component: () => import('../views/categories/create.vue')
    },
    {
        path: '/categories/edit/:id',
        name: 'categories-edit',
        component: () => import('../views/categories/edit.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router