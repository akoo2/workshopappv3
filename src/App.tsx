import React, { useState, useEffect, useMemo } from 'react';
import {
  Wrench,
  Package,
  Users,
  Shield,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  Plus,
  Search,
  Filter,
  DollarSign,
  Smartphone,
  Database,
  History,
  FileText,
  UserCheck,
  UserX,
  RefreshCw,
  Camera,
  Layers,
  ChevronRight,
  Globe,
  Clock,
  ArrowRight,
  X,
  Tv
} from 'lucide-react';

// --- TRANSLATIONS (English, Arabic, Kurdish Sorani) ---
type Language = 'en' | 'ar' | 'ckb';
type Role = 'TECH' | 'MANAGER' | 'ADMIN' | 'OWNER';

interface TranslationStrings {
  appName: string;
  tagline: string;
  dashboard: string;
  repairs: string;
  inventory: string;
  customers: string;
  staff: string;
  security: string;
  backups: string;
  activeRole: string;
  switchRole: string;
  language: string;
  online: string;
  offline: string;
  offlineTitle: string;
  offlineMessage: string;
  reconnect: string;
  simulateDrop: string;
  restoreConnection: string;
  newTicket: string;
  totalTickets: string;
  inProgress: string;
  readyPickup: string;
  lowStockAlert: string;
  lastBackupWarning: string;
  lastBackupTime: string;
  auditLog: string;
  sanitizedNotice: string;
  staffTitle: string;
  addStaff: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  active: string;
  disabled: string;
  locked: string;
  unlock: string;
  resetPassword: string;
  revokeSessions: string;
  privateNotes: string;
  cantDisableLastOwner: string;
  accessDenied: string;
  accessDeniedMsg: string;
  currencyRate: string;
}

