
import { Rarity } from '../types';

export interface PokedexFish {
  id: string;
  name: string;
  category: '淡水鱼' | '海鱼';
  description: string;
}

export interface PokedexAchievement {
  id: string;
  title: string;
  rarity: Rarity;
  description: string;
}

export const ALL_FISH_SPECIES: PokedexFish[] = [
  { id: 'f_1', name: '鲫鱼', category: '淡水鱼', description: '分布极广的淡水底层鱼类，钓鱼人的启蒙导师。' },
  { id: 'f_2', name: '大口黑鲈', category: '淡水鱼', description: '性情凶猛的掠食性鱼类，路亚垂钓的热门目标。' },
  { id: 'f_3', name: '翘嘴', category: '淡水鱼', description: '泳速快、性情贪婪，常见于江河湖库的上层水域。' },
  { id: 'f_4', name: '鳜鱼', category: '淡水鱼', description: '肉质鲜美，“桃花流水鳜鱼肥”中的名贵鱼类。' },
  { id: 'f_5', name: '蓝鳍金枪鱼', category: '海鱼', description: '大海中的法拉利，力量与速度的顶级挑战。' },
  { id: 'f_6', name: '真鲷', category: '海鱼', description: '有着绚丽红色鳞片的海洋珍贵鱼种，象征吉祥。' },
  { id: 'f_7', name: '罗非鱼', category: '淡水鱼', description: '生命力极其顽强，被称为“淡水小强”。' },
  { id: 'f_8', name: '鳡鱼', category: '淡水鱼', description: '水下霸主，能吞食大量其他鱼类。' },
];

export const ALL_ACHIEVEMENTS: PokedexAchievement[] = [
  { id: 'a_1', title: '新手上路', rarity: 'Common', description: '成功记录第 1 条渔获。' },
  { id: 'a_2', title: '米级巨物', rarity: 'Legendary', description: '捕获体长超过 100cm 的超级大鱼。' },
  { id: 'a_3', title: '黎明猎手', rarity: 'Rare', description: '在凌晨 4:00 - 6:00 期间完成记录。' },
  { id: 'a_4', title: '空军司令', rarity: 'Rare', description: '连续 5 次出钓未记录（自嘲勋章）。' },
  { id: 'a_5', title: '路亚先锋', rarity: 'Common', description: '累计使用 3 种不同的路亚饵料。' },
];
