
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Backpack, Pencil, Save as SaveIcon } from 'lucide-react';
import { Button, Input, Card, Modal } from '../../../../shared/ui';
import DB from '../../../../core/db';
import AuthService from '../../../../core/auth';
import { GearSet } from '../../../../core/types';

export const GearManagerPage: React.FC = () => {
  const [gears, setGears] = useState<GearSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<GearSet | null>(null);
  
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const [formData, setFormData] = useState({
    name: '',
    rod: '',
    reel: '',
    line: '',
    hook: ''
  });

  const loadGears = async () => {
    if (!user) return;
    setLoading(true);
    const all = await DB.findAll<GearSet>(DB.COLLECTIONS.GEAR_SETS);
    setGears(all.filter(g => g.userId === user.id));
    setLoading(false);
  };

  useEffect(() => {
    loadGears();
  }, []);

  const openAddModal = () => {
    setEditingSet(null);
    setFormData({ name: '', rod: '', reel: '', line: '', hook: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (gear: GearSet) => {
    setEditingSet(gear);
    setFormData({
      name: gear.name,
      rod: gear.rod,
      reel: gear.reel || '',
      line: gear.line,
      hook: gear.hook
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editingSet) {
      // Update Scenario
      const updated = await DB.update<GearSet>(DB.COLLECTIONS.GEAR_SETS, editingSet.id, formData);
      if (updated) {
        setGears(prev => prev.map(g => g.id === updated.id ? updated : g));
      }
    } else {
      // Create Scenario
      const newGear: GearSet = {
        id: `g_${Date.now()}`,
        userId: user.id,
        ...formData
      };
      const created = await DB.create(DB.COLLECTIONS.GEAR_SETS, newGear);
      setGears(prev => [...prev, created]);
    }

    setIsModalOpen(false);
    setEditingSet(null);
    setFormData({ name: '', rod: '', reel: '', line: '', hook: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这套装备吗？')) {
      const success = await DB.delete(DB.COLLECTIONS.GEAR_SETS, id);
      if (success) {
        setGears(prev => prev.filter(g => g.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in slide-in-from-right-4 duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">装备库</h2>
        </div>
        <Button 
          size="sm" 
          onClick={openAddModal}
          className="rounded-xl px-4"
        >
          <Plus size={18} className="mr-1" /> 新增
        </Button>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : gears.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
             <Backpack size={32} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">暂无常用装备</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {gears.map(gear => (
            <Card key={gear.id} className="p-5 border-none shadow-sm group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{gear.name}</h3>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">
                    {gear.rod.includes('UL') ? '微物精细' : '全能型'} 配置
                  </p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEditModal(gear)}
                    className="p-2 text-slate-300 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    title="编辑"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(gear.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                    title="删除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                <div className="space-y-0.5">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">鱼竿</p>
                   <p className="text-xs font-bold text-slate-700 truncate">{gear.rod}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">卷线器</p>
                   <p className="text-xs font-bold text-slate-700 truncate">{gear.reel || '无'}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">线组</p>
                   <p className="text-xs font-bold text-slate-700 truncate">{gear.line}</p>
                </div>
                <div className="space-y-0.5">
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">鱼钩</p>
                   <p className="text-xs font-bold text-slate-700 truncate">{gear.hook}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSet ? "编辑装备套装" : "添加新装备"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="套装名称" 
            placeholder="例如：溪流微物套装" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <Input 
            label="鱼竿型号" 
            placeholder="例如：Luremaster UL 1.8m" 
            value={formData.rod}
            onChange={e => setFormData({...formData, rod: e.target.value})}
            required
          />
          <Input 
            label="卷线器 (可选)" 
            placeholder="例如：Shimano Stradic 1000" 
            value={formData.reel}
            onChange={e => setFormData({...formData, reel: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="线组详情" 
              placeholder="0.6 PE + 4lb 前导" 
              value={formData.line}
              onChange={e => setFormData({...formData, line: e.target.value})}
              required
            />
            <Input 
              label="鱼钩型号" 
              placeholder="秋田狐 2.5#" 
              value={formData.hook}
              onChange={e => setFormData({...formData, hook: e.target.value})}
              required
            />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full py-4 rounded-2xl shadow-blue-200 font-black">
              {editingSet ? <><SaveIcon size={20} className="mr-2" /> 保存修改</> : <><Plus size={20} className="mr-2" /> 确认添加</>}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
