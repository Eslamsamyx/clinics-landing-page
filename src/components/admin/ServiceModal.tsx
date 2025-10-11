import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface ServiceModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newService: {
    name: string;
    description: string;
    duration: number;
    price: number;
  };
  setNewService: (service: { name: string; description: string; duration: number; price: number }) => void;
  isPending: boolean;
}

export function ServiceModal({
  show,
  onClose,
  onSubmit,
  newService,
  setNewService,
  isPending,
}: ServiceModalProps) {
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
                <h3 className="text-2xl font-bold text-primary">إضافة خدمة جديدة</h3>
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
                  <Label htmlFor="name" className="text-base font-semibold">اسم الخدمة</Label>
                  <Input
                    id="name"
                    value={newService.name}
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                    placeholder="مثال: كشف عام"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-base font-semibold">المدة (بالدقائق)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newService.duration}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        duration: parseInt(e.target.value),
                      })
                    }
                    placeholder="30"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-base font-semibold">السعر (ج.م)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newService.price}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        price: parseFloat(e.target.value),
                      })
                    }
                    placeholder="200"
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-base font-semibold">الوصف</Label>
                  <Textarea
                    id="description"
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        description: e.target.value,
                      })
                    }
                    placeholder="وصف تفصيلي للخدمة..."
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 gap-2"
                  style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                >
                  {isPending ? "جاري الحفظ..." : "حفظ الخدمة"}
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
