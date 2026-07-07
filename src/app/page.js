"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const ALL_QUESTS = [
  { id: 6, title: '洗碗盤', reward: 50, icon: 'flatware' },
  { id: 3, title: '曬衣服', reward: 20, icon: 'wb_sunny' },
  { id: 5, title: '拖地板', reward: 20, icon: 'mop' },
  { id: 7, title: '倒垃圾', reward: 20, icon: 'delete' },
  { id: 1, title: '洗衣服', reward: 15, icon: 'local_laundry_service' },
  { id: 2, title: '拿衣服', reward: 15, icon: 'checkroom' },
  { id: 4, title: '吸地板', reward: 15, icon: 'vacuum' },
  { id: 8, title: '整理', reward: 10, icon: 'inventory_2' },
  { id: 'premium', title: '獲得獎狀', reward: 100, icon: 'workspace_premium', isRepeatable: true },
];

const Icon = ({ name, filled, className = "" }) => (
  <span 
    className={`material-symbols-outlined ${className}`}
    style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}
  >
    {name}
  </span>
);

const DashboardPage = ({ totalEarnings, pendingRewards, dishwashStats = { streak: 0 }, history = [], onRedeem, onDayClick }) => {
  const streak = dishwashStats.streak;
  const displayStreak = Math.min(streak, 3);
  const percentage = Math.round((displayStreak / 3) * 100);

  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [redeemUnlocked, setRedeemUnlocked] = useState(false);
  const redeemTimer = React.useRef(null);

  const handleRedeemClick = () => {
    if (!redeemUnlocked) {
      setRedeemUnlocked(true);
      redeemTimer.current = setTimeout(() => setRedeemUnlocked(false), 3000);
    } else {
      setRedeemUnlocked(false);
      if (redeemTimer.current) clearTimeout(redeemTimer.current);
      onRedeem();
    }
  };
  
  const currentMonth = currentViewDate.getMonth();
  const currentYear = currentViewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const today = new Date();

  // 計算每天的結清狀態
  const lastRedeemTime = history
    .filter(h => h.isRedeem && h.date)
    .map(h => new Date(h.date).getTime())
    .sort((a, b) => b - a)[0] || null;

  const dayStatusMap = {};
  history
    .filter(h => !h.isRedeem && h.date && (() => { const d = new Date(h.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; })())
    .forEach(h => {
      const day = new Date(h.date).getDate();
      // 補登任務用「新增時間（id）」比較，一般任務用「任務日期」比較
      const compareTime = h.isMakeup ? h.id : new Date(h.date).getTime();
      const isCleared = lastRedeemTime && compareTime < lastRedeemTime;
      if (!dayStatusMap[day]) dayStatusMap[day] = { hasCleared: false, hasPending: false };
      if (isCleared) dayStatusMap[day].hasCleared = true;
      else dayStatusMap[day].hasPending = true;
    });
  // today's '剛剛' tasks
  if (history.some(h => h.timestamp === '剛剛') && today.getMonth() === currentMonth && today.getFullYear() === currentYear) {
    const d = today.getDate();
    if (!dayStatusMap[d]) dayStatusMap[d] = { hasCleared: false, hasPending: false };
    dayStatusMap[d].hasPending = true;
  }

  const prevMonth = () => setCurrentViewDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () => setCurrentViewDate(new Date(currentYear, currentMonth + 1, 1));

  return (
    <div className="space-y-3">
      <section>
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-4 rounded-xl border border-outline-variant relative overflow-hidden group">
          {/* Two stats side by side */}
          <div className="flex items-stretch gap-4">
            <div className="flex-1">
              <p className="text-xs font-semibold text-on-surface-variant mb-1">總收入</p>
              <h2 className="text-4xl font-bold text-primary-container leading-none">${totalEarnings}</h2>
            </div>
            <div className="w-px bg-outline-variant/50 self-stretch" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-on-surface-variant mb-1">待領取</p>
              <div className="flex items-center gap-1.5">
                <h2 className="text-4xl font-bold text-on-surface leading-none">${pendingRewards.toFixed(0)}</h2>
              </div>
            </div>
          </div>
          {/* Redeem button */}
          <button
            onClick={handleRedeemClick}
            className={`mt-3 w-full py-2 rounded-lg font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 text-sm ${
              pendingRewards <= 0
                ? 'bg-surface-variant text-on-surface-variant opacity-40 cursor-not-allowed'
                : redeemUnlocked
                ? 'bg-green-600 text-white hover:bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                : 'bg-primary-container text-on-primary-container hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            }`}
            disabled={pendingRewards <= 0}
          >
            <Icon name={redeemUnlocked ? "lock_open" : "lock"} className="text-[16px]" />
            {redeemUnlocked ? '確認兌換（將入總收入）' : '立即兌換'}
          </button>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-4 rounded-xl border border-outline-variant">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon name="calendar_month" className="text-primary-container" />
            <h3 className="text-base font-bold text-on-surface">{currentYear}年 {currentMonth + 1}月</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1 rounded bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest"><Icon name="chevron_left" /></button>
            <button onClick={nextMonth} className="p-1 rounded bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest"><Icon name="chevron_right" /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-on-surface-variant mb-1">
          <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map(d => <div key={`empty-${d}`} className="h-7"></div>)}
          {days.map(d => {
            const status = dayStatusMap[d];
            const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            
            let cellClass = 'text-on-surface-variant';
            let dotColor = null;
            
            if (status) {
              if (status.hasCleared && status.hasPending) {
                // 部分結清 - orange
                cellClass = 'bg-orange-500/20 text-orange-300 font-bold';
                dotColor = 'bg-orange-400';
              } else if (status.hasCleared && !status.hasPending) {
                // 已結清 - green
                cellClass = 'bg-green-600/20 text-green-400 font-bold';
                dotColor = 'bg-green-400';
              } else {
                // 未結清 - yellow/primary
                cellClass = 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]';
                dotColor = null;
              }
            }
            
            if (isToday && !status) cellClass = 'border border-primary-container text-primary-container font-bold';
            
            return (
              <div 
                key={d} 
                onClick={() => onDayClick(new Date(currentYear, currentMonth, d))}
                className={`h-7 flex flex-col items-center justify-center rounded-full text-xs transition-all cursor-pointer hover:opacity-80 relative ${cellClass}`}
              >
                <span className="text-[13px] leading-none">{d}</span>
                {dotColor && <span className={`w-1 h-1 rounded-full mt-0.5 ${dotColor}`} />}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-on-surface-variant">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-container inline-block" />未結清</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />部分結清</div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />已結清</div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-4 rounded-xl border border-outline-variant">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Icon name="restaurant" filled className="text-tertiary-container" />
            <h3 className="text-base font-bold text-on-surface">每日洗碗挑戰</h3>
          </div>
          <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full text-xs font-semibold shrink-0 ml-2">
            Day {streak > 0 ? streak : 0}
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm font-semibold text-on-surface-variant">
            <span>進度: {displayStreak} / 3 天</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary-container transition-all duration-700" style={{ width: `${percentage}%` }}></div>
          </div>
          <p className="text-on-surface-variant text-sm mt-1 italic">
            "持續保持，第三天起每次可獲額外加給！"
          </p>
        </div>
      </section>
    </div>
  );
};

const QuestCard = ({ quest, onComplete, specialStyle, isOpen, onToggle }) => {
  return (
    <div className="rounded-xl overflow-hidden">
      {/* Main card row */}
      <div
        onClick={onToggle}
        className={`glass-card p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all select-none ${specialStyle ? 'border-tertiary-container/30' : ''} ${isOpen ? 'rounded-b-none border-b-0' : ''}`}
      >
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border shrink-0 ${specialStyle ? 'border-tertiary-container/50 bg-tertiary/10 text-tertiary' : 'bg-surface-container-high text-primary border-outline-variant'}`}>
          <Icon name={quest.icon} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-on-surface">{quest.title}</h4>
          <div className={`${specialStyle ? 'text-tertiary' : 'text-primary'} font-semibold text-xs`}>${quest.reward}</div>
        </div>
        <Icon name={isOpen ? "expand_less" : "expand_more"} className="text-on-surface-variant opacity-50" />
      </div>

      {/* Confirm action row */}
      {isOpen && (
        <div className={`flex border border-t-0 rounded-b-xl overflow-hidden border-outline-variant/30 ${specialStyle ? 'border-tertiary-container/30' : ''}`}>
          <button
            onClick={onToggle}
            className="flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold text-on-surface-variant bg-surface-variant hover:bg-surface-container-highest active:scale-95 transition-all"
          >
            <Icon name="close" className="text-[16px]" />取消
          </button>
          <button
            onClick={() => { onComplete(quest); onToggle(); }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold active:scale-95 transition-all ${specialStyle ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-primary-container text-on-primary-container'}`}
          >
            <Icon name="check" className="text-[16px]" />完成 +${quest.reward}
          </button>
        </div>
      )}
    </div>
  );
};

