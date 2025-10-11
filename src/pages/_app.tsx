import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Cairo } from "next/font/google";

import { api } from "~/utils/api";
import { NotificationProvider } from "~/components/NotificationProvider";

import "~/styles/globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NotificationProvider>
        <div className={cairo.className} dir="rtl">
          <Component {...pageProps} />
        </div>
      </NotificationProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
