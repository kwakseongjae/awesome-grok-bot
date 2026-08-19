import { routing } from "@/i18n/routing";
import ko from "./messages/ko.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof ko;
  }
}
