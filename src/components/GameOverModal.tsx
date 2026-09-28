/**
 * GameOverModal Bileşeni (PicSay - Staj Eğitim Notu)
 * 
 * Oyun bittiğinde (Kazanma veya Kaybetme durumu) açılan diyalog/modal penceresidir.
 * Doğru hedef cümleyi (Target Sentence), kazanılan puanı, deneme sayısını ve
 * 'Sınırsız Mod'a geçiş yapma ya da skoru kopyalayıp paylaşma butonlarını içerir.
 */

import React from "react";
import { Home, CheckCircle2, XCircle, Share2, Check, Sparkles, Shuffle } from "lucide-react";
import { SentenceChallenge, GameMode } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface GameOverModalProps {
  /** Modal'ın görünürlük durumu */
  isOpen: boolean;
  /** Oyuncunun bulmacayı bilip bilmediği */
  isWon: boolean;
  /** Bu bulmacadan kazanılan puan */
  score: number;
  /** Tamamlanan veya çözülemeyen bulmaca nesnesi */
  challenge: SentenceChallenge;
  /** Yapılan toplam deneme sayısı (1 - 5) */
  attemptsCount: number;
  /** Aktif oyun modu ('daily' veya 'unlimited') */
  gameMode: GameMode;
  /** Ana ekrana dönme fonksiyonu */
  onReturnHome: () => void;
  /** Sıradaki sınırsız bulmacayı başlatma fonksiyonu */
  onPlayNextUnlimited: () => void;
  /** Modal'ı kapatma fonksiyonu */
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isWon,
  score,
  challenge,
  attemptsCount,
  gameMode,
  onReturnHome,
  onPlayNextUnlimited
}) => {
  // Puan paylaşım panosuna kopyalandı bilgisi için state
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // Skor özetini panoya kopyalama handler'ı
  const handleShare = () => {
    const text = `🎨 PicSay - Visual English Sentence Game!\n"${challenge.targetSentence}"\n🎯 Solved in ${attemptsCount} attempt(s)!\n🏆 Score: ${score} / 100\nPlay now!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col gap-6 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Üst Dekoratif Renk Şeridi (Kazanma: Yeşil, Kaybetme: Kırmızı) */}
          <div className={`absolute top-0 inset-x-0 h-2 ${isWon ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-rose-500 to-amber-500"}`} />

          {/* Durum Rozeti ve İkon (Tebrikler veya Oyun Bitti) */}
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl ${
              isWon ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}>
              {isWon ? <CheckCircle2 className="w-10 h-10 animate-bounce" /> : <XCircle className="w-10 h-10" />}
            </div>

            <h2 className="text-2xl font-black font-mono text-white tracking-tight">
              {isWon ? "CONGRATULATIONS! 🎉" : "PUZZLE COMPLETED 🌅"}
            </h2>

            <p className="text-xs text-zinc-300 font-medium leading-relaxed max-w-xs">
              {isWon
                ? "You successfully completed this visual puzzle! See you tomorrow for a new scene!"
                : "Nice try! Today's puzzle is complete. See you tomorrow for a fresh new visual challenge!"}
            </p>
          </div>

          {/* Skor ve Deneme Bilgisi Kartı */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-around">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">SCORE EARNED</span>
              <span className="text-3xl font-black font-mono text-emerald-400 mt-0.5">+{score}</span>
            </div>

            <div className="w-px h-10 bg-zinc-800" />

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">ATTEMPTS</span>
              <span className="text-3xl font-black font-mono text-amber-400 mt-0.5">{attemptsCount} / 5</span>
            </div>
          </div>

          {/* Doğru Hedef Cümle Çözüm Kutusu */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 text-left flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-mono">
              <Sparkles className="w-4 h-4" />
              <span>TARGET SENTENCE SOLUTION</span>
            </div>

            <p className="text-lg font-black font-mono text-white tracking-wider">
              "{challenge.targetSentence}"
            </p>
          </div>

          {/* Aksiyon Butonları (Sınırsız Mod, Paylaşım, Ana Sayfa) */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onPlayNextUnlimited}
              className="w-full h-13 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-98 transition-all border border-purple-400/40"
            >
              <Shuffle className="w-4 h-4" />
              <span>PLAY NEXT UNLIMITED PUZZLE ♾️</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="flex-1 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border border-zinc-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Share Score"}</span>
              </button>

              <button
                onClick={onReturnHome}
                className="flex-1 h-11 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border border-zinc-800"
              >
                <Home className="w-4 h-4" />
                <span>Return Home 🏠</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

