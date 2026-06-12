import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  primary: "#2563EB",
  primaryHover: "#1D4ED8",
  primaryLight: "#EFF6FF",
  accent: "#0EA5E9",
  success: "#16A34A",
  successLight: "#F0FDF4",
  warning: "#D97706",
  warningLight: "#FFFBEB",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  purple: "#7C3AED",
  purpleLight: "#F5F3FF",
  teal: "#0D9488",
  tealLight: "#F0FDFA",
  gray50: "#F8FAFC",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray300: "#CBD5E1",
  gray400: "#94A3B8",
  gray500: "#64748B",
  gray600: "#475569",
  gray700: "#334155",
  gray800: "#1E293B",
  gray900: "#0F172A",
  white: "#FFFFFF",
  sidebarBg: "#0F172A",
  sidebarActive: "#1E40AF",
  sidebarHover: "#1E293B",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: "ST001", name: "Arjun Sharma", dept: "CSE", year: "3rd", section: "A", dob: "2002-05-14", email: "arjun@college.edu", parentName: "Ravi Sharma", parentEmail: "ravi@email.com", parentPhone: "9876543210", gender: "Male", faceRegistered: true, lastFaceUpdate: "2025-01-10", accuracy: 97.3, attendance: 82 },
  { id: "ST002", name: "Priya Nair", dept: "ECE", year: "2nd", section: "B", dob: "2003-08-22", email: "priya@college.edu", parentName: "Suresh Nair", parentEmail: "suresh@email.com", parentPhone: "9123456789", gender: "Female", faceRegistered: true, lastFaceUpdate: "2025-01-08", accuracy: 98.1, attendance: 91 },
  { id: "ST003", name: "Karthik Menon", dept: "MECH", year: "4th", section: "A", dob: "2001-12-03", email: "karthik@college.edu", parentName: "Gopi Menon", parentEmail: "gopi@email.com", parentPhone: "9988776655", gender: "Male", faceRegistered: true, lastFaceUpdate: "2025-01-05", accuracy: 96.7, attendance: 74 },
  { id: "ST004", name: "Sneha Reddy", dept: "CSE", year: "3rd", section: "A", dob: "2002-03-17", email: "sneha@college.edu", parentName: "Venkat Reddy", parentEmail: "venkat@email.com", parentPhone: "9871234567", gender: "Female", faceRegistered: false, lastFaceUpdate: null, accuracy: 0, attendance: 68 },
  { id: "ST005", name: "Rahul Gupta", dept: "IT", year: "1st", section: "C", dob: "2004-07-29", email: "rahul@college.edu", parentName: "Anil Gupta", parentEmail: "anil@email.com", parentPhone: "9001122334", gender: "Male", faceRegistered: true, lastFaceUpdate: "2025-01-12", accuracy: 99.0, attendance: 95 },
  { id: "ST006", name: "Divya Krishnan", dept: "ECE", year: "2nd", section: "A", dob: "2003-11-08", email: "divya@college.edu", parentName: "Murali Krishnan", parentEmail: "murali@email.com", parentPhone: "9765432100", gender: "Female", faceRegistered: true, lastFaceUpdate: "2025-01-11", accuracy: 97.8, attendance: 88 },
  { id: "ST007", name: "Vikram Patel", dept: "MECH", year: "1st", section: "B", dob: "2004-02-14", email: "vikram@college.edu", parentName: "Sunil Patel", parentEmail: "sunil@email.com", parentPhone: "9654321098", gender: "Male", faceRegistered: true, lastFaceUpdate: "2025-01-09", accuracy: 95.4, attendance: 79 },
  { id: "ST008", name: "Meera Iyer", dept: "IT", year: "4th", section: "C", dob: "2001-06-25", email: "meera@college.edu", parentName: "Pradeep Iyer", parentEmail: "pradeep@email.com", parentPhone: "9543210987", gender: "Female", faceRegistered: true, lastFaceUpdate: "2025-01-07", accuracy: 98.6, attendance: 93 },
];

const MOCK_PERIODS = [
  { id: "P001", name: "Period 1", subject: "Data Structures", startTime: "09:00", endTime: "10:00", dept: "CSE", year: "3rd", section: "A" },
  { id: "P002", name: "Period 2", subject: "DBMS", startTime: "10:15", endTime: "11:15", dept: "CSE", year: "3rd", section: "A" },
  { id: "P003", name: "Period 3", subject: "OS Lab", startTime: "11:30", endTime: "01:00", dept: "CSE", year: "3rd", section: "A" },
  { id: "P004", name: "Period 4", subject: "Computer Networks", startTime: "02:00", endTime: "03:00", dept: "ECE", year: "2nd", section: "B" },
  { id: "P005", name: "Tutorial", subject: "Mathematics", startTime: "03:15", endTime: "04:15", dept: "MECH", year: "1st", section: "B" },
];

const MOCK_ATTENDANCE = [
  { id: "A001", studentId: "ST001", periodId: "P001", date: "2025-01-15", status: "Present", time: "09:03", confidence: 97.3 },
  { id: "A002", studentId: "ST002", periodId: "P001", date: "2025-01-15", status: "Present", time: "09:01", confidence: 98.1 },
  { id: "A003", studentId: "ST003", periodId: "P001", date: "2025-01-15", status: "Absent", time: null, confidence: null },
  { id: "A004", studentId: "ST001", periodId: "P002", date: "2025-01-15", status: "Present", time: "10:17", confidence: 96.8 },
  { id: "A005", studentId: "ST004", periodId: "P002", date: "2025-01-15", status: "Late", time: "10:32", confidence: 94.2 },
  { id: "A006", studentId: "ST005", periodId: "P001", date: "2025-01-14", status: "Present", time: "09:02", confidence: 99.0 },
  { id: "A007", studentId: "ST001", periodId: "P001", date: "2025-01-14", status: "Absent", time: null, confidence: null },
  { id: "A008", studentId: "ST006", periodId: "P004", date: "2025-01-15", status: "Present", time: "14:03", confidence: 97.8 },
];

const MOCK_LEAVES = [
  { id: "L001", studentId: "ST003", studentName: "Karthik Menon", date: "2025-01-20", reason: "Medical appointment - follow-up checkup at CMC Hospital", status: "Pending", attachment: null, remarks: "" },
  { id: "L002", studentId: "ST001", studentName: "Arjun Sharma", date: "2025-01-22", reason: "Family function - sister's wedding ceremony", status: "Approved", attachment: null, remarks: "Approved. Kindly submit notes for missed classes." },
  { id: "L003", studentId: "ST004", studentName: "Sneha Reddy", date: "2025-01-18", reason: "Fever and cold", status: "Rejected", attachment: null, remarks: "Medical certificate required for approval." },
  { id: "L004", studentId: "ST007", studentName: "Vikram Patel", date: "2025-01-25", reason: "Sports selection trials - state level cricket", status: "Pending", attachment: null, remarks: "" },
  { id: "L005", studentId: "ST002", studentName: "Priya Nair", date: "2025-01-21", reason: "Parents visiting from abroad", status: "Approved", attachment: null, remarks: "Approved. Ensure assignments are completed." },
];

const MOCK_ANNOUNCEMENTS = [
  { id: "AN001", title: "Internal Assessment Exam Schedule", description: "IA Exams for Semester 6 will be conducted from January 28th to February 3rd. Students must carry their ID cards. No late entry will be permitted. Seating arrangement will be displayed on the college notice board.", priority: "High", date: "2025-01-13", readBy: ["ST002", "ST005"] },
  { id: "AN002", title: "Republic Day Holiday", description: "The college will remain closed on January 26th on account of Republic Day. Classes will resume on January 27th (Monday) as per the normal schedule.", priority: "Medium", date: "2025-01-10", readBy: ["ST001", "ST002", "ST003", "ST004"] },
  { id: "AN003", title: "Assignment Submission Deadline", description: "All assignments for Data Structures (CSE 3A) must be submitted by January 20th, 5:00 PM without fail. Late submissions will not be accepted under any circumstances.", priority: "High", date: "2025-01-12", readBy: ["ST001"] },
  { id: "AN004", title: "Sports Day Registration Open", description: "Registrations for Annual Sports Day 2025 are now open. Students interested in participating in track & field, team sports, or cultural events can register at the Sports Department Office (Block C, Room 104) before January 22nd.", priority: "Low", date: "2025-01-08", readBy: [] },
];

