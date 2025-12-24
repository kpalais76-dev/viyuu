
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Waves, 
  ClipboardCheck, 
  Camera, 
  X, 
  Backpack, 
  MapPinned, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft,
  Settings2,
  CalendarDays,
  Loader2,
  History,
  Zap,
  MessageSquareQuote,
  Tags as TagsIcon,
  CloudSun,
  AlertTriangle,
  RefreshCcw,
  Save,
  FilePlus,
  Check,
  Edit2
} from 'lucide-react';
import { Button, Card, Input, FishingDataBlock, Modal } from '../../shared/ui';
import { Rarity, ExifData, FishRecord, AppEvent, GearSet, FishingSpot } from '../../core/types';
import DB from '../../core/db';
import AuthService from '../../core/auth';
import EventBus from '../../core/bus';
import { cn } from '../../shared/utils/styles';
import { SBTSuccessModal } from './record/components/SBTSuccessModal';

const PREF_LAST_CONFIG = 'zhiyu_last_config';

const TAG_OPTIONS = [
  { label: '放流', category: 'Outcome' },
  { label: '带回', category: 'Outcome' },
  { label: '切线', category: 'Incident' },
  { label: '脱钩', category: 'Incident' },
  { label: '底钓', category: 'Technique' },
  { label: '浮钓', category: 'Technique' },
  { label: '接口', category: 'Technique' },
];

const WEATHER_OPTIONS = ['晴朗', '多云', '阴天', '有风', '小雨'];

