import React from "react";
import { useBuilder } from "../core/BuilderContext";
import { useEditorCore } from "../core/EditorCore";
import { Registry } from "../../../../packages/registry";
import { ControlFactory } from "./ControlFactory";
import { 
  Settings, 
  Info, 
  FileText, 
  Image, 
  Layout, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Search,
  Lock,
  Unlock,
  Star,
  Database,
  Palette,
  Play,
  Sparkle,
  Compass,
  FileImage,
  Eye,
  EyeOff,
  Link,
  Save,
  ShieldAlert,
  Edit,
  ArrowRightLeft
} from "lucide-react";

interface FlattenedField {
  path: string[];
  type: string;
  label: string;
  default: any;
  options?: any[];
  arrayFields?: Record<string, any>;
  originalKey: string;
  permissions?: "editable" | "readOnly" | "hidden" | "locked" | "templateOnly";
  ai?: {
    editable?: boolean;
    description?: string;
  };
}

function getNestedProperty(obj: any, path: string[]): any {
  return path.reduce((acc, part) => acc?.[part], obj);
}

function parseSpacingString(val: string): { top: string; right: string; bottom: string; left: string } {
  if (!val || typeof val !== "string") return { top: "0px", right: "0px", bottom: "0px", left: "0px" };
  const parts = val.trim().split(/\s+/);
  if (parts.length === 1) {
    return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  }
  if (parts.length === 2) {
    return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  }
  if (parts.length === 3) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
  }
  if (parts.length >= 4) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }
  return { top: "0px", right: "0px", bottom: "0px", left: "0px" };
}

function formatSpacingString(top: string, right: string, bottom: string, left: string): string {
  const t = top || "0px";
  const r = right || "0px";
  const b = bottom || "0px";
  const l = left || "0px";
  if (t === r && r === b && b === l) return t;
  if (t === b && r === l) return `${t} ${r}`;
  return `${t} ${r} ${b} ${l}`;
}

function flattenSchema(schema: Record<string, any>, defaultProps: any = {}, prefixPath: string[] = [], prefixLabel = ""): FlattenedField[] {
  const flattened: FlattenedField[] = [];

  for (const [key, field] of Object.entries(schema)) {
    if (!field) continue;

    const path = [...prefixPath, key];
    const fieldLabel = prefixLabel ? `${prefixLabel} ➔ ${field.label || key}` : (field.label || key);
    const fieldDefault = defaultProps?.[key] ?? field.default ?? "";

    if (field.type === "object" && field.subfields) {
      const subDefault = defaultProps?.[key] || {};
      flattened.push(...flattenSchema(field.subfields, subDefault, path, fieldLabel));
    } else if (field.type === "array") {
      flattened.push({
        path,
        type: "array",
        label: fieldLabel,
        default: fieldDefault || [],
        options: field.options,
        originalKey: key,
        arrayFields: field.arrayFields || field.subfields,
        permissions: field.permissions || "editable"
      });
    } else {
      let type = field.type || "text";
      if (type === "radio") type = "select";
      if (type === "boolean") type = "select";

      const lowercaseKey = key.toLowerCase();
      const lowercaseLabel = (field.label || "").toLowerCase();
      if (
        lowercaseKey.includes("color") ||
        lowercaseKey.includes("colour") ||
        lowercaseKey === "bg" ||
        lowercaseKey === "ink" ||
        lowercaseKey === "accent" ||
        lowercaseLabel.includes("color") ||
        lowercaseLabel.includes("colour")
      ) {
        type = "color";
      }

      if (lowercaseKey.includes("productid")) {
        type = "product";
      }

      flattened.push({
        path,
        type,
        label: fieldLabel,
        default: fieldDefault,
        options: field.options,
        originalKey: key,
        permissions: field.permissions || "editable",
        ai: {
          editable: true,
          description: `Visual property ${fieldLabel} for layout generation`,
        }
      });
    }
  }

  return flattened;
}

