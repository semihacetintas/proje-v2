/**
 * SentenceWordleGrid Bileşeni (PicSay - Staj Eğitim Notu)
 * 
 * Bu React bileşeni, cümlenin kelime kelime kutucuklarını (Wordle Matrisi) ekrana çizer.
 * useRef ile doğrudan input odaklanmasını (focus management) yönetir ve gramer rollerini gösterir.
 */

import React, { useRef, useEffect } from "react";
import { SentenceChallenge, SentenceAttempt } from "../types";
import { motion } from "motion/react";

interface SentenceWordleGridProps {
  challenge: SentenceChallenge;
  currentAttemptWords: string[];
  pastAttempts: SentenceAttempt[];
  activeWordIndex: number;
  activeCharIndex: number;
  onInputChange: (wordIdx: number, val: string) => void;
  onKeyDown: (e: React.KeyboardEvent, wordIdx: number, charIdx: number) => void;
  onBoxClick: (wordIdx: number, charIdx: number) => void;
  onSubmit: () => void;
  isGameOver: boolean;
}

export const SentenceWordleGrid: React.FC<SentenceWordleGridProps> = ({
  challenge,
  currentAttemptWords,
  pastAttempts,
  activeWordIndex,
  activeCharIndex,
  onInputChange,
  onKeyDown,
  onBoxClick,
  onSubmit,
  isGameOver
}) => {
  // Matristeki her kutucuğun HTMLInputElement referansını saklar
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  // Bulmaca değiştiğinde referans matrisini yeniden yapılandırır
  useEffect(() => {
    inputRefs.current = challenge.targetWords.map((word) =>
      new Array(word.length).fill(null)
    );
  }, [challenge]);

  // Aktif hücre değiştiğinde otomatik klavye odağını (Focus) o hücreye kaydırır
  useEffect(() => {
    if (isGameOver) return;
    if (
      inputRefs.current[activeWordIndex] &&
      inputRefs.current[activeWordIndex][activeCharIndex]
    ) {
      inputRefs.current[activeWordIndex][activeCharIndex]?.focus();
    }
  }, [activeWordIndex, activeCharIndex, isGameOver]);

  const maxAttempts = 5;
  const attemptsRemaining = maxAttempts - pastAttempts.length;

  return (
    <div className="w-full flex flex-col gap-4 items-center">
      {/* Denemeler Listesi */}
      <div className="w-full flex flex-col gap-3 items-center">
        {/* AKTİF (ŞU ANKİ) DENEME SATIRI - EN ÜSTTE (Resme yakın ve odak noktası) */}
        {!isGameOver && pastAttempts.length < maxAttempts && (
          <motion.div
            key={`active-${pastAttempts.length}`}
            initial={{ scale: 0.96, y: -8, opacity: 0.8 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl bg-zinc-900 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/20"
          >
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Active Row: {pastAttempts.length + 1} / {maxAttempts}</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-medium text-zinc-400">
                Attempts Left: <strong className="text-amber-300 font-black">{attemptsRemaining}</strong>
              </span>
            </div>

            {/* Kelime Kutuları Satırı */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3 my-0.5 w-full">
              {challenge.targetWords.map((targetWord, wordIdx) => {
                const currentWordVal = currentAttemptWords[wordIdx] || "";

                return (
                  <div key={wordIdx} className="flex items-center gap-0.5 sm:gap-1">
                    {Array.from({ length: targetWord.length }).map((_, charIdx) => {
                      const charVal = currentWordVal[charIdx] || "";
                      const isActive =
                        activeWordIndex === wordIdx && activeCharIndex === charIdx;

                      return (
                        <div
                          key={charIdx}
                          onClick={() => onBoxClick(wordIdx, charIdx)}
                          className={`relative w-7 h-9 sm:w-8 sm:h-10 md:w-10 md:h-12 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all ${
                            isActive
                              ? "bg-zinc-950 border-amber-400 shadow-lg shadow-amber-400/40 ring-2 ring-amber-400/30 scale-105"
                              : charVal
                              ? "bg-zinc-800 border-zinc-500 text-white shadow-sm"
                              : "bg-zinc-950/80 border-zinc-800 text-zinc-600"
                          }`}
                        >
                          <input
                            ref={(el) => {
                              if (!inputRefs.current[wordIdx]) {
                                inputRefs.current[wordIdx] = [];
                              }
                              inputRefs.current[wordIdx][charIdx] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={charVal}
                            onChange={(e) => onInputChange(wordIdx, e.target.value)}
                            onKeyDown={(e) => onKeyDown(e, wordIdx, charIdx)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-center text-sm sm:text-base font-black uppercase font-mono"
                          />
                          <span className="text-sm sm:text-base md:text-lg font-black font-mono text-white uppercase">
                            {charVal}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Gönder (Submit) Butonu */}
            <button
              onClick={onSubmit}
              className="w-full sm:w-auto px-8 h-9 sm:h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 transition-all mt-0.5"
            >
              <span>SUBMIT GUESS ↵</span>
            </button>
          </motion.div>
        )}

        {/* GEÇMİŞ (TAMAMLANMIŞ) DENEMELER BÖLÜMÜ - EN SON DENEME ÜSTTE OLACAK ŞEKİLDE SIFIRLANIR */}
        {pastAttempts.length > 0 && (
          <div className="w-full flex flex-col gap-2.5 mt-1">
            <div className="flex items-center gap-2 w-full justify-center opacity-60">
              <div className="h-[1px] flex-1 bg-zinc-800" />
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest px-2">
                PAST ATTEMPTS ({pastAttempts.length})
              </span>
              <div className="h-[1px] flex-1 bg-zinc-800" />
            </div>

            {[...pastAttempts].reverse().map((attempt) => {
              const isLatest = attempt.attemptNumber === pastAttempts.length;

              return (
                <motion.div
                  layout
                  key={attempt.attemptNumber}
                  initial={isLatest ? { opacity: 0, y: -30, scale: 0.95 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 25,
                    opacity: { duration: 0.2 }
                  }}
                  className={`flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-2xl bg-zinc-900/90 border shadow-lg w-full transition-colors ${
                    isLatest ? "border-amber-500/40 ring-1 ring-amber-500/20" : "border-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-black text-zinc-300 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg">
                      ATTEMPT #{attempt.attemptNumber}
                    </span>
                    {attempt.isCorrect ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        ✓ PERFECT MATCH
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-semibold text-zinc-400">
                        +{attempt.score} PTS
                      </span>
                    )}
                  </div>

                  {/* Harf/Kelime Kutucukları */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {attempt.wordAttempts.map((wordAttempt, wordIdx) => (
                      <div key={wordIdx} className="flex items-center gap-0.5 sm:gap-1">
                        {wordAttempt.letters.map((letter, charIdx) => {
                          let bgClass = "bg-zinc-800 text-zinc-400 border-zinc-700";
                          if (letter.status === "correct") {
                            bgClass = "bg-emerald-500 text-zinc-950 font-black border-emerald-400 shadow-md shadow-emerald-500/20";
                          } else if (letter.status === "present") {
                            bgClass = "bg-amber-400 text-zinc-950 font-black border-amber-300 shadow-md shadow-amber-400/20";
                          }

                          // Staggered 3D flip animation for latest attempt
                          const delayIndex = wordIdx * 4 + charIdx;

                          return (
                            <motion.div
                              key={charIdx}
                              initial={isLatest ? { rotateX: -90, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                              animate={{ rotateX: 0, opacity: 1 }}
                              transition={
                                isLatest
                                  ? {
                                      duration: 0.35,
                                      delay: delayIndex * 0.05,
                                      ease: "backOut"
                                    }
                                  : { duration: 0 }
                              }
                              className={`w-7 h-9 sm:w-8 sm:h-10 rounded-xl border-2 flex items-center justify-center text-xs sm:text-sm uppercase tracking-wider font-mono font-black ${bgClass}`}
                            >
                              {letter.char}
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