const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: 'TV Repair Workshop',
    tagline: 'Professional Workshop OS',
    dashboard: 'Dashboard',
    repairs: 'Repairs & Workbench',
    inventory: 'Inventory & Parts',
    customers: 'Customers',
    staff: 'Staff Management',
    security: 'Security & Audit',
    backups: 'Backups & GPG',
    activeRole: 'Current Profile',
    switchRole: 'Switch Role',
    language: 'Language',
    online: 'Online',
    offline: 'Offline',
    offlineTitle: 'Connection Interrupted',
    offlineMessage: 'Network connection dropped. All edits are disabled until connection is restored.',
    reconnect: 'Check Connection',
    simulateDrop: 'Simulate Offline Drop',
    restoreConnection: 'Restore Connection',
    newTicket: 'Check-in New TV',
    totalTickets: 'Active Tickets',
    inProgress: 'On Bench',
    readyPickup: 'Ready for Pickup',
    lowStockAlert: 'Low Stock Parts',
    lastBackupWarning: 'Warning: Last successful backup is older than 36 hours!',
    lastBackupTime: 'Last Verified Backup',
    auditLog: 'Append-Only Audit Log',
    sanitizedNotice: 'Sensitive fields (passwords, tokens, sessions) are automatically scrubbed.',
    staffTitle: 'Staff Accounts & Permissions',
    addStaff: 'Add Staff Member',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    role: 'Role',
    status: 'Status',
    active: 'Active',
    disabled: 'Disabled',
    locked: 'Locked (Rate Limit)',
    unlock: 'Unlock Account',
    resetPassword: 'Force Password Reset',
    revokeSessions: 'Revoke All Sessions',
    privateNotes: 'Owner Private Notes',
    cantDisableLastOwner: 'Cannot demote or disable the last active Owner!',
    accessDenied: '403 Access Denied',
    accessDeniedMsg: 'Only the OWNER has permission to access Staff Management.',
    currencyRate: 'Exchange Rate'
  },
  ar: {
    appName: 'ورشة تصليح التلفزيونات',
    tagline: 'نظام إدارة الورشة المتكامل',
    dashboard: 'لوحة التحكم',
    repairs: 'طاولة التصليح',
    inventory: 'المخزن والقطع',
    customers: 'الزبائن',
    staff: 'إدارة الكادر',
    security: 'الأمان والتدقيق',
    backups: 'النسخ الاحتياطي',
    activeRole: 'الملف الحالي',
    switchRole: 'تبديل الدور',
    language: 'اللغة',
    online: 'متصل',
    offline: 'غير متصل',
    offlineTitle: 'انقطع الاتصال',
    offlineMessage: 'انقطع الاتصال بالخادم. تم إيقاف التعديلات مؤقتاً لحماية البيانات حتى عودة الاتصال.',
    reconnect: 'فحص الاتصال',
    simulateDrop: 'محاكاة انقطاع الإنترنت',
    restoreConnection: 'إعادة الاتصال',
    newTicket: 'استلام جهاز جديد',
    totalTickets: 'الأجهزة الحالية',
    inProgress: 'قيد الفحص',
    readyPickup: 'جاهز للاستلام',
    lowStockAlert: 'قطع منخفضة المخزون',
    lastBackupWarning: 'تحذير: مضى أكثر من 36 ساعة على آخر نسخة احتياطية ناجحة!',
    lastBackupTime: 'آخر نسخة احتياطية',
    auditLog: 'سجل التدقيق غير القابل للتعديل',
    sanitizedNotice: 'الحقول الحساسة (كلمات المرور والرموز) يتم حجبها أوتوماتيكياً.',
    staffTitle: 'حسابات وصلاحيات الكادر',
    addStaff: 'إضافة موظف جديد',
    fullName: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    role: 'الصلاحية',
    status: 'الحالة',
    active: 'نشط',
    disabled: 'معطل',
    locked: 'مقفل (محاولات فاشلة)',
    unlock: 'إلغاء القفل',
    resetPassword: 'إعادة تعيين كلمة المرور',
    revokeSessions: 'إنهاء كافة الجلسات',
    privateNotes: 'ملاحظات المالك الخاصة',
    cantDisableLastOwner: 'لا يمكن تعطيل أو تخفيض رتبة المالك الأخير النشط!',
    accessDenied: '403 تم رفض الوصول',
    accessDeniedMsg: 'المالك (OWNER) فقط يمتلك صلاحية الدخول لإدارة الكادر.',
    currencyRate: 'سعر الصرف'
  },
  ckb: {
    appName: 'وۆرکشۆپی تەلەفزیۆن',
    tagline: 'سیستەمی کارگێڕی وۆرکشۆپ',
    dashboard: 'داشبۆرد',
    repairs: 'چاککردنەوە و مێزی کار',
    inventory: 'مەخزەن و پارچەکان',
    customers: 'موشتەرییەکان',
    staff: 'بەڕێوەبردنی کارمەندان',
    security: 'ئاسایش و چاودێری',
    backups: 'پاشەکەوت و داتا',
    activeRole: 'ڕۆڵی ئێستا',
    switchRole: 'گۆڕینی ڕۆڵ',
    language: 'زمان',
    online: 'سەرهێڵ',
    offline: 'دەرەوەی هێڵ',
    offlineTitle: 'پەیوەندی پچڕا',
    offlineMessage: 'هێڵی ئینتەرنێت پچڕا. هەموو دەستکارییەکان ڕاگیراون تا هێڵ دەگەڕێتەوە.',
    reconnect: 'پشکنینی پەیوەندی',
    simulateDrop: 'تاقیکردنەوەی پچڕانی هێڵ',
    restoreConnection: 'گێڕانەوەی پەیوەندی',
    newTicket: 'وەرگرتنی ئامێری نوێ',
    totalTickets: 'ئامێرەکان',
    inProgress: 'لەژێر کاردایە',
    readyPickup: 'ئامادەیە بۆ وەرگرتنەوە',
    lowStockAlert: 'پارچەی کەمبووەوە',
    lastBackupWarning: 'ئاگاداری: زیاتر لە ٣٦ کاتژمێر تێپەڕیوە بەسەر دواین پاشەکەوتی سەرکەوتوودا!',
    lastBackupTime: 'دواین پاشەکەوتی دڵنیاکراو',
    auditLog: 'تۆماری چاودێری پارێزراو',
    sanitizedNotice: 'زانیارییە هەستیارەکان (وشەی نهێنی و تۆکنەکان) پاککراونەتەوە.',
    staffTitle: 'هەژمارەکانی کارمەندان',
    addStaff: 'زیادکردنی کارمەند',
    fullName: 'ناوی تەواو',
    email: 'ئیمەیڵ',
    phone: 'مۆبایل',
    role: 'ڕۆڵ',
    status: 'دۆخ',
    active: 'چالاک',
    disabled: 'ناچالاک',
    locked: 'قوفڵکراو',
    unlock: 'کردنەوەی قوفڵ',
    resetPassword: 'ڕێکخستنەوەی وشەی نهێنی',
    revokeSessions: 'داخستنی دانیشتنەکان',
    privateNotes: 'تێبینی تایبەتی خاوەن',
    cantDisableLastOwner: 'ناتوانی دواین خاوەنی چالاک ناچالاک بکەیت!',
    accessDenied: '403 ڕێپێنەدراو',
    accessDeniedMsg: 'تەنها خاوەن کار (OWNER) بۆی هەیە بەشی کارمەندان ببینێت.',
    currencyRate: 'نرخی ئاڵوگۆڕ'
  }
};