export function SpacingBoxEditor({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (next: string) => void;
}) {
  const { top, right, bottom, left } = parseSpacingString(value);

  const handleEdgeChange = (edge: "top" | "right" | "bottom" | "left", val: string) => {
    const nextTop = edge === "top" ? val : top;
    const nextRight = edge === "right" ? val : right;
    const nextBottom = edge === "bottom" ? val : bottom;
    const nextLeft = edge === "left" ? val : left;
    onChange(formatSpacingString(nextTop, nextRight, nextBottom, nextLeft));
  };

  return (
    <div className="space-y-1.5 text-xs text-left">
      <label className="font-semibold text-[#0F1020]/60 uppercase tracking-wider text-[10px]">{label}</label>
      
      {/* Box Spacing Container */}
      <div className="relative p-7 bg-neutral-50/50 rounded-2xl border border-black/5 flex flex-col items-center justify-center font-sans font-medium text-[10px] text-neutral-400">
        
        {/* Margin Top */}
        <input 
          type="text" 
          value={top} 
          onChange={(e) => handleEdgeChange("top", e.target.value)}
          className="absolute top-1.5 w-12 text-center bg-white rounded-lg border border-black/5 shadow-sm focus:border-indigo-500 focus:outline-none py-0.5 text-[#0F1020]" 
        />
        
        {/* Margin Left */}
        <input 
          type="text" 
          value={left} 
          onChange={(e) => handleEdgeChange("left", e.target.value)}
          className="absolute left-1.5 w-12 text-center bg-white rounded-lg border border-black/5 shadow-sm focus:border-indigo-500 focus:outline-none py-0.5 text-[#0F1020]" 
        />
        
        {/* Center Canvas Box */}
        <div className="w-28 h-10 bg-white rounded-lg border border-black/5 shadow-inner flex items-center justify-center relative text-neutral-500 select-none text-[8px] uppercase tracking-widest font-mono">
          Content
        </div>
        
        {/* Margin Right */}
        <input 
          type="text" 
          value={right} 
          onChange={(e) => handleEdgeChange("right", e.target.value)}
          className="absolute right-1.5 w-12 text-center bg-white rounded-lg border border-black/5 shadow-sm focus:border-indigo-500 focus:outline-none py-0.5 text-[#0F1020]" 
        />
        
        {/* Margin Bottom */}
        <input 
          type="text" 
          value={bottom} 
          onChange={(e) => handleEdgeChange("bottom", e.target.value)}
          className="absolute bottom-1.5 w-12 text-center bg-white rounded-lg border border-black/5 shadow-sm focus:border-indigo-500 focus:outline-none py-0.5 text-[#0F1020]" 
        />
      </div>
    </div>
  );
}

