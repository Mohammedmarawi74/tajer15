import React from 'react';
import { Sparkles, RotateCcw, Check } from 'lucide-react';
import { InfographicData, ThemeColors } from '../types';

interface CustomizationPanelProps {
  data: InfographicData;
  onUpdate: (updates: Partial<InfographicData>) => void;
}

interface ThemePreset {
  name: string;
  colors: ThemeColors;
  description: string;
}

// Al-Tajer Digital Theme Presets - Modern Professional Colors
const PRESET_THEMES: ThemePreset[] = [
  { 
    name: 'الأزرق الكهربائي', 
    description: 'الثيم الرسمي للمنصة',
    colors: { primary: '#2563EB', secondary: '#10B981', background: '#FFFFFF', text: '#4B5563' } 
  },
  { 
    name: 'كحلي الملكي', 
    description: 'فخامة واحترافية',
    colors: { primary: '#1E3A8A', secondary: '#3B82F6', background: '#F8FAFC', text: '#1E293B' } 
  },
  { 
    name: 'الأخضر الزمردي', 
    description: 'نمو واستدامة',
    colors: { primary: '#059669', secondary: '#34D399', background: '#F0FDF4', text: '#1E293B' } 
  },
  { 
    name: 'البنفسجي العميق', 
    description: 'إبداع وتميز',
    colors: { primary: '#7C3AED', secondary: '#A78BFA', background: '#F5F3FF', text: '#1E293B' } 
  },
  { 
    name: 'الأزرق السماوي', 
    description: 'انتعاش وحيوية',
    colors: { primary: '#0EA5E9', secondary: '#38BDF8', background: '#F0F9FF', text: '#0F172A' } 
  },
  { 
    name: 'البرتقالي النابض', 
    description: 'طاقة وحيوية',
    colors: { primary: '#EA580C', secondary: '#FB923C', background: '#FFF7ED', text: '#1E293B' } 
  },
  { 
    name: 'الوردي الحديث', 
    description: 'عصري وجريء',
    colors: { primary: '#DB2777', secondary: '#F472B6', background: '#FDF2F8', text: '#1E293B' } 
  },
  { 
    name: 'الوضع الداكن', 
    description: 'راحة للعين',
    colors: { primary: '#3B82F6', secondary: '#10B981', background: '#0F172A', text: '#F1F5F9' } 
  },
];

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({ data, onUpdate }) => {
  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    onUpdate({
      colors: { ...data.colors, [key]: value }
    });
  };

  const isSelected = (theme: ThemePreset) => {
    return theme.colors.primary === data.colors.primary &&
           theme.colors.secondary === data.colors.secondary;
  };

  return (
    <div className="customization-panel">
      {/* Ready Themes Section */}
      <section>
        <h4 className="panel-header-label">
          <Sparkles size={14} /> الثيمات الجاهزة
        </h4>
        <div className="preset-grid">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => onUpdate({ colors: theme.colors })}
              className={`preset-button ${isSelected(theme) ? 'active' : ''}`}
            >
              {isSelected(theme) && (
                <div className="preset-check">
                  <Check size={12} />
                </div>
              )}
              <div className="preset-info">
                <div className="preset-swatches">
                  <div className="preset-swatch" style={{ backgroundColor: theme.colors.secondary }}></div>
                  <div className="preset-swatch" style={{ backgroundColor: theme.colors.primary }}></div>
                </div>
                <span className="preset-name">{theme.name}</span>
              </div>
              <div className="preset-preview-bar">
                <div style={{ backgroundColor: theme.colors.background, width: '35%', height: '100%' }}></div>
                <div style={{ backgroundColor: theme.colors.primary, width: '40%', height: '100%' }}></div>
                <div style={{ backgroundColor: theme.colors.secondary, width: '25%', height: '100%' }}></div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Manual Color Customization */}
      <section>
        <h4 className="panel-header-label">
          <RotateCcw size={14} /> تخصيص الألوان
        </h4>
        <div className="color-picker-grid">
          <ColorPicker
            label="اللون الأساسي"
            value={data.colors.primary}
            onChange={(val) => handleColorChange('primary', val)}
          />
          <ColorPicker
            label="اللون الثانوي"
            value={data.colors.secondary}
            onChange={(val) => handleColorChange('secondary', val)}
          />
          <ColorPicker
            label="لون الخلفية"
            value={data.colors.background}
            onChange={(val) => handleColorChange('background', val)}
          />
          <ColorPicker
            label="لون النصوص"
            value={data.colors.text}
            onChange={(val) => handleColorChange('text', val)}
          />
        </div>
      </section>

      {/* CSS Editor Section */}
      <section className="css-editor-section">
        <h4 className="css-editor-label">
          <Sparkles size={14} /> محرر CSS المتقدم
        </h4>
        <div className="css-editor-container">
          <textarea
            value={data.customCss}
            onChange={(e) => onUpdate({ customCss: e.target.value })}
            className="css-editor-textarea"
            placeholder="/* اكتب كود CSS المخصص هنا */"
            dir="ltr"
          />
          <div className="css-editor-reset">
            <RotateCcw
              size={14}
              onClick={() => confirm('هل أنت متأكد من تصفير الكود؟') && onUpdate({ customCss: '' })}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
  <div className="color-picker-group">
    <label className="color-picker-label">{label}</label>
    <div className="color-picker-container">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="color-picker-input"
      />
      <div className="color-picker-swatch" style={{ backgroundColor: value }}></div>
    </div>
  </div>
);

export default CustomizationPanel;
