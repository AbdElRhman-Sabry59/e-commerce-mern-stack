import React, { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Activity,
  Wallet,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

// ---- Design tokens -------------------------------------------------
// Ink navy   #161B2B   (sidebar / headings)
// Signal blue#3E6DF6   (primary accent, matches existing sidebar button)
// Paper      #F4F6FB   (page background)
// Card       #FFFFFF
// Muted      #6B7280
// Line       #E6E9F2
// Success    #17A673
// Amber      #F5A524
// Danger     #EF4B54

const chartData = [
  { day: "Sat", value: 320 },
  { day: "Sun", value: 410 },
  { day: "Mon", value: 380 },
  { day: "Tue", value: 512 },
  { day: "Wed", value: 470 },
  { day: "Thu", value: 610 },
  { day: "Fri", value: 588 },
];

const stats = [
  {
    label: "إجمالي المستخدمين",
    value: "1,240",
    delta: "+8.2%",
    up: true,
    icon: Users,
  },
  {
    label: "العمليات اليوم",
    value: "364",
    delta: "+3.4%",
    up: true,
    icon: Activity,
  },
  {
    label: "الإيرادات",
    value: "$12,480",
    delta: "-1.1%",
    up: false,
    icon: Wallet,
  },
  {
    label: "نشطون الآن",
    value: "87",
    delta: "مباشر",
    up: null,
    icon: Radio,
  },
];

const activity = [
  {
    user: "سارة أحمد",
    action: "أنشأت حسابًا جديدًا",
    time: "منذ 5 دقائق",
    status: "success",
  },
  {
    user: "محمد علي",
    action: "حدّث بيانات الملف الشخصي",
    time: "منذ 22 دقيقة",
    status: "success",
  },
  {
    user: "خالد يوسف",
    action: "طلب استرداد بانتظار المراجعة",
    time: "منذ ساعة",
    status: "pending",
  },
  {
    user: "ليلى حسن",
    action: "فشل تسجيل الدخول (3 محاولات)",
    time: "منذ ساعتين",
    status: "failed",
  },
  {
    user: "عمر فاروق",
    action: "حذف عنصرًا من المخزون",
    time: "أمس",
    status: "success",
  },
];

const statusMap = {
  success: { label: "مكتمل", color: "#17A673", Icon: CheckCircle2 },
  pending: { label: "قيد الانتظار", color: "#F5A524", Icon: Clock },
  failed: { label: "فشل", color: "#EF4B54", Icon: XCircle },
};

function StatCard({ label, value, delta, up, icon: Icon }) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E6E9F2",
        borderRadius: 14,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>
          {label}
        </span>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            background: "#EEF2FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={17} color="#3E6DF6" strokeWidth={2} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 26,
            fontWeight: 600,
            color: "#161B2B",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {up !== null && (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontSize: 12,
              fontWeight: 600,
              color: up ? "#17A673" : "#EF4B54",
            }}
          >
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta}
          </span>
        )}
        {up === null && (
          <span style={{ fontSize: 12, fontWeight: 600, color: "#3E6DF6" }}>
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: "#161B2B",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 8,
        fontSize: 12,
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      }}
    >
      {label}: {payload[0].value}
    </div>
  );
}

export default function AdminDashboard() {
  const [range, setRange] = useState("7d");

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: "#F4F6FB",
        minHeight: "100vh",
        padding: "28px 32px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            color: "#161B2B",
            letterSpacing: "-0.01em",
          }}
        >
          نظرة عامة
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#6B7280" }}>
          ملخص أداء النظام لهذا الأسبوع
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Chart + activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 16,
          marginBottom: 16,
          alignItems: "stretch",
        }}
      >
        {/* Chart */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E6E9F2",
            borderRadius: 14,
            padding: "20px 22px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 600,
                color: "#161B2B",
              }}
            >
              النشاط خلال الأسبوع
            </h2>
            <div style={{ display: "flex", gap: 6 }}>
              {["7d", "30d"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  style={{
                    border: "none",
                    borderRadius: 7,
                    padding: "5px 10px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: range === r ? "#3E6DF6" : "#F4F6FB",
                    color: range === r ? "#fff" : "#6B7280",
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3E6DF6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3E6DF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#EEF1F8" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3E6DF6"
                strokeWidth={2.5}
                fill="url(#fillBlue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Notifications */}
        <div
          style={{
            background: "#161B2B",
            borderRadius: 14,
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Bell size={16} color="#3E6DF6" />
            <h2
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              تنبيهات سريعة
            </h2>
          </div>
          {[
            { text: "3 طلبات بانتظار المراجعة", tone: "#F5A524" },
            { text: "تحديث النظام مجدول الليلة 2:00 ص", tone: "#3E6DF6" },
            { text: "نسخة احتياطية تمت بنجاح", tone: "#17A673" },
          ].map((n, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 9,
                padding: "10px 12px",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: n.tone,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: "#D7DBE8" }}>{n.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity table */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E6E9F2",
          borderRadius: 14,
          padding: "20px 22px",
        }}
      >
        <h2
          style={{
            margin: "0 0 14px",
            fontSize: 15,
            fontWeight: 600,
            color: "#161B2B",
          }}
        >
          آخر النشاطات
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["المستخدم", "الإجراء", "الوقت", "الحالة"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "right",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#9CA3AF",
                    padding: "0 8px 10px",
                    borderBottom: "1px solid #EEF1F8",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activity.map((a, i) => {
              const s = statusMap[a.status];
              return (
                <tr key={i}>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontSize: 13.5,
                      color: "#161B2B",
                      fontWeight: 500,
                      borderBottom:
                        i === activity.length - 1
                          ? "none"
                          : "1px solid #F3F4F8",
                    }}
                  >
                    {a.user}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontSize: 13.5,
                      color: "#6B7280",
                      borderBottom:
                        i === activity.length - 1
                          ? "none"
                          : "1px solid #F3F4F8",
                    }}
                  >
                    {a.action}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      fontSize: 12.5,
                      color: "#9CA3AF",
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      borderBottom:
                        i === activity.length - 1
                          ? "none"
                          : "1px solid #F3F4F8",
                    }}
                  >
                    {a.time}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom:
                        i === activity.length - 1
                          ? "none"
                          : "1px solid #F3F4F8",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 12,
                        fontWeight: 600,
                        color: s.color,
                        background: `${s.color}14`,
                        padding: "4px 9px",
                        borderRadius: 20,
                      }}
                    >
                      <s.Icon size={12} />
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