const MONTHLY_DATA = [
  { month: "Aug", present: 88, absent: 12 }, { month: "Sep", present: 85, absent: 15 },
  { month: "Oct", present: 91, absent: 9 }, { month: "Nov", present: 79, absent: 21 },
  { month: "Dec", present: 76, absent: 24 }, { month: "Jan", present: 83, absent: 17 },
];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = {
    Present: { bg: C.successLight, color: C.success },
    Absent: { bg: C.dangerLight, color: C.danger },
    Late: { bg: C.warningLight, color: C.warning },
    Pending: { bg: C.warningLight, color: C.warning },
    Approved: { bg: C.successLight, color: C.success },
    Rejected: { bg: C.dangerLight, color: C.danger },
    High: { bg: C.dangerLight, color: C.danger },
    Medium: { bg: C.warningLight, color: C.warning },
    Low: { bg: C.primaryLight, color: C.primary },
    Registered: { bg: C.successLight, color: C.success },
    Unregistered: { bg: C.dangerLight, color: C.danger },
  };
  const s = map[status] || { bg: C.gray100, color: C.gray600 };
  return (
    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
};

const StatCard = ({ icon, label, value, sub, color = C.primary, trend }) => (
  <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "20px", display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: color + "1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      {trend && <span style={{ fontSize: 12, color: trend > 0 ? C.success : C.danger, fontWeight: 600 }}>{trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: C.gray900 }}>{value}</div>
    <div style={{ fontSize: 13, color: C.gray500 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: C.gray400 }}>{sub}</div>}
  </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, required, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: C.gray700 }}>{label}{required && <span style={{ color: C.danger }}> *</span>}</label>}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ padding: "9px 12px", border: `1px solid ${C.gray300}`, borderRadius: 8, fontSize: 14, color: C.gray900, outline: "none", background: C.white, width: "100%", boxSizing: "border-box" }}
    />
  </div>
);

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: C.gray700 }}>{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ padding: "9px 12px", border: `1px solid ${C.gray300}`, borderRadius: 8, fontSize: 14, color: C.gray900, background: C.white, outline: "none", width: "100%", boxSizing: "border-box" }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Button = ({ children, onClick, variant = "primary", size = "md", disabled, style = {} }) => {
  const variants = {
    primary: { background: C.primary, color: C.white, border: "none" },
    secondary: { background: C.white, color: C.gray700, border: `1px solid ${C.gray300}` },
    success: { background: C.success, color: C.white, border: "none" },
    danger: { background: C.danger, color: C.white, border: "none" },
    ghost: { background: "transparent", color: C.primary, border: `1px solid ${C.primary}` },
  };
  const sizes = { sm: { padding: "6px 12px", fontSize: 12 }, md: { padding: "9px 18px", fontSize: 14 }, lg: { padding: "12px 24px", fontSize: 15 } };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...variants[variant], ...sizes[size], borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", ...style }}
    >
      {children}
    </button>
  );
};

