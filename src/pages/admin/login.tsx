import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Calendar } from "lucide-react";
import Head from "next/head";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useNotification } from "~/components/NotificationProvider";

export default function AdminLogin() {
  const router = useRouter();
  const notification = useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        notification.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      } else {
        notification.success("تم تسجيل الدخول بنجاح");
        await router.push("/admin/dashboard");
      }
    } catch (error) {
      notification.error("حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>تسجيل دخول الإدارة - عيادات د. نادر حماد</title>
      </Head>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary-dark to-primary-light p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass w-full max-w-md rounded-2xl p-8 shadow-2xl"
        >
          {/* Logo and Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-primary">
              لوحة التحكم
            </h1>
            <p className="text-gray-600">عيادات د. نادر حماد</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@clinic.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 flex items-center gap-2">
                <Lock className="h-4 w-4" />
                كلمة المرور
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "جاري تسجيل الدخول..."
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 rounded-lg bg-accent p-4 text-sm">
            <p className="mb-2 font-bold text-primary">بيانات تجريبية:</p>
            <p>البريد: admin@clinic.com</p>
            <p>كلمة المرور: admin123</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
