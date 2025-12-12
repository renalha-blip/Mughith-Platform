
import React, { useState } from 'react';
import { REGIONS_DATA } from '../constants';
import { sanitizeName } from '../utils';
import { UserCheck, MapPin, FileText, Activity, ShieldCheck, HeartPulse, Users, Plus, Trash2, CloudRain } from 'lucide-react';

interface Companion {
  name: string;
  relation: string;
  phone: string;
  notes: string;
}

const NewIncident: React.FC = () => {
  const [region, setRegion] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [isSameReporter, setIsSameReporter] = useState(false);
  const [missingName, setMissingName] = useState('');
  
  // Companions State
  const [hasCompanions, setHasCompanions] = useState(false);
  const [companions, setCompanions] = useState<Companion[]>([{ name: '', relation: '', phone: '', notes: '' }]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    const regionData = REGIONS_DATA.find(r => r.region === selectedRegion);
    setCities(regionData ? regionData.cities : []);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Real-time sanitization logic could be here, but usually better on Blur for UX. 
      // However, we will set it directly but can enforce truncation on blur.
      setMissingName(e.target.value);
  };

  const handleNameBlur = () => {
      // Strict Rule: Truncate to 2 words on blur
      setMissingName(sanitizeName(missingName));
  };

  const addCompanion = () => {
    if (companions.length < 10) {
      setCompanions([...companions, { name: '', relation: '', phone: '', notes: '' }]);
    }
  };

  const removeCompanion = (index: number) => {
    const newCompanions = [...companions];
    newCompanions.splice(index, 1);
    setCompanions(newCompanions);
  };

  const updateCompanion = (index: number, field: keyof Companion, value: string) => {
    const newCompanions = [...companions];
    newCompanions[index] = { ...newCompanions[index], [field]: value };
    setCompanions(newCompanions);
  };

  const handleHasCompanionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasCompanions(e.target.checked);
    if (!e.target.checked) {
       // Logic to clear or keep companions
    } else if (companions.length === 0) {
       setCompanions([{ name: '', relation: '', phone: '', notes: '' }]);
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-20 custom-scrollbar pr-2">
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { label: 'أبشر متصل', icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'توكلنا متصل', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'صحتي متصل', icon: HeartPulse, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'الأرصاد متصل', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map((badge, idx) => (
          <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 ${badge.bg}`}>
            <badge.icon size={14} className={badge.color} />
            <span className={`text-xs font-medium ${badge.color}`}>{badge.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Missing Person Info */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-lime-500/10 flex items-center justify-center">
                <UserCheck className="text-lime-500" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">بيانات المفقود</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-bold text-lime-400">اسم المفقود (ثنائي)</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-2.5 rounded-lg glass-input text-sm focus:border-lime-500 transition-colors" 
                    placeholder="مثال: أحمد محمد" 
                    value={missingName}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                />
                <p className="text-[10px] text-gray-500 mt-1">يجب إدخال الاسم الأول واسم الأب فقط.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs text-gray-400 mb-1.5">نوع الهوية</label>
                    <select className="w-full px-4 py-2.5 rounded-lg glass-input text-sm appearance-none">
                        <option>هوية وطنية</option>
                        <option>إقامة</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs text-gray-400 mb-1.5">رقم الهوية</label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg glass-input text-sm" />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs text-gray-400 mb-1.5">العمر</label>
                    <input type="number" className="w-full px-4 py-2.5 rounded-lg glass-input text-sm" />
                 </div>
                 <div>
                    <label className="block text-xs text-gray-400 mb-1.5">الجنس</label>
                    <select className="w-full px-4 py-2.5 rounded-lg glass-input text-sm">
                        <option>ذكر</option>
                        <option>أنثى</option>
                    </select>
                 </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">أوصاف إضافية (الملابس، العلامات الفارقة)</label>
                <textarea rows={3} className="w-full px-4 py-2.5 rounded-lg glass-input text-sm resize-none"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MapPin className="text-blue-500" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">الموقع وظروف الفقد</h3>
            </div>

            <div className="space-y-4">
               <div>
                 <label className="block text-xs text-gray-400 mb-1.5">المنطقة</label>
                 <select 
                    className="w-full px-4 py-2.5 rounded-lg glass-input text-sm"
                    value={region}
                    onChange={handleRegionChange}
                 >
                    <option value="">اختر المنطقة</option>
                    {REGIONS_DATA.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
                 </select>
               </div>
               <div>
                 <label className="block text-xs text-gray-400 mb-1.5">المدينة / المحافظة</label>
                 <select className="w-full px-4 py-2.5 rounded-lg glass-input text-sm" disabled={!region}>
                    <option value="">اختر المدينة</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div>
                  <label className="block text-xs text-gray-400 mb-1.5">تحديد الموقع التقريبي</label>
                  <div className="w-full h-40 bg-black/40 rounded-xl border border-white/10 relative overflow-hidden group cursor-crosshair">
                     <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Saudi_Arabia_satellite_map.jpg/640px-Saudi_Arabia_satellite_map.jpg')] bg-cover opacity-50 grayscale"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black/60 px-3 py-1 rounded text-xs text-white backdrop-blur">اضغط لتحديد الموقع</span>
                     </div>
                  </div>
               </div>
               <div>
                    <label className="block text-xs text-gray-400 mb-1.5">طبيعة المكان</label>
                    <select className="w-full px-4 py-2.5 rounded-lg glass-input text-sm">
                        <option>وادي</option>
                        <option>صحراء</option>
                        <option>جبال</option>
                        <option>سهل مفتوح</option>
                        <option>منطقة حضرية</option>
                    </select>
               </div>
               <div>
                    <label className="block text-xs text-gray-400 mb-1.5">وقت آخر مشاهدة</label>
                    <input type="datetime-local" className="w-full px-4 py-2.5 rounded-lg glass-input text-sm text-white dark:[color-scheme:dark]" />
               </div>
            </div>
          </div>
        </div>

        {/* Reporter Info & Companions */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl min-h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <FileText className="text-orange-500" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">بيانات المبلّغ والمرافقين</h3>
            </div>

            <div className="space-y-4 flex-1">
               {/* Reporter Toggle */}
               <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                  <input 
                    type="checkbox" 
                    id="sameReporter" 
                    checked={isSameReporter}
                    onChange={(e) => setIsSameReporter(e.target.checked)}
                    className="accent-lime-500 w-4 h-4 cursor-pointer" 
                  />
                  <label htmlFor="sameReporter" className="text-sm select-none cursor-pointer">المفقود هو نفس المبلّغ؟</label>
               </div>
               
               {/* Reporter Fields */}
               {!isSameReporter && (
                   <div className="space-y-4 animate-in slide-in-from-top-2">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">اسم المبلّغ</label>
                        <input type="text" className="w-full px-4 py-2.5 rounded-lg glass-input text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">رقم الجوال</label>
                        <input type="tel" className="w-full px-4 py-2.5 rounded-lg glass-input text-sm" dir="ltr" placeholder="+966" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">الصلة بالمفقود</label>
                        <select className="w-full px-4 py-2.5 rounded-lg glass-input text-sm">
                            <option>أب / أم</option>
                            <option>أخ / أخت</option>
                            <option>صديق</option>
                            <option>جهة رسمية</option>
                        </select>
                    </div>
                   </div>
               )}

               <div className="border-t border-white/10 my-4"></div>

               {/* Companions Section */}
               <div>
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <Users size={16} className="text-blue-400" />
                        <label htmlFor="hasCompanions" className="text-sm font-bold text-white cursor-pointer select-none">مرافقين مع المفقود</label>
                     </div>
                     <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                           type="checkbox" 
                           name="hasCompanions" 
                           id="hasCompanions" 
                           checked={hasCompanions}
                           onChange={handleHasCompanionsChange}
                           className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 checked:right-0 right-5"
                           style={{ right: hasCompanions ? '0' : 'auto', left: hasCompanions ? 'auto' : '0' }}
                        />
                        <label htmlFor="hasCompanions" className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors ${hasCompanions ? 'bg-blue-500' : 'bg-gray-700'}`}></label>
                     </div>
                  </div>

                  {hasCompanions && (
                    <div className="space-y-4 animate-in slide-in-from-top-4">
                       <p className="text-xs text-gray-400 mb-2">يمكنك إضافة بيانات الأشخاص المرافقين للمفقود هنا.</p>
                       
                       {companions.map((companion, index) => (
                          <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 relative group">
                             <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-blue-300">مرافق {index + 1}</span>
                                {companions.length > 1 && (
                                   <button 
                                      onClick={() => removeCompanion(index)}
                                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                      title="حذف المرافق"
                                   >
                                      <Trash2 size={14} />
                                   </button>
                                )}
                             </div>
                             
                             <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                   <div>
                                      <label className="block text-[10px] text-gray-500 mb-1">الاسم</label>
                                      <input 
                                         type="text" 
                                         value={companion.name}
                                         onChange={(e) => updateCompanion(index, 'name', e.target.value)}
                                         className="w-full px-3 py-2 rounded-lg glass-input text-xs" 
                                         placeholder="الاسم"
                                      />
                                   </div>
                                   <div>
                                      <label className="block text-[10px] text-gray-500 mb-1">الصلة</label>
                                      <select 
                                         value={companion.relation}
                                         onChange={(e) => updateCompanion(index, 'relation', e.target.value)}
                                         className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                                      >
                                         <option value="">اختر...</option>
                                         <option>صديق</option>
                                         <option>قريب</option>
                                         <option>زميل عمل</option>
                                         <option>مرافق رحلة</option>
                                         <option>سائق</option>
                                         <option>أخرى</option>
                                      </select>
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                   <div>
                                      <label className="block text-[10px] text-gray-500 mb-1">رقم الجوال</label>
                                      <input 
                                         type="tel" 
                                         value={companion.phone}
                                         onChange={(e) => updateCompanion(index, 'phone', e.target.value)}
                                         className="w-full px-3 py-2 rounded-lg glass-input text-xs" 
                                         placeholder="اختياري"
                                      />
                                   </div>
                                   <div>
                                      <label className="block text-[10px] text-gray-500 mb-1">ملاحظات</label>
                                      <input 
                                         type="text" 
                                         value={companion.notes}
                                         onChange={(e) => updateCompanion(index, 'notes', e.target.value)}
                                         className="w-full px-3 py-2 rounded-lg glass-input text-xs" 
                                         placeholder="ملاحظات صحية"
                                      />
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}

                       {companions.length < 10 && (
                          <button 
                             onClick={addCompanion}
                             className="w-full py-2 border-2 border-dashed border-white/10 rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                          >
                             <Plus size={14} />
                             إضافة مرافق آخر
                          </button>
                       )}
                    </div>
                  )}
               </div>

            </div>

            <div className="mt-6 flex gap-3 pt-4 border-t border-white/5">
                <button className="flex-1 bg-lime-600 hover:bg-lime-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-lime-900/20">
                    إرسال البلاغ وتفعيل غياث
                </button>
                <button className="px-6 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all border border-white/10">
                    مسودة
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewIncident;
