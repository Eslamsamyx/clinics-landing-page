import { motion } from "framer-motion";
import { PieChart, CheckCircle, Clock, X, Calendar } from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface BookingStatusChartProps {
  data:
    | {
        name: string;
        value: number;
        status: string;
      }[]
    | undefined;
}

export function BookingStatusChart({ data }: BookingStatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <PieChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              توزيع حالات الحجوزات
            </h3>
            <p className="text-sm text-gray-600">نسبة الحجوزات حسب الحالة</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-600">لا توجد بيانات متاحة</p>
        </div>
      </motion.div>
    );
  }

  const STATUS_COLORS: { [key: string]: string } = {
    PENDING: "#f59e0b",
    CONFIRMED: "#10b981",
    COMPLETED: "#3b82f6",
    CANCELLED: "#ef4444",
  };

  const STATUS_ICONS: { [key: string]: any } = {
    PENDING: Clock,
    CONFIRMED: CheckCircle,
    COMPLETED: CheckCircle,
    CANCELLED: X,
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-primary mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600">
            العدد:{" "}
            <span className="font-bold text-primary-light">
              {payload[0].value}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            النسبة:{" "}
            <span className="font-bold text-primary-light">
              {percentage}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label
  const renderCustomLabel = (entry: any) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((entry.value / total) * 100).toFixed(0);
    return `${percentage}%`;
  };

  const totalBookings = data.reduce((sum, item) => sum + item.value, 0);
  const completionRate = totalBookings > 0
    ? (((data.find(d => d.status === "COMPLETED")?.value ?? 0) / totalBookings) * 100).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <PieChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">
              توزيع حالات الحجوزات
            </h3>
            <p className="text-sm text-gray-600">نسبة الحجوزات حسب الحالة</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex gap-6">
          <div className="text-left">
            <p className="text-xs text-gray-500 mb-1">معدل الإكمال</p>
            <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] ?? "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.map((item) => {
          const Icon = STATUS_ICONS[item.status] ?? Calendar;
          return (
            <div
              key={item.status}
              className="flex items-center gap-2 p-3 rounded-lg bg-gray-50"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[item.status] }}
              ></div>
              <Icon className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
              <span className="mr-auto text-sm font-bold text-primary">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
