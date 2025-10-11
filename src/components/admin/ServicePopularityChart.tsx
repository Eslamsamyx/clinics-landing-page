import { motion } from "framer-motion";
import { Stethoscope, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ServicePopularityChartProps {
  data:
    | {
        name: string;
        bookings: number;
        revenue: number;
      }[]
    | undefined;
}

export function ServicePopularityChart({ data }: ServicePopularityChartProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              أكثر الخدمات طلباً
            </h3>
            <p className="text-sm text-gray-600">توزيع الحجوزات حسب الخدمة</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Stethoscope className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-600">لا توجد بيانات متاحة</p>
        </div>
      </motion.div>
    );
  }

  const COLORS = [
    "#0a1931",
    "#4a7fa7",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-primary mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-gray-600">
            الحجوزات:{" "}
            <span className="font-bold text-primary-light">
              {payload[0].value}
            </span>
          </p>
          {payload[0].payload.revenue > 0 && (
            <p className="text-sm text-gray-600">
              الإيرادات:{" "}
              <span className="font-bold text-green-600">
                {payload[0].payload.revenue.toLocaleString()} ج.م
              </span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const topService = data.reduce((max, item) =>
    item.bookings > max.bookings ? item : max
  , data[0] ?? { name: "", bookings: 0, revenue: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              أكثر الخدمات طلباً
            </h3>
            <p className="text-sm text-gray-600">توزيع الحجوزات حسب الخدمة</p>
          </div>
        </div>

        {/* Stats Summary - Aligned right for RTL */}
        <div className="flex gap-4 text-right">
          {totalRevenue > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">الإيرادات المتوقعة</p>
              <p className="text-xl font-bold text-green-600">
                {totalRevenue.toLocaleString()} ج.م
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 mb-1">إجمالي الحجوزات</p>
            <p className="text-xl font-bold text-primary">{totalBookings}</p>
          </div>
        </div>
      </div>

      {/* Horizontal Bar Chart - Better for Arabic */}
      <div className="space-y-4">
        {data.map((service, index) => {
          const percentage = totalBookings > 0 ? (service.bookings / totalBookings) * 100 : 0;
          const isTop = service.name === topService.name;

          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-xl border-2 transition-all ${
                isTop
                  ? "bg-gradient-to-l from-emerald-50 to-green-50 border-emerald-300"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {isTop && (
                    <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">
                      <TrendingUp className="h-3 w-3" />
                      الأكثر طلباً
                    </div>
                  )}
                  <h4 className="font-bold text-primary text-base">
                    {service.name}
                  </h4>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {service.revenue > 0 && (
                    <span className="text-green-600 font-semibold">
                      {service.revenue.toLocaleString()} ج.م
                    </span>
                  )}
                  <span className="text-primary-light font-bold">
                    {service.bookings} حجز
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 bg-white rounded-lg overflow-hidden border border-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  className="h-full rounded-lg"
                  style={{
                    background: `linear-gradient(to left, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}cc)`,
                  }}
                >
                  <div className="flex items-center justify-end h-full px-3">
                    <span className="text-white font-bold text-sm drop-shadow">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Insight Box */}
      <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-emerald-700">💡 إحصائية:</span>{" "}
          <span className="font-bold">{topService.name}</span> هي الخدمة الأكثر طلباً بإجمالي{" "}
          <span className="font-bold">{topService.bookings}</span> حجز
          {topService.revenue > 0 && (
            <> وإيرادات متوقعة <span className="font-bold">{topService.revenue.toLocaleString()} ج.م</span></>
          )}
        </p>
      </div>
    </motion.div>
  );
}
