/**
 * WelcomeScreen Bileşeni (PicSay - Staj Eğitim Notu):
 * 
 * Oyuncunun giriş yaptığı karşılama ve mod seçim ekranıdır.
 * Günlük skor (Daily Score) ve Toplam skor (Total Score) gibi istatistikleri
 * temiz ve anlaşılır kartlar halinde sunar.
 */

import React from "react";
import { Sparkles, Play, HelpCircle, Trophy, Flame, Zap, CheckCircle2, Infinity as InfinityIcon, Shuffle } from "lucide-react";
import { motion } from "motion/react";
import { GameStats, GameMode } from "../types";

interface WelcomeScreenProps {
  onStartGame: (mode: GameMode) => void;
  stats: GameStats;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame, stats }) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 py-6 px-4 text-center relative">
      {/* Animated Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono tracking-wider shadow-lg shadow-amber-500/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>DAILY VISUAL ENGLISH SENTENCE PUZZLE</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-purple-400 drop-shadow-md">
          PicSay
        </h1>

        <p className="text-sm md:text-base text-zinc-300 max-w-xl font-medium leading-relaxed">
          Look at today's visual scene and guess the describing English sentence with Wordle letter feedback!
        </p>
      </motion.div>

      {/* Player Stats Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full grid grid-cols-2 sm:grid-cols-5 gap-3 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl shadow-xl"
      >
        <div className="flex flex-col items-center p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>DAILY SCORE</span>
          </div>
          <span className="text-xl font-black text-amber-300 font-mono mt-1">{stats.dailyScore} PTS</span>
          <span className="text-[9px] text-amber-400/80 font-mono">Resets Daily (00:00)</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-bold font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>TOTAL SCORE</span>
          </div>
          <span className="text-xl font-black text-white font-mono mt-1">{stats.totalScore}</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>WON</span>
          </div>
          <span className="text-xl font-black text-white font-mono mt-1">{stats.gamesWon} / {stats.gamesPlayed}</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
          <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-bold font-mono">
            <Flame className="w-3.5 h-3.5" />
            <span>STREAK</span>
          </div>
          <span className="text-xl font-black text-white font-mono mt-1">{stats.currentStreak} 🔥</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/80 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-purple-400 text-[11px] font-bold font-mono">
            <Zap className="w-3.5 h-3.5" />
            <span>MAX STREAK</span>
          </div>
          <span className="text-xl font-black text-white font-mono mt-1">{stats.maxStreak}</span>
        </div>
      </motion.div>

      {/* How to Play Section (Oyun Nasıl Oynanır) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-zinc-800 rounded-3xl p-6 md:p-8 text-left shadow-2xl relative overflow-hidden"
      >
        <div className="flex items-center gap-2.5 text-amber-400 font-bold font-mono text-xs uppercase tracking-wider mb-4">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>HOW TO PLAY PICSAY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
              🖼️
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">1. Observe the Visual Scene</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Study the image carefully to spot the subject, action, object, and location.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
              📝
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">2. Follow English Grammar</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Sentences follow standard structure: <b className="text-amber-300">Subject + Verb + Object + Preposition + Place</b>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
              🟩
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">3. Wordle Color Feedback</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                <span className="text-emerald-400 font-bold">Green</span> = Correct spot, <span className="text-amber-300 font-bold">Yellow</span> = Wrong spot, <span className="text-zinc-500 font-bold">Gray</span> = Not in word.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-mono">4. Daily 00:00 Reset</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                A new visual scene puzzle arrives every day at midnight (00:00)!
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Oyun Modu Seçenek Kartları (Kart 1: Günlük 00:00 Bulmacası, Kart 2: Sınırsız Mod) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Mod Kartı 1: Günlük Bulmaca Modu (00:00 Sıfırlamalı) */}
        <div className="flex flex-col items-center justify-between gap-4 bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden shadow-xl text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold font-mono uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DAILY 00:00 PUZZLE</span>
            </div>
            <h3 className="text-xl font-black text-white font-mono">DAILY PUZZLE</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Every day at 00:00 midnight, a single global puzzle arrives for all players!
            </p>
          </div>

          {stats.dailyCompleted ? (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center gap-2 shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>TODAY'S PUZZLE COMPLETED! 🌅</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Next daily puzzle arrives at 00:00 midnight</span>
            </div>
          ) : (
            <button
              onClick={() => onStartGame("daily")}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 text-zinc-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-xl hover:brightness-110 active:scale-98 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START DAILY PUZZLE</span>
            </button>
          )}
        </div>

        {/* Mod Kartı 2: Sınırsız Pratik Modu (Gece Yarısını Beklemeden Rastgele Oyna) */}
        <div className="flex flex-col items-center justify-between gap-4 bg-gradient-to-b from-purple-950/40 via-zinc-900/90 to-zinc-900/90 border border-purple-500/30 p-6 rounded-3xl relative overflow-hidden shadow-xl text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-bold font-mono uppercase">
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>UNLIMITED PRACTICE MODE</span>
            </div>
            <h3 className="text-xl font-black text-white font-mono">UNLIMITED MODE</h3>
            <p className="text-xs text-zinc-300 leading-relaxed max-w-xs">
              Play infinite random visual scene challenges without waiting for tomorrow!
            </p>
          </div>

          <button
            onClick={() => onStartGame("unlimited")}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-xl hover:brightness-110 active:scale-98 transition-all border border-purple-400/40"
          >
            <Shuffle className="w-5 h-5" />
            <span>PLAY UNLIMITED MODE ♾️</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
