import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { ServicesManagement } from "~/components/admin/ServicesManagement";
import { ServiceModal } from "~/components/admin/ServiceModal";
import { api } from "~/utils/api";
import { useNotification } from "~/components/NotificationProvider";

export default function ServicesPage() {
  const { status } = useSession();
  const router = useRouter();
  const notification = useNotification();

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    duration: 30,
    price: 0,
  });

  // Queries - must be called before any conditional returns
  const { data: services, refetch: refetchServices, isError } =
    api.admin.getAllServices.useQuery(undefined, {
      enabled: status === "authenticated",
    });

  // Mutations - must be called before any conditional returns
  const createService = api.admin.createService.useMutation({
    onSuccess: () => {
      notification.success("تم إضافة الخدمة بنجاح");
      void refetchServices();
      setShowServiceModal(false);
      setNewService({ name: "", description: "", duration: 30, price: 0 });
    },
    onError: () => notification.error("فشل في إضافة الخدمة"),
  });

  const deleteService = api.admin.deleteService.useMutation({
    onSuccess: () => {
      notification.success("تم حذف الخدمة بنجاح");
      void refetchServices();
    },
    onError: () => notification.error("فشل في حذف الخدمة"),
  });

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    void router.push("/admin/login");
    return null;
  }

  // Check if user has access (redirect if not ADMIN role)
  if (isError) {
    void router.push("/admin/bookings");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-lg text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    createService.mutate(newService);
  };

  return (
    <>
      <Head>
        <title>إدارة الخدمات - عيادات د. محمد حماد</title>
      </Head>

      <AdminLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">إدارة الخدمات</h1>
            <p className="text-lg text-gray-600">إضافة وإدارة الخدمات العلاجية المتاحة</p>
          </div>

          <ServicesManagement
            services={services}
            onAddClick={() => setShowServiceModal(true)}
            onDeleteService={(id) => deleteService.mutate({ id })}
          />
        </div>

        <ServiceModal
          show={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          onSubmit={handleCreateService}
          newService={newService}
          setNewService={setNewService}
          isPending={createService.isPending}
        />
      </AdminLayout>
    </>
  );
}
