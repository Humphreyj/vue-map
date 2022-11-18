import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import "./style.css";

import { useRuntimeStore } from "@/stores/runtimeStore";
const configPath = [
  import.meta.env.BASE_URL.replace(/[/]*$/g, ""),
  "config.json",
].join("/");
const runtimeConfig = {};
fetch(configPath)
  .then(async (res) => {
    const respJson = await res.json();
    runtimeConfig.mapboxToken = respJson.mapboxToken;

    const app = createApp(App);
    const pinia = createPinia();
    app.use(pinia).mount("#app");
    const runtimeStore = useRuntimeStore();
    runtimeStore.$state = runtimeConfig;
  })
  .catch((err) => {
    console.log(err);
  });