// --- INITIAL MOCK / SEED DATA ---
interface StaffUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  isLocked: boolean;
  activeSessions: number;
  notes: string[];
}

const initialStaff: StaffUser[] = [
  {
    id: 1,
    name: 'Mustafa K. (Primary Owner)',
    email: 'owner@workshop.local',
    phone: '+964 750 442 1100',
    role: 'OWNER',
    isActive: true,
    isLocked: false,
    activeSessions: 2,
    notes: ['Master workshop founder', 'Handles main supplier orders from Dubai']
  },
  {
    id: 2,
    name: 'Karwan Ahmed',
    email: 'karwan.admin@workshop.local',
    phone: '+964 770 123 4567',
    role: 'ADMIN',
    isActive: true,
    isLocked: false,
    activeSessions: 1,
    notes: ['Manages daily customer receivables and workshop shifts']
  },
  {
    id: 3,
    name: 'Sarmad Zaki',
    email: 'sarmad.m@workshop.local',
    phone: '+964 750 998 8776',
    role: 'MANAGER',
    isActive: true,
    isLocked: false,
    activeSessions: 1,
    notes: ['Front-desk coordinator']
  },
  {
    id: 4,
    name: 'Hemin Rebar',
    email: 'hemin.tech@workshop.local',
    phone: '+964 751 334 5566',
    role: 'TECH',
    isActive: true,
    isLocked: false,
    activeSessions: 1,
    notes: ['Specialist in Samsung LED strip replacements & COF bonding']
  }
];

interface RepairTicket {
  id: number;
  ticketNo: string;
  customerName: string;
  customerPhone: string;
  brand: string;
  model: string;
  serial: string;
  fault: string;
  diagnosis: string;
  status: 'CHECK_IN' | 'IN_PROGRESS' | 'READY_FOR_PICKUP' | 'PICKED_UP';
  currency: 'IQD' | 'USD';
  laborFee: number;
  partsTotal: number;
  techName: string;
  createdAt: string;
}

const initialRepairs: RepairTicket[] = [
  {
    id: 101,
    ticketNo: 'TICK-8021',
    customerName: 'Haidar Al-Bayati',
    customerPhone: '0780 112 3344',
    brand: 'Samsung',
    model: 'UA55AU7000UXZN',
    serial: 'SN-SAM-88910',
    fault: 'Dark shadow on right half of screen, sound works normal',
    diagnosis: 'Failed LED backlight strip channel #2. Diffuser intact.',
    status: 'IN_PROGRESS',
    currency: 'IQD',
    laborFee: 35000,
    partsTotal: 45000,
    techName: 'Hemin Rebar',
    createdAt: '2026-10-10 10:15'
  },
  {
    id: 102,
    ticketNo: 'TICK-8022',
    customerName: 'Shakar Kawa',
    customerPhone: '0750 882 9911',
    brand: 'LG',
    model: 'OLED65C2PSA',
    serial: 'SN-LG-002194',
    fault: 'Standby red light blinks twice then clicks off, no picture',
    diagnosis: 'Shorted 12V rail on Primary Power Supply Unit (EAY652)',
    status: 'READY_FOR_PICKUP',
    currency: 'USD',
    laborFee: 30,
    partsTotal: 55,
    techName: 'Hemin Rebar',
    createdAt: '2026-10-09 14:30'
  },
  {
    id: 103,
    ticketNo: 'TICK-8023',
    customerName: 'Zaid Farhan',
    customerPhone: '0771 445 6677',
    brand: 'Sony Bravia',
    model: 'KD-55X80K',
    serial: 'SN-SONY-7712',
    fault: 'Horizontal green lines appearing after 10 minutes warm up',
    diagnosis: 'Under inspection on bench #1',
    status: 'CHECK_IN',
    currency: 'IQD',
    laborFee: 25000,
    partsTotal: 0,
    techName: 'Hemin Rebar',
    createdAt: '2026-10-10 13:00'
  }
];

interface InventoryPart {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  costPriceUSD: number;
  sellingPriceUSD: number;
}

