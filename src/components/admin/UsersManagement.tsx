import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Users, Shield, UserCog, Edit, Check, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { AdminRole } from "@prisma/client";

interface User {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: Date;
}

interface UsersManagementProps {
  users: User[] | undefined;
  onAddClick: () => void;
  onEditUser: (user: { id: string; name: string; email: string; role: AdminRole }) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onDeleteUser: (id: string) => void;
  editingUser: { id: string; name: string; email: string; role: AdminRole } | null;
  onCancelEdit: () => void;
  onSaveEdit: (id: string, data: { name?: string; role?: AdminRole; password?: string }) => void;
}

export function UsersManagement({
  users,
  onAddClick,
  onEditUser,
  onToggleActive,
  onDeleteUser,
  editingUser,
  onCancelEdit,
  onSaveEdit,
}: UsersManagementProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [editForm, setEditForm] = useState<{
    name: string;
    role: AdminRole;
    password: string;
  }>({ name: "", role: AdminRole.ASSISTANT, password: "" });

  const handleDeleteClick = (user: User) => {
    setUserToDelete({ id: user.id, name: user.name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  const handleEditClick = (user: User) => {
    setEditForm({ name: user.name, role: user.role, password: "" });
    onEditUser({ id: user.id, name: user.name, email: user.email, role: user.role });
  };

  const handleSaveEdit = (userId: string) => {
    const updateData: { name?: string; role?: AdminRole; password?: string } = {
      name: editForm.name,
      role: editForm.role,
    };
    if (editForm.password) {
      updateData.password = editForm.password;
    }
    onSaveEdit(userId, updateData);
  };

  const getRoleLabel = (role: AdminRole) => {
    return role === AdminRole.ADMIN ? "مسؤول" : "مساعد";
  };

  const getRoleIcon = (role: AdminRole) => {
    return role === AdminRole.ADMIN ? <Shield className="h-5 w-5" /> : <UserCog className="h-5 w-5" />;
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
          إضافة مستخدم جديد
        </Button>
      </div>

      {users && users.length > 0 ? (
        <div className="grid gap-6">
          {users?.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-primary-light"></div>

              {editingUser?.id === user.id ? (
                // Edit mode
                <div className="p-6" dir="rtl">
                  <div className="grid gap-4 md:grid-cols-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as AdminRole })}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                      >
                        <option value={AdminRole.ADMIN}>مسؤول</option>
                        <option value={AdminRole.ASSISTANT}>مساعد</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        كلمة المرور الجديدة (اختياري)
                      </label>
                      <input
                        type="password"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        placeholder="اتركه فارغاً للإبقاء على كلمة المرور الحالية"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      onClick={() => handleSaveEdit(user.id)}
                      className="gap-2"
                      style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                    >
                      <Check className="h-4 w-4" />
                      حفظ
                    </Button>
                    <Button
                      onClick={onCancelEdit}
                      variant="outline"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                // View mode
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-primary">
                          {user.name}
                        </h4>
                        <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          user.role === AdminRole.ADMIN
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {getRoleIcon(user.role)}
                          {getRoleLabel(user.role)}
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.active ? 'نشط' : 'غير نشط'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600" dir="ltr">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        تاريخ الإنشاء: {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button
                      onClick={() => handleEditClick(user)}
                      variant="outline"
                      size="sm"
                      className="gap-2 hover:bg-primary hover:text-white transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      تعديل
                    </Button>
                    <Button
                      onClick={() => onToggleActive(user.id, !user.active)}
                      variant="outline"
                      size="sm"
                      className={`gap-2 ${
                        user.active
                          ? 'text-orange-600 border-orange-200 hover:bg-orange-600 hover:text-white'
                          : 'text-green-600 border-green-200 hover:bg-green-600 hover:text-white'
                      } transition-colors`}
                    >
                      {user.active ? 'تعطيل' : 'تفعيل'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                      className="gap-2 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      حذف
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-lg border border-gray-100">
          <Users className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">لا يوجد مستخدمون حالياً</p>
          <p className="text-sm text-gray-500">ابدأ بإضافة أول مستخدم</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف المستخدم"
        description={`هل أنت متأكد من حذف المستخدم "${userToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </motion.div>
  );
}
