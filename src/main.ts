import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "./styles/main.css";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