const Modal = ({ open, onClose, title, children, width = 560 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.white, borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.gray900 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.gray500, padding: "0 4px" }}>✕</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: { bg: C.success, icon: "✓" }, error: { bg: C.danger, icon: "✕" }, info: { bg: C.primary, icon: "ℹ" }, warning: { bg: C.warning, icon: "⚠" } };
  const c = colors[type];
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, background: c.bg, color: C.white, padding: "12px 20px", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, zIndex: 2000, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: 360 }}>
      <span style={{ fontSize: 16 }}>{c.icon}</span>
      {message}
      <button onClick={onClose} style={{ background: "none", border: "none", color: C.white, cursor: "pointer", marginLeft: 8, opacity: 0.7 }}>✕</button>
    </div>
  );
};

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [role, setRole] = useState("teacher");
  const [form, setForm] = useState({ email: "", password: "", regNo: "", dob: "", parentEmail: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "teacher", label: "Teacher / Admin", icon: "👨‍🏫", color: C.primary },
    { id: "student", label: "Student", icon: "🎓", color: C.teal },
    { id: "parent", label: "Parent", icon: "👨‍👩‍👧", color: C.purple },
  ];

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (role === "teacher") {
      if (form.email === "admin@college.edu" && form.password === "admin123") {
        onLogin({ role: "teacher", name: "Dr. Anitha Suresh", email: form.email });
      } else setError("Invalid credentials. Use admin@college.edu / admin123");
    } else if (role === "student") {
      const s = MOCK_STUDENTS.find(s => s.id === form.regNo);
      if (s && form.dob === s.dob) onLogin({ role: "student", ...s });
      else setError("Invalid registration number or date of birth.");
    } else {
      const s = MOCK_STUDENTS.find(s => s.parentEmail === form.parentEmail && s.id === form.regNo);
      if (s) onLogin({ role: "parent", name: s.parentName, email: s.parentEmail, studentId: s.id });
      else setError("Invalid parent email or student registration number.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.gray900} 0%, #1E3A5F 50%, ${C.gray900} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: C.white, borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 480, boxShadow: "0 25px 80px rgba(0,0,0,0.35)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.gray900, margin: 0 }}>Smart Attendance System</h1>
          <p style={{ fontSize: 14, color: C.gray500, marginTop: 6 }}>AI-Powered Face Recognition Attendance</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 28 }}>
          {roles.map(r => (
            <button key={r.id} onClick={() => { setRole(r.id); setError(""); }} style={{ padding: "12px 8px", borderRadius: 10, border: `2px solid ${role === r.id ? r.color : C.gray200}`, background: role === r.id ? r.color + "12" : C.white, cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
              <div style={{ fontSize: 22 }}>{r.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: role === r.id ? r.color : C.gray600, marginTop: 4 }}>{r.label}</div>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {role === "teacher" && <>
            <Input label="Email Address" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="admin@college.edu" />
            <Input label="Password" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="••••••••" />
            <div style={{ fontSize: 12, color: C.gray400, textAlign: "right" }}>Demo: admin@college.edu / admin123</div>
          </>}
          {role === "student" && <>
            <Input label="Registration Number" value={form.regNo} onChange={v => setForm(f => ({ ...f, regNo: v }))} placeholder="e.g. ST001" />
            <Input label="Date of Birth" type="date" value={form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} />
            <div style={{ fontSize: 12, color: C.gray400 }}>Demo: ST001 / DOB: 2002-05-14</div>
          </>}
          {role === "parent" && <>
            <Input label="Parent Email" type="email" value={form.parentEmail} onChange={v => setForm(f => ({ ...f, parentEmail: v }))} placeholder="your@email.com" />
            <Input label="Student Registration Number" value={form.regNo} onChange={v => setForm(f => ({ ...f, regNo: v }))} placeholder="e.g. ST001" />
            <div style={{ fontSize: 12, color: C.gray400 }}>Demo: ravi@email.com / ST001</div>
          </>}
          {error && <div style={{ background: C.dangerLight, color: C.danger, padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500 }}>⚠ {error}</div>}
          <Button onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
            {loading ? "Signing in…" : `Sign in as ${roles.find(r => r.id === role)?.label}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const TEACHER_MENU = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "students", label: "Students", icon: "👥" },
  { id: "face-registration", label: "Face Registration", icon: "📸" },
  { id: "periods", label: "Periods", icon: "🕐" },
  { id: "attendance", label: "Take Attendance", icon: "✅" },
  { id: "attendance-records", label: "Attendance Records", icon: "📋" },
  { id: "leaves", label: "Leave Requests", icon: "📝" },
  { id: "reports", label: "Reports", icon: "📈" },
  { id: "announcements", label: "Announcements", icon: "📢" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
];
const STUDENT_MENU = [
  { id: "student-dashboard", label: "Dashboard", icon: "📊" },
  { id: "my-attendance", label: "My Attendance", icon: "✅" },
  { id: "leave-request", label: "Leave Request", icon: "📝" },
  { id: "announcements-view", label: "Announcements", icon: "📢" },
  { id: "my-profile", label: "Profile", icon: "👤" },
];
const PARENT_MENU = [
  { id: "parent-dashboard", label: "Dashboard", icon: "📊" },
  { id: "child-attendance", label: "Child Attendance", icon: "✅" },
  { id: "leave-status", label: "Leave Status", icon: "📝" },
  { id: "parent-announcements", label: "Announcements", icon: "📢" },
];

const Sidebar = ({ role, active, onNavigate, user, onLogout }) => {
  const menu = role === "teacher" ? TEACHER_MENU : role === "student" ? STUDENT_MENU : PARENT_MENU;
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div style={{ width: collapsed ? 68 : 240, background: C.sidebarBg, height: "100vh", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width 0.25s", overflow: "hidden" }}>
      <div style={{ padding: collapsed ? "16px 12px" : "20px 16px", borderBottom: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between" }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.white }}>EduTrack</div>
            <div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>{role === "teacher" ? "Admin Panel" : role === "student" ? "Student Portal" : "Parent Portal"}</div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "none", color: C.gray400, cursor: "pointer", fontSize: 18, padding: 4 }}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {menu.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: collapsed ? 0 : 10, padding: collapsed ? "11px 14px" : "11px 12px", borderRadius: 8, marginBottom: 3, background: active === item.id ? C.sidebarActive : "transparent", color: active === item.id ? C.white : C.gray400, border: "none", cursor: "pointer", fontSize: 13, fontWeight: active === item.id ? 600 : 400, textAlign: "left", justifyContent: collapsed ? "center" : "flex-start", whiteSpace: "nowrap", transition: "background 0.15s" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: collapsed ? "16px 8px" : "16px", borderTop: `1px solid rgba(255,255,255,0.08)` }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {user?.name?.charAt(0) || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.white, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: C.gray500, textTransform: "capitalize" }}>{role}</div>
            </div>
          </div>
        )}
        <button onClick={onLogout} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: collapsed ? "9px 0" : "9px 12px", color: C.gray400, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 8 }}>
          <span>🚪</span>{!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
};

// ─── PAGE HEADER ──────────────────────────────────────────────────────────────
const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: C.gray900, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 14, color: C.gray500, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>}
  </div>
);

// ─── BAR CHART ────────────────────────────────────────────────────────────────
const MiniBarChart = ({ data, height = 180 }) => {
  const max = Math.max(...data.map(d => d.present + d.absent));
  return (
    <div style={{ height, display: "flex", alignItems: "flex-end", gap: 8, padding: "0 4px" }}>
      {data.map((d, i) => {
        const total = d.present + d.absent;
        const pct = total > 0 ? (d.present / total) * 100 : 0;
        const barH = (total / max) * (height - 28);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, color: C.gray500, fontWeight: 600 }}>{Math.round(pct)}%</div>
            <div style={{ width: "100%", height: barH, borderRadius: 4, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ background: C.danger, height: `${100 - pct}%`, opacity: 0.5 }} />
              <div style={{ background: C.primary, height: `${pct}%` }} />
            </div>
            <div style={{ fontSize: 11, color: C.gray500 }}>{d.month}</div>
          </div>
        );
      })}
    </div>
  );
};

// ─── TEACHER DASHBOARD ────────────────────────────────────────────────────────
const TeacherDashboard = ({ showToast }) => {
  const presentToday = MOCK_ATTENDANCE.filter(a => a.date === "2025-01-15" && a.status === "Present").length;
  const absentToday = MOCK_ATTENDANCE.filter(a => a.date === "2025-01-15" && a.status === "Absent").length;
  const pendingLeaves = MOCK_LEAVES.filter(l => l.status === "Pending").length;
  const avgAtt = Math.round(MOCK_STUDENTS.reduce((sum, s) => sum + s.attendance, 0) / MOCK_STUDENTS.length);
  const lowAtt = MOCK_STUDENTS.filter(s => s.attendance < 75).length;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Welcome back! Today is ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Total Students" value={MOCK_STUDENTS.length} color={C.primary} />
        <StatCard icon="✅" label="Present Today" value={presentToday} sub="Across all periods" color={C.success} trend={3} />
        <StatCard icon="❌" label="Absent Today" value={absentToday} color={C.danger} trend={-8} />
        <StatCard icon="📊" label="Avg Attendance" value={`${avgAtt}%`} color={C.teal} />
        <StatCard icon="📝" label="Pending Leaves" value={pendingLeaves} color={C.warning} />
        <StatCard icon="⚠️" label="Low Attendance" value={lowAtt} sub="Below 75%" color={C.danger} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.gray800, marginBottom: 16, marginTop: 0 }}>Monthly Attendance Trend</h3>
          <MiniBarChart data={MONTHLY_DATA} height={200} />
          <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.gray600 }}><div style={{ width: 12, height: 12, background: C.primary, borderRadius: 2 }} /> Present</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.gray600 }}><div style={{ width: 12, height: 12, background: C.danger, opacity: 0.5, borderRadius: 2 }} /> Absent</div>
          </div>
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.gray800, marginBottom: 16, marginTop: 0 }}>Student Attendance Overview</h3>
          {MOCK_STUDENTS.slice(0, 6).map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.primary, flexShrink: 0 }}>{s.name.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.gray800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                <div style={{ height: 6, background: C.gray100, borderRadius: 3, marginTop: 4 }}>
                  <div style={{ height: "100%", borderRadius: 3, background: s.attendance >= 85 ? C.success : s.attendance >= 75 ? C.warning : C.danger, width: `${s.attendance}%` }} />
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: s.attendance >= 85 ? C.success : s.attendance >= 75 ? C.warning : C.danger, minWidth: 40 }}>{s.attendance}%</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.gray800, marginBottom: 12, marginTop: 0 }}>Recent Leave Requests</h3>
          {MOCK_LEAVES.slice(0, 4).map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.gray100}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.gray800 }}>{l.studentName}</div>
                <div style={{ fontSize: 12, color: C.gray500 }}>{l.date} · {l.reason.substring(0, 40)}…</div>
              </div>
              <Badge status={l.status} />
            </div>
          ))}
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: C.gray800, marginBottom: 12, marginTop: 0 }}>Recent Announcements</h3>
          {MOCK_ANNOUNCEMENTS.slice(0, 3).map(a => (
            <div key={a.id} style={{ padding: "10px 0", borderBottom: `1px solid ${C.gray100}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Badge status={a.priority} />
                <span style={{ fontSize: 12, color: C.gray400 }}>{a.date}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.gray800 }}>{a.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── STUDENTS PAGE ─────────────────────────────────────────────────────────────
const StudentsPage = ({ showToast, onNavigate }) => {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [form, setForm] = useState({ name: "", id: "", dept: "CSE", year: "1st", section: "A", dob: "", email: "", parentName: "", parentEmail: "", parentPhone: "", gender: "Male" });

  const filtered = students.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)) &&
    (!dept || s.dept === dept)
  );

  const handleAdd = () => {
    if (!form.name || !form.id || !form.dob || !form.email) { showToast("Please fill all required fields.", "error"); return; }
    if (students.find(s => s.id === form.id)) { showToast("Registration number already exists.", "error"); return; }
    setStudents(prev => [...prev, { ...form, faceRegistered: false, lastFaceUpdate: null, accuracy: 0, attendance: 0 }]);
    setShowAdd(false);
    showToast(`Student ${form.name} added successfully.`);
    setForm({ name: "", id: "", dept: "CSE", year: "1st", section: "A", dob: "", email: "", parentName: "", parentEmail: "", parentPhone: "", gender: "Male" });
  };

  return (
    <div>
      <PageHeader title="Student Management" subtitle={`${filtered.length} students found`}
        actions={<Button onClick={() => setShowAdd(true)}>+ Add Student</Button>} />
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by name or reg. number…" style={{ flex: 1, minWidth: 200, padding: "9px 12px", border: `1px solid ${C.gray300}`, borderRadius: 8, fontSize: 14, outline: "none" }} />
        <select value={dept} onChange={e => setDept(e.target.value)} style={{ padding: "9px 12px", border: `1px solid ${C.gray300}`, borderRadius: 8, fontSize: 14 }}>
          <option value="">All Departments</option>
          {["CSE", "ECE", "MECH", "IT"].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.gray50, borderBottom: `1px solid ${C.gray200}` }}>
              {["Reg. No.", "Student", "Dept / Year", "Section", "Attendance", "Face Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: C.gray600, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: C.primary }}>{s.id}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.primary }}>{s.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.gray900 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: C.gray500 }}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: C.gray700 }}>{s.dept} / {s.year}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: C.gray700 }}>Sec {s.section}</td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 60, height: 6, background: C.gray100, borderRadius: 3 }}>
                      <div style={{ height: "100%", borderRadius: 3, background: s.attendance >= 85 ? C.success : s.attendance >= 75 ? C.warning : C.danger, width: `${s.attendance}%` }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.attendance >= 85 ? C.success : s.attendance >= 75 ? C.warning : C.danger }}>{s.attendance}%</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <Badge status={s.faceRegistered ? "Registered" : "Unregistered"} />
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { showToast(`Viewing ${s.name}'s profile`); }} style={{ padding: "5px 10px", background: C.primaryLight, color: C.primary, border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>View</button>
                    <button onClick={() => onNavigate("face-registration")} style={{ padding: "5px 10px", background: s.faceRegistered ? C.successLight : C.warningLight, color: s.faceRegistered ? C.success : C.warning, border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                      {s.faceRegistered ? "Update Face" : "Register Face"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 48, color: C.gray400 }}>No students found matching your search.</div>}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Student" width={640}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
          <Input label="Registration Number" value={form.id} onChange={v => setForm(f => ({ ...f, id: v }))} required placeholder="e.g. ST009" />
          <Select label="Department" value={form.dept} onChange={v => setForm(f => ({ ...f, dept: v }))} options={["CSE", "ECE", "MECH", "IT"].map(d => ({ value: d, label: d }))} />
          <Select label="Year" value={form.year} onChange={v => setForm(f => ({ ...f, year: v }))} options={["1st", "2nd", "3rd", "4th"].map(y => ({ value: y, label: y }))} />
          <Select label="Section" value={form.section} onChange={v => setForm(f => ({ ...f, section: v }))} options={["A", "B", "C", "D"].map(s => ({ value: s, label: "Section " + s }))} />
          <Select label="Gender" value={form.gender} onChange={v => setForm(f => ({ ...f, gender: v }))} options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
          <Input label="Date of Birth" type="date" value={form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} required />
          <Input label="Student Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} required />
          <Input label="Parent Name" value={form.parentName} onChange={v => setForm(f => ({ ...f, parentName: v }))} />
          <Input label="Parent Email" type="email" value={form.parentEmail} onChange={v => setForm(f => ({ ...f, parentEmail: v }))} />
          <Input label="Parent Phone" value={form.parentPhone} onChange={v => setForm(f => ({ ...f, parentPhone: v }))} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
          <Button onClick={handleAdd}>Add Student</Button>
        </div>
      </Modal>
    </div>
  );
};

// ─── FACE REGISTRATION ────────────────────────────────────────────────────────
const FaceRegistrationPage = ({ showToast }) => {
  const [step, setStep] = useState("search");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [captureStep, setCaptureStep] = useState(0);
  const [done, setDone] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const CAPTURE_STEPS = [
    { label: "Front Face", icon: "😐", instruction: "Look directly at the camera" },
    { label: "Slight Left", icon: "😶", instruction: "Turn head slightly to the left" },
    { label: "Slight Right", icon: "😶‍🌫️", instruction: "Turn head slightly to the right" },
    { label: "Look Up", icon: "🙂", instruction: "Tilt head slightly upward" },
    { label: "Look Down", icon: "😑", instruction: "Tilt head slightly downward" },
  ];

  const filtered = MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search));

  const handleCapture = async () => {
    if (selected?.faceRegistered && !showConfirm) { setShowConfirm(true); return; }
    setShowConfirm(false);
    setCapturing(true);
    setProgress(0);
    setCaptureStep(0);
    for (let i = 0; i < CAPTURE_STEPS.length; i++) {
      setCaptureStep(i);
      for (let p = 0; p <= 100; p += 10) {
        await new Promise(r => setTimeout(r, 60));
        setProgress((i * 100 + p) / CAPTURE_STEPS.length);
      }
      await new Promise(r => setTimeout(r, 200));
    }
    setCapturing(false);
    setDone(true);
    showToast(`Face data for ${selected.name} registered successfully!`);
  };

  return (
    <div>
      <PageHeader title="Face Registration" subtitle="Register or update student face data for AI recognition" />
      {step === "search" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 16, color: C.gray800 }}>Find Student</h3>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by name or reg. number…" style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.gray300}`, borderRadius: 8, fontSize: 14, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />
            <div style={{ maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(s => (
                <div key={s.id} onClick={() => { setSelected(s); setDone(false); }} style={{ padding: "12px 14px", borderRadius: 10, border: `2px solid ${selected?.id === s.id ? C.primary : C.gray200}`, cursor: "pointer", background: selected?.id === s.id ? C.primaryLight : C.white, transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.primary }}>{s.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.gray900 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: C.gray500 }}>{s.id} · {s.dept} · {s.year} Yr · Sec {s.section}</div>
                    </div>
                    <Badge status={s.faceRegistered ? "Registered" : "Unregistered"} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
            {selected ? (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 16, color: C.gray800 }}>Student Details</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: 16, background: C.gray50, borderRadius: 10 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: C.primary }}>{selected.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.gray900 }}>{selected.name}</div>
                    <div style={{ fontSize: 13, color: C.gray500 }}>{selected.id} · {selected.dept} · {selected.year} Year</div>
                    {selected.faceRegistered && <div style={{ fontSize: 12, color: C.success, marginTop: 4 }}>✓ Face registered · Accuracy: {selected.accuracy}%</div>}
                  </div>
                </div>
                {done ? (
                  <div style={{ textAlign: "center", padding: 24, background: C.successLight, borderRadius: 12 }}>
                    <div style={{ fontSize: 48 }}>✅</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.success, marginTop: 8 }}>Face Successfully Registered!</div>
                    <div style={{ fontSize: 13, color: C.gray600, marginTop: 6 }}>5 face angles captured · Model trained · Accuracy: 97.8%</div>
                    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
                      <Button variant="secondary" onClick={() => { setDone(false); setSelected(null); setSearch(""); }}>Register Another</Button>
                      <Button onClick={() => setStep("search")}>Done</Button>
                    </div>
                  </div>
                ) : capturing ? (
                  <div>
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                      <div style={{ width: "100%", height: 180, background: "#111", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                          <div style={{ width: 80, height: 100, border: "2px solid #00FF88", borderRadius: "50% / 60%", boxShadow: "0 0 20px rgba(0,255,136,0.4)" }} />
                          <div style={{ color: "#00FF88", fontSize: 13, fontWeight: 700 }}>Face Detected</div>
                        </div>
                        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,255,136,0.15)", borderRadius: 6, padding: "4px 10px" }}>
                          <span style={{ color: "#00FF88", fontSize: 12, fontWeight: 700 }}>● LIVE</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                        <span style={{ color: C.gray700 }}>{CAPTURE_STEPS[captureStep]?.label}</span>
                        <span style={{ color: C.primary }}>{Math.round(progress)}%</span>
                      </div>
                      <div style={{ height: 8, background: C.gray100, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: C.primary, width: `${progress}%`, borderRadius: 4, transition: "width 0.1s" }} />
                      </div>
                      <div style={{ fontSize: 12, color: C.gray500, marginTop: 6 }}>{CAPTURE_STEPS[captureStep]?.instruction}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                      {CAPTURE_STEPS.map((s, i) => (
                        <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: i < captureStep ? C.successLight : i === captureStep ? C.primaryLight : C.gray100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: `2px solid ${i === captureStep ? C.primary : "transparent"}` }}>{s.icon}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {showConfirm && (
                      <div style={{ background: C.warningLight, border: `1px solid ${C.warning}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.warning, marginBottom: 6 }}>⚠ Replace existing face data?</div>
                        <div style={{ fontSize: 13, color: C.gray700, marginBottom: 12 }}>This will permanently replace the current face data for {selected.name}. Previous data cannot be recovered.</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Button variant="secondary" size="sm" onClick={() => setShowConfirm(false)}>Cancel</Button>
                          <Button variant="danger" size="sm" onClick={handleCapture}>Confirm Replace</Button>
                        </div>
                      </div>
                    )}
                    <div style={{ background: C.gray50, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.gray700, marginBottom: 10 }}>Capture Plan</div>
                      {CAPTURE_STEPS.map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: i < CAPTURE_STEPS.length - 1 ? `1px solid ${C.gray200}` : "none" }}>
                          <span style={{ fontSize: 20 }}>{s.icon}</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.gray800 }}>{s.label}</div>
                            <div style={{ fontSize: 12, color: C.gray500 }}>{s.instruction}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleCapture} style={{ width: "100%", justifyContent: "center" }}>
                      📸 {selected.faceRegistered ? "Update Face Data" : "Start Face Capture"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 300, color: C.gray400 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📸</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Select a student to begin</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Search and select a student from the left panel</div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ─── PERIODS PAGE ─────────────────────────────────────────────────────────────
const PeriodsPage = ({ showToast }) => {
  const [periods, setPeriods] = useState(MOCK_PERIODS);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", subject: "", startTime: "", endTime: "", dept: "CSE", year: "3rd", section: "A" });

  const handleSave = () => {
    if (!form.name || !form.subject) { showToast("Name and subject required.", "error"); return; }
    if (editItem) {
      setPeriods(prev => prev.map(p => p.id === editItem.id ? { ...editItem, ...form } : p));
      showToast("Period updated.");
    } else {
      setPeriods(prev => [...prev, { id: `P${String(prev.length + 1).padStart(3, "0")}`, ...form }]);
      showToast("Period added.");
    }
    setShowAdd(false);
    setEditItem(null);
    setForm({ name: "", subject: "", startTime: "", endTime: "", dept: "CSE", year: "3rd", section: "A" });
  };

  return (
    <div>
      <PageHeader title="Period Management" subtitle="Create and manage class periods" actions={<Button onClick={() => setShowAdd(true)}>+ Add Period</Button>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {periods.map(p => (
          <div key={p.id} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🕐</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.gray900 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: C.gray500 }}>{p.id}</div>
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[["Subject", p.subject], ["Department", p.dept], ["Year", p.year], ["Section", "Sec " + p.section], ["Start", p.startTime], ["End", p.endTime]].map(([k, v]) => (
                <div key={k} style={{ background: C.gray50, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 11, color: C.gray400, marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.gray800 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="secondary" size="sm" onClick={() => { setEditItem(p); setForm(p); setShowAdd(true); }}>✏ Edit</Button>
              <Button variant="danger" size="sm" onClick={() => { setPeriods(prev => prev.filter(x => x.id !== p.id)); showToast("Period deleted."); }}>🗑 Delete</Button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={showAdd} onClose={() => { setShowAdd(false); setEditItem(null); }} title={editItem ? "Edit Period" : "Add Period"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input label="Period Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Period 1" required />
          <Input label="Subject Name" value={form.subject} onChange={v => setForm(f => ({ ...f, subject: v }))} placeholder="e.g. Data Structures" required />
          <Input label="Start Time" type="time" value={form.startTime} onChange={v => setForm(f => ({ ...f, startTime: v }))} />
          <Input label="End Time" type="time" value={form.endTime} onChange={v => setForm(f => ({ ...f, endTime: v }))} />
          <Select label="Department" value={form.dept} onChange={v => setForm(f => ({ ...f, dept: v }))} options={["CSE", "ECE", "MECH", "IT"].map(d => ({ value: d, label: d }))} />
          <Select label="Year" value={form.year} onChange={v => setForm(f => ({ ...f, year: v }))} options={["1st", "2nd", "3rd", "4th"].map(y => ({ value: y, label: y }))} />
          <Select label="Section" value={form.section} onChange={v => setForm(f => ({ ...f, section: v }))} options={["A", "B", "C"].map(s => ({ value: s, label: "Section " + s }))} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => { setShowAdd(false); setEditItem(null); }}>Cancel</Button>
          <Button onClick={handleSave}>{editItem ? "Save Changes" : "Add Period"}</Button>
        </div>
      </Modal>
    </div>
  );
};

// ─── TAKE ATTENDANCE ──────────────────────────────────────────────────────────
const TakeAttendancePage = ({ showToast }) => {
  const [step, setStep] = useState("setup");
  const [config, setConfig] = useState({ dept: "CSE", year: "3rd", section: "A", period: "P001" });
  const [recognizing, setRecognizing] = useState(false);
  const [recognized, setRecognized] = useState([]);
  const [scanIdx, setScanIdx] = useState(0);
  const [attendanceList, setAttendanceList] = useState([]);
  const [done, setDone] = useState(false);

  const classStudents = MOCK_STUDENTS.filter(s => s.dept === config.dept && s.year === config.year && s.section === config.section);

  const startRecognition = async () => {
    setStep("recognition");
    setRecognizing(true);
    setRecognized([]);
    setScanIdx(0);
    const initialList = classStudents.map(s => ({ ...s, status: "Absent", time: null, confidence: null }));
    setAttendanceList(initialList);

    for (let i = 0; i < classStudents.length; i++) {
      setScanIdx(i);
      await new Promise(r => setTimeout(r, 1200));
      const s = classStudents[i];
      if (s.faceRegistered) {
        const shouldPresent = Math.random() > 0.25;
        if (shouldPresent) {
          const time = new Date();
          setRecognized(prev => [...prev, s]);
          setAttendanceList(prev => prev.map(a => a.id === s.id ? { ...a, status: "Present", time: `${time.getHours()}:${String(time.getMinutes()).padStart(2, "0")}`, confidence: s.accuracy } : a));
        }
      }
    }
    setRecognizing(false);
    setDone(true);
  };

  const handleManualChange = (id, status) => {
    setAttendanceList(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleSave = () => {
    showToast(`Attendance saved for ${attendanceList.filter(a => a.status === "Present").length} students.`);
    setStep("setup");
    setDone(false);
    setRecognized([]);
  };

  return (
    <div>
      <PageHeader title="Take Attendance" subtitle="AI face recognition attendance system" />
      {step === "setup" ? (
        <div style={{ maxWidth: 560 }}>
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 20, color: C.gray800 }}>Configure Session</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <Select label="Department" value={config.dept} onChange={v => setConfig(c => ({ ...c, dept: v }))} options={["CSE", "ECE", "MECH", "IT"].map(d => ({ value: d, label: d }))} />
              <Select label="Year" value={config.year} onChange={v => setConfig(c => ({ ...c, year: v }))} options={["1st", "2nd", "3rd", "4th"].map(y => ({ value: y, label: y }))} />
              <Select label="Section" value={config.section} onChange={v => setConfig(c => ({ ...c, section: v }))} options={["A", "B", "C"].map(s => ({ value: s, label: "Section " + s }))} />
              <Select label="Period" value={config.period} onChange={v => setConfig(c => ({ ...c, period: v }))} options={MOCK_PERIODS.map(p => ({ value: p.id, label: `${p.name} — ${p.subject}` }))} />
            </div>
            <div style={{ background: C.gray50, borderRadius: 10, padding: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: C.gray600 }}>
                <strong>{classStudents.length}</strong> students in {config.dept} · {config.year} Year · Section {config.section} ·{" "}
                <strong style={{ color: classStudents.filter(s => !s.faceRegistered).length > 0 ? C.warning : C.success }}>
                  {classStudents.filter(s => !s.faceRegistered).length} unregistered
                </strong>
              </div>
            </div>
            <Button onClick={startRecognition} style={{ width: "100%", justifyContent: "center", padding: "13px" }}>
              📸 Start Face Recognition Attendance
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16 }}>
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
            <div style={{ width: "100%", paddingBottom: "65%", background: "#0A0A0A", borderRadius: 12, position: "relative", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8 }}>
                {recognizing ? (
                  <>
                    <div style={{ width: 100, height: 120, border: "2px solid #00FF88", borderRadius: "50% / 60%", boxShadow: "0 0 30px rgba(0,255,136,0.5)", animation: "pulse 1.5s infinite" }} />
                    <div style={{ color: "#00FF88", fontSize: 13, fontWeight: 700 }}>Scanning…</div>
                    <div style={{ color: "#666", fontSize: 12 }}>{classStudents[scanIdx]?.name || ""}</div>
                  </>
                ) : done ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 36 }}>✅</div>
                    <div style={{ color: "#00FF88", fontSize: 14, fontWeight: 700, marginTop: 8 }}>Scan Complete</div>
                  </div>
                ) : null}
              </div>
              {recognizing && <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,255,136,0.15)", borderRadius: 6, padding: "4px 10px" }}><span style={{ color: "#00FF88", fontSize: 12, fontWeight: 700 }}>● LIVE</span></div>}
              {recognizing && <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 2 }}><div style={{ height: "100%", background: "#00FF88", width: `${(scanIdx / classStudents.length) * 100}%`, borderRadius: 2, transition: "width 0.3s" }} /></div>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div style={{ background: C.successLight, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.success }}>{attendanceList.filter(a => a.status === "Present").length}</div>
                <div style={{ fontSize: 11, color: C.gray500 }}>Present</div>
              </div>
              <div style={{ background: C.dangerLight, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.danger }}>{attendanceList.filter(a => a.status === "Absent").length}</div>
                <div style={{ fontSize: 11, color: C.gray500 }}>Absent</div>
              </div>
              <div style={{ background: C.primaryLight, borderRadius: 8, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>{classStudents.length}</div>
                <div style={{ fontSize: 11, color: C.gray500 }}>Total</div>
              </div>
            </div>
            {done && (
              <div style={{ marginTop: 16, display: "flex", gap: 10, flexDirection: "column" }}>
                <Button onClick={handleSave} style={{ justifyContent: "center" }}>💾 Save Attendance</Button>
                <Button variant="secondary" onClick={() => { setStep("setup"); setDone(false); }} style={{ justifyContent: "center" }}>← Back to Setup</Button>
              </div>
            )}
          </div>
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.gray800 }}>Attendance List</span>
              <span style={{ fontSize: 12, color: C.gray500 }}>Manual override available</span>
            </div>
            <div style={{ maxHeight: 450, overflowY: "auto" }}>
              {attendanceList.map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${C.gray100}`, background: i === scanIdx && recognizing ? C.primaryLight : "transparent", transition: "background 0.3s" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: s.status === "Present" ? C.successLight : C.gray100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: s.status === "Present" ? C.success : C.gray500 }}>{s.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.gray900 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: C.gray500 }}>{s.id} {s.confidence ? `· ${s.confidence}% confidence` : ""}</div>
                  </div>
                  <select value={s.status} onChange={e => handleManualChange(s.id, e.target.value)}
                    style={{ padding: "5px 8px", border: `1px solid ${C.gray300}`, borderRadius: 6, fontSize: 12, background: C.white, cursor: "pointer" }}>
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Late</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ATTENDANCE RECORDS ───────────────────────────────────────────────────────
const AttendanceRecordsPage = ({ showToast }) => {
  const [filter, setFilter] = useState({ dept: "", date: "2025-01-15", period: "" });
  const records = MOCK_ATTENDANCE.filter(a =>
    (!filter.date || a.date === filter.date) &&
    (!filter.period || a.periodId === filter.period)
  );

  const getPeriodName = id => MOCK_PERIODS.find(p => p.id === id)?.name || id;
  const getStudentName = id => MOCK_STUDENTS.find(s => s.id === id)?.name || id;

  return (
    <div>
      <PageHeader title="Attendance Records" subtitle="View and manage all attendance records" />
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 18, marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Input label="" type="date" value={filter.date} onChange={v => setFilter(f => ({ ...f, date: v }))} style={{ flex: 1, minWidth: 160 }} />
        <Select label="" value={filter.period} onChange={v => setFilter(f => ({ ...f, period: v }))} options={[{ value: "", label: "All Periods" }, ...MOCK_PERIODS.map(p => ({ value: p.id, label: p.name }))]} style={{ flex: 1, minWidth: 160 }} />
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", background: C.gray50, borderBottom: `1px solid ${C.gray200}`, display: "flex", gap: 16, fontSize: 13, fontWeight: 600 }}>
          <span style={{ color: C.success }}>✓ Present: {records.filter(r => r.status === "Present").length}</span>
          <span style={{ color: C.danger }}>✗ Absent: {records.filter(r => r.status === "Absent").length}</span>
          <span style={{ color: C.warning }}>⧗ Late: {records.filter(r => r.status === "Late").length}</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.gray50 }}>
              {["Student", "Reg. No.", "Period", "Date", "Time", "Status", "Confidence"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: C.gray600, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: C.gray900 }}>{getStudentName(r.studentId)}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.primary }}>{r.studentId}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.gray700 }}>{getPeriodName(r.periodId)}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.gray600 }}>{r.date}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.gray600 }}>{r.time || "—"}</td>
                <td style={{ padding: "12px 16px" }}><Badge status={r.status} /></td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: r.confidence ? C.success : C.gray400 }}>{r.confidence ? `${r.confidence}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <div style={{ textAlign: "center", padding: 48, color: C.gray400 }}>No records for selected filters.</div>}
      </div>
    </div>
  );
};

// ─── LEAVE MANAGEMENT ─────────────────────────────────────────────────────────
const LeavesPage = ({ showToast }) => {
  const [leaves, setLeaves] = useState(MOCK_LEAVES);
  const [filter, setFilter] = useState("all");
  const [showRemarks, setShowRemarks] = useState(null);
  const [remarks, setRemarks] = useState("");

  const filtered = leaves.filter(l => filter === "all" || l.status.toLowerCase() === filter);

  const handleAction = (id, action) => {
    if (action === "Approved" || action === "Rejected") {
      setShowRemarks(id);
    }
  };

  const handleConfirmAction = (id, action) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action, remarks } : l));
    setShowRemarks(null);
    setRemarks("");
    showToast(`Leave request ${action.toLowerCase()} and email sent to parent.`);
  };

  return (
    <div>
      <PageHeader title="Leave Requests" subtitle="Manage student leave applications" />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "approved", "rejected"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 16px", borderRadius: 20, border: `1px solid ${filter === s ? C.primary : C.gray300}`, background: filter === s ? C.primaryLight : C.white, color: filter === s ? C.primary : C.gray600, fontSize: 13, fontWeight: filter === s ? 700 : 400, cursor: "pointer", textTransform: "capitalize" }}>
            {s} {s === "pending" && <span style={{ background: C.warning, color: C.white, borderRadius: 10, padding: "1px 7px", fontSize: 11, marginLeft: 4 }}>{leaves.filter(l => l.status === "Pending").length}</span>}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(l => (
          <div key={l.id} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.primary }}>{l.studentName.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.gray900 }}>{l.studentName}</div>
                    <div style={{ fontSize: 12, color: C.gray500 }}>{l.studentId} · Leave Date: {l.date}</div>
                  </div>
                  <Badge status={l.status} />
                </div>
                <div style={{ background: C.gray50, borderRadius: 8, padding: "10px 14px", marginBottom: l.remarks ? 10 : 0 }}>
                  <div style={{ fontSize: 12, color: C.gray400, marginBottom: 4 }}>Reason</div>
                  <div style={{ fontSize: 13, color: C.gray800 }}>{l.reason}</div>
                </div>
                {l.remarks && (
                  <div style={{ background: l.status === "Approved" ? C.successLight : l.status === "Rejected" ? C.dangerLight : C.warningLight, borderRadius: 8, padding: "10px 14px", marginTop: 10 }}>
                    <div style={{ fontSize: 12, color: C.gray400, marginBottom: 4 }}>Remarks</div>
                    <div style={{ fontSize: 13, color: C.gray800 }}>{l.remarks}</div>
                  </div>
                )}
                {showRemarks === l.id && (
                  <div style={{ marginTop: 12 }}>
                    <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Add remarks (optional)…" rows={3}
                      style={{ width: "100%", padding: "8px 12px", border: `1px solid ${C.gray300}`, borderRadius: 8, fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <Button variant="success" size="sm" onClick={() => handleConfirmAction(l.id, "Approved")}>✓ Confirm Approve</Button>
                      <Button variant="danger" size="sm" onClick={() => handleConfirmAction(l.id, "Rejected")}>✕ Confirm Reject</Button>
                      <Button variant="secondary" size="sm" onClick={() => setShowRemarks(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
              {l.status === "Pending" && showRemarks !== l.id && (
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <Button variant="success" size="sm" onClick={() => handleAction(l.id, "Approved")}>✓ Approve</Button>
                  <Button variant="danger" size="sm" onClick={() => handleAction(l.id, "Rejected")}>✕ Reject</Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: 60, color: C.gray400, background: C.white, borderRadius: 12, border: `1px solid ${C.gray200}` }}>No leave requests in this category.</div>}
      </div>
    </div>
  );
};

// ─── REPORTS ──────────────────────────────────────────────────────────────────
const ReportsPage = ({ showToast }) => {
  const [reportType, setReportType] = useState("class");
  const [filter, setFilter] = useState({ dept: "CSE", year: "3rd", section: "A", from: "2025-01-01", to: "2025-01-31", regNo: "" });
  const [generated, setGenerated] = useState(false);

  const classStudents = MOCK_STUDENTS.filter(s => !filter.dept || s.dept === filter.dept);

  const handleGenerate = () => {
    setGenerated(true);
    showToast("Report generated successfully!");
  };

  const handleDownload = (fmt) => {
    showToast(`Downloading ${fmt} report…`, "info");
    setTimeout(() => showToast(`${fmt} report downloaded successfully.`), 1500);
  };

  return (
    <div>
      <PageHeader title="Attendance Reports" subtitle="Generate, filter, and download attendance reports" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16 }}>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20, height: "fit-content" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>Report Configuration</h3>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ id: "class", label: "Class Report" }, { id: "individual", label: "Individual" }].map(t => (
              <button key={t.id} onClick={() => setReportType(t.id)} style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: `2px solid ${reportType === t.id ? C.primary : C.gray200}`, background: reportType === t.id ? C.primaryLight : C.white, color: reportType === t.id ? C.primary : C.gray600, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>{t.label}</button>
            ))}
          </div>
          {reportType === "class" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Select label="Department" value={filter.dept} onChange={v => setFilter(f => ({ ...f, dept: v }))} options={["CSE", "ECE", "MECH", "IT"].map(d => ({ value: d, label: d }))} />
              <Select label="Year" value={filter.year} onChange={v => setFilter(f => ({ ...f, year: v }))} options={["1st", "2nd", "3rd", "4th"].map(y => ({ value: y, label: y }))} />
              <Select label="Section" value={filter.section} onChange={v => setFilter(f => ({ ...f, section: v }))} options={["A", "B", "C"].map(s => ({ value: s, label: "Section " + s }))} />
            </div>
          ) : (
            <Input label="Registration Number" value={filter.regNo} onChange={v => setFilter(f => ({ ...f, regNo: v }))} placeholder="e.g. ST001" />
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            <Input label="From Date" type="date" value={filter.from} onChange={v => setFilter(f => ({ ...f, from: v }))} />
            <Input label="To Date" type="date" value={filter.to} onChange={v => setFilter(f => ({ ...f, to: v }))} />
          </div>
          <Button onClick={handleGenerate} style={{ width: "100%", justifyContent: "center", marginTop: 20 }}>📊 Generate Report</Button>
        </div>

        {generated ? (
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.gray200}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.gray900 }}>Class Attendance Report</div>
                <div style={{ fontSize: 12, color: C.gray500 }}>{filter.dept} · {filter.year} Year · Sec {filter.section} · {filter.from} to {filter.to}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" size="sm" onClick={() => handleDownload("PDF")}>📄 PDF</Button>
                <Button variant="secondary" size="sm" onClick={() => handleDownload("Excel")}>📊 Excel</Button>
                <Button variant="secondary" size="sm" onClick={() => showToast("Sending to printer…", "info")}>🖨️ Print</Button>
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[["Total Students", classStudents.length, C.primary], ["Avg Attendance", `${Math.round(classStudents.reduce((s, x) => s + x.attendance, 0) / classStudents.length)}%`, C.success], ["Low Attendance", classStudents.filter(s => s.attendance < 75).length, C.danger], ["Full Attendance", classStudents.filter(s => s.attendance >= 95).length, C.teal]].map(([l, v, c]) => (
                  <div key={l} style={{ background: C.gray50, borderRadius: 8, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: c }}>{v}</div>
                    <div style={{ fontSize: 11, color: C.gray500, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.gray50 }}>
                    {["Reg. No.", "Name", "Present", "Absent", "Late", "%", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, color: C.gray600, textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map(s => {
                    const total = 30, present = Math.round(s.attendance * 0.3), absent = total - present, late = Math.floor(Math.random() * 3);
                    return (
                      <tr key={s.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                        <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: C.primary }}>{s.id}</td>
                        <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: "10px 12px", fontSize: 13, color: C.success }}>{present}</td>
                        <td style={{ padding: "10px 12px", fontSize: 13, color: C.danger }}>{absent}</td>
                        <td style={{ padding: "10px 12px", fontSize: 13, color: C.warning }}>{late}</td>
                        <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: s.attendance >= 75 ? C.success : C.danger }}>{s.attendance}%</td>
                        <td style={{ padding: "10px 12px" }}><Badge status={s.attendance >= 75 ? "Present" : "Absent"} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: 60, color: C.gray400 }}>
            <div style={{ fontSize: 52 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Configure and generate a report</div>
            <div style={{ fontSize: 13 }}>Use the panel on the left to set filters and generate</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────────
const AnnouncementsPage = ({ showToast, readOnly = false }) => {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });

  const handleAdd = () => {
    if (!form.title) { showToast("Title is required.", "error"); return; }
    setAnnouncements(prev => [{ id: `AN${Date.now()}`, ...form, date: new Date().toISOString().split("T")[0], readBy: [] }, ...prev]);
    setShowAdd(false);
    showToast("Announcement posted and notifications sent.");
    setForm({ title: "", description: "", priority: "Medium" });
  };

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Manage college announcements and notices"
        actions={!readOnly && <Button onClick={() => setShowAdd(true)}>+ New Announcement</Button>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {announcements.map(a => (
          <div key={a.id} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <Badge status={a.priority} />
                  <span style={{ fontSize: 12, color: C.gray400 }}>📅 {a.date}</span>
                  <span style={{ fontSize: 12, color: C.gray400 }}>👁 {a.readBy.length} read</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.gray900, marginBottom: 8 }}>{a.title}</div>
                <div style={{ fontSize: 14, color: C.gray600, lineHeight: 1.6 }}>{a.description}</div>
              </div>
              {!readOnly && (
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => { setAnnouncements(prev => prev.filter(x => x.id !== a.id)); showToast("Announcement deleted."); }}
                    style={{ padding: "6px 10px", background: C.dangerLight, color: C.danger, border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Announcement">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} required />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.gray700 }}>Description <span style={{ color: C.danger }}>*</span></label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
              style={{ padding: "9px 12px", border: `1px solid ${C.gray300}`, borderRadius: 8, fontSize: 14, resize: "vertical" }} />
          </div>
          <Select label="Priority" value={form.priority} onChange={v => setForm(f => ({ ...f, priority: v }))} options={["High", "Medium", "Low"].map(p => ({ value: p, label: p }))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Post Announcement</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
const NotificationsPage = ({ showToast }) => {
  const notifs = [
    { id: 1, type: "absence", icon: "❌", message: "Karthik Menon was absent in Period 1 on Jan 15.", time: "Today, 9:15 AM", read: false },
    { id: 2, type: "leave", icon: "📝", message: "New leave request from Vikram Patel for Jan 25.", time: "Today, 8:45 AM", read: false },
    { id: 3, type: "low-attendance", icon: "⚠️", message: "Sneha Reddy's attendance dropped below 75% (68%).", time: "Yesterday", read: true },
    { id: 4, type: "email", icon: "📧", message: "Email notification sent to parent of Karthik Menon.", time: "Jan 15, 9:17 AM", read: true },
    { id: 5, type: "face", icon: "📸", message: "Face data for Rahul Gupta updated successfully.", time: "Jan 12, 2:30 PM", read: true },
  ];
  return (
    <div>
      <PageHeader title="Notifications" subtitle="System alerts and activity log" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {notifs.map(n => (
          <div key={n.id} style={{ background: C.white, border: `1px solid ${n.read ? C.gray200 : C.primary + "40"}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 14, opacity: n.read ? 0.8 : 1 }}>
            {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, flexShrink: 0 }} />}
            <span style={{ fontSize: 22, flexShrink: 0 }}>{n.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: n.read ? 400 : 600, color: C.gray900 }}>{n.message}</div>
              <div style={{ fontSize: 12, color: C.gray400, marginTop: 3 }}>{n.time}</div>
            </div>
            {!n.read && <Button variant="ghost" size="sm" onClick={() => showToast("Marked as read.")}>Mark read</Button>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── STUDENT DASHBOARD ─────────────────────────────────────────────────────────
const StudentDashboard = ({ user }) => {
  const myLeaves = MOCK_LEAVES.filter(l => l.studentId === user.id);
  return (
    <div>
      <PageHeader title={`Hello, ${user.name.split(" ")[0]}!`} subtitle="Your attendance overview and quick links" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📊" label="Overall Attendance" value={`${user.attendance}%`} color={user.attendance >= 75 ? C.success : C.danger} />
        <StatCard icon="✅" label="Present Days" value={Math.round(user.attendance * 0.3)} color={C.success} />
        <StatCard icon="❌" label="Absent Days" value={30 - Math.round(user.attendance * 0.3)} color={C.danger} />
        <StatCard icon="📝" label="Pending Leaves" value={myLeaves.filter(l => l.status === "Pending").length} color={C.warning} />
      </div>
      <div style={{ background: user.attendance < 75 ? C.dangerLight : C.successLight, border: `1px solid ${user.attendance < 75 ? C.danger + "40" : C.success + "40"}`, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, fontWeight: 600, color: user.attendance < 75 ? C.danger : C.success }}>
        {user.attendance < 75 ? `⚠️ Warning: Your attendance is ${user.attendance}%, below the required 75%. Please attend classes regularly.` : `✅ Good standing: Your attendance is ${user.attendance}%, above the required 75%.`}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>Monthly Trend</h3>
          <MiniBarChart data={MONTHLY_DATA} />
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>My Leave Requests</h3>
          {myLeaves.length > 0 ? myLeaves.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.gray100}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{l.date}</div>
                <div style={{ fontSize: 12, color: C.gray500 }}>{l.reason.substring(0, 35)}…</div>
              </div>
              <Badge status={l.status} />
            </div>
          )) : <div style={{ color: C.gray400, fontSize: 13 }}>No leave requests.</div>}
        </div>
      </div>
    </div>
  );
};

