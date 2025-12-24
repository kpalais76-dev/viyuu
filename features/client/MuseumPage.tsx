
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FishCard, 
  Modal, 
  FishingDataBlock, 
  RarityBadge, 
  Button, 
  Card 
} from '../../shared/ui';
import { FishRecord, AppEvent } from '../../core/types';
import DB from '../../core/db';
import AuthService from '../../core/auth';
import EventBus from '../../core/bus';
import { 
  Trophy, 
  Fingerprint, 
  Calendar, 
  MapPin, 
  BookOpen, 
  ArrowLeft, 
  ChevronRight, 
  Layers,
  Scale,
  Ruler,
  Backpack,
  MapPinned,
  Share2,
  Download
} from 'lucide-react';
import { CollectionBook } from './museum/components/CollectionBook';
import { CertificateCard } from './record/components/CertificateCard';
import { cn } from '../../shared/utils/styles';

interface SpeciesGroup {
  name: string;
  count: number;
  maxLen: number;
  coverImg?: string;
  records: FishRecord[];
}

const MuseumPage: React.FC = () => {
  const [records, setRecords] = useState<FishRecord[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);
  const [selectedFish, setSelectedFish] = useState<FishRecord | null>(null);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = AuthService.getCurrentUser();

  const loadRecords = async () => {
    if (!user) return;
    setLoading(true);
    const all = await DB.findAll<FishRecord>(DB.COLLECTIONS.RECORDS);
    const userRecords = all.filter(r => r.userId === user.id).sort((a, b) => b.timestamp - a.timestamp);
    setRecords(userRecords);
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
    const unsubscribe = EventBus.on(AppEvent.RECORD_ADDED, () => {
      loadRecords();
    });
    return unsubscribe;
  }, []);

  // Grouping Logic
  const speciesGroups = useMemo(() => {
    const groups: Record<string, SpeciesGroup> = {};
    
    records.forEach(record => {
      if (!groups[record.species]) {
        groups[record.species] = {
          name: record.species,
          count: 0,
          maxLen: 0,
          coverImg: record.imageUrl,
          records: []
        };
      }
      
      groups[record.species].records.push(record);
      groups[record.species].count += 1;
      
      if (record.length >= groups[record.species].maxLen) {
        groups[record.species].maxLen = record.length;
        groups[record.species].coverImg = record.imageUrl;
      }
    });
    
    return Object.values(groups).sort((a, b) => b.count - a.count);
  }, [records]);

  const activeGroup = useMemo(() => {
    return speciesGroups.find(g => g.name === selectedSpecies);
  }, [speciesGroups, selectedSpecies]);

  const handleBack = () => setSelectedSpecies(null);

  if (loading) {
    return (
      <div className="space-y-6 pt-4 animate-pulse">
        <div className="h-8 bg-slate-100 w-1/3 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[4/5] bg-slate-100 rounded-3xl" />
          <div className="aspect-[4/5] bg-slate-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  // LEVEL 2: Detailed Species View
  if (selectedSpecies && activeGroup) {
    return (
      <div className="space-y-6 pb-20 animate-in slide-in-from-right-4 duration-500">
        <header className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-full shadow-sm border border-slate-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{selectedSpecies}</h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              共有 {activeGroup.count} 条记录 • 最大 {activeGroup.maxLen}cm
            </p>
          </div>
        </header>

        <div className="space-y-4">
          {activeGroup.records.map(record => (
            <Card 
              key={record.id} 
              padding="sm" 
              hoverable 
              onClick={() => setSelectedFish(record)}
              className="flex items-center gap-4 border-none shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                <img src={record.imageUrl} alt={record.species} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex justify-between items-start mb-1">
                  <RarityBadge rarity={record.rarity} className="scale-75 origin-left" />
                  <span className="text-[9px] font-black text-slate-300 uppercase">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Ruler size={12} className="text-slate-300" />
                    <span className="text-xs font-bold">{record.length}cm</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Scale size={12} className="text-slate-300" />
                    <span className="text-xs font-bold">{record.weight}kg</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold truncate">
                   <div className="flex items-center gap-1 min-w-0">
                      <Backpack size={10} className="shrink-0" />
                      <span className="truncate">{record.gearSetName}</span>
                   </div>
                   <div className="flex items-center gap-1 min-w-0">
                      <MapPinned size={10} className="shrink-0" />
                      <span className="truncate">{record.spotName}</span>
                   </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-200" />
            </Card>
          ))}
        </div>

        {/* Premium Detail Modal (WYSIWYG with Success Modal) */}
        <Modal 
          isOpen={!!selectedFish} 
          onClose={() => setSelectedFish(null)} 
          title="数字存证详情"
        >
          {selectedFish && (
            <div className="space-y-6">
              <div className="transform scale-90 -mt-8 -mb-4 origin-top">
                <CertificateCard 
                  record={selectedFish} 
                  user={user} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" className="rounded-xl py-4 flex gap-2">
                  <Share2 size={18} /> 分享
                </Button>
                <Button variant="outline" className="rounded-xl py-4 flex gap-2">
                  <Download size={18} /> 下载
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // LEVEL 1: Main Gallery View
  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">陈列馆</h2>
          <p className="text-slate-500 text-sm font-medium">鱼种归档系统 v3.0</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-10 h-10 p-0 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-600"
            onClick={() => setIsBookOpen(true)}
          >
            <BookOpen size={20} />
          </Button>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Trophy size={24} />
          </div>
        </div>
      </header>

      {records.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
             <Layers size={40} className="text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">尚无归档渔获</p>
          <p className="text-slate-300 text-sm mt-1">开始记录你的第一条大鱼。</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {speciesGroups.map(group => (
            <div 
              key={group.name}
              onClick={() => setSelectedSpecies(group.name)}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              {/* Cover Image */}
              <img 
                src={group.coverImg} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={group.name}
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-lg font-black text-white leading-tight mb-1 truncate">{group.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    {group.count} 条记录
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                     <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collection Book Modal */}
      <Modal isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} title="知渔图鉴">
        <CollectionBook userRecords={records} />
      </Modal>
    </div>
  );
};

export default MuseumPage;
