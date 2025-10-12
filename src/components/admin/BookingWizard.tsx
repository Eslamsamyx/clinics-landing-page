import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  UserPlus,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface Service {
  id: string;
  name: string;
  duration: number;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
}

interface NewPatient {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface NewBooking {
  serviceId: string;
  city: string;
  date: string;
  time: string;
  notes: string;
}

interface BookingWizardProps {
  show: boolean;
  onClose: () => void;
  services: Service[] | undefined;
  searchResults: Patient[] | undefined;
  patientSearchQuery: string;
  setPatientSearchQuery: (query: string) => void;
  newPatient: NewPatient;
  setNewPatient: (patient: NewPatient) => void;
  newBooking: NewBooking;
  setNewBooking: (booking: NewBooking) => void;
  onCreatePatient: (e: React.FormEvent) => void;
  onCreateBooking: (e: React.FormEvent) => void;
  bookingStep: number;
  setBookingStep: (step: number) => void;
  selectedPatient: string | null;
  setSelectedPatient: (id: string | null) => void;
}

export function BookingWizard({
  show,
  onClose,
  services,
  searchResults,
  patientSearchQuery,
  setPatientSearchQuery,
  newPatient,
  setNewPatient,
  newBooking,
  setNewBooking,
  onCreatePatient,
  onCreateBooking,
  bookingStep,
  setBookingStep,
  selectedPatient,
  setSelectedPatient,
}: BookingWizardProps) {
  const handleClose = () => {
    setBookingStep(1);
    setSelectedPatient(null);
    setSelectedPatientInfo(null);
    setPatientSearchQuery("");
    setNewPatient({ firstName: "", lastName: "", email: "", phone: "" });
    setNewBooking({ serviceId: "", city: "", date: "", time: "", notes: "" });
    onClose();
  };

  // Keep track of selected patient data
  const [selectedPatientInfo, setSelectedPatientInfo] = useState<Patient | null>(null);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient.id);
    setSelectedPatientInfo(patient);
    setBookingStep(2);
    setPatientSearchQuery("");
  };

  const handleBackToStep1 = () => {
    setBookingStep(1);
    setSelectedPatientInfo(null);
    setNewBooking({ serviceId: "", city: "", date: "", time: "", notes: "" });
  };

  const selectedPatientData = selectedPatientInfo;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            dir="rtl"
          >
            {/* Header with Steps */}
            <div className="bg-gradient-to-r from-primary via-primary-dark to-primary-light p-4">
              <h2 className="text-2xl font-bold text-white mb-3">حجز موعد جديد</h2>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bookingStep === 1 ? 'bg-white text-primary' : 'bg-white/30 text-white'} font-bold text-sm transition-all`}>
                    1
                  </div>
                  <span className={`text-xs font-medium ${bookingStep === 1 ? 'text-white' : 'text-white/60'}`}>اختيار المريض</span>
                </div>
                <div className={`h-1 w-12 rounded-full ${bookingStep === 2 ? 'bg-white' : 'bg-white/30'}`}></div>
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bookingStep === 2 ? 'bg-white text-primary' : 'bg-white/30 text-white'} font-bold text-sm transition-all`}>
                    2
                  </div>
                  <span className={`text-xs font-medium ${bookingStep === 2 ? 'text-white' : 'text-white/60'}`}>تفاصيل الحجز</span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5">
              {bookingStep === 1 ? (
                // Step 1: Patient Selection
                <div className="space-y-4">
                  {/* Patient Search */}
                  <div>
                    <Label className="mb-2 block text-base font-semibold text-gray-800">ابحث عن مريض موجود</Label>
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="ابحث بالاسم أو الهاتف..."
                        value={patientSearchQuery}
                        onChange={(e) => setPatientSearchQuery(e.target.value)}
                        className="pe-10 h-10"
                      />
                    </div>

                    {/* Search Results */}
                    {searchResults && searchResults.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50">
                        {searchResults.map((patient) => (
                          <button
                            key={patient.id}
                            onClick={() => handlePatientSelect(patient)}
                            className="w-full p-3 text-right hover:bg-white hover:shadow-sm transition-all border-b border-gray-200 last:border-0"
                          >
                            <div className="font-bold text-primary">
                              {patient.firstName} {patient.lastName}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-1 justify-end">
                              <span>{patient.phone}</span>
                              <Phone className="h-3 w-3" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="text-gray-500 text-sm px-2">أو</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>

                  {/* New Patient Form */}
                  <div>
                    <Label className="mb-2 block text-base font-semibold text-gray-800">إضافة مريض جديد</Label>

                    <form onSubmit={onCreatePatient} className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <Label className="mb-1 block text-sm font-medium">الاسم الأول *</Label>
                          <Input
                            required
                            value={newPatient.firstName}
                            onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                            placeholder="أدخل الاسم الأول"
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="mb-1 block text-sm font-medium">الاسم الأخير *</Label>
                          <Input
                            required
                            value={newPatient.lastName}
                            onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                            placeholder="أدخل الاسم الأخير"
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="mb-1 block text-sm font-medium">رقم الهاتف *</Label>
                          <Input
                            required
                            type="tel"
                            value={newPatient.phone}
                            onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                            placeholder="أدخل رقم الهاتف"
                            className="h-10"
                          />
                        </div>
                        <div>
                          <Label className="mb-1 block text-sm font-medium">البريد الإلكتروني</Label>
                          <Input
                            type="email"
                            value={newPatient.email}
                            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                            placeholder="أدخل البريد الإلكتروني (اختياري)"
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 flex-row-reverse">
                        <Button
                          type="submit"
                          className="flex-1 h-10 text-sm font-bold"
                          style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                        >
                          <UserPlus className="h-4 w-4 ml-2" />
                          إضافة وحجز موعد
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClose}
                          className="h-10 px-6 text-sm"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                // Step 2: Booking Details
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-accent-light to-white p-3 rounded-lg border-r-4 border-accent">
                    <p className="text-xs text-gray-600">المريض المحدد</p>
                    <p className="text-base font-bold text-primary mt-0.5">
                      {selectedPatientData && (
                        <>
                          {selectedPatientData.firstName} {selectedPatientData.lastName}
                        </>
                      )}
                    </p>
                  </div>

                  <form onSubmit={onCreateBooking} className="space-y-3">
                    <div>
                      <Label className="mb-1 block text-sm font-medium">الخدمة *</Label>
                      <Select
                        value={newBooking.serviceId}
                        onValueChange={(value) => setNewBooking({ ...newBooking, serviceId: value })}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="اختر الخدمة" />
                        </SelectTrigger>
                        <SelectContent>
                          {services?.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - {service.duration} دقيقة
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <Label className="mb-1 block text-sm font-medium">التاريخ *</Label>
                        <Input
                          type="date"
                          required
                          value={newBooking.date}
                          onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                          min={new Date().toISOString().split("T")[0]}
                          style={{ direction: 'ltr' }}
                          className="text-right h-10"
                        />
                      </div>

                      <div>
                        <Label className="mb-1 block text-sm font-medium">الوقت *</Label>
                        <Input
                          type="time"
                          required
                          value={newBooking.time}
                          onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                          style={{ direction: 'ltr' }}
                          className="text-right h-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-1 block text-sm font-medium">ملاحظات</Label>
                      <Textarea
                        value={newBooking.notes}
                        onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                        placeholder="أي ملاحظات إضافية..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="mt-4 flex gap-2 flex-row-reverse">
                      <Button
                        type="submit"
                        className="flex-1 h-10 text-sm font-bold"
                        style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                      >
                        <CheckCircle className="h-4 w-4 ml-2" />
                        تأكيد الحجز
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBackToStep1}
                        className="h-10 px-6 text-sm"
                        >
                        <ArrowRight className="h-4 w-4 ml-2" />
                        رجوع
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
