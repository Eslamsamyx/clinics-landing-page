import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PeakTimesChartProps {
  data:
    | {
        day: string;
        bookings: number;
      }[]
    | undefined;
}

export function PeakTimesChart({ data }: PeakTimesChartProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              أوقات الذروة
            </h3>
            <p className="text-sm text-gray-600">توزيع الحجوزات حسب أيام الأسبوع</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-600">لا توجد بيانات متاحة</p>
        </div>
      </motion.div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.bookings, 0);
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-primary mb-1">
            {payload[0].payload.day}
          </p>
          <p className="text-sm text-gray-600">
            الحجوزات:{" "}
            <span className="font-bold text-primary-light">
              {payload[0].value}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            من الإجمالي:{" "}
            <span className="font-bold text-purple-600">
              {percentage}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0);
  const busiestDay = data.reduce((max, item) =>
    item.bookings > max.bookings ? item : max
  , data[0] ?? { day: "", bookings: 0 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              أوقات الذروة
            </h3>
            <p className="text-sm text-gray-600">توزيع الحجوزات حسب أيام الأسبوع</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-6">
          <div className="text-left">
            <p className="text-xs text-gray-500 mb-1">أكثر الأيام ازدحاماً</p>
            <p className="text-lg font-bold text-purple-600">{busiestDay.day}</p>
            <p className="text-xs text-gray-500">{busiestDay.bookings} حجز</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="bookings"
              fill="url(#colorPeak)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-purple-700">💡 نصيحة:</span>{" "}
          يوم <span className="font-bold">{busiestDay.day}</span> هو الأكثر ازدحاماً.
          يُنصح بتوفير موظفين إضافيين في هذا اليوم.
        </p>
      </div>
    </motion.div>
  );
}
