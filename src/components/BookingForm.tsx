import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, startOfToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AlertDialog } from "./ui/alert-dialog";
import { Calendar, Clock, User, Mail, Phone, FileText } from "lucide-react";

const bookingSchema = z.object({
  serviceId: z.string().min(1, "يرجى اختيار الخدمة"),
  firstName: z.string()
    .min(1, "الاسم الأول مطلوب")
    .regex(/^[\p{L}\s]+$/u, "الاسم يجب أن يحتوي على حروف فقط"),
  lastName: z.string()
    .min(1, "اسم العائلة مطلوب")
    .regex(/^[\p{L}\s]+$/u, "اسم العائلة يجب أن يحتوي على حروف فقط"),
  email: z.string().optional(),
  phone: z.string()
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .regex(/^[0-9+\-\s()]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingForm() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [step, setStep] = useState(1);
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    description: "",
    variant: "info",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const serviceId = watch("serviceId");

  const { data: services } = api.service.getAll.useQuery();
  const { data: availableSlots, refetch: refetchSlots } =
    api.booking.getAvailableSlots.useQuery(
      {
        serviceId: serviceId!,
        date: selectedDate!,
      },
      {
        enabled: !!serviceId && !!selectedDate,
      }
    );

  const createBooking = api.booking.create.useMutation({
    onSuccess: (data) => {
      // Redirect to success page with only the booking ID
      void router.push({
        pathname: '/booking-success',
        query: {
          id: data.id,
        },
      });
    },
    onError: (error) => {
      // Provide user-friendly error messages
      let friendlyMessage = error.message;

      if (error.message.includes("already booked") || error.message.includes("محجوز")) {
        friendlyMessage = "عذراً، هذا الموعد أصبح محجوزاً للتو. الرجاء اختيار موعد آخر.";
      } else if (error.message.includes("email")) {
        friendlyMessage = "الرجاء التأكد من إدخال بريد إلكتروني صحيح أو تركه فارغاً.";
      } else if (error.message.includes("Service") || error.message.includes("الخدمة")) {
        friendlyMessage = "الخدمة المطلوبة غير متوفرة حالياً. الرجاء المحاولة مرة أخرى.";
      }

      setAlertDialog({
        isOpen: true,
        title: "فشل الحجز",
        description: friendlyMessage,
        variant: "error",
      });

      // Refresh available slots after error
      void refetchSlots();
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      setAlertDialog({
        isOpen: true,
        title: "معلومات ناقصة",
        description: "الرجاء اختيار تاريخ ووقت للموعد.",
        variant: "info",
      });
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours!, minutes!, 0, 0);

    createBooking.mutate({
      ...data,
      date: selectedDate,
      startTime,
    });
  };

  const handleServiceChange = (value: string) => {
    setValue("serviceId", value);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    if (date) {
      void refetchSlots();
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">Book an Appointment</h2>
        <div className="mt-4 flex items-center gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 1 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <div className="h-1 w-16 bg-gray-200">
            <div
              className={`h-full ${step >= 2 ? "bg-primary" : ""}`}
              style={{ width: step >= 2 ? "100%" : "0%" }}
            />
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 2 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <div className="h-1 w-16 bg-gray-200">
            <div
              className={`h-full ${step >= 3 ? "bg-primary" : ""}`}
              style={{ width: step >= 3 ? "100%" : "0%" }}
            />
          </div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 3 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceId">Select Service</Label>
              <Select onValueChange={handleServiceChange} value={serviceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a service" />
                </SelectTrigger>
                <SelectContent>
                  {services?.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - {service.duration} min
                      {service.price && ` - $${service.price}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.serviceId.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!serviceId}
              className="w-full"
            >
              Next: Select Date & Time
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Date
              </Label>
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={{ before: startOfToday() }}
                  className="rounded-md border p-3"
                />
              </div>
            </div>

            {selectedDate && availableSlots && (
              <div>
                <Label className="mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  اختر الوقت
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map((slot) => {
                    const timeString = format(slot.time, "HH:mm");
                    const isSelected = selectedTime === timeString;

                    if (slot.isBooked) {
                      return (
                        <Button
                          key={slot.time.toISOString()}
                          type="button"
                          variant="outline"
                          disabled
                          className="relative opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                        >
                          <span className="line-through text-gray-400">
                            {format(slot.time, "h:mm a")}
                          </span>
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            محجوز
                          </span>
                        </Button>
                      );
                    }

                    return (
                      <Button
                        key={slot.time.toISOString()}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => setSelectedTime(timeString)}
                        className={
                          isSelected
                            ? "bg-primary hover:bg-primary/90"
                            : "hover:bg-primary/10 hover:border-primary"
                        }
                      >
                        {format(slot.time, "h:mm a")}
                      </Button>
                    );
                  })}
                </div>
                {availableSlots.every((slot) => slot.isBooked) && (
                  <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200 mt-4">
                    <p className="text-amber-800 font-medium mb-2">
                      لا توجد مواعيد متاحة في هذا اليوم
                    </p>
                    <p className="text-sm text-amber-600">
                      جميع المواعيد محجوزة. الرجاء اختيار يوم آخر.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="w-full"
              >
                Next: Your Information
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  First Name
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="+201021133317"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Any special requests or information we should know..."
              />
            </div>

            <div className="rounded-md bg-accent p-4">
              <h3 className="mb-2 font-semibold text-primary">
                Appointment Summary
              </h3>
              <p className="text-sm">
                <strong>Service:</strong>{" "}
                {services?.find((s) => s.id === serviceId)?.name}
              </p>
              <p className="text-sm">
                <strong>Date:</strong>{" "}
                {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </p>
              <p className="text-sm">
                <strong>Time:</strong>{" "}
                {selectedTime &&
                  format(
                    new Date(`2000-01-01T${selectedTime}`),
                    "h:mm a"
                  )}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="w-full"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full"
              >
                {createBooking.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}
      </form>

      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        description={alertDialog.description}
        variant={alertDialog.variant}
      />
    </div>
  );
}
