import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.zahara.zurisales",
  appName: "ZURI Sales OS",
  webDir: ".output/public",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
    cleartext: true,
  },
  plugins: {
    Geolocation: {
      // Configuration GPS haute précision pour Android
    },
  },
};

export default config;
