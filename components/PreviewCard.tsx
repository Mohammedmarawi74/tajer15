import React from 'react';
import {
  Handshake,
  TrendingUp,
  Target,
  Search,
  Calendar,
  MapPin,
  Globe,
  Twitter
} from 'lucide-react';
import { InfographicData, LogoPosition } from '../types';

interface PreviewCardProps {
  data: InfographicData;
}

const IconMap: Record<string, React.ReactNode> = {
  handshake: <Handshake size={28} />,
  growth: <TrendingUp size={28} />,
  investment: <Target size={28} />,
  search: <Search size={28} />,
};

const PreviewCard: React.FC<PreviewCardProps> = ({ data }) => {
  const getLogoPositionClass = (pos?: LogoPosition) => {
    switch (pos) {
      case 'top-left': return 'top-6 left-6';
      case 'bottom-right': return 'bottom-6 right-6';
      case 'bottom-left': return 'bottom-6 left-6';
      case 'top-right':
      default: return 'top-6 right-6';
    }
  };

  const themeStyles = {
    '--primary': data.colors.primary,
    '--secondary': data.colors.secondary,
    '--background': data.colors.background,
    '--text': data.colors.text,
  } as React.CSSProperties;

  return (
    <div
      className="poster-root font-ibm"
      style={{ ...themeStyles, backgroundColor: 'var(--background)' }}
    >
      {/* Custom Styles Injection */}
      <style>{data.customCss}</style>

      {/* Logo Overlay */}
      {data.logoUrl && (
        <div className={`poster-logo ${getLogoPositionClass(data.logoPosition)}`}>
          <img
            src={data.logoUrl}
            alt="Logo"
          />
        </div>
      )}

      {/* Header Image */}
      <div className="poster-image-container">
        <img
          src={data.headerImage}
          alt="Event"
          className="poster-image"
        />
        {/* Modern Curved Overlay with Gradient */}
        <div
          className="poster-curve"
          style={{ background: `linear-gradient(180deg, ${data.colors.primary}EE 0%, ${data.colors.primary}CC 100%)` }}
        ></div>
      </div>

      {/* Main Title Section - Modern Gradient Card */}
      <div
        className="poster-content"
        style={{ background: `linear-gradient(135deg, ${data.colors.primary} 0%, ${data.colors.primary}DD 100%)` }}
      >
        <h2 className="poster-headline">
          {data.mainTitle}
        </h2>
        <p className="poster-subtitle">
          {data.subTitle}
        </p>
      </div>

      {/* Info Bar - Modern Pill Design */}
      <div className="poster-infobar">
        <div className="infobar-item">
          <Calendar size={18} style={{ color: data.colors.primary }} />
          <span>{data.eventDate}</span>
        </div>
        <div className="infobar-divider"></div>
        <div className="infobar-item">
          <MapPin size={18} style={{ color: data.colors.primary }} />
          <span>{data.eventLocation}</span>
        </div>
      </div>

      {/* Goals Section */}
      <div className="poster-section-goals">
        <div className="section-title-wrapper">
            <h3
              className="poster-section-title"
              style={{ color: data.colors.primary, borderColor: data.colors.primary }}
            >
              الأهداف
            </h3>
        </div>

        <div className="goals-grid">
          {data.goals.map((goal) => (
            <div key={goal.id} className="poster-goal-item">
              <div
                className="poster-goal-icon"
                style={{ background: `linear-gradient(135deg, ${data.colors.primary} 0%, ${data.colors.secondary} 100%)` }}
              >
                {IconMap[goal.icon] || IconMap.search}
              </div>
              <p
                className="poster-goal-text"
                style={{ color: data.colors.text }}
              >
                {goal.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Entities Section */}
      <div className="poster-section-entities">
        <div className="section-title-wrapper">
            <h3
              className="poster-section-title"
              style={{ color: data.colors.primary, borderColor: data.colors.primary }}
            >
              الجهات المنضمة
            </h3>
        </div>

        <div className="entities-grid">
          {data.entities.map((entity) => (
            <div key={entity.id} className="poster-entity-item">
              <div
                className="poster-entity-dot"
                style={{ background: `linear-gradient(135deg, ${data.colors.primary} 0%, ${data.colors.secondary} 100%)` }}
              ></div>
              <span
                className="poster-entity-text"
                style={{ color: data.colors.text }}
              >
                {entity.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="poster-footer"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="footer-branding">
          <div className="branding-content">
             <div className="branding-text-block">
                <div
                  className="mewa-title"
                  style={{ color: data.colors.primary }}
                >
                  وزارة البيئة والمياه والزراعة
                </div>
                <div className="mewa-subtitle">Kingdom of Saudi Arabia</div>
             </div>
             <div
                className="mewa-logo-placeholder"
                style={{ background: `linear-gradient(135deg, ${data.colors.primary} 0%, ${data.colors.primary}DD 100%)` }}
             >
                <div className="logo-inner-circle"></div>
             </div>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-link-item">
            <Globe size={16} style={{ color: data.colors.primary }} />
            <span>{data.footerWebsite}</span>
          </div>
          <div className="footer-link-item">
            <Twitter size={16} style={{ color: data.colors.primary }} />
            <span>{data.footerSocial}</span>
          </div>
        </div>
      </div>

      {/* Custom Bottom Footer - Al-Tajer Digital Branding */}
      <div className="design-custom-footer">
        <div className="custom-footer-content">
          <span className="footer-text-left">Al-Tajer Digital</span>
          <span className="footer-text-right">منصة التاجر الرقمية</span>
        </div>
        <div 
          className="footer-accent-strip" 
          style={{ background: `linear-gradient(90deg, ${data.colors.primary} 0%, ${data.colors.secondary} 50%, #8B5CF6 100%)` }}
        ></div>
      </div>
    </div>
  );
};

export default PreviewCard;
