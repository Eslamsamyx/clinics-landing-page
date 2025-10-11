import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { UsersManagement } from "~/components/admin/UsersManagement";
import { UserModal } from "~/components/admin/UserModal";
import { api } from "~/utils/api";
import { useNotification } from "~/components/NotificationProvider";
import { AdminRole } from "@prisma/client";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const notification = useNotification();

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<{ id: string; name: string; email: string; role: AdminRole } | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: AdminRole.ASSISTANT,
  });

  // Queries - must be called before any conditional returns
  const { data: users, refetch: refetchUsers, isError } =
    api.admin.getAllUsers.useQuery(undefined, {
      enabled: status === "authenticated",
    });

  // Mutations - must be called before any conditional returns
  const createUser = api.admin.createUser.useMutation({
    onSuccess: () => {
      notification.success("تم إضافة المستخدم بنجاح");
      void refetchUsers();
      setShowUserModal(false);
      setNewUser({ name: "", email: "", password: "", role: AdminRole.ASSISTANT });
    },
    onError: (error) => notification.error(error.message || "فشل في إضافة المستخدم"),
  });

  const updateUser = api.admin.updateUser.useMutation({
    onSuccess: () => {
      notification.success("تم تحديث المستخدم بنجاح");
      void refetchUsers();
      setEditingUser(null);
    },
    onError: (error) => notification.error(error.message || "فشل في تحديث المستخدم"),
  });

  const deleteUser = api.admin.deleteUser.useMutation({
    onSuccess: () => {
      notification.success("تم حذف المستخدم بنجاح");
      void refetchUsers();
    },
    onError: (error) => notification.error(error.message || "فشل في حذف المستخدم"),
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(newUser);
  };

  const handleEditUser = (user: { id: string; name: string; email: string; role: AdminRole }) => {
    setEditingUser(user);
  };

  const handleUpdateUser = (id: string, data: { name?: string; role?: AdminRole; active?: boolean; password?: string }) => {
    updateUser.mutate({ id, ...data });
  };

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    void router.push("/admin/login");
    return null;
  }

  // Check if user has access (redirect if not ADMIN role)
  if (isError) {
    void router.push("/admin/dashboard");
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

  return (
    <>
      <Head>
        <title>إدارة المستخدمين - عيادات د. محمد حماد</title>
      </Head>

      <AdminLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">إدارة المستخدمين</h1>
            <p className="text-lg text-gray-600">إضافة وإدارة المستخدمين والمساعدين</p>
          </div>

          <UsersManagement
            users={users}
            onAddClick={() => setShowUserModal(true)}
            onEditUser={handleEditUser}
            onToggleActive={(id, active) => handleUpdateUser(id, { active })}
            onDeleteUser={(id) => deleteUser.mutate({ id })}
            editingUser={editingUser}
            onCancelEdit={() => setEditingUser(null)}
            onSaveEdit={(id, data) => handleUpdateUser(id, data)}
          />
        </div>

        <UserModal
          show={showUserModal}
          onClose={() => setShowUserModal(false)}
          onSubmit={handleCreateUser}
          newUser={newUser}
          setNewUser={setNewUser}
          isPending={createUser.isPending}
        />
      </AdminLayout>
    </>
  );
}
