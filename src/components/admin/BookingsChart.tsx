import { motion } from "framer-motion";
import { TrendingUp, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";

interface BookingsChartProps {
  data:
    | {
        date: string;
        count: number;
      }[]
    | undefined;
}

export function BookingsChart({ data }: BookingsChartProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              إحصائيات الحجوزات اليومية
            </h3>
            <p className="text-sm text-gray-600">آخر 30 يوم</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-600">لا توجد بيانات متاحة</p>
          <p className="text-sm text-gray-500">ابدأ بإضافة حجوزات لعرض الإحصائيات</p>
        </div>
      </motion.div>
    );
  }

  const totalBookings = data.reduce((sum, item) => sum + item.count, 0);
  const avgBookings = (totalBookings / data.length).toFixed(1);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const date = parseISO(payload[0].payload.date);
      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-primary mb-1">
            {format(date, "dd MMMM yyyy", { locale: ar })}
          </p>
          <p className="text-sm text-gray-600">
            الحجوزات:{" "}
            <span className="font-bold text-primary-light">
              {payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              إحصائيات الحجوزات اليومية
            </h3>
            <p className="text-sm text-gray-600">آخر 30 يوم</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-6">
          <div className="text-left">
            <p className="text-xs text-gray-500 mb-1">إجمالي الحجوزات</p>
            <p className="text-2xl font-bold text-primary">{totalBookings}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-gray-500 mb-1">المتوسط اليومي</p>
            <p className="text-2xl font-bold text-primary-light">{avgBookings}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4a7fa7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4a7fa7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = parseISO(value);
                return format(date, "dd/MM", { locale: ar });
              }}
              stroke="#9ca3af"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#0a1931"
              strokeWidth={3}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