const initialParts: InventoryPart[] = [
  { id: 1, name: 'Samsung 55" AU7000 LED Backlight Set (5 Bars)', category: 'Backlight', quantity: 2, minStock: 3, costPriceUSD: 16, sellingPriceUSD: 30 },
  { id: 2, name: 'LG 65" C2 OLED PSU Board (EAY65249101)', category: 'Power Supply', quantity: 1, minStock: 1, costPriceUSD: 38, sellingPriceUSD: 65 },
  { id: 3, name: 'Sony Bravia T-Con Board 55X80K', category: 'T-Con', quantity: 4, minStock: 2, costPriceUSD: 22, sellingPriceUSD: 45 },
  { id: 4, name: 'Universal 45-65W TV Main Board TP.SK516S.PB801', category: 'Mainboard', quantity: 7, minStock: 5, costPriceUSD: 18, sellingPriceUSD: 32 }
];

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentRole, setCurrentRole] = useState<Role>('OWNER');
  const [activeTab, setActiveTab] = useState<'repairs' | 'inventory' | 'staff' | 'security' | 'backups'>('repairs');
  
  // Offline State Tracking
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastHeartbeat, setLastHeartbeat] = useState<string>('Just now');
  
  // Data State
  const [staffList, setStaffList] = useState<StaffUser[]>(initialStaff);
  const [repairsList, setRepairsList] = useState<RepairTicket[]>(initialRepairs);
  const [partsList, setPartsList] = useState<InventoryPart[]>(initialParts);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Notices
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedStaffUser, setSelectedStaffUser] = useState<StaffUser | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Exchange rate USD to IQD
  const exchangeRate = 1510; // 1 USD = 1,510 IQD

  const t = translations[lang];
  const isRtl = lang === 'ar' || lang === 'ckb';

  // Heartbeat polling loop (every 15 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isOnline) {
        setLastHeartbeat(new Date().toLocaleTimeString());
      }
    }, 15000);
    return () => clearInterval(timer);
  }, [isOnline]);

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Staff Protection Logic
  const handleToggleStaffStatus = (id: number) => {
    const userToEdit = staffList.find(s => s.id === id);
    if (!userToEdit) return;

    // RULE: Cannot disable last active Owner
    if (userToEdit.role === 'OWNER' && userToEdit.isActive) {
      const activeOwners = staffList.filter(s => s.role === 'OWNER' && s.isActive && s.id !== id);
      if (activeOwners.length === 0) {
        showFeedback(t.cantDisableLastOwner);
        return;
      }
    }

    setStaffList(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.isActive;
        return { ...s, isActive: nextState, activeSessions: nextState ? s.activeSessions : 0 };
      }
      return s;
    }));
    showFeedback(userToEdit.isActive ? 'Account disabled & all sessions revoked.' : 'Account reactivated.');
  };

  const handleRoleChange = (id: number, newRole: Role) => {
    const userToEdit = staffList.find(s => s.id === id);
    if (!userToEdit) return;

    // RULE: Cannot demote last active Owner
    if (userToEdit.role === 'OWNER' && newRole !== 'OWNER') {
      const otherOwners = staffList.filter(s => s.role === 'OWNER' && s.isActive && s.id !== id);
      if (otherOwners.length === 0) {
        showFeedback(t.cantDisableLastOwner);
        return;
      }
    }

    setStaffList(prev => prev.map(s => s.id === id ? { ...s, role: newRole } : s));
    showFeedback(`Role updated to ${newRole}. Active sessions refreshed.`);
  };

  const handleUnlockUser = (id: number) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, isLocked: false } : s));
    showFeedback('Login rate-limit lockout cleared by Owner.');
  };

  const handleRevokeSessions = (id: number) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, activeSessions: 0 } : s));
    showFeedback('All active browser sessions revoked.');
  };

  const handleAddNote = (id: number, note: string) => {
    if (!note.trim()) return;
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, notes: [note, ...s.notes] } : s));
    showFeedback('Private Owner note added.');
  };

  // Filtered lists
  const filteredRepairs = useMemo(() => {
    if (!searchQuery) return repairsList;
    const q = searchQuery.toLowerCase();
    return repairsList.filter(r => 
      r.ticketNo.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.brand.toLowerCase().includes(q) ||
      r.model.toLowerCase().includes(q)
    );
  }, [repairsList, searchQuery]);

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-900 font-sans ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* --- TOP APP HEADER --- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base leading-tight tracking-tight flex items-center gap-2">
                <span>{t.appName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  v2.4
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium">{t.tagline}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Heartbeat Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-slate-600 text-[11px] font-medium tabular-nums">
                {isOnline ? `Heartbeat: ${lastHeartbeat}` : t.offline}
              </span>
            </div>

            {/* Offline Simulation Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              title={isOnline ? t.simulateDrop : t.restoreConnection}
              className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                isOnline 
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100' 
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
              }`}
            >
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
              <span className="hidden md:inline">{isOnline ? t.online : t.offline}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative inline-block">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="en">English (EN)</option>
                <option value="ar">العربية (AR)</option>
                <option value="ckb">کوردی (CKB)</option>
              </select>
            </div>

            {/* Role Switcher (Simulates login as TECH, MANAGER, ADMIN, OWNER) */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
              <span className="text-[11px] text-slate-500 font-medium px-1.5 hidden lg:inline">{t.role}:</span>
              {(['OWNER', 'ADMIN', 'MANAGER', 'TECH'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`px-2 py-1 rounded text-xs font-bold transition cursor-pointer ${
                    currentRole === r
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* --- NOTICE TOAST --- */}
      {actionNotice && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-4 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl flex items-center justify-between border border-slate-800 transition">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- BACKUP 36H WARNING BANNER --- */}
      <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{t.lastBackupWarning} — {t.lastBackupTime}: 2026-10-09 02:00 UTC (GPG Encrypted).</span>
      </div>

      {/* --- MAIN WORKSPACE CONTAINER --- */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Navigation Tabs for Desktop & Tablets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-200 mb-6 text-sm">
          <button
            onClick={() => setActiveTab('repairs')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'repairs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>{t.repairs}</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-indigo-500/30 text-current">
              {repairsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t.inventory}</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'staff'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.staff}</span>
            {currentRole !== 'OWNER' && (
              <span className="px-1.5 py-0.5 text-[9px] rounded bg-red-100 text-red-700">
                Owner Only
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{t.security}</span>
          </button>

          <button
            onClick={() => setActiveTab('backups')}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'backups'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{t.backups}</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: REPAIRS & WORKBENCH                                                */}
        {/* ========================================================================= */}
        {activeTab === 'repairs' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="text"
                  placeholder="Search ticket #, brand, customer phone, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isRtl ? 'pr-10' : 'pl-10'
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.newTicket}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 font-semibold">{t.totalTickets}</div>
                <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">3 Active</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 font-semibold">{t.inProgress}</div>
                <div className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">1 Bench</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 font-semibold">{t.readyPickup}</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">1 Repaired</div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 font-semibold">{t.currencyRate}</div>
                <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">1$ = 1,510 د.ع</div>
              </div>
            </div>

            {/* Repair Cards List (Optimized for Mobile Screens) */}
            <div className="space-y-4">
              {filteredRepairs.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {ticket.ticketNo}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {ticket.brand} {ticket.model}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        ticket.status === 'READY_FOR_PICKUP'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ticket.status === 'IN_PROGRESS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{ticket.createdAt}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3 text-xs">
                    <div>
                      <span className="text-slate-500 block font-medium">Customer:</span>
                      <span className="font-bold text-slate-900">{ticket.customerName}</span>
                      <span className="text-slate-500 ml-2">({ticket.customerPhone})</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block font-medium">Reported Fault:</span>
                      <p className="text-slate-800 italic mt-0.5">{ticket.fault}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs">
                    <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                      <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Diagnosis & Bench Notes ({ticket.techName}):</span>
                    </div>
                    <div className="text-slate-900 font-medium">{ticket.diagnosis}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-slate-500">Labor:</span>{' '}
                        <span className="font-bold tabular-nums">
                          {ticket.currency === 'USD' ? `$${ticket.laborFee}` : `${ticket.laborFee.toLocaleString()} IQD`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Parts:</span>{' '}
                        <span className="font-bold tabular-nums">
                          {ticket.currency === 'USD' ? `$${ticket.partsTotal}` : `${ticket.partsTotal.toLocaleString()} IQD`}
                        </span>
                      </div>
                      <div className="text-indigo-700 font-bold border-l pl-3 ml-1">
                        Total: {ticket.currency === 'USD' 
                          ? `$${ticket.laborFee + ticket.partsTotal} (~${((ticket.laborFee + ticket.partsTotal) * exchangeRate).toLocaleString()} IQD)`
                          : `${(ticket.laborFee + ticket.partsTotal).toLocaleString()} IQD (~$${Math.round((ticket.laborFee + ticket.partsTotal) / exchangeRate)})`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showFeedback(`Photos for ${ticket.ticketNo} served via authorized secure endpoint.`)}
                        className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
                        title="Inspection Photos"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Photos (2)</span>
                      </button>

                      <button
                        onClick={() => {
                          setRepairsList(prev => prev.map(r => {
                            if (r.id === ticket.id) {
                              const next = r.status === 'CHECK_IN' ? 'IN_PROGRESS' : r.status === 'IN_PROGRESS' ? 'READY_FOR_PICKUP' : 'PICKED_UP';
                              return { ...r, status: next };
                            }
                            return r;
                          }));
                          showFeedback(`Status progressed for ticket ${ticket.ticketNo}.`);
                        }}
                        className="py-1.5 px-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition cursor-pointer"
                      >
                        Advance Workflow &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INVENTORY & PARTS                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t.inventory}</h2>
                <p className="text-xs text-slate-500">Real-time workshop spare parts stock with dual-currency valuation.</p>
              </div>
              <button
                onClick={() => showFeedback('Part stock intake recorded in stock_movements table.')}
                className="py-2 px-3.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Part Batch</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Part Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Cost (USD)</th>
                      <th className="py-3 px-4">Selling Price</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {partsList.map((part) => (
                      <tr key={part.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{part.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-600">
                            {part.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`font-bold tabular-nums px-2 py-0.5 rounded-full ${
                            part.quantity <= part.minStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {part.quantity} in stock
                          </span>
                        </td>
                        <td className="py-3.5 px-4 tabular-nums">${part.costPriceUSD}</td>
                        <td className="py-3.5 px-4 font-bold tabular-nums">
                          ${part.sellingPriceUSD} ({(part.sellingPriceUSD * exchangeRate).toLocaleString()} IQD)
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setPartsList(prev => prev.map(p => p.id === part.id ? { ...p, quantity: p.quantity + 1 } : p));
                              showFeedback(`Stock updated (+1) for ${part.name}`);
                            }}
                            className="py-1 px-2.5 rounded bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 transition cursor-pointer"
                          >
                            + Add Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: STAFF MANAGEMENT (OWNER ONLY - RBAC DEMO)                          */}
        {/* ========================================================================= */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            
            {/* 403 Access Denied Check if not OWNER */}
            {currentRole !== 'OWNER' ? (
              <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto shadow-sm">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t.accessDenied}</h3>
                <p className="text-xs text-slate-600 mb-6">{t.accessDeniedMsg}</p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 mb-4">
                  Your simulated role is <span className="font-bold text-slate-800 uppercase">{currentRole}</span>. Switch to <span className="font-bold text-indigo-600">OWNER</span> in the header to manage workshop staff.
                </div>
                <button
                  onClick={() => setCurrentRole('OWNER')}
                  className="py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                >
                  Switch Profile to OWNER
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{t.staffTitle}</h2>
                    <p className="text-xs text-slate-500">
                      Owner-exclusive control plane. All changes logged to append-only audit trail.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddStaffModal(true)}
                    className="py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addStaff}</span>
                  </button>
                </div>

                {/* Staff Cards List */}
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
                  {staffList.map((user) => (
                    <div key={user.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              user.role === 'OWNER' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                              user.role === 'MANAGER' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {user.role}
                            </span>
                            {!user.isActive && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                                {t.disabled}
                              </span>
                            )}
                            {user.isLocked && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                                {t.locked}
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                            <span>{user.email}</span>
                            <span aria-hidden="true">·</span>
                            <span>{user.phone}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums font-medium text-slate-700">
                              {user.activeSessions} active sessions
                            </span>
                          </div>

                          {/* Owner Private Notes Preview */}
                          {user.notes.length > 0 && (
                            <div className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100 inline-block">
                              Note: {user.notes[0]}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Staff Actions Bar */}
                      <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                        {/* Role Selector */}
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-slate-700 font-semibold focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="TECH">TECH</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="OWNER">OWNER</option>
                        </select>

                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => handleToggleStaffStatus(user.id)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                            user.isActive
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {user.isActive ? 'Disable' : 'Enable'}
                        </button>

                        {/* Unlock Button if locked */}
                        {user.isLocked && (
                          <button
                            onClick={() => handleUnlockUser(user.id)}
                            className="py-1.5 px-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>{t.unlock}</span>
                          </button>
                        )}

                        {/* Revoke Sessions */}
                        <button
                          onClick={() => handleRevokeSessions(user.id)}
                          className="py-1.5 px-2.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition cursor-pointer"
                          title={t.revokeSessions}
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>

                        {/* Open Details / Notes Modal */}
                        <button
                          onClick={() => setSelectedStaffUser(user)}
                          className="py-1.5 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
                        >
                          Details & Notes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SECURITY & SANITIZED AUDIT LOG                                     */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t.auditLog}</h2>
              <p className="text-xs text-slate-500">{t.sanitizedNotice}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-semibold block">Session Hash Storage</span>
                <span className="font-mono text-[11px] text-emerald-600 block mt-1">
                  SHA-256(raw_cookie_id)
                </span>
                <p className="text-slate-500 mt-2">Zero plaintext session IDs stored in database.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-semibold block">Rate Limiting Lockout</span>
                <span className="font-bold text-slate-900 text-sm block mt-1">
                  10 Failures / 15 Minutes
                </span>
                <p className="text-slate-500 mt-2">Per email+IP pair. Global IP flood gate at 30 req.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-slate-500 font-semibold block">Password Hashing</span>
                <span className="font-mono text-[11px] text-indigo-600 block mt-1">
                  Argon2id (v=19, m=65536)
                </span>
                <p className="text-slate-500 mt-2">Cost-adaptive rehashing on every successful login.</p>
              </div>
            </div>

            {/* Audit Log Table (Simulated live from audit_log table) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Audit Trail (Strictly Sanitized)
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Append-Only</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-3.5 flex items-start justify-between gap-3 bg-slate-50/50">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">AUTH</span>
                      <span>User #1 (Owner) successful sign-in</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 mt-1">
                      {`{"email": "owner@workshop.local", "ip": "192.168.1.10"}`}
                    </div>
                  </div>
                  <span className="text-slate-400 tabular-nums text-[11px]">Today 10:14:02 UTC</span>
                </div>

                <div className="p-3.5 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px]">STAFF_UPDATE</span>
                      <span>User #4 role modified: TECH</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 mt-1">
                      {`{"before": {"role": "TECH"}, "after": {"role": "TECH"}, "scrubbed": ["password_hash", "token"]}`}
                    </div>
                  </div>
                  <span className="text-slate-400 tabular-nums text-[11px]">Today 09:32:18 UTC</span>
                </div>

                <div className="p-3.5 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px]">PAYMENT</span>
                      <span>Payment recorded for Ticket #TICK-8022: $85 (Cash)</span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 mt-1">
                      {`{"amount": 85, "currency": "USD", "rate_snapshot": 1510, "credit_iqd": 128350}`}
                    </div>
                  </div>
                  <span className="text-slate-400 tabular-nums text-[11px]">Yesterday 14:35:10 UTC</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BACKUPS & GPG RECOVERY                                             */}
        {/* ========================================================================= */}
        {activeTab === 'backups' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{t.backups}</h2>
                  <p className="text-xs text-slate-500">
                    Nightly automated archive of MySQL / SQLite database & uploaded inspection photos.
                  </p>
                </div>
                <button
                  onClick={() => showFeedback('Triggered backup script ./scripts/backup.sh & restore test.')}
                  className="py-2.5 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Run Backup & Test Restore</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium block">Encryption Standard</span>
                  <span className="text-slate-900 font-bold text-sm mt-0.5 block">GPG Public Key (RSA 4096)</span>
                  <p className="text-slate-500 mt-1">
                    Public key only on server. Private decryption key is held strictly offsite.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium block">Retention Policy</span>
                  <span className="text-slate-900 font-bold text-sm mt-0.5 block">14 Days Rotation</span>
                  <p className="text-slate-500 mt-1">Automated cleanup via find -mtime +14 in cron.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 font-medium block">Restore Verification</span>
                  <span className="text-emerald-700 font-bold text-sm mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>PASSED (Automated)</span>
                  </span>
                  <p className="text-slate-500 mt-1">Last tested: 2026-10-10 17:00:15 UTC.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto">
                <div className="text-slate-400"># Verification output from ./scripts/restore_test.sh:</div>
                <div className="text-emerald-400">[*] Testing restoration of backup: tv_workshop_backup_20261010_170006.tar.gz.enc</div>
                <div>[*] Decrypting archive with test recipient...</div>
                <div>[*] Verifying SQLite database structure...</div>
                <div className="text-emerald-400">[+] SQLite database integrity test PASSED.</div>
                <div className="text-emerald-400">[+] Restore test completed successfully.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN BLOCKING OFFLINE MODAL (Online Only Hard Requirement)         */}
      {/* ========================================================================= */}
      {!isOnline && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <WifiOff className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{t.offlineTitle}</h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {t.offlineMessage}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsOnline(true);
                  showFeedback('Connection restored.');
                }}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition cursor-pointer shadow-xs"
              >
                {t.reconnect}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: STAFF DETAILS & PRIVATE OWNER NOTES                                */}
      {/* ========================================================================= */}
      {selectedStaffUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{selectedStaffUser.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 uppercase">
                  {selectedStaffUser.role}
                </span>
              </div>
              <button onClick={() => setSelectedStaffUser(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-medium">Email:</span>
                  <span className="font-bold text-slate-900">{selectedStaffUser.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone:</span>
                  <span className="font-bold text-slate-900">{selectedStaffUser.phone}</span>
                </div>
              </div>

              {/* Password Reset Action */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Issue Temporary Password</span>
                <p className="text-[11px] text-amber-700 mb-3">
                  Forces must_change_password=1 and immediately revokes all current sessions.
                </p>
                <button
                  onClick={() => {
                    showFeedback(`Temporary password issued for ${selectedStaffUser.email}. Sessions cleared.`);
                    setSelectedStaffUser(null);
                  }}
                  className="py-1.5 px-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition cursor-pointer"
                >
                  Generate Temp Password
                </button>
              </div>

              {/* Owner Private Notes Section */}
              <div>
                <span className="font-bold text-slate-900 block mb-2">{t.privateNotes}</span>
                <div className="space-y-2 mb-3">
                  {selectedStaffUser.notes.map((n, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
                      {n}
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = (e.currentTarget.elements.namedItem('new_note') as HTMLInputElement);
                    handleAddNote(selectedStaffUser.id, input.value);
                    input.value = '';
                    setSelectedStaffUser(null);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    name="new_note"
                    placeholder="Add private note (visible to Owner only)..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                  <button type="submit" className="py-2 px-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition cursor-pointer">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW STAFF MEMBER                                              */}
      {/* ========================================================================= */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">{t.addStaff}</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                const role = (form.elements.namedItem('role') as HTMLSelectElement).value as Role;

                setStaffList(prev => [
                  ...prev,
                  {
                    id: Date.now(),
                    name,
                    email,
                    phone,
                    role,
                    isActive: true,
                    isLocked: false,
                    activeSessions: 0,
                    notes: []
                  }
                ]);
                setShowAddStaffModal(false);
                showFeedback(`Staff account created for ${name} (${role}).`);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.fullName}</label>
                <input type="text" name="name" required placeholder="e.g. Dana Rashid" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.email}</label>
                <input type="email" name="email" required placeholder="dana@workshop.local" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.phone}</label>
                <input type="tel" name="phone" placeholder="0750XXXXXXX" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.role}</label>
                <select name="role" defaultValue="TECH" className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option value="TECH">TECH (Technician)</option>
                  <option value="MANAGER">MANAGER (Front-desk)</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="OWNER">OWNER</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddStaffModal(false)} className="py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">
                  Create Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CHECK-IN NEW REPAIR TICKET                                         */}
      {/* ========================================================================= */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">{t.newTicket}</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const custName = (form.elements.namedItem('custName') as HTMLInputElement).value;
                const custPhone = (form.elements.namedItem('custPhone') as HTMLInputElement).value;
                const brand = (form.elements.namedItem('brand') as HTMLInputElement).value;
                const model = (form.elements.namedItem('model') as HTMLInputElement).value;
                const fault = (form.elements.namedItem('fault') as HTMLTextAreaElement).value;

                const newT: RepairTicket = {
                  id: Date.now(),
                  ticketNo: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
                  customerName: custName,
                  customerPhone: custPhone,
                  brand,
                  model,
                  serial: `SN-${brand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
                  fault,
                  diagnosis: 'Awaiting workbench diagnosis',
                  status: 'CHECK_IN',
                  currency: 'IQD',
                  laborFee: 25000,
                  partsTotal: 0,
                  techName: 'Hemin Rebar',
                  createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
                };

                setRepairsList([newT, ...repairsList]);
                setShowNewTicketModal(false);
                showFeedback(`Ticket ${newT.ticketNo} created successfully.`);
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
                  <input type="text" name="custName" required placeholder="Ahmed Ali" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Phone</label>
                  <input type="tel" name="custPhone" required placeholder="0750XXXXXXX" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">TV Brand</label>
                  <input type="text" name="brand" required placeholder="e.g. Samsung, LG, TCL" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model Number</label>
                  <input type="text" name="model" required placeholder="e.g. 55AU7000" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reported Fault Description</label>
                <textarea name="fault" required rows={2} placeholder="Describe problem observed by customer..." className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewTicketModal(false)} className="py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold">
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