// ─── MY ATTENDANCE (Student) ──────────────────────────────────────────────────
const MyAttendancePage = ({ user }) => {
  const myRecords = MOCK_ATTENDANCE.filter(a => a.studentId === user.id);
  const getPeriodName = id => MOCK_PERIODS.find(p => p.id === id)?.name || id;
  const getSubject = id => MOCK_PERIODS.find(p => p.id === id)?.subject || "";

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Detailed attendance records for all periods" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[["Present", myRecords.filter(r => r.status === "Present").length, C.success], ["Absent", myRecords.filter(r => r.status === "Absent").length, C.danger], ["Late", myRecords.filter(r => r.status === "Late").length, C.warning]].map(([l, v, c]) => (
          <div key={l} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 10, padding: "16px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: c }}>{v}</div>
            <div style={{ fontSize: 13, color: C.gray500 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.gray50 }}>
              {["Date", "Period", "Subject", "Time", "Status", "Confidence"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: C.gray600, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myRecords.length > 0 ? myRecords.map(r => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{r.date}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600 }}>{getPeriodName(r.periodId)}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: C.gray600 }}>{getSubject(r.periodId)}</td>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{r.time || "—"}</td>
                <td style={{ padding: "12px 16px" }}><Badge status={r.status} /></td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: r.confidence ? C.success : C.gray400 }}>{r.confidence ? `${r.confidence}%` : "—"}</td>
              </tr>
            )) : (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: C.gray400 }}>No attendance records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── LEAVE REQUEST (Student) ───────────────────────────────────────────────────