const RecordPage: React.FC = () => {
  const user = AuthService.getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [exif, setExif] = useState<ExifData | null>(null);
  
  const [gearList, setGearList] = useState<GearSet[]>([]);
  const [spotList, setSpotList] = useState<FishingSpot[]>([]);
  const [recentSpecies, setRecentSpecies] = useState<string[]>([]);

  // Selection state
  const [selectedGearId, setSelectedGearId] = useState('');
  const [selectedSpotId, setSelectedSpotId] = useState('');
  const [recordTime, setRecordTime] = useState(new Date().toISOString().slice(0, 16));
  const [manualWeather, setManualWeather] = useState('晴朗');

  // Logic Branch: is it Backfill?
  const isBackfill = useMemo(() => {
    const diff = Math.abs(Date.now() - new Date(recordTime).getTime());
    return diff > 3600000; // More than 1 hour diff
  }, [recordTime]);

  // Snapshot override state
  const [snapRod, setSnapRod] = useState('');
  const [snapReel, setSnapReel] = useState('');
  const [snapLine, setSnapLine] = useState('');
  const [snapHook, setSnapHook] = useState('');

  // Gear Decision State
  const [originalGearValues, setOriginalGearValues] = useState<{rod: string, reel: string, line: string, hook: string} | null>(null);
  const [gearSaveMode, setGearSaveMode] = useState<'snapshot' | 'update' | 'new'>('snapshot');
  const [newGearSetName, setNewGearSetName] = useState('');
  const [gearDecisionMade, setGearDecisionMade] = useState(false);

  const isGearModified = useMemo(() => {
    if (!originalGearValues) return false;
    return snapRod !== originalGearValues.rod ||
           snapReel !== originalGearValues.reel ||
           snapLine !== originalGearValues.line ||
           snapHook !== originalGearValues.hook;
  }, [snapRod, snapReel, snapLine, snapHook, originalGearValues]);

  // Effect to reset decision when values keep changing
  useEffect(() => {
    setGearDecisionMade(false);
  }, [snapRod, snapReel, snapLine, snapHook]);

  // Analytics & Notes
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');

  // Success Modal state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastCreatedRecord, setLastCreatedRecord] = useState<FishRecord | null>(null);

  // Modals state
  const [isGearModalOpen, setIsGearModalOpen] = useState(false);
  const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'list' | 'add'>('list');

  // Form states
  const [species, setSpecies] = useState('');
  const [length, setLength] = useState('');
  const [weight, setWeight] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Add states
  const [newGear, setNewGear] = useState({ name: '', rod: '', line: '', hook: '', reel: '' });
  const [newSpot, setNewSpot] = useState({ name: '', type: '水库' });

  const refreshData = async () => {
    if (!user) return;
    const [gears, spots, records] = await Promise.all([
      DB.findAll<GearSet>(DB.COLLECTIONS.GEAR_SETS),
      DB.findAll<FishingSpot>(DB.COLLECTIONS.SPOTS),
      DB.findAll<FishRecord>(DB.COLLECTIONS.RECORDS)
    ]);
    
    const myGears = gears.filter(g => g.userId === user.id);
    const mySpots = spots.filter(s => s.userId === user.id);
    setGearList(myGears);
    setSpotList(mySpots);

    const speciesHistory = Array.from(new Set(records.filter(r => r.userId === user.id).map(r => r.species))).slice(0, 3);
    setRecentSpecies(speciesHistory);
  };

  useEffect(() => {
    const initPage = async () => {
      if (!user) return;
      await refreshData();
      const lastConfig = localStorage.getItem(PREF_LAST_CONFIG);
      if (lastConfig) {
        const { gearId, spotId } = JSON.parse(lastConfig);
        setSelectedGearId(gearId);
        setSelectedSpotId(spotId);
      }
    };
    initPage();
  }, [user]);

  // Weather Logic
  useEffect(() => {
    if (isBackfill) {
      setExif(null);
      return;
    }

    if (!selectedSpotId && !recordTime) return;
    
    const fetchWeather = async () => {
      setWeatherLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const hour = new Date(recordTime).getHours();
      const isNight = hour > 18 || hour < 6;
      const spot = spotList.find(s => s.id === selectedSpotId);
      
      setExif({
        pressure: Math.floor(Math.random() * (1015 - 1000) + 1000),
        tide: isNight ? '平潮' : ['涨潮', '落潮'][Math.floor(Math.random() * 2)],
        location: { 
          lat: 0, 
          lng: 0, 
          name: spot?.name || '未知钓点' 
        }
      });
      setWeatherLoading(false);
    };

    fetchWeather();
  }, [selectedSpotId, recordTime, spotList, isBackfill]);

  // Gear Auto-fill
  useEffect(() => {
    const gear = gearList.find(g => g.id === selectedGearId);
    if (gear) {
      const values = {
        rod: gear.rod,
        reel: gear.reel || '',
        line: gear.line,
        hook: gear.hook
      };
      setSnapRod(values.rod);
      setSnapReel(values.reel);
      setSnapLine(values.line);
      setSnapHook(values.hook);
      setOriginalGearValues(values);
      setGearSaveMode('snapshot');
      setGearDecisionMade(false);
    }
  }, [selectedGearId, gearList]);

  const activeGear = gearList.find(g => g.id === selectedGearId);
  const activeSpot = spotList.find(s => s.id === selectedSpotId);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleCreateGear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const item = await DB.create<GearSet>(DB.COLLECTIONS.GEAR_SETS, {
      id: `g_${Date.now()}`,
      userId: user.id,
      ...newGear
    });
    await refreshData();
    setSelectedGearId(item.id);
    setIsGearModalOpen(false);
    setModalMode('list');
  };

  const handleCreateSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const item = await DB.create<FishingSpot>(DB.COLLECTIONS.SPOTS, {
      id: `s_${Date.now()}`,
      userId: user.id,
      ...newSpot
    });
    await refreshData();
    setSelectedSpotId(item.id);
    setIsSpotModalOpen(false);
    setModalMode('list');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeGear || !activeSpot || !previewUrl || !species) {
      alert('请完整填写关键信息（照片、鱼种、地点、装备）。');
      return;
    }

    if (isGearModified && !gearDecisionMade) {
      alert('检测到装备配置已更改，请在保存前确认处理方式。');
      return;
    }

    if (isGearModified && gearSaveMode === 'new' && !newGearSetName) {
      alert('存为新套装时需要输入套装名称。');
      return;
    }

    setLoading(true);

    let finalGearId = activeGear.id;
    let finalGearName = activeGear.name;
    const currentSnapshot = {
      rod: snapRod,
      reel: snapReel,
      line: snapLine,
      hook: snapHook
    };

    // Execution Decision Logic
    if (isGearModified) {
      if (gearSaveMode === 'update') {
        await DB.update<GearSet>(DB.COLLECTIONS.GEAR_SETS, activeGear.id, currentSnapshot);
      } else if (gearSaveMode === 'new') {
        const newSet = await DB.create<GearSet>(DB.COLLECTIONS.GEAR_SETS, {
          id: `g_${Date.now()}`,
          userId: user.id,
          name: newGearSetName,
          ...currentSnapshot
        });
        finalGearId = newSet.id;
        finalGearName = newSet.name;
      }
    }

    const w = weight ? parseFloat(weight) : 0;
    const l = length ? parseFloat(length) : 0;
    const rarity = w > 8 || l > 80 ? 'Legendary' : (w > 3 || l > 45 ? 'Rare' : 'Common');

    const record: FishRecord = {
      id: `r_${Date.now()}`,
      userId: user.id,
      species,
      length: l,
      weight: w,
      rarity,
      imageUrl: previewUrl,
      exifData: exif || { 
        pressure: 0, 
        tide: '未记录', 
        location: { lat: 0, lng: 0, name: activeSpot.name } 
      },
      manualWeather: isBackfill ? manualWeather : undefined,
      gearSetId: finalGearId,
      gearSetName: finalGearName,
      spotId: activeSpot.id,
      spotName: activeSpot.name,
      gearSnapshot: currentSnapshot,
      tags: selectedTags,
      note,
      timestamp: new Date(recordTime).getTime(),
    };

    const created = await DB.create(DB.COLLECTIONS.RECORDS, record);
    localStorage.setItem(PREF_LAST_CONFIG, JSON.stringify({ gearId: finalGearId, spotId: activeSpot.id }));
    
    await refreshData();
    EventBus.emit(AppEvent.RECORD_ADDED, created);
    
    setLastCreatedRecord(created);
    setIsSuccessModalOpen(true);

    // Reset Form
    setSpecies('');
    setLength('');
    setWeight('');
    setPreviewUrl(null);
    setSelectedTags([]);
    setNote('');
    setNewGearSetName('');
    setGearDecisionMade(false);
    setLoading(false);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. COMPACT HEADER */}
      <Card padding="none" className="overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white">
        <div className="flex p-4 gap-4 items-stretch">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-28 aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden border-2 border-dashed shrink-0 relative",
              previewUrl ? "border-transparent" : "border-slate-100 bg-slate-50 text-slate-300 hover:border-blue-400"
            )}
          >
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover" alt="Thumb" />
            ) : (
              <>
                <Camera size={24} className="mb-1" />
                <span className="text-[9px] font-black uppercase">上传实拍</span>
              </>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreviewUrl(URL.createObjectURL(file));
            }} />
          </div>

          <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-slate-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">垂钓时间</p>
                <input 
                  type="datetime-local" 
                  value={recordTime} 
                  onChange={(e) => setRecordTime(e.target.value)}
                  className="w-full text-xs font-bold text-slate-700 bg-transparent outline-none appearance-none" 
                />
              </div>
            </div>
            <div className="h-px bg-slate-50 w-full" />
            <button onClick={() => { setModalMode('list'); setIsSpotModalOpen(true); }} className="flex items-center gap-2 text-left">
              <MapPinned size={14} className="text-emerald-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">钓点</p>
                <p className={cn("text-xs font-bold truncate", activeSpot ? "text-slate-700" : "text-slate-300")}>
                  {activeSpot?.name || "点击选择..."}
                </p>
              </div>
              <ChevronRight size={14} className="text-slate-200" />
            </button>
            <div className="h-px bg-slate-50 w-full" />
            <button onClick={() => { setModalMode('list'); setIsGearModalOpen(true); }} className="flex items-center gap-2 text-left">
              <Backpack size={14} className="text-amber-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">装备</p>
                <p className={cn("text-xs font-bold truncate", activeGear ? "text-slate-700" : "text-slate-300")}>
                  {activeGear?.name || "点击选择..."}
                </p>
              </div>
              <ChevronRight size={14} className="text-slate-200" />
            </button>
          </div>
        </div>
      </Card>

      {/* 2. GEAR CONFIGURATION */}
      {activeGear && (
        <Card padding="sm" className="bg-slate-50/80 border-slate-100 mx-1 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Settings2 size={12} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">配置实测细节 (微调)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase px-1">鱼竿</label>
              <input value={snapRod} onChange={e => setSnapRod(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-300" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase px-1">卷线器</label>
              <input value={snapReel} onChange={e => setSnapReel(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-300" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase px-1">线组</label>
              <input value={snapLine} onChange={e => setSnapLine(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-300" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black text-slate-400 uppercase px-1">鱼钩</label>
              <input value={snapHook} onChange={e => setSnapHook(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-300" />
            </div>
          </div>

          {/* Decision Logic: Resolve & Collapse pattern */}
          {isGearModified ? (
            !gearDecisionMade ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-500" />
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">检测到配置变更，请选择：</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => { setGearSaveMode('snapshot'); setGearDecisionMade(true); }} className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border bg-white border-amber-100 text-amber-600 text-[9px] font-bold hover:bg-amber-100">
                    <RefreshCcw size={12} /> 仅本次生效
                  </button>
                  <button onClick={() => { setGearSaveMode('update'); setGearDecisionMade(true); }} className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border bg-blue-600 border-blue-600 text-white text-[9px] font-bold shadow-sm">
                    <Save size={12} /> 更新原套装
                  </button>
                  <button onClick={() => setGearSaveMode('new')} className={cn("flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-[9px] font-bold transition-all", gearSaveMode === 'new' ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-blue-100 text-blue-600")}>
                    <FilePlus size={12} /> 存为新套装
                  </button>
                </div>
                {gearSaveMode === 'new' && (
                  <div className="flex gap-2 animate-in slide-in-from-top-1">
                    <input placeholder="输入新套装名称..." value={newGearSetName} onChange={e => setNewGearSetName(e.target.value)} className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none" />
                    <button onClick={() => setGearDecisionMade(true)} className="p-1.5 bg-blue-600 text-white rounded-lg"><Check size={16} /></button>
                  </div>
                )}
              </div>
            ) : (
              <div className={cn("mx-1 p-2 rounded-xl flex items-center justify-between animate-in zoom-in-95", gearSaveMode === 'snapshot' ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-700 border border-blue-100")}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className={gearSaveMode === 'snapshot' ? "text-slate-400" : "text-blue-500"} />
                  <span className="text-[10px] font-bold">
                    {gearSaveMode === 'snapshot' && "✅ 仅本次生效 (不改动原套装)"}
                    {gearSaveMode === 'update' && `✅ 将更新原套装: ${activeGear.name}`}
                    {gearSaveMode === 'new' && `✅ 将存为新套装: ${newGearSetName}`}
                  </span>
                </div>
                <button onClick={() => setGearDecisionMade(false)} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                  <Edit2 size={10} /> 修改
                </button>
              </div>
            )
          ) : null}
        </Card>
      )}

      {/* 3. ENVIRONMENTAL STATUS */}
      <div className="px-1">
        {isBackfill ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-3 space-y-3">
             <div className="flex items-center gap-2 text-slate-400 px-1">
               <CloudSun size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">补充气象信息 (回填模式)</span>
             </div>
             <div className="flex flex-wrap gap-2">
                {WEATHER_OPTIONS.map(w => (
                  <button key={w} onClick={() => setManualWeather(w)} className={cn("px-4 py-1.5 rounded-xl text-xs font-bold transition-all", manualWeather === w ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100")}>
                    {w}
                  </button>
                ))}
             </div>
          </div>
        ) : weatherLoading ? (
          <div className="flex items-center justify-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 gap-2">
            <Loader2 size={14} className="animate-spin text-blue-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">正在回溯历史气象...</span>
          </div>
        ) : exif ? (
          <FishingDataBlock data={exif} />
        ) : (
          <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">选择钓点以启用环境存证</p>
          </div>
        )}
      </div>

      {/* 4. MAIN FORM */}
      <Card className="border-none shadow-xl shadow-slate-200/50 p-6 space-y-6 bg-white">
        <div className="space-y-5">
          <div className="space-y-2">
            <Input label="鱼种名称" placeholder="例如：大口黑鲈" value={species} onChange={e => setSpecies(e.target.value)} required />
            {recentSpecies.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <History size={12} className="text-slate-300" />
                {recentSpecies.map(s => (
                  <button key={s} onClick={() => setSpecies(s)} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input label="体长 (cm)" type="number" value={length} onChange={e => setLength(e.target.value)} placeholder="可选" />
              <div className="flex gap-1.5">
                <button onClick={() => setLength('8')} className="px-2 py-1 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-lg">奶鲫 (8cm)</button>
                <button onClick={() => setLength('25')} className="px-2 py-1 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-lg">大板 (25cm)</button>
              </div>
            </div>
            <Input label="重量 (kg)" type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} placeholder="可选" />
          </div>

          <div className="h-px bg-slate-50" />

          <section className="space-y-3">
             <div className="flex items-center gap-2 px-1">
               <TagsIcon size={14} className="text-blue-500" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">分析标签</span>
             </div>
             <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map(tag => (
                  <button key={tag.label} onClick={() => toggleTag(tag.label)} className={cn("px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all", selectedTags.includes(tag.label) ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200")}>
                    {tag.label}
                  </button>
                ))}
             </div>
          </section>

          <section className="space-y-3">
             <div className="flex items-center gap-2 px-1">
               <MessageSquareQuote size={14} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">备注 / 心得</span>
             </div>
             <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="记录当下的心情或特殊情况..." className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-700 outline-none focus:border-blue-200 transition-all resize-none" />
          </section>
        </div>

        <Button onClick={handleSubmit} className="w-full py-4 rounded-2xl text-lg shadow-blue-200 font-black" isLoading={loading}>
          <ClipboardCheck size={20} className="mr-2" /> 生成数字鱼拓
        </Button>
      </Card>

      {/* Selectors Modals */}
      <Modal isOpen={isGearModalOpen} onClose={() => setIsGearModalOpen(false)} title={modalMode === 'list' ? "选择装备" : "新增装备"}>
        {modalMode === 'list' ? (
          <div className="space-y-3">
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {gearList.map(g => (
                <button key={g.id} onClick={() => { setSelectedGearId(g.id); setIsGearModalOpen(false); }} className={cn("p-4 rounded-xl border text-left flex justify-between", selectedGearId === g.id ? "border-blue-500 bg-blue-50" : "border-slate-100")}>
                  <span className="font-bold text-sm">{g.name}</span>
                  {selectedGearId === g.id && <CheckCircle2 size={16} className="text-blue-500" />}
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => setModalMode('add')}><Plus size={16} className="mr-2" /> 新建套装</Button>
          </div>
        ) : (
          <form onSubmit={handleCreateGear} className="space-y-4">
            <button type="button" onClick={() => setModalMode('list')} className="text-xs font-bold text-blue-600 flex items-center gap-1"><ArrowLeft size={12} /> 返回列表</button>
            <Input label="名称" value={newGear.name} onChange={e => setNewGear({...newGear, name: e.target.value})} required />
            <Input label="鱼竿" value={newGear.rod} onChange={e => setNewGear({...newGear, rod: e.target.value})} required />
            <div className="grid grid-cols-2 gap-2">
              <Input label="线组" value={newGear.line} onChange={e => setNewGear({...newGear, line: e.target.value})} required />
              <Input label="鱼钩" value={newGear.hook} onChange={e => setNewGear({...newGear, hook: e.target.value})} required />
            </div>
            <Button type="submit" className="w-full rounded-xl py-3 mt-2">保存</Button>
          </form>
        )}
      </Modal>

      <Modal isOpen={isSpotModalOpen} onClose={() => setIsSpotModalOpen(false)} title={modalMode === 'list' ? "选择钓点" : "收藏钓点"}>
        {modalMode === 'list' ? (
          <div className="space-y-3">
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {spotList.map(s => (
                <button key={s.id} onClick={() => { setSelectedSpotId(s.id); setIsSpotModalOpen(false); }} className={cn("p-4 rounded-xl border text-left flex justify-between", selectedSpotId === s.id ? "border-emerald-500 bg-emerald-50" : "border-slate-100")}>
                  <div><span className="font-bold text-sm">{s.name}</span><p className="text-[10px] text-slate-400 font-black uppercase">{s.type}</p></div>
                  {selectedSpotId === s.id && <CheckCircle2 size={16} className="text-emerald-500" />}
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => setModalMode('add')}><Plus size={16} className="mr-2" /> 收藏新地点</Button>
          </div>
        ) : (
          <form onSubmit={handleCreateSpot} className="space-y-4">
            <button type="button" onClick={() => setModalMode('list')} className="text-xs font-bold text-emerald-600 flex items-center gap-1"><ArrowLeft size={12} /> 返回列表</button>
            <Input label="地点名称" value={newSpot.name} onChange={e => setNewSpot({...newSpot, name: e.target.value})} required />
            <div className="grid grid-cols-3 gap-2">
              {['水库', '溪流', '黑坑', '江河', '海钓'].map(t => (
                <button key={t} type="button" onClick={() => setNewSpot({...newSpot, type: t})} className={cn("py-2 rounded-lg text-[10px] font-bold border", newSpot.type === t ? "bg-emerald-600 text-white border-emerald-600" : "bg-white border-slate-100")}>{t}</button>
              ))}
            </div>
            <Button type="submit" className="w-full rounded-xl py-3 mt-2 bg-emerald-600 hover:bg-emerald-700">保存</Button>
          </form>
        )}
      </Modal>

      <SBTSuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} record={lastCreatedRecord} />
    </div>
  );
};

export default RecordPage;