export function PropertyInspector() {
  const { puckData, selectedNodeId } = useBuilder();
  const { 
    state: editorState, 
    updateProperty, 
    toggleLockNode 
  } = useEditorCore();

  const [activeTab, setActiveTab] = React.useState<string>("Properties");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [activeState, setActiveState] = React.useState<string>("Default");
  const [favoriteProps, setFavoriteProps] = React.useState<Record<string, boolean>>({});
  
  // Binding configurations state
  const [activeBindings, setActiveBindings] = React.useState<Record<string, { type: string; path: string }>>({});
  
  // Custom Variants presets
  const [savedVariants, setSavedVariants] = React.useState<Record<string, any>>({});
  const [newVariantName, setNewVariantName] = React.useState<string>("");

  // Asset manager upload mocks
  const [mockAssets, setMockAssets] = React.useState<any[]>([
    { id: "img1", name: "Modern Office Workspace", url: "https://images.unsplash.com/photo-1497366216548-37526070297c", alt: "Office lobby workspace" },
    { id: "img2", name: "Minimalist Linen Shirts Grid", url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b", alt: "Folded clothing wardrobe" },
    { id: "img3", name: "Premium Leather Shoes", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772", alt: "Brown dress boots" },
  ]);
  const [newAltText, setNewAltText] = React.useState<string>("");

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    Spacing: true,
    Sizing: true,
    Fills: true,
    Stroke: true,
    Settings: true,
    General: true,
  });

  const selectedNode = (puckData?.content || []).find((node: any) => node.props?.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-80 border-l border-black/5 bg-white p-6 flex flex-col items-center justify-center text-center text-neutral-400 font-medium select-none shrink-0 h-full">
        <Info className="h-6 w-6 opacity-35 mb-2.5" />
        <p className="text-xs max-w-[180px] font-sans">Select any component on the canvas to configure properties.</p>
      </aside>
    );
  }

  const getTabbedFields = (flattenedFields: FlattenedField[], registryEntry: any) => {
    const tabs: Record<string, FlattenedField[]> = {
      Properties: [],
      Layout: [],
      Position: [],
      Style: [],
      Assets: [],
      Data: [],
      Theme: [],
      Animation: [],
      Advanced: [],
    };

    // Explicit custom metadata-driven mapping configured in Registry schemas:
    const customTabs = registryEntry?.inspector?.tabs;

    flattenedFields.forEach((field) => {
      const lowercaseKey = field.originalKey.toLowerCase();
      
      if (customTabs) {
        let mapped = false;
        Object.entries(customTabs).forEach(([tabName, keys]: [string, any]) => {
          if (Array.isArray(keys) && keys.includes(field.originalKey)) {
            const camelTab = tabName.charAt(0).toUpperCase() + tabName.slice(1);
            if (tabs[camelTab]) {
              tabs[camelTab].push(field);
              mapped = true;
            }
          }
        });
        if (mapped) return;
      }

      // Fallback auto-categorizer:
      if (
        lowercaseKey === "id" ||
        lowercaseKey === "aria" ||
        lowercaseKey === "customcss" ||
        lowercaseKey === "locked"
      ) {
        tabs.Advanced.push(field);
      }
      else if (
        lowercaseKey === "position" ||
        lowercaseKey === "overflow" ||
        lowercaseKey === "zindex" ||
        lowercaseKey === "sticky" ||
        lowercaseKey === "top" ||
        lowercaseKey === "bottom" ||
        lowercaseKey === "left" ||
        lowercaseKey === "right" ||
        lowercaseKey === "display"
      ) {
        tabs.Position.push(field);
      }
      else if (
        lowercaseKey === "width" ||
        lowercaseKey === "height" ||
        lowercaseKey === "minheight" ||
        lowercaseKey === "maxwidth" ||
        lowercaseKey === "containerwidth" ||
        lowercaseKey === "align" ||
        lowercaseKey === "padding" ||
        lowercaseKey === "margin" ||
        lowercaseKey === "gap" ||
        lowercaseKey === "flex" ||
        lowercaseKey === "grid"
      ) {
        tabs.Layout.push(field);
      }
      else if (
        lowercaseKey === "image" ||
        lowercaseKey === "video" ||
        lowercaseKey === "src" ||
        lowercaseKey === "icon" ||
        lowercaseKey === "logo" ||
        lowercaseKey === "svg" ||
        lowercaseKey === "font" ||
        lowercaseKey === "file" ||
        lowercaseKey === "alt" ||
        lowercaseKey.includes("url")
      ) {
        tabs.Assets.push(field);
      }
      else if (
        lowercaseKey === "bgcolor" ||
        lowercaseKey === "bgimage" ||
        lowercaseKey === "bgtype" ||
        lowercaseKey === "bggradient" ||
        lowercaseKey === "bordercolor" ||
        lowercaseKey === "borderwidth" ||
        lowercaseKey === "borderstyle" ||
        lowercaseKey === "radius" ||
        lowercaseKey === "shadow" ||
        lowercaseKey === "opacity" ||
        lowercaseKey === "blur" ||
        lowercaseKey === "variant" ||
        lowercaseKey === "color" ||
        lowercaseKey === "colour"
      ) {
        tabs.Style.push(field);
      }
      else if (
        lowercaseKey === "productid" ||
        lowercaseKey === "collection" ||
        lowercaseKey === "source" ||
        lowercaseKey === "bindings"
      ) {
        tabs.Data.push(field);
      }
      else if (
        lowercaseKey === "animation" ||
        lowercaseKey === "transition" ||
        lowercaseKey === "delay" ||
        lowercaseKey === "duration" ||
        lowercaseKey === "hovereffect" ||
        lowercaseKey === "zoomonhover"
      ) {
        tabs.Animation.push(field);
      }
      else if (
        lowercaseKey === "theme" ||
        lowercaseKey === "token"
      ) {
        tabs.Theme.push(field);
      }
      else {
        tabs.Properties.push(field);
      }
    });

    return tabs;
  };

  const getFieldGroup = (tabName: string, field: FlattenedField) => {
    const key = field.originalKey.toLowerCase();
    
    if (tabName === "Layout") {
      if (key === "padding" || key === "margin") return "Spacing";
      if (key === "width" || key === "height" || key === "minheight" || key === "maxwidth" || key === "containerwidth") return "Sizing";
      return "Flex & Grid Grids";
    }
    
    if (tabName === "Style") {
      if (key.includes("bg") || key.includes("color") || key.includes("colour")) return "Fills";
      if (key.includes("border") || key === "radius") return "Stroke";
      return "Effects & Style Filters";
    }
    
    if (tabName === "Advanced") {
      if (key === "customcss") return "Custom CSS Layout";
      if (key === "id" || key.includes("aria")) return "Attributes & Accessibility";
      return "Developer View";
    }
    
    return "General Settings";
  };

  const entry = Registry.get(selectedNode.type);
  const defaultProps = entry?.defaultProps || {};
  const flattened = flattenSchema(entry?.schema || {}, defaultProps);
  const tabbedFields = getTabbedFields(flattened, entry);

  // Filter fields based on search query
  const activeFields = (tabbedFields[activeTab] || []).filter((field) => 
    field.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group fields inside active tab
  const grouped: Record<string, FlattenedField[]> = {};
  activeFields.forEach((field) => {
    const groupName = getFieldGroup(activeTab, field);
    if (!grouped[groupName]) grouped[groupName] = [];
    grouped[groupName].push(field);
  });

  const handlePropChange = (path: string[], val: any) => {
    const isLocked = selectedNode.props?.locked;
    if (isLocked) return; // frozen node

    updateProperty(selectedNode.props.id, path, val, activeState, activeTab);
  };

  const togglePropFavorite = (propKey: string) => {
    setFavoriteProps(prev => ({ ...prev, [propKey]: !prev[propKey] }));
  };

  const triggerAISuggestion = (field: FlattenedField) => {
    alert(`[AI Suggestion] Recommended values for ${field.label}: Use Theme Accent and default layout scales for optimal contrast.`);
  };

  // Variant manager triggers
  const handleSaveVariant = () => {
    if (!newVariantName.trim()) return;
    setSavedVariants(prev => ({
      ...prev,
      [newVariantName]: { ...selectedNode.props }
    }));
    alert(`✓ Saved variant configuration as "${newVariantName}"`);
    setNewVariantName("");
  };

  const handleApplyVariant = (varName: string) => {
    const val = savedVariants[varName];
    if (val) {
      Object.entries(val).forEach(([k, v]) => {
        if (k !== "id") handlePropChange([k], v);
      });
    }
  };

  const handleMockUpload = () => {
    const name = prompt("Enter asset name:", "Shopify Promo Banner");
    const url = prompt("Enter asset image URL:", "https://images.unsplash.com/photo-1542291026-7eec264c27ff");
    if (name && url) {
      setMockAssets(prev => [
        ...prev,
        { id: `asset-${Math.random().toString(36).substr(2, 5)}`, name, url, alt: "New clothing catalog image" }
      ]);
    }
  };

  const renderArrayBuilder = (field: FlattenedField) => {
    const items = selectedNode.props?.[field.originalKey] || [];
    const arrayFields = field.arrayFields || {};

    const handleAddItem = () => {
      const newItem: any = {};
      Object.entries(arrayFields).forEach(([k, f]: [string, any]) => {
        newItem[k] = f.default ?? "";
      });
      const nextItems = [...items, newItem];
      handlePropChange(field.path, nextItems);
    };

    const handleDeleteItem = (index: number) => {
      const nextItems = items.filter((_: any, i: number) => i !== index);
      handlePropChange(field.path, nextItems);
    };

    const handleItemFieldChange = (index: number, subKey: string, val: any) => {
      const nextItems = [...items];
      nextItems[index] = {
        ...nextItems[index],
        [subKey]: val,
      };
      handlePropChange(field.path, nextItems);
    };

    return (
      <div className="space-y-3 p-3.5 bg-neutral-50/50 rounded-2xl border border-black/5 text-xs text-left">
        <div className="flex justify-between items-center select-none">
          <label className="font-bold text-[#0F1020]/70 uppercase tracking-wider text-[10px]">{field.label}</label>
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-black text-white rounded-lg text-[10px] font-semibold hover:bg-neutral-800 transition active:scale-95"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className="text-[10px] text-neutral-400 font-medium py-3 text-center bg-white rounded-xl border border-dashed border-neutral-200">
            No items added yet. Click Add to create one.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="p-3 bg-white rounded-xl border border-black/5 relative space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center border-b border-black/5 pb-1.5 select-none">
                  <span className="font-mono text-[10px] font-bold text-neutral-500">Item #{idx + 1}</span>
                  <button
                    onClick={() => handleDeleteItem(idx)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                {Object.entries(arrayFields).map(([subKey, subField]: [string, any]) => {
                  let subType = subField.type || "text";
                  if (subType === "radio") subType = "select";
                  if (subType === "boolean") subType = "select";
                  
                  const lowercaseSubKey = subKey.toLowerCase();
                  if (lowercaseSubKey.includes("color") || lowercaseSubKey.includes("colour")) {
                    subType = "color";
                  }

                  return (
                    <ControlFactory
                      key={subKey}
                      type={subType}
                      label={subField.label || subKey}
                      value={item[subKey] ?? subField.default ?? ""}
                      options={subField.options}
                      onChange={(val) => handleItemFieldChange(idx, subKey, val)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TABS = [
    { id: "Properties", icon: FileText },
    { id: "Layout", icon: Layout },
    { id: "Position", icon: Compass },
    { id: "Style", icon: Sparkles },
    { id: "Assets", icon: FileImage },
    { id: "Data", icon: Database },
    { id: "Theme", icon: Palette },
    { id: "Animation", icon: Play },
    { id: "Advanced", icon: Settings },
  ];

  return (
    <aside className="w-80 border-l border-black/5 bg-white flex flex-col shrink-0 h-full overflow-hidden text-[#0F1020]">
      {/* Component Title Header */}
      <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Settings className="h-4.5 w-4.5 text-[#0F1020]/60" />
          <h3 className="text-xs uppercase font-mono tracking-widest text-[#0F1020]/75 font-bold truncate">
            {selectedNode.type.split(".").pop()}
          </h3>
        </div>
        <span className="px-2 py-0.5 bg-neutral-100 rounded-md text-[9px] font-mono text-neutral-500 font-bold uppercase select-none">
          Active
        </span>
      </div>

      {/* 9 Tabs Visual Switcher */}
      <div className="flex border-b border-black/5 bg-neutral-50/50 p-1 gap-0.5 overflow-x-auto scrollbar-none select-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.id}
              className={`p-2 flex-1 flex flex-col items-center gap-1 rounded-lg text-[9px] font-sans font-semibold transition active:scale-95 shrink-0 ${
                isActive 
                  ? "bg-white text-indigo-600 shadow-sm border border-black/5 font-bold" 
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.id.substring(0, 4)}.</span>
            </button>
          );
        })}
      </div>

      {/* Global Interactive Search */}
      <div className="px-6 py-3 border-b border-black/5 flex items-center gap-2 select-none relative">
        <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-9" />
        <input 
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 rounded-xl border border-black/5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
        />
      </div>

      {/* Tab Specific Options State Switchers */}
      {activeTab === "Style" && (
        <div className="px-6 py-2.5 bg-neutral-50/20 border-b border-black/5 flex gap-1 select-none text-[10px]">
          {["Default", "Hover", "Focus", "Active"].map((state) => (
            <button
              key={state}
              onClick={() => setActiveState(state)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeState === state
                  ? "bg-black text-white"
                  : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      )}

      {/* Inspector Performance Rules: Conditional DOM Mounting per active tab */}
      <div className="flex-1 overflow-y-auto">
        
        {/* properties Tab Custom Variants block */}
        {activeTab === "Properties" && (
          <div className="px-6 py-4 border-b border-black/5 space-y-3 bg-neutral-50/30 text-xs">
            <h4 className="font-bold text-[10px] text-[#0F1020]/60 uppercase tracking-widest flex items-center gap-1.5">
              <ArrowRightLeft className="h-3.5 w-3.5" /> Variant Manager
            </h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Variant Preset Name..." 
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                className="flex-1 px-2.5 py-1 bg-white rounded-lg border border-black/10 text-xs focus:outline-none"
              />
              <button 
                onClick={handleSaveVariant}
                className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </div>
            
            {Object.keys(savedVariants).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {Object.keys(savedVariants).map((varName) => (
                  <button 
                    key={varName}
                    onClick={() => handleApplyVariant(varName)}
                    className="px-2.5 py-1 bg-white rounded-lg border border-black/5 hover:border-indigo-500 font-mono text-[9px]"
                  >
                    Apply: {varName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ASSETS TAB PANEL */}
        {activeTab === "Assets" && (
          <div className="p-6 space-y-5 text-xs text-left">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-[10px] text-[#0F1020]/60 uppercase tracking-widest">Library Images & Icons</h4>
              <button 
                onClick={handleMockUpload}
                className="px-2.5 py-1 bg-black text-white rounded-lg text-[10px] font-semibold hover:bg-neutral-800 transition"
              >
                Upload Asset
              </button>
            </div>

            {/* Asset Picker List */}
            <div className="grid grid-cols-2 gap-3.5">
              {mockAssets.map((asset) => (
                <div 
                  key={asset.id}
                  onClick={() => {
                    handlePropChange(["image"], asset.url);
                    handlePropChange(["src"], asset.url);
                    setNewAltText(asset.alt);
                    alert(`✓ Asset selected and URL bound to component image fields!`);
                  }}
                  className="bg-white rounded-xl border border-black/5 p-2 shadow-sm cursor-pointer hover:border-indigo-500 transition group select-none relative"
                >
                  <img src={asset.url} alt={asset.name} className="h-16 w-full object-cover rounded-lg mb-1.5" />
                  <p className="font-sans font-semibold text-[9px] text-neutral-600 truncate">{asset.name}</p>
                </div>
              ))}
            </div>

            {/* Asset Editing overrides */}
            <div className="border-t border-black/5 pt-4 space-y-3">
              <h5 className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider">Alt text Override</h5>
              <input 
                type="text"
                placeholder="Image alt description..."
                value={newAltText}
                onChange={(e) => {
                  setNewAltText(e.target.value);
                  handlePropChange(["alt"], e.target.value);
                }}
                className="w-full px-3 py-2 bg-neutral-50 rounded-xl border border-black/5 text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* DATA BINDINGS ENGINE TAB */}
        {activeTab === "Data" && (
          <div className="p-6 space-y-5 text-xs text-left">
            <div>
              <h4 className="font-bold text-[10px] text-[#0F1020]/60 uppercase tracking-widest">Binding Variable Engine</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">Map component fields to dynamic database collection settings.</p>
            </div>

            <div className="space-y-4">
              {["title", "heading", "subheading", "badge", "quote"].map((propKey) => {
                const binding = activeBindings[propKey] || { type: "Manual", path: "" };

                const handleBindingTypeChange = (type: string) => {
                  const updated = { ...binding, type };
                  setActiveBindings(prev => ({ ...prev, [propKey]: updated }));
                  if (type === "Manual") {
                    handlePropChange([propKey], "Sample Content Title");
                  } else {
                    handlePropChange([propKey], `{{ ${type.toLowerCase()}.${propKey} }}`);
                  }
                };

                return (
                  <div key={propKey} className="p-3 bg-neutral-50/50 rounded-xl border border-black/5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-[10px] text-neutral-500 uppercase">{propKey} Field</span>
                      <select
                        value={binding.type}
                        onChange={(e) => handleBindingTypeChange(e.target.value)}
                        className="bg-white border border-black/10 rounded px-1.5 py-0.5 text-[9px] font-semibold focus:outline-none"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Theme Token">Theme Token</option>
                        <option value="CMS">CMS Bind</option>
                        <option value="Commerce">Commerce Bind</option>
                        <option value="Expression">JS Expression</option>
                      </select>
                    </div>

                    {binding.type !== "Manual" && (
                      <input 
                        type="text"
                        placeholder="Path reference e.g. products.0.title"
                        value={binding.path}
                        onChange={(e) => {
                          const updated = { ...binding, path: e.target.value };
                          setActiveBindings(prev => ({ ...prev, [propKey]: updated }));
                        }}
                        className="w-full px-2.5 py-1 bg-white rounded-lg border border-black/10 text-[10px] font-mono focus:outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EVENT SYSTEM OPTIONS & TRIGGERS PANEL */}
        {activeTab === "Animation" && (
          <div className="p-6 border-b border-black/5 space-y-4 text-xs text-left">
            <h4 className="font-bold text-[10px] text-[#0F1020]/60 uppercase tracking-widest flex items-center gap-1.5 select-none">
              <Link className="h-3.5 w-3.5" /> Interactive Event Triggers
            </h4>
            
            <div className="space-y-3.5">
              {["OnClick", "OnHover", "OnScroll"].map((evt) => {
                const savedAction = selectedNode.props?.events?.[evt] || { action: "none", target: "" };

                const handleActionChange = (action: string) => {
                  const events = selectedNode.props?.events || {};
                  handlePropChange(["events", evt], { ...savedAction, action });
                };

                const handleTargetChange = (target: string) => {
                  const events = selectedNode.props?.events || {};
                  handlePropChange(["events", evt], { ...savedAction, target });
                };

                return (
                  <div key={evt} className="p-3 bg-neutral-50/50 rounded-xl border border-black/5 space-y-2">
                    <div className="flex justify-between items-center select-none">
                      <span className="font-semibold text-neutral-600">{evt}</span>
                      <select
                        value={savedAction.action}
                        onChange={(e) => handleActionChange(e.target.value)}
                        className="bg-white border border-black/10 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                      >
                        <option value="none">No Action</option>
                        <option value="link">Open URL Link</option>
                        <option value="scroll">Scroll to Section</option>
                        <option value="cart">Add to Cart</option>
                      </select>
                    </div>

                    {savedAction.action !== "none" && (
                      <input 
                        type="text"
                        placeholder="Link URL or Section ID target..."
                        value={savedAction.target}
                        onChange={(e) => handleTargetChange(e.target.value)}
                        className="w-full px-2.5 py-1 bg-white rounded-lg border border-black/10 text-[10px] focus:outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RENDER STANDARD FIELDS GROUPINGS IF NOT ASSETS/DATA/THEME PANELS */}
        {activeTab !== "Assets" && activeTab !== "Data" && Object.entries(grouped).map(([groupName, groupFields]) => {
          const isOpen = openGroups[groupName] ?? true;

          return (
            <div key={groupName} className="border-b border-black/5">
              <button
                onClick={() => setOpenGroups({ ...openGroups, [groupName]: !isOpen })}
                className="w-full px-6 py-3.5 flex justify-between items-center bg-neutral-50/50 hover:bg-neutral-50 transition text-left select-none"
              >
                <span className="text-[10px] font-bold text-[#0F1020]/75 tracking-wider uppercase font-sans">
                  {groupName}
                </span>
                {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-neutral-400" /> : <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />}
              </button>

              {isOpen && (
                <div className="px-6 py-4 space-y-4 bg-white">
                  {groupFields.map((field) => {
                    const propKey = field.path.join(".");
                    const isLocked = selectedNode.props?.locked;
                    const isFavorite = favoriteProps[propKey];
                    const permission = field.permissions || "editable";

                    // Check Permission rules
                    if (permission === "hidden") return null; // do not render
                    const isReadOnly = permission === "readOnly";
                    const isLockedProp = permission === "locked";

                    if (field.type === "array") {
                      return <React.Fragment key={field.label}>{renderArrayBuilder(field)}</React.Fragment>;
                    }

                    // Render Visual Box spacing layout editor if Spacing property matches
                    if (activeTab === "Layout" && groupName === "Spacing" && (field.originalKey === "padding" || field.originalKey === "margin")) {
                      const val = getNestedProperty(selectedNode.props, field.path) ?? field.default;
                      const spacingString = typeof val === "object" ? (val.desktop || "0px") : val || "0px";
                      return (
                        <div key={field.label} className="relative group/spacing">
                          <SpacingBoxEditor 
                            label={field.label}
                            value={spacingString}
                            onChange={(nextSpacing) => handlePropChange(field.path, nextSpacing)}
                          />
                          {/* Visual Locks and favorites overlay */}
                          <div className="absolute right-0 top-0 flex gap-1 select-none">
                            <button onClick={() => toggleLockNode(selectedNode.props.id)} title="Lock Property">
                              {isLocked ? <Lock className="h-3 w-3 text-red-500" /> : <Unlock className="h-3 w-3 text-neutral-300 hover:text-neutral-500" />}
                            </button>
                            <button onClick={() => togglePropFavorite(propKey)} title="Pin to Favorites">
                              <Star className={`h-3 w-3 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-neutral-300 hover:text-yellow-500"}`} />
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // Fetch value with Hover state overrides if editing Hover Style
                    let val = getNestedProperty(selectedNode.props, field.path) ?? field.default;
                    if (activeState === "Hover" && activeTab === "Style") {
                      val = getNestedProperty(selectedNode.props, ["states", "hover", ...field.path]) ?? val;
                    }

                    return (
                      <div key={field.label} className="relative space-y-1">
                        {/* Property Actions Overlays */}
                        <div className="flex justify-between items-center select-none pr-1">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide flex items-center gap-1">
                            {isReadOnly && <ShieldAlert className="h-3 w-3 text-orange-400" />}
                            {isReadOnly && "READ-ONLY"}
                            {isLockedProp && "LOCKED FIELD"}
                          </span>
                          <div className="flex gap-1.5 items-center">
                            <button onClick={() => triggerAISuggestion(field)} title="AI Suggestion" className="text-neutral-300 hover:text-indigo-500">
                              <Sparkle className="h-3 w-3" />
                            </button>
                            <button onClick={() => toggleLockNode(selectedNode.props.id)} title="Lock Property">
                              {isLocked ? <Lock className="h-3 w-3 text-red-500" /> : <Unlock className="h-3 w-3 text-neutral-300 hover:text-neutral-500" />}
                            </button>
                            <button onClick={() => togglePropFavorite(propKey)} title="Pin to Favorites">
                              <Star className={`h-3 w-3 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-neutral-300 hover:text-yellow-500"}`} />
                            </button>
                          </div>
                        </div>

                        <div className={(isLocked || isReadOnly || isLockedProp) ? "pointer-events-none opacity-50" : ""}>
                          <ControlFactory
                            type={field.type}
                            label={field.label}
                            value={val}
                            options={field.options}
                            onChange={(nextVal) => handlePropChange(field.path, nextVal)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default PropertyInspector;
