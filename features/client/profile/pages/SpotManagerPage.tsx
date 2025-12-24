
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, MapPinned } from 'lucide-react';
import { Button, Input, Card, Modal } from '../../../../shared/ui';
import DB from '../../../../core/db';
import AuthService from '../../../../core/auth';
import { FishingSpot } from '../../../../core/types';
// Add missing import for cn utility
import { cn } from '../../../../shared/utils/styles';

export const SpotManagerPage: React.FC = () => {
  const [spots, setSpots] = useState<FishingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const [formData, setFormData] = useState({
    name: '',
    type: '水库'
  });

  const loadSpots = async () => {
    if (!user) return;
    setLoading(true);
    const all = await DB.findAll<FishingSpot>(DB.COLLECTIONS.SPOTS);
    setSpots(all.filter(s => s.userId === user.id));
    setLoading(false);
  };

  useEffect(() => {
    loadSpots();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newSpot: FishingSpot = {
      id: `s_${Date.now()}`,
      userId: user.id,
      ...formData
    };

    await DB.create(DB.COLLECTIONS.SPOTS, newSpot);
    setIsModalOpen(false);
    setFormData({ name: '', type: '水库' });
    loadSpots();
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个钓点吗？')) {
      await DB.delete(DB.COLLECTIONS.SPOTS, id);
      loadSpots();
    }
  };

  const spotTypes = ['水库', '溪流', '黑坑', '江河', '野塘', '海钓'];

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
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">常用钓点</h2>
        </div>
        <Button 
          size="sm" 
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl px-4"
        >
          <Plus size={18} className="mr-1" /> 新增
        </Button>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-2xl" />)}
        </div>
      ) : spots.length === 0 ? (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-200">
             <MapPinned size={32} />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">暂无收藏钓点</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {spots.map(spot => (
            <Card key={spot.id} className="p-4 border-none shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MapPinned size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{spot.name}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{spot.type}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(spot.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="收藏新钓点"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="钓点名称" 
            placeholder="例如：碧波湖东岸码头" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">钓点类型</label>
            <div className="grid grid-cols-3 gap-2">
              {spotTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({...formData, type})}
                  className={cn(
                    "py-2 rounded-xl text-xs font-bold transition-all border",
                    formData.type === type 
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100" 
                      : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full py-4 rounded-2xl shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700">
              保存钓点
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
