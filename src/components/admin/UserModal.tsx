import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { AdminRole } from "@prisma/client";

interface UserModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newUser: {
    name: string;
    email: string;
    password: string;
    role: AdminRole;
  };
  setNewUser: (user: { name: string; email: string; password: string; role: AdminRole }) => void;
  isPending: boolean;
}

export function UserModal({
  show,
  onClose,
  onSubmit,
  newUser,
  setNewUser,
  isPending,
}: UserModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-primary">إضافة مستخدم جديد</h3>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="name" className="text-base font-semibold">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    placeholder="مثال: أحمد محمد"
                    className="mt-2"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email" className="text-base font-semibold">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="example@clinic.com"
                    className="mt-2"
                    dir="ltr"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="password" className="text-base font-semibold">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder="كلمة مرور قوية (8 أحرف على الأقل)"
                    className="mt-2"
                    minLength={8}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="role" className="text-base font-semibold">الدور</Label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value as AdminRole })
                    }
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                    required
                  >
                    <option value={AdminRole.ASSISTANT}>مساعد - يدير المواعيد والمرضى فقط</option>
                    <option value={AdminRole.ADMIN}>مسؤول - صلاحيات كاملة</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    {newUser.role === AdminRole.ADMIN
                      ? "المسؤول لديه صلاحيات كاملة لإدارة النظام والمستخدمين"
                      : "المساعد يمكنه فقط إدارة المواعيد وسجلات المرضى"}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 gap-2"
                  style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                >
                  {isPending ? "جاري الحفظ..." : "حفظ المستخدم"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
