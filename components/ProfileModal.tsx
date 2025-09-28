
import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileModalProps {
  onSave: (profile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onSave }) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    gender: 'male',
    activityLevel: 'sedentary',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.age && profile.gender && profile.weight && profile.height && profile.activityLevel && profile.goal) {
      onSave(profile as UserProfile);
    } else {
      alert('الرجاء تعبئة جميع الحقول');
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-center text-emerald-700 mb-4">أخبرنا عنك لنبدأ</h2>
        <p className="text-center text-gray-500 mb-6">هذه المعلومات تساعدنا في تقديم نصائح مخصصة لك.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className={labelClass}>العمر</label>
              <input type="number" name="age" id="age" required className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="gender" className={labelClass}>الجنس</label>
              <select name="gender" id="gender" required className={inputClass} onChange={handleChange} defaultValue="male">
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className={labelClass}>الوزن (كجم)</label>
              <input type="number" name="weight" id="weight" required className={inputClass} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="height" className={labelClass}>الطول (سم)</label>
              <input type="number" name="height" id="height" required className={inputClass} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label htmlFor="activityLevel" className={labelClass}>مستوى النشاط اليومي</label>
            <select name="activityLevel" id="activityLevel" required className={inputClass} onChange={handleChange} defaultValue="sedentary">
              <option value="sedentary">خامل (عمل مكتبي)</option>
              <option value="light">نشاط خفيف (تمارين 1-3 أيام/أسبوع)</option>
              <option value="moderate">نشاط معتدل (تمارين 3-5 أيام/أسبوع)</option>
              <option value="active">نشيط (تمارين 6-7 أيام/أسبوع)</option>
              <option value="very_active">نشيط جداً (عمل بدني)</option>
            </select>
          </div>
          <div>
            <label htmlFor="goal" className={labelClass}>ما هو هدفك الرئيسي؟</label>
            <textarea name="goal" id="goal" rows={2} required className={inputClass} placeholder="مثال: خسارة 10 كيلو جرام، بناء كتلة عضلية، الأكل الصحي..." onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 font-semibold">
            حفظ والبدء
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
