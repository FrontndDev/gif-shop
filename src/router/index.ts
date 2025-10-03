import { createRouter, createWebHistory } from 'vue-router';

const Shop = () => import('../views/Shop.vue');
const Product = () => import('../views/Product.vue');
const Cart = () => import('../views/Cart.vue');
const Payment = () => import('../views/Payment.vue');
const Success = () => import('../views/Success.vue');
const Support = () => import('../views/Support.vue');
const Order = () => import('../views/Order.vue');
const Privacy = () => import('../views/Privacy.vue');
const Offer = () => import('../views/Offer.vue');
const About = () => import('../views/About.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/shop' },
    { path: '/shop', name: 'shop', component: Shop },
    { path: '/product/:slug', name: 'product', component: Product, props: true },
    { path: '/cart', name: 'cart', component: Cart },
    { path: '/payment/:productId?', name: 'payment', component: Payment, props: true },
    { path: '/success/:orderId?', name: 'success', component: Success, props: true },
    { path: '/support', name: 'support', component: Support },
    { path: '/order', name: 'order', component: Order },
    { path: '/privacy', name: 'privacy', component: Privacy },
    { path: '/offer', name: 'offer', component: Offer },
    { path: '/about', name: 'about', component: About }
  ],
  scrollBehavior() { return { top: 0 }; }
});

export default router;


