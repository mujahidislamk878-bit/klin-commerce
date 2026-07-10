import React from "react";
import { useBuilder } from "../core/BuilderContext";
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
  Sparkle
} from "lucide-react";

interface FlattenedField {
  path: string[];
  type: string;
  label: string;
  default: any;
  options?: any[];
  arrayFields?: Record<string, any>;
  originalKey: string;
  ai?: {
    editable?: boolean;
    description?: string;
  };
}

function getNestedProperty(obj: any, path: string[]): any {
  return path.reduce((acc, part) => acc?.[part], obj);
}

function updateNestedProperty(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value;
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };
  const [head, ...tail] = path;
  newObj[head] = updateNestedProperty(obj[head], tail, value);
  return newObj;
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
  const { puckData, selectedNodeId, setPuckData } = useBuilder();
  const [activeTab, setActiveTab] = React.useState<string>("Properties");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [activeState, setActiveState] = React.useState<string>("Default");
  const [lockedProps, setLockedProps] = React.useState<Record<string, boolean>>({});
  const [favoriteProps, setFavoriteProps] = React.useState<Record<string, boolean>>({});
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    Spacing: true,
    Sizing: true,
    Fill: true,
    Borders: true,
    Effects: true,
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

  const getTabbedFields = (flattened: FlattenedField[]) => {
    const tabs: Record<string, FlattenedField[]> = {
      Properties: [],
      Layout: [],
      Style: [],
      Data: [],
      Theme: [],
      Animation: [],
      Advanced: [],
    };

    flattened.forEach((field) => {
      const lowercaseKey = field.originalKey.toLowerCase();
      
      if (
        lowercaseKey === "id" ||
        lowercaseKey === "aria" ||
        lowercaseKey === "customcss" ||
        lowercaseKey === "locked"
      ) {
        tabs.Advanced.push(field);
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
        lowercaseKey === "position" ||
        lowercaseKey === "overflow" ||
        lowercaseKey === "zindex" ||
        lowercaseKey === "sticky"
      ) {
        tabs.Layout.push(field);
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
      return "Alignment & Positioning";
    }
    
    if (tabName === "Style") {
      if (key.includes("bg") || key.includes("color") || key.includes("colour")) return "Fill";
      if (key.includes("border") || key === "radius") return "Borders";
      return "Effects";
    }
    
    if (tabName === "Advanced") {
      if (key === "customcss") return "Custom CSS";
      if (key === "id" || key.includes("aria")) return "Attributes & ARIA";
      return "Developer View";
    }
    
    return "General";
  };

  const entry = Registry.get(selectedNode.type);
  const defaultProps = entry?.defaultProps || {};
  const flattened = flattenSchema(entry?.schema || {}, defaultProps);
  const tabbedFields = getTabbedFields(flattened);

  // Filter fields inside active tab based on search query
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
    const propKey = path.join(".");
    if (lockedProps[propKey]) return; // locked

    const nextContent = (puckData?.content || []).map((node: any) => {
      if (node.props?.id === selectedNodeId) {
        // If state is Hover and style field, write to states.hover namespace
        if (activeState === "Hover" && activeTab === "Style") {
          const hoverPath = ["states", "hover", ...path];
          const nextProps = updateNestedProperty(node.props, hoverPath, val);
          return { ...node, props: nextProps };
        }
        
        const nextProps = updateNestedProperty(node.props, path, val);
        return {
          ...node,
          props: nextProps,
        };
      }
      return node;
    });
    setPuckData({ ...puckData, content: nextContent });
  };

  const togglePropLock = (propKey: string) => {
    setLockedProps(prev => ({ ...prev, [propKey]: !prev[propKey] }));
  };

  const togglePropFavorite = (propKey: string) => {
    setFavoriteProps(prev => ({ ...prev, [propKey]: !prev[propKey] }));
  };

  const triggerAISuggestion = (field: FlattenedField) => {
    alert(`[AI Suggestion] Recommended values for ${field.label}: Use Theme Primary and default padding scales for optimal layout contrast.`);
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
    { id: "Style", icon: Sparkles },
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

      {/* Reusable Visual Tab Switcher */}
      <div className="flex border-b border-black/5 bg-neutral-50/50 p-1 gap-0.5 overflow-x-auto scrollbar-none select-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.id}
              className={`p-2 flex-1 flex flex-col items-center gap-1 rounded-lg text-[9px] font-sans font-semibold transition active:scale-95 ${
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

      {/* Render Active Panels and Groups */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-xs text-neutral-400 font-semibold text-center py-10 font-sans">
            No properties found in this panel.
          </div>
        ) : (
          Object.entries(grouped).map(([groupName, groupFields]) => {
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
                      const isLocked = lockedProps[propKey];
                      const isFavorite = favoriteProps[propKey];

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
                              <button onClick={() => togglePropLock(propKey)} title="Lock Property">
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
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">
                              {isLocked && "[LOCKED]"}
                            </span>
                            <div className="flex gap-1.5 items-center">
                              <button onClick={() => triggerAISuggestion(field)} title="AI Suggestion" className="text-neutral-300 hover:text-indigo-500">
                                <Sparkle className="h-3 w-3" />
                              </button>
                              <button onClick={() => togglePropLock(propKey)} title="Lock Property">
                                {isLocked ? <Lock className="h-3 w-3 text-red-500" /> : <Unlock className="h-3 w-3 text-neutral-300 hover:text-neutral-500" />}
                              </button>
                              <button onClick={() => togglePropFavorite(propKey)} title="Pin to Favorites">
                                <Star className={`h-3 w-3 ${isFavorite ? "text-yellow-500 fill-yellow-500" : "text-neutral-300 hover:text-yellow-500"}`} />
                              </button>
                            </div>
                          </div>

                          <div className={isLocked ? "pointer-events-none opacity-50" : ""}>
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
          })
        )}
      </div>
    </aside>
  );
}

export default PropertyInspector;