const LeaveRequestPage = ({ user, showToast }) => {
  const [leaves, setLeaves] = useState(MOCK_LEAVES.filter(l => l.studentId === user.id));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", reason: "" });

  const handleSubmit = () => {
    if (!form.date || !form.reason) { showToast("Date and reason required.", "error"); return; }
    setLeaves(prev => [...prev, { id: `L${Date.now()}`, studentId: user.id, studentName: user.name, date: form.date, reason: form.reason, status: "Pending", remarks: "" }]);
    setShowForm(false);
    showToast("Leave request submitted. Your parent will be notified of approval/rejection.");
    setForm({ date: "", reason: "" });
  };

  return (
    <div>
      <PageHeader title="Leave Requests" subtitle="Submit and track your leave applications"
        actions={<Button onClick={() => setShowForm(true)}>+ New Request</Button>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {leaves.map(l => (
          <div key={l.id} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <Badge status={l.status} />
                  <span style={{ fontSize: 13, color: C.gray500 }}>📅 {l.date}</span>
                </div>
                <div style={{ fontSize: 14, color: C.gray800 }}>{l.reason}</div>
                {l.remarks && <div style={{ fontSize: 13, color: C.gray600, marginTop: 6, background: C.gray50, padding: "8px 12px", borderRadius: 6 }}>Remarks: {l.remarks}</div>}
              </div>
            </div>
          </div>
        ))}
        {leaves.length === 0 && <div style={{ textAlign: "center", padding: 60, color: C.gray400, background: C.white, borderRadius: 12 }}>No leave requests yet.</div>}
      </div>
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Submit Leave Request">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Leave Date" type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} required />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.gray700 }}>Reason <span style={{ color: C.danger }}>*</span></label>
            <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} rows={4} placeholder="Briefly describe the reason for your leave…"
              style={{ padding: "9px 12px", border: `1px solid ${C.gray300}`, borderRadius: 8, fontSize: 14, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ─── STUDENT PROFILE ──────────────────────────────────────────────────────────
const StudentProfilePage = ({ user }) => (
  <div>
    <PageHeader title="My Profile" subtitle="Your personal and academic information" />
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, maxWidth: 700 }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800, color: C.primary }}>{user.name.charAt(0)}</div>
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 24 }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800, color: C.gray900 }}>{user.name}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["Registration No.", user.id], ["Department", user.dept], ["Year", user.year], ["Section", user.section], ["Date of Birth", user.dob], ["Gender", user.gender], ["Email", user.email], ["Attendance", `${user.attendance}%`]].map(([k, v]) => (
            <div key={k} style={{ background: C.gray50, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11, color: C.gray400, marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.gray800 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, background: user.faceRegistered ? C.successLight : C.dangerLight, borderRadius: 8, padding: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: user.faceRegistered ? C.success : C.danger }}>
            {user.faceRegistered ? `✅ Face Registered · Accuracy: ${user.accuracy}% · Last updated: ${user.lastFaceUpdate}` : "⚠️ Face not registered — contact your teacher"}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── PARENT DASHBOARD ─────────────────────────────────────────────────────────
const ParentDashboard = ({ user }) => {
  const child = MOCK_STUDENTS.find(s => s.id === user.studentId);
  if (!child) return <div>Child not found.</div>;

  return (
    <div>
      <PageHeader title={`Welcome, ${user.name}!`} subtitle={`Monitoring attendance for ${child.name}`} />
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: C.primary }}>{child.name.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.gray900 }}>{child.name}</div>
          <div style={{ fontSize: 14, color: C.gray500 }}>{child.id} · {child.dept} · {child.year} Year · Section {child.section}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: child.attendance >= 75 ? C.success : C.danger }}>{child.attendance}%</div>
          <div style={{ fontSize: 12, color: C.gray500 }}>Attendance</div>
        </div>
      </div>
      {child.attendance < 75 && (
        <div style={{ background: C.dangerLight, border: `1px solid ${C.danger + "40"}`, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, fontWeight: 600, color: C.danger }}>
          ⚠️ Low Attendance Alert: {child.name}'s attendance is {child.attendance}%, below the 75% minimum. Please ensure regular attendance.
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
        <StatCard icon="✅" label="Present Days" value={Math.round(child.attendance * 0.3)} color={C.success} />
        <StatCard icon="❌" label="Absent Days" value={30 - Math.round(child.attendance * 0.3)} color={C.danger} />
        <StatCard icon="📝" label="Leave Requests" value={MOCK_LEAVES.filter(l => l.studentId === child.id).length} color={C.warning} />
      </div>
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>Monthly Attendance Trend</h3>
        <MiniBarChart data={MONTHLY_DATA} height={200} />
      </div>
    </div>
  );
};

