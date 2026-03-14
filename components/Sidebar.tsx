import React, { useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon, List, Info, Target, Globe, Twitter, Upload, Link as LinkIcon } from 'lucide-react';
import { InfographicData, Goal, Entity, LogoPosition } from '../types';

interface SidebarProps {
  data: InfographicData;
  onUpdate: (updates: Partial<InfographicData>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ data, onUpdate }) => {
  const headerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'headerImage' | 'logoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoalUpdate = (id: string, text: string) => {
    onUpdate({
      goals: data.goals.map(g => g.id === id ? { ...g, text } : g)
    });
  };

  const addGoal = () => {
    onUpdate({
      goals: [...data.goals, { id: Date.now().toString(), text: 'هدف جديد', icon: 'search' }]
    });
  };

  const removeGoal = (id: string) => {
    onUpdate({
      goals: data.goals.filter(g => g.id !== id)
    });
  };

  const handleEntityUpdate = (id: string, name: string) => {
    onUpdate({
      entities: data.entities.map(e => e.id === id ? { ...e, name } : e)
    });
  };

  const addEntity = () => {
    onUpdate({
      entities: [...data.entities, { id: Date.now().toString(), name: 'جهة جديدة' }]
    });
  };

  const removeEntity = (id: string) => {
    onUpdate({
      entities: data.entities.filter(e => e.id !== id)
    });
  };

  return (
    <div className="sidebar-scroll-content pb-12 p-6">
      {/* Header Info */}
      <section className="sidebar-section">
        <h4 className="section-label">
          <Info size={16} className="text-emerald-500" /> معلومات الرأس
        </h4>
        <div className="input-container">
          {/* Header Image Upload */}
          <div className="field-group">
            <label className="field-label">الصورة الرئيسية</label>
            <div className="action-row">
              <input
                type="text"
                value={data.headerImage.startsWith('data:') ? 'صورة مرفوعة محلياً' : data.headerImage}
                onChange={(e) => onUpdate({ headerImage: e.target.value })}
                className="text-input"
                placeholder="رابط الصورة..."
              />
              <button
                onClick={() => headerInputRef.current?.click()}
                className="icon-button"
                title="رفع من الجهاز"
              >
                <Upload size={16} />
              </button>
              <input
                type="file"
                ref={headerInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'headerImage')}
              />
            </div>
          </div>

          {/* Logo Section */}
          <div className="field-group pt-4 border-t border-slate-700/50">
            <label className="field-label">الشعار (اللوغو)</label>
            <div className="action-row mb-3">
              <input
                type="text"
                value={data.logoUrl?.startsWith('data:') ? 'شعار مرفوع محلياً' : (data.logoUrl || '')}
                onChange={(e) => onUpdate({ logoUrl: e.target.value })}
                className="text-input"
                placeholder="رابط الشعار..."
              />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="icon-button"
                title="رفع من الجهاز"
              >
                <Upload size={16} />
              </button>
              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logoUrl')}
              />
            </div>

            <label className="field-label logo-selection-label">اختر شعاراً من القائمة</label>
            <div className="logo-selector-grid">
              {['logo-1.png', 'logo-2.png', 'logo-3.png', 'logo-4.png'].map((logoName) => {
                const logoPath = `/logooo/${logoName}`;
                return (
                  <button
                    key={logoName}
                    onClick={() => onUpdate({
                      logoUrl: logoPath,
                      logoPosition: 'top-right'
                    })}
                    className={`logo-option-button ${data.logoUrl === logoPath ? 'active' : ''}`}
                  >
                    <img src={logoPath} alt={logoName} />
                  </button>
                );
              })}
            </div>

            {data.logoUrl && (
              <button
                onClick={() => onUpdate({ logoUrl: '' })}
                className="remove-logo-button"
              >
                <Trash2 size={14} /> إزالة الشعار بالكامل
              </button>
            )}
          </div>

          <div className="field-group pt-2 border-t border-slate-700/50">
            <label className="field-label">العنوان الرئيسي</label>
            <textarea
              value={data.mainTitle}
              onChange={(e) => onUpdate({ mainTitle: e.target.value })}
              className="text-input h-20 resize-none"
              placeholder="أدخل العنوان الرئيسي..."
            />
          </div>
          <div className="field-group">
            <label className="field-label">العنوان الفرعي</label>
            <input
              type="text"
              value={data.subTitle}
              onChange={(e) => onUpdate({ subTitle: e.target.value })}
              className="text-input"
              placeholder="أدخل العنوان الفرعي..."
            />
          </div>
          <div className="multi-input-row">
            <div className="field-group">
              <label className="field-label">التاريخ</label>
              <input
                type="text"
                value={data.eventDate}
                onChange={(e) => onUpdate({ eventDate: e.target.value })}
                className="text-input"
                placeholder="أدخل التاريخ..."
              />
            </div>
            <div className="field-group">
              <label className="field-label">الموقع</label>
              <input
                type="text"
                value={data.eventLocation}
                onChange={(e) => onUpdate({ eventLocation: e.target.value })}
                className="text-input"
                placeholder="أدخل الموقع..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Goals Editor */}
      <section className="sidebar-section">
        <div className="flex items-center justify-between mb-4">
          <h4 className="section-label">
            <Target size={16} className="text-emerald-500" /> الأهداف
          </h4>
          <button onClick={addGoal} className="icon-button" style={{ background: 'transparent', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Plus size={16} className="text-emerald-500" />
          </button>
        </div>
        <div className="list-container">
          {data.goals.map((goal) => (
            <div key={goal.id} className="list-item">
              <input
                type="text"
                value={goal.text}
                onChange={(e) => handleGoalUpdate(goal.id, e.target.value)}
                className="text-input flex-1"
                placeholder="أدخل الهدف..."
              />
              <button onClick={() => removeGoal(goal.id)} className="remove-button">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Entities Editor */}
      <section className="sidebar-section">
        <div className="flex items-center justify-between mb-4">
          <h4 className="section-label">
            <List size={16} className="text-emerald-500" /> الجهات المشاركة
          </h4>
          <button onClick={addEntity} className="icon-button" style={{ background: 'transparent', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Plus size={16} className="text-emerald-500" />
          </button>
        </div>
        <div className="list-container">
          {data.entities.map((entity) => (
            <div key={entity.id} className="list-item">
              <input
                type="text"
                value={entity.name}
                onChange={(e) => handleEntityUpdate(entity.id, e.target.value)}
                className="text-input flex-1"
                placeholder="أدخل الجهة..."
              />
              <button onClick={() => removeEntity(entity.id)} className="remove-button">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <section className="footer-input-box">
        <h4 className="field-label mb-3">التذييل</h4>
        <div className="space-y-3">
          <div className="footer-input-row">
            <Globe size={14} className="text-slate-500" />
            <input
              type="text"
              value={data.footerWebsite}
              onChange={(e) => onUpdate({ footerWebsite: e.target.value })}
              className="inline-input"
              placeholder="الموقع الإلكتروني..."
            />
          </div>
          <div className="footer-input-row">
            <Twitter size={14} className="text-slate-500" />
            <input
              type="text"
              value={data.footerSocial}
              onChange={(e) => onUpdate({ footerSocial: e.target.value })}
              className="inline-input"
              placeholder="حساب التواصل..."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sidebar;
