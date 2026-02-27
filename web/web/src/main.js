import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import App from "./App.vue";
import "./assets/tailwind.css";
import router from "./router";
import store from "./store";

library.add(fas, far, fab);

const app = createApp(App)
  .component("FontAwesomeIcon", FontAwesomeIcon)
  .use(store)
  .use(router);

router.isReady().then(() => {
  app.mount("#app");

  // Used by prerender plugin to know when route is fully rendered.
  if (typeof document !== "undefined") {
    document.dispatchEvent(new Event("render-event"));
  }
});
