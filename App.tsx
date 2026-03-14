import React, { useState, useRef } from "react";
import {
  Download,
  Layout,
  Sparkles,
  Type as TypeIcon,
  Palette,
  Loader2,
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import * as htmlToImage from "html-to-image";
import { InfographicData, ActiveTab } from "./types";
import PreviewCard from "./components/PreviewCard";
import Sidebar from "./components/Sidebar";
import CustomizationPanel from "./components/CustomizationPanel";

// Al-Tajer Digital Default Theme - Electric Blue & Mint Green
const DEFAULT_DATA: InfographicData = {
  headerImage:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
  logoUrl:
    "https://upload.wikimedia.org/wikipedia/ar/thumb/a/a6/MEWA_Logo.svg/1200px-MEWA_Logo.svg.png",
  logoPosition: "top-right",
  mainTitle:
    "انضمام 11 جهة هولندية لعضوية التحالف السعودي لتقنيات الزراعة والغذاء",
  subTitle: 'برعاية نائب وزير "البيئة" المهندس منصور بن هلال المشيطي',
  eventLocation: 'معرض "جرينتك" - أمستردام',
  eventDate: "يونيو 2025م",
  colors: {
    primary: "#2563EB",      /* Electric Blue - Al-Tajer Digital Primary */
    secondary: "#10B981",    /* Mint Green - Al-Tajer Digital Secondary */
    background: "#FFFFFF",   /* White Background */
    text: "#4B5563",         /* Dark Gray - Body Text */
  },
  goals: [
    { id: "1", text: "بناء الشراكات وتبادل الخبرات", icon: "handshake" },
    {
      id: "2",
      text: "تعزيز التعاون الدولي في مجالات الابتكار الزراعي",
      icon: "growth",
    },
    {
      id: "3",
      text: "تحفيز الاستثمار في المجالات ذات الأولوية",
      icon: "investment",
    },
    {
      id: "4",
      text: "استكشاف مجالات التعاون في قطاعات البيئة والمياه والزراعة",
      icon: "search",
    },
  ],
  entities: [
    { id: "1", name: "جامعة فاجينينجن الهولندية" },
    { id: "2", name: "التحالف الهولندي للبيوت المحمية" },
    { id: "3", name: "وادي الغذاء الهولندي" },
    { id: "4", name: "فان دير هوفن" },
  ],
  footerWebsite: "mewa.gov.sa",
  footerSocial: "@mewa_ksa",
  footerPhone: "939",
  customCss: "",
};

const App: React.FC = () => {
  const [data, setData] = useState<InfographicData>(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState<ActiveTab>("content");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleUpdate = (updates: Partial<InfographicData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleExport = async () => {
    if (!previewRef.current || isExporting) return;

    setIsExporting(true);
    try {
      // Ensure all images are loaded and fonts are ready
      await document.fonts.ready;
      
      const node = previewRef.current;
      
      // Fix for some browsers: ensure the node has a fixed width for the snapshot
      const originalWidth = node.style.width;
      node.style.width = '500px';

      const options = {
        quality: 1,
        pixelRatio: 4, // Higher quality
        cacheBust: true,
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '0', // Remove border radius for the export if needed
        }
      };

      // Use to Blob and then Create URL for better compatibility with large images
      const blob = await htmlToImage.toBlob(node, options);
      
      // Revert style
      node.style.width = originalWidth;

      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `tajer-design-${Date.now()}.png`;
        link.href = url;
        link.click();
        
        // Cleanup
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert(
        "حدث خطأ أثناء التصدير. يرجى تجربة متصفح آخر أو التأكد من استقرار الإنترنت.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateAI = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate professional Arabic content for an official agricultural infographic based on this idea: "${prompt}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mainTitle: { type: Type.STRING },
              subTitle: { type: Type.STRING },
              goals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    icon: { type: Type.STRING },
                  },
                  required: ["text", "icon"],
                },
              },
              entities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["mainTitle", "subTitle", "goals", "entities"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      setData((prev) => ({
        ...prev,
        mainTitle: result.mainTitle || prev.mainTitle,
        subTitle: result.subTitle || prev.subTitle,
        goals:
          result.goals?.map((g: any, i: number) => ({
            id: String(Date.now() + i),
            text: g.text,
            icon: g.icon,
          })) || prev.goals,
        entities:
          result.entities?.map((e: string, i: number) => ({
            id: String(Date.now() + i + 100),
            name: e,
          })) || prev.entities,
      }));
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className={`app-layout ${isExporting ? "exporting-state" : ""}`}
      dir="rtl"
    >
      {/* Sidebar Controls */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <div className="sidebar-app-icon">
              <Layout size={22} />
            </div>
            <div>
              <h1 className="sidebar-title">مُصمم الكاروسيل</h1>
              <span className="sidebar-version">Al-Tajer Digital v3.0</span>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="export-button"
            title="تصدير كصورة PNG"
          >
            {isExporting ? (
              <Loader2 size={20} className="export-loading-icon" />
            ) : (
              <Download size={20} />
            )}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-navigation">
          <TabButton
            active={activeTab === "ai"}
            onClick={() => setActiveTab("ai")}
            icon={<Sparkles size={16} />}
            label="الذكاء"
          />
          <TabButton
            active={activeTab === "content"}
            onClick={() => setActiveTab("content")}
            icon={<TypeIcon size={16} />}
            label="النصوص"
          />
          <TabButton
            active={activeTab === "custom"}
            onClick={() => setActiveTab("custom")}
            icon={<Palette size={16} />}
            label="الثيمات"
          />
        </div>

        <div className="sidebar-scroll-content">
          {activeTab === "content" && (
            <Sidebar data={data} onUpdate={handleUpdate} />
          )}
          {activeTab === "custom" && (
            <CustomizationPanel data={data} onUpdate={handleUpdate} />
          )}
          {activeTab === "ai" && (
            <div className="ai-panel">
              <div className="ai-container">
                <p className="ai-header-label">
                  <Sparkles size={14} /> توليد المحتوى الذكي
                </p>
                <textarea
                  className="ai-textarea"
                  placeholder="اكتب فكرتك هنا... وسأقوم بصياغتها لك بشكل احترافي"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerateAI(e.currentTarget.value);
                    }
                  }}
                />
                <button
                  disabled={isGenerating}
                  onClick={(e) => {
                    const textarea = e.currentTarget
                      .previousElementSibling as HTMLTextAreaElement;
                    handleGenerateAI(textarea.value);
                  }}
                  className="ai-generate-button"
                >
                  {isGenerating ? "جاري التفكير..." : "توليد المحتوى"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="preview-area">
        <div className="poster-wrapper">
          <div ref={previewRef} className="poster-box print-area">
            <PreviewCard data={data} />
          </div>
        </div>
        {isExporting && (
          <div className="export-status-indicator">
            <Loader2 size={16} className="export-loading-icon" />
            جاري تثبيت الخطوط ومعالجة الصورة...
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button onClick={onClick} className={`tab-button ${active ? "active" : ""}`}>
    <span className="tab-icon">{icon}</span>
    <span className="tab-label">{label}</span>
    {active && <div className="tab-indicator"></div>}
  </button>
);

export default App;