// ─── CHILD ATTENDANCE (Parent) ────────────────────────────────────────────────
const ChildAttendancePage = ({ user }) => {
  const child = MOCK_STUDENTS.find(s => s.id === user.studentId);
  const records = MOCK_ATTENDANCE.filter(a => a.studentId === user.studentId);
  const getPeriodName = id => MOCK_PERIODS.find(p => p.id === id)?.name || id;

  return (
    <div>
      <PageHeader title="Child Attendance" subtitle={child ? `Detailed records for ${child.name}` : ""} />
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.gray50 }}>
              {["Date", "Period", "Time", "Status", "Confidence"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 12, fontWeight: 700, color: C.gray600, textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id} style={{ borderBottom: `1px solid ${C.gray100}` }}>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{r.date}</td>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{getPeriodName(r.periodId)}</td>
                <td style={{ padding: "12px 16px", fontSize: 13 }}>{r.time || "—"}</td>
                <td style={{ padding: "12px 16px" }}><Badge status={r.status} /></td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: r.confidence ? C.success : C.gray400 }}>{r.confidence ? `${r.confidence}%` : "—"}</td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: C.gray400 }}>No records found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── LEAVE STATUS (Parent) ────────────────────────────────────────────────────
const LeaveStatusPage = ({ user }) => {
  const leaves = MOCK_LEAVES.filter(l => l.studentId === user.studentId);
  return (
    <div>
      <PageHeader title="Leave Status" subtitle="Track your child's leave requests" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {leaves.map(l => (
          <div key={l.id} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Badge status={l.status} />
              <span style={{ fontSize: 13, color: C.gray500 }}>📅 {l.date}</span>
            </div>
            <div style={{ fontSize: 14, color: C.gray800, marginBottom: l.remarks ? 8 : 0 }}>{l.reason}</div>
            {l.remarks && <div style={{ fontSize: 13, background: C.gray50, borderRadius: 6, padding: "8px 12px", color: C.gray600 }}>Teacher's Remarks: {l.remarks}</div>}
          </div>
        ))}
        {leaves.length === 0 && <div style={{ textAlign: "center", padding: 60, color: C.gray400, background: C.white, borderRadius: 12 }}>No leave requests found.</div>}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => setToast({ message, type, id: Date.now() }), []);

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "teacher" ? "dashboard" : u.role === "student" ? "student-dashboard" : "parent-dashboard");
  };

  const handleLogout = () => { setUser(null); setPage(null); };

  if (!user) return (
    <>
      <LoginScreen onLogin={handleLogin} />
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );

  const renderPage = () => {
    if (user.role === "teacher") {
      const props = { showToast, onNavigate: setPage };
      switch (page) {
        case "dashboard": return <TeacherDashboard showToast={showToast} />;
        case "students": return <StudentsPage {...props} />;
        case "face-registration": return <FaceRegistrationPage {...props} />;
        case "periods": return <PeriodsPage {...props} />;
        case "attendance": return <TakeAttendancePage {...props} />;
        case "attendance-records": return <AttendanceRecordsPage {...props} />;
        case "leaves": return <LeavesPage {...props} />;
        case "reports": return <ReportsPage {...props} />;
        case "announcements": return <AnnouncementsPage {...props} />;
        case "notifications": return <NotificationsPage {...props} />;
        default: return <TeacherDashboard showToast={showToast} />;
      }
    }
    if (user.role === "student") {
      switch (page) {
        case "student-dashboard": return <StudentDashboard user={user} />;
        case "my-attendance": return <MyAttendancePage user={user} />;
        case "leave-request": return <LeaveRequestPage user={user} showToast={showToast} />;
        case "announcements-view": return <AnnouncementsPage showToast={showToast} readOnly />;
        case "my-profile": return <StudentProfilePage user={user} />;
        default: return <StudentDashboard user={user} />;
      }
    }
    if (user.role === "parent") {
      switch (page) {
        case "parent-dashboard": return <ParentDashboard user={user} />;
        case "child-attendance": return <ChildAttendancePage user={user} />;
        case "leave-status": return <LeaveStatusPage user={user} />;
        case "parent-announcements": return <AnnouncementsPage showToast={showToast} readOnly />;
        default: return <ParentDashboard user={user} />;
      }
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.gray50, fontFamily: "Inter, system-ui, sans-serif", overflow: "hidden" }}>
      <Sidebar role={user.role} active={page} onNavigate={setPage} user={user} onLogout={handleLogout} />
      <main style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {renderPage()}
        </div>
      </main>
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}