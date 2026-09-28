/**
 * GameHeader Bileşeni (PicSay - Staj Eğitim Notu)
 * 
 * Oyun ekranının üst barıdır. Ana sayfaya dönüş butonunu, aktif oyun modu rozetini
 * ('Günlük Bulmaca' veya 'Sınırsız Mod') ve oyuncunun o anki puan ile serisini (Streak) gösterir.
 */

import React from "react";
import { ArrowLeft, Trophy, Flame, Infinity as InfinityIcon, Sparkles, HelpCircle } from "lucide-react";
import { GameStats, SentenceChallenge, GameMode } from "../types";

interface GameHeaderProps {
  /** Aktif bulmaca nesnesi */
  challenge: SentenceChallenge;
  /** Oyuncu istatistikleri */
  stats: GameStats;
  /** Aktif oyun modu */
  gameMode: GameMode;
  /** Ana sayfaya geri dönme callback fonksiyonu */
  onBackToWelcome: () => void;
  /** Formül pop-up modalını açma callback'i */
  onOpenFormula?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  stats,
  gameMode,
  onBackToWelcome,
  onOpenFormula,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-2 px-1">
      {/* Sol Bar: Geri Dön Butonu + (?) Formül İkonu */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBackToWelcome}
          className="h-9 px-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {onOpenFormula && (
          <button
            onClick={onOpenFormula}
            className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer flex items-center justify-center shadow-md"
            title="Formula Help (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sağ Bar: Oyun Modu ve İstatistikler */}
      <div className="flex items-center gap-2">
        {/* Oyun Modu Rozeti */}
        {gameMode === "daily" ? (
          <div className="h-9 px-3 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">DAILY</span>
          </div>
        ) : (
          <div className="h-9 px-3 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
            <InfinityIcon className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline font-bold">UNLIMITED</span>
          </div>
        )}

        {/* Skor & Streak */}
        <div className="h-9 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono font-bold flex items-center gap-2 shadow-md">
          <div className="flex items-center gap-1 text-amber-400" title="Daily Score">
            <Trophy className="w-3.5 h-3.5" />
            <span>{stats.dailyScore}</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1 text-rose-400" title="Current Streak">
            <Flame className="w-3.5 h-3.5" />
            <span>{stats.currentStreak}🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
};

