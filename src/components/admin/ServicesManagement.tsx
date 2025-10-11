import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Clock, Trash2, Stethoscope } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number | null;
}

interface ServicesManagementProps {
  services: Service[] | undefined;
  onAddClick: () => void;
  onDeleteService: (id: string) => void;
}

export function ServicesManagement({
  services,
  onAddClick,
  onDeleteService,
}: ServicesManagementProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete({ id: service.id, name: service.name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      onDeleteService(serviceToDelete.id);
      setServiceToDelete(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <div className="mb-6 flex items-center justify-end">
        <Button
          onClick={onAddClick}
          className="gap-2 shadow-lg hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
        >
          <Plus className="h-5 w-5" />
          إضافة خدمة جديدة
        </Button>
      </div>

      {services && services.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services?.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-primary-light"></div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-primary mb-2">
                    {service.name}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="mb-4 flex items-center justify-between rounded-lg bg-accent-light p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary-light" />
                    <span className="text-sm font-medium text-gray-700">{service.duration} دقيقة</span>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {service.price?.toString()} ج.م
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClick(service)}
                  className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف الخدمة
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-lg border border-gray-100">
          <Stethoscope className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">لا توجد خدمات حالياً</p>
          <p className="text-sm text-gray-500">ابدأ بإضافة أول خدمة علاجية</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف الخدمة"
        description={`هل أنت متأكد من حذف خدمة "${serviceToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </motion.div>
  );
}
