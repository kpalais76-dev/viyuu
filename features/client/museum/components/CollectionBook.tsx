
import React, { useState } from 'react';
import { ALL_FISH_SPECIES, ALL_ACHIEVEMENTS } from '../../../../core/config/pokedex';
import { FishRecord } from '../../../../core/types';
import { RarityBadge } from '../../../../shared/ui';
import { cn } from '../../../../shared/utils/styles';
import { Lock, Fish, Award, Search } from 'lucide-react';

interface CollectionBookProps {
  userRecords: FishRecord[];
}

export const CollectionBook: React.FC<CollectionBookProps> = ({ userRecords }) => {
  const [activeTab, setActiveTab] = useState<'fish' | 'badges'>('fish');

  // Logic to calculate unlocked status
  const unlockedSpeciesNames = new Set(userRecords.map(r => r.species));
  
  // Mock logic for achievements: Unlocked if user has any Legendary/Rare records for now
  const hasLegendary = userRecords.some(r => r.rarity === 'Legendary');
  const hasRare = userRecords.some(r => r.rarity === 'Rare');
  const unlockedAchievements = new Set(['a_1', 'a_5']); // Default unlocked
  if (hasLegendary) unlockedAchievements.add('a_2');
  if (hasRare) unlockedAchievements.add('a_3');

  const fishProgress = ALL_FISH_SPECIES.filter(f => unlockedSpeciesNames.has(f.name)).length;
  const badgeProgress = ALL_ACHIEVEMENTS.filter(a => unlockedAchievements.has(a.id)).length;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">当前收集进度</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">{activeTab === 'fish' ? fishProgress : badgeProgress}</span>
            <span className="text-xl font-bold opacity-60">/ {activeTab === 'fish' ? ALL_FISH_SPECIES.length : ALL_ACHIEVEMENTS.length}</span>
          </div>
          <div className="mt-4 h-2 w-full bg-blue-400/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000" 
              style={{ width: `${(activeTab === 'fish' ? (fishProgress/ALL_FISH_SPECIES.length) : (badgeProgress/ALL_ACHIEVEMENTS.length)) * 100}%` }}
            />
          </div>
        </div>
        <Search size={120} className="absolute -bottom-6 -right-6 text-white/10 rotate-12" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setActiveTab('fish')}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
            activeTab === 'fish' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Fish size={18} />
          鱼类图鉴
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={cn(
            "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
            activeTab === 'badges' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Award size={18} />
          荣誉勋章
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-3">
        {activeTab === 'fish' ? (
          ALL_FISH_SPECIES.map((fish) => {
            const isUnlocked = unlockedSpeciesNames.has(fish.name);
            return (
              <div 
                key={fish.id}
                className={cn(
                  "p-4 rounded-2xl border flex flex-col items-center text-center transition-all",
                  isUnlocked ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60 grayscale"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-2",
                  isUnlocked ? "bg-blue-50 text-blue-600" : "bg-slate-200 text-slate-400"
                )}>
                  {isUnlocked ? <Fish size={24} /> : <Lock size={20} />}
                </div>
                <span className="text-[10px] font-black truncate w-full">
                  {isUnlocked ? fish.name : '???'}
                </span>
                <span className="text-[8px] text-slate-400 uppercase font-bold mt-1">
                  {isUnlocked ? fish.category : '未知'}
                </span>
              </div>
            );
          })
        ) : (
          ALL_ACHIEVEMENTS.map((badge) => {
            const isUnlocked = unlockedAchievements.has(badge.id);
            return (
              <div 
                key={badge.id}
                className={cn(
                  "p-4 rounded-2xl border flex flex-col items-center text-center transition-all",
                  isUnlocked ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-60 grayscale"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-2",
                  isUnlocked ? "bg-amber-50 text-amber-600" : "bg-slate-200 text-slate-400"
                )}>
                  {isUnlocked ? <Award size={24} /> : <Lock size={20} />}
                </div>
                <span className="text-[10px] font-black truncate w-full">
                  {isUnlocked ? badge.title : '???'}
                </span>
                {isUnlocked && <RarityBadge rarity={badge.rarity} className="mt-1 scale-75 origin-top" />}
              </div>
            );
          })
        )}
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 text-center">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
           {activeTab === 'fish' ? '收录更多的不同种类的鱼获来解锁图鉴' : '达成特定垂钓目标以获取稀有荣誉勋章'}
         </p>
      </div>
    </div>
  );
};
