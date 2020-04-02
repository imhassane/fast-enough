import Vue        from "vue";
import VueRouter  from "vue-router";
import Home       from "@/views/Home.vue";
import Test       from "@/views/Test.vue";
import Result     from "@/views/Result.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/test",
    name: "Test",
    component: Test
  },
  {
    path: "/results",
    name: "Result",
    component: Result
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes
});

export default router;