const QuestsPage = ({ quests, onCompleteQuest }) => {
  const [openQuestId, setOpenQuestId] = useState(null);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-on-surface mb-4">可接任務</h2>
      <div className="space-y-3">
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onComplete={onCompleteQuest}
            specialStyle={quest.id === 'premium'}
            isOpen={openQuestId === quest.id}
            onToggle={() => setOpenQuestId(openQuestId === quest.id ? null : quest.id)}
          />
        ))}
      </div>
    </div>
};

const HistoryPage = ({ history, onUndo }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-on-surface">最近活動紀錄</h2>
    </div>
    
    <div className="space-y-4">
      {history.map((item) => (
        <div key={item.id} className="p-4 bg-surface-container rounded-xl border border-outline-variant flex items-center gap-4 group transition-colors hover:border-primary/50">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-surface-container-high text-primary border border-outline-variant shrink-0">
            <Icon name={item.icon || 'task_alt'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-sm text-on-surface truncate pr-2">{item.title}</h4>
              <span className="text-sm font-bold text-primary shrink-0">{item.reward >= 0 ? `+$${item.reward}` : `-$${Math.abs(item.reward)}`}</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                 <p className="font-medium text-xs text-on-surface-variant line-clamp-1">{item.description}</p>
                 <div className="flex items-center text-on-surface-variant gap-1 mt-1">
                   <Icon name="calendar_today" className="text-[12px]" />
                   <span className="font-medium text-xs">{item.date ? new Date(item.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'short' }) : item.timestamp}</span>
                   <span className="text-on-surface-variant/50 mx-0.5">·</span>
                   <span className="font-medium text-xs">{item.timestamp}</span>
                 </div>
              </div>
              {item.canUndo && (
                 <button onClick={() => onUndo(item)} className="text-xs text-error font-semibold hover:underline bg-error/10 px-2 py-1 rounded transition-colors opacity-0 group-hover:opacity-100">
                   退回
                 </button>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant opacity-70">
          <Icon name="history_toggle_off" className="text-5xl mb-2" />
          <p className="text-sm font-medium">目前沒有活動紀錄</p>
        </div>
      )}
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [quests, setQuests] = useState(ALL_QUESTS);
  const [dishwashStats, setDishwashStats] = useState({ streak: 0, lastWashDate: null });
  const [history, setHistory] = useState([]);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);
  const [showMakeupSelection, setShowMakeupSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 從 Supabase 載入資料
  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, historyRes] = await Promise.all([
          supabase.from('user_stats').select('*').eq('id', 1).single(),
          supabase.from('chore_history').select('*').order('created_at', { ascending: false }),
        ]);

        if (statsRes.data) {
          setTotalEarnings(Number(statsRes.data.total_earnings) || 0);
          setPendingRewards(Number(statsRes.data.pending_rewards) || 0);
          setDishwashStats({
            streak: statsRes.data.dish_streak || 0,
            lastWashDate: statsRes.data.dish_last_wash_date || null,
          });
        }

        if (historyRes.data) {
          const mapped = historyRes.data.map(row => ({
            id: Number(row.id),
            title: row.title,
            description: row.description,
            reward: Number(row.reward),
            icon: row.icon,
            timestamp: row.timestamp,
            date: row.date,
            canUndo: row.can_undo,
            isMakeup: row.is_makeup,
            isRedeem: row.is_redeem,
            originalQuest: row.original_quest,
          }));
          setHistory(mapped);
        }
      } catch (err) {
        console.error('載入資料失敗:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 同步 user_stats 到 Supabase
  const syncStats = useCallback(async (earnings, pending, stats) => {
    await supabase.from('user_stats').update({
      total_earnings: earnings,
      pending_rewards: pending,
      dish_streak: stats.streak,
      dish_last_wash_date: stats.lastWashDate,
      updated_at: new Date().toISOString(),
    }).eq('id', 1);
  }, []);

  // 新增歷史紀錄到 Supabase
  const addHistoryToDb = useCallback(async (item) => {
    await supabase.from('chore_history').insert({
      id: item.id,
      title: item.title,
      description: item.description,
      reward: item.reward,
      icon: item.icon,
      timestamp: item.timestamp,
      date: item.date,
      can_undo: item.canUndo ?? true,
      is_makeup: item.isMakeup ?? false,
      is_redeem: item.isRedeem ?? false,
      original_quest: item.originalQuest ?? null,
    });
  }, []);

  // 刪除歷史紀錄
  const removeHistoryFromDb = useCallback(async (itemId) => {
    await supabase.from('chore_history').delete().eq('id', itemId);
  }, []);

  const handleCompleteQuest = (quest) => {
    let finalReward = quest.reward;
    let extraDescription = '已完成日常任務';
    let newDishwashStats = { ...dishwashStats };

    if (quest.title === '洗碗盤') {
      const today = new Date().toDateString();
      if (dishwashStats.lastWashDate !== today) {
        if (dishwashStats.lastWashDate) {
          const lastDate = new Date(dishwashStats.lastWashDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastDate.toDateString() === yesterday.toDateString()) {
            newDishwashStats.streak += 1;
          } else {
            newDishwashStats.streak = 1;
          }
        } else {
          newDishwashStats.streak = 1;
        }
        newDishwashStats.lastWashDate = today;
      }
      
      if (newDishwashStats.streak >= 3) {
        finalReward += 5;
        extraDescription = '已完成日常任務 (連勝獎勵 +$5)';
      }
      
      setDishwashStats(newDishwashStats);
    }

    setPendingRewards(prev => prev + finalReward);
    
    const newHistoryItem = {
      id: Date.now(),
      title: quest.title,
      description: extraDescription,
      reward: finalReward,
      icon: quest.icon,
      timestamp: '剛剛',
      date: new Date().toISOString(),
      canUndo: true,
      originalQuest: quest,
      prevDishwashStats: quest.title === '洗碗盤' ? dishwashStats : null
    };
    
    setHistory([newHistoryItem, ...history]);
    
    if (!quest.isRepeatable) {
      setQuests(prevQuests => prevQuests.filter(q => q.id !== quest.id));
    }

    // Sync to Supabase
    const statsToSync = quest.title === '洗碗盤' ? newDishwashStats : dishwashStats;
    addHistoryToDb(newHistoryItem);
    syncStats(totalEarnings, pendingRewards + finalReward, statsToSync);
  };

  const recalculateStreak = (allHistory) => {
    const dishDates = allHistory
      .filter(h => h.title === '洗碗盤' && h.date)
      .map(h => new Date(h.date).toDateString());
    const uniqueDates = [...new Set(dishDates)].map(d => new Date(d)).sort((a, b) => b - a);
    
    if (uniqueDates.length === 0) return { streak: 0, lastWashDate: null };
    
    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const diff = (uniqueDates[i] - uniqueDates[i + 1]) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === 1) {
        streak++;
      } else {
        break;
      }
    }
    return { streak, lastWashDate: uniqueDates[0].toDateString() };
  };

  const handleMakeupQuest = (quest, dateObj) => {
    let finalReward = quest.reward;
    let extraDescription = '補登任務';
    
    const newHistoryItem = {
      id: Date.now(),
      title: quest.title,
      description: extraDescription,
      reward: finalReward,
      icon: quest.icon,
      timestamp: '補登',
      date: dateObj.toISOString(),
      canUndo: true,
      originalQuest: quest,
      isMakeup: true
    };
    
    const updatedHistory = [newHistoryItem, ...history];
    
    if (quest.title === '洗碗盤') {
      const newStats = recalculateStreak(updatedHistory);
      if (newStats.streak >= 3) {
        finalReward += 5;
        extraDescription = '補登任務 (連勝修復 +$5)';
        newHistoryItem.reward = finalReward;
        newHistoryItem.description = extraDescription;
      }
      setDishwashStats(newStats);
    }
    
    setPendingRewards(prev => prev + finalReward);
    setHistory(updatedHistory);
    setShowMakeupSelection(false);

    // Sync to Supabase
    const statsToSync = quest.title === '洗碗盤' ? recalculateStreak(updatedHistory) : dishwashStats;
    addHistoryToDb(newHistoryItem);
    syncStats(totalEarnings, pendingRewards + finalReward, statsToSync);
  };

  const handleUndoQuest = (historyItem) => {
    if (historyItem.isRedeem) {
      setTotalEarnings(prev => prev - historyItem.reward);
      setPendingRewards(prev => prev + historyItem.reward);
      setHistory(prev => prev.filter(item => item.id !== historyItem.id));
      return;
    }
    setPendingRewards(prev => {
      if (prev >= historyItem.reward) return prev - historyItem.reward;
      setTotalEarnings(t => t - (historyItem.reward - prev));
      return 0;
    });
    setHistory(prev => prev.filter(item => item.id !== historyItem.id));
    if (historyItem.originalQuest && !historyItem.originalQuest.isRepeatable && !historyItem.isMakeup) {
      setQuests(prev => {
        if (!prev.find(q => q.id === historyItem.originalQuest.id)) {
          return [...prev, historyItem.originalQuest].sort((a, b) => {
            if (a.id === 'premium') return 1;
            if (b.id === 'premium') return -1;
            return a.id - b.id;
          });
        }
        return prev;
      });
    }
    if (historyItem.title === '洗碗盤') {
      const remainingHistory = history.filter(item => item.id !== historyItem.id);
      const newStats = recalculateStreak(remainingHistory);
      setDishwashStats(newStats);
    } else if (historyItem.prevDishwashStats) {
      setDishwashStats(historyItem.prevDishwashStats);
    }

    // Sync to Supabase
    removeHistoryFromDb(historyItem.id);
    const newPending = historyItem.isRedeem ? (pendingRewards + historyItem.reward) : Math.max(0, pendingRewards - historyItem.reward);
    const newEarnings = historyItem.isRedeem ? (totalEarnings - historyItem.reward) : (pendingRewards >= historyItem.reward ? totalEarnings : totalEarnings - (historyItem.reward - pendingRewards));
    const undoStats = historyItem.title === '洗碗盤' ? recalculateStreak(history.filter(i => i.id !== historyItem.id)) : dishwashStats;
    syncStats(newEarnings, newPending, undoStats);
  };

  const handleRedeem = () => {
    if (pendingRewards > 0) {
      setTotalEarnings(prev => prev + pendingRewards);
      
      const newHistoryItem = {
        id: Date.now(),
        title: '兌換獎金',
        description: '已成功提領至總收入',
        reward: pendingRewards,
        icon: 'payments',
        timestamp: '剛剛',
        date: new Date().toISOString(),
        canUndo: true,
        isRedeem: true,
      };
      
      setHistory(prev => [newHistoryItem, ...prev]);
      setPendingRewards(0);

      // Sync to Supabase
      addHistoryToDb(newHistoryItem);
      syncStats(totalEarnings + pendingRewards, 0, dishwashStats);
    }
  };

  const selectedDayHistory = selectedDayDetail 
    ? history.filter(h => h.date && new Date(h.date).toDateString() === selectedDayDetail.toDateString())
    : [];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPage totalEarnings={totalEarnings} pendingRewards={pendingRewards} dishwashStats={dishwashStats} history={history} onRedeem={handleRedeem} onDayClick={(date) => {
        if (date.toDateString() === new Date().toDateString()) {
          setActiveTab('quests');
        } else {
          setSelectedDayDetail(date);
        }
      }} />;
      case 'quests': return <QuestsPage quests={quests} onCompleteQuest={handleCompleteQuest} />;
      case 'history': return <HistoryPage history={history} onUndo={handleUndoQuest} />;
      default: return <DashboardPage totalEarnings={totalEarnings} pendingRewards={pendingRewards} dishwashStats={dishwashStats} />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col flex-1">
      <header className="w-full sticky top-0 bg-background/95 backdrop-blur border-b border-outline-variant flex justify-between items-center px-4 py-2 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSUebV7y5FvTr1rmLIotBI9NmsLlCIzKckkJj08JHQjI5JnfuJtZhF7IAHuWVr_4C73oMr2uYjoBQSzi7zTDWKcj4JhDMXPmLycOt3WS3OJAfwqR5CEotBXq_cSRi-XP-uihSmITdXJd_LS6a8y2ttbd3Wzt5sQQHGGrTL_a7fecy413aD9w_wix2bU6slvzfixtc7QAL7j0TLpebXmbb8IzPRNwEMe1rJL6tjK40JAPc03yQU6vmyKK4zOXKZt9Hj9isAyMrZGro" 
              alt="Avatar" 
            />
          </div>
          <h1 className="text-xl font-bold text-primary">Ray的家事簿</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-scroll px-4 pt-6 pb-32 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
            <div className="w-10 h-10 rounded-full border-4 border-primary-container border-t-transparent animate-spin" />
            <p className="text-sm font-medium">載入資料中…</p>
          </div>
        ) : renderContent()}
      </main>

      <nav className="absolute bottom-0 left-0 w-full bg-surface-container border-t border-outline-variant/30 flex justify-around p-2 pb-3 z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center w-16 p-2 transition-transform active:scale-90 ${activeTab === 'dashboard' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant hover:text-primary'}`}>
          <Icon name="dashboard" filled={activeTab === 'dashboard'} />
          <span className="text-xs mt-1">總覽</span>
        </button>
        <button onClick={() => setActiveTab('quests')} className={`flex flex-col items-center justify-center w-16 p-2 transition-transform active:scale-90 ${activeTab === 'quests' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant hover:text-primary'}`}>
          <Icon name="swords" filled={activeTab === 'quests'} />
          <span className="text-xs mt-1">任務</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center justify-center w-16 p-2 transition-transform active:scale-90 ${activeTab === 'history' ? 'bg-primary-container text-on-primary-container rounded-xl' : 'text-on-surface-variant hover:text-primary'}`}>
          <Icon name="history" filled={activeTab === 'history'} />
          <span className="text-xs mt-1">歷史</span>
        </button>
      </nav>

      {/* Day Detail Modal */}
      {selectedDayDetail && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container rounded-2xl w-full max-w-[360px] overflow-hidden flex flex-col max-h-[80vh] border border-outline-variant/50 shadow-2xl">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
              <h3 className="font-bold text-lg text-on-surface">{selectedDayDetail.toLocaleDateString()} 紀錄</h3>
              <button onClick={() => { setSelectedDayDetail(null); setShowMakeupSelection(false); }} className="text-on-surface-variant hover:text-error transition-colors p-1 rounded-full hover:bg-surface-variant">
                <Icon name="close" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {showMakeupSelection ? (
                <div>
                  <h4 className="text-sm font-semibold text-on-surface-variant mb-3 flex items-center gap-2">
                    <button onClick={() => setShowMakeupSelection(false)} className="hover:text-primary"><Icon name="arrow_back" className="text-sm" /></button>
                    選擇補登任務
                  </h4>
                  <div className="space-y-2">
                    {quests.map(quest => (
                      <div key={quest.id} onClick={() => handleMakeupQuest(quest, selectedDayDetail)} className="p-3 bg-surface rounded-xl border border-outline-variant flex items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors">
                        <Icon name={quest.icon} className={quest.id === 'premium' ? 'text-tertiary' : 'text-primary'} />
                        <span className="font-semibold text-sm text-on-surface flex-1">{quest.title}</span>
                        <span className="text-xs font-bold text-primary">+${quest.reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {selectedDayHistory.length === 0 ? (
                    <div className="text-center py-8 text-on-surface-variant opacity-70">
                      <Icon name="sentiment_dissatisfied" className="text-4xl mb-2" />
                      <p className="text-sm font-medium">當天沒有任何任務紀錄</p>
                    </div>
                  ) : (
                    selectedDayHistory.map(item => (
                      <div key={item.id} className="p-3 bg-surface rounded-xl border border-outline-variant flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon name={item.icon || 'task_alt'} className="text-on-surface-variant" />
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{item.title}</p>
                            <p className="text-xs text-on-surface-variant">{item.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-sm font-bold text-primary">{item.reward >= 0 ? `+$${item.reward}` : `-$${Math.abs(item.reward)}`}</span>
                           {item.canUndo && (
                             <button onClick={() => handleUndoQuest(item)} className="mt-1 text-[10px] text-error hover:underline bg-error/10 px-1.5 py-0.5 rounded transition-colors">
                               退回
                             </button>
                           )}
                        </div>
                      </div>
                    ))
                  )}
                  
                  <button onClick={() => setShowMakeupSelection(true)} className="mt-4 w-full py-3 border border-dashed border-primary/50 text-primary rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-primary/10 transition-colors">
                    <Icon name="add_circle" />
                    補登任務
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
