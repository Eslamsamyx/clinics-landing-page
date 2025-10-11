import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalServices: number;
}

interface StatsCardsProps {
  stats: Stats | undefined;
}

interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  bgGradient: string;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statCards: StatCard[] = [
    {
      title: "إجمالي الحجوزات",
      value: stats?.totalBookings ?? 0,
      icon: Calendar,
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100/50",
    },
    {
      title: "قيد الانتظار",
      value: stats?.pendingBookings ?? 0,
      icon: Clock,
      gradient: "from-amber-500 via-amber-600 to-orange-600",
      bgGradient: "from-amber-50 to-amber-100/50",
    },
    {
      title: "مؤكدة",
      value: stats?.confirmedBookings ?? 0,
      icon: CheckCircle,
      gradient: "from-emerald-500 via-emerald-600 to-green-600",
      bgGradient: "from-emerald-50 to-emerald-100/50",
    },
    {
      title: "الخدمات النشطة",
      value: stats?.totalServices ?? 0,
      icon: Stethoscope,
      gradient: "from-purple-500 via-purple-600 to-indigo-600",
      bgGradient: "from-purple-50 to-purple-100/50",
    },
  ];

  return (
    <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 group hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-4xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 h-32 w-32 translate-x-8 translate-y-8 rounded-full bg-white/20 blur-2xl"></div>
          </motion.div>
        );
      })}
    </div>
  );
}
