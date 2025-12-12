
import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Truck, Activity, CheckCircle, Lock, AlertTriangle, Users } from 'lucide-react';
import { Incident } from '../types';

interface SecurityRoutingModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
}

const SecurityRoutingModal: React.FC<SecurityRoutingModalProps> = ({ isOpen, onClose, incident }) => {
  const [activeTab, setActiveTab] = useState('civil_defense');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !incident) return null;

  const handleRoute = () => {
      setSuccess(true);
      setTimeout(() => {
          setSuccess(false);
          onClose();
      }, 2000);
  };

  if (success) {
      return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="bg-[#1a1c15] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <CheckCircle size={32} className="text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">تم التوجيه بنجاح</h3>
                  <p className="text-gray-400 text-sm">تم إرسال كافة البيانات للجهة المختصة.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0c1008] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-red-900/20 to-transparent">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <ShieldAlert size={20} className="text-red-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">توجيه أمني</h2>
                    <p className="text-xs text-red-300 flex items-center gap-1">
                        <Lock size={10} />
                        جلسة آمنة ومشفرة - {incident.id}
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-sm">إلغاء</button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 bg-white/5 border-l border-white/10 flex flex-col p-2 gap-1">
                {[
                    { id: 'civil_defense', label: 'الدفاع المدني', icon: Truck },
                    { id: 'public_security', label: 'الشرطة', icon: ShieldCheck },
                    { id: 'red_crescent', label: 'الهلال الأحمر', icon: Activity },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab.id 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Panel */}
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-[#0c1008]">
                <div className="mb-6 bg-red-900/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
                    <AlertTriangle size={20} className="text-red-400 shrink-0" />
                    <div>
                        <h4 className="text-sm font-bold text-red-200 mb-1">مستوى الخطورة: {incident.health_profile.risk_level}</h4>
                        <p className="text-xs text-red-300/70">يوصى بتفعيل الاستجابة السريعة نظرًا لطبيعة التضاريس والمخاطر الصحية.</p>
                    </div>
                </div>

                {activeTab === 'civil_defense' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="text-white font-bold mb-4">إجراءات الدفاع المدني</h3>
                        
                        {/* Main CD Dispatch */}
                        <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10">
                            <input type="checkbox" defaultChecked className="accent-red-500 w-5 h-5" />
                            <div>
                                <span className="block text-sm text-white font-medium">توجيه دفاع مدني</span>
                                <span className="block text-xs text-gray-500">إرسال فرق البحث والإنقاذ الرسمية للموقع.</span>
                            </div>
                        </label>

                        {/* Volunteers Submenu - STRICTLY UNDER CIVIL DEFENSE */}
                        <div className="pl-4 border-r-2 border-white/5 mr-2 pr-4 mt-2 bg-white/5 rounded-xl p-3">
                            <h4 className="text-xs text-gray-300 mb-3 font-bold flex items-center gap-1">
                                <Users size={12} className="text-yellow-400" />
                                الفرق المساندة (تحت إشراف الدفاع المدني)
                            </h4>
                            <label className="flex items-center gap-3 mb-2 cursor-pointer">
                                <input type="checkbox" className="accent-yellow-500 w-4 h-4" />
                                <span className="text-sm text-white">توجيه الجمعيات التطوعية</span>
                            </label>
                            
                            <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded text-[10px] text-yellow-300 flex items-center gap-2 mt-2">
                                <Lock size={12} />
                                مشاركة خاضعة لموافقة النظام - صلاحية الرابط 15 دقيقة
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'public_security' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                         <h3 className="text-white font-bold mb-4">إجراءات الشرطة والأمن العام</h3>
                         <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10">
                            <input type="checkbox" defaultChecked className="accent-blue-500 w-5 h-5" />
                            <div>
                                <span className="block text-sm text-white font-medium">تأمين الموقع</span>
                                <span className="block text-xs text-gray-500">فرض طوق أمني حول منطقة البحث.</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10">
                            <input type="checkbox" className="accent-blue-500 w-5 h-5" />
                            <div>
                                <span className="block text-sm text-white font-medium">إغلاق الطرق الخطرة</span>
                                <span className="block text-xs text-gray-500">منع الوصول للأودية أو المناطق الوعرة.</span>
                            </div>
                        </label>
                    </div>
                )}
                 
                 {activeTab === 'red_crescent' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                         <h3 className="text-white font-bold mb-4">الهلال الأحمر السعودي</h3>
                         <label className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:bg-white/10">
                            <input type="checkbox" defaultChecked className="accent-red-500 w-5 h-5" />
                            <div>
                                <span className="block text-sm text-white font-medium">توجيه الفرق الإسعافية</span>
                                <span className="block text-xs text-gray-500">الاستعداد للتدخل الطبي الفوري.</span>
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#0c1008] flex justify-end gap-3">
             <button onClick={onClose} className="px-6 py-2 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-colors">
                 إلغاء
             </button>
             <button 
                onClick={handleRoute}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 transition-colors flex items-center gap-2"
             >
                 <ShieldCheck size={16} />
                 تأكيد التوجيه
             </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityRoutingModal;
