import React, { useState, useEffect, useRef } from "react";
import { SAMPLE_CHALLENGES } from "./data";
import { SentenceChallenge, SentenceAttempt, GameStats, GameMode } from "./types";
import { evaluateSentenceAttempt } from "./utils/wordleEvaluator";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { GameHeader } from "./components/GameHeader";
import { SentenceWordleGrid } from "./components/SentenceWordleGrid";
import { GameOverModal } from "./components/GameOverModal";
import { FormulaModal } from "./components/FormulaModal";
import { fetchDailyPuzzleForDate } from "./services/dailyPuzzleService";
import { ZoomIn, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * PicSay Ana Uygulama Bileşeni (React + Express Full-Stack Staj Projesi)
 * 
 * Bu dosya frontend durum yönetimini (State Management), kullanıcı girdilerini,
 * Express REST API backend isteklerini, oyun akışını ve Arka Planda (Sessizce)
 * 00:00 Gece Yarısı Otomatik Sıfırlama (Daily Reset) mekanizmasını organize eder.
 */

/**
 * Bugünün tarihini kullanıcının yerel saatine göre YYYY-MM-DD formatında döner.
 * Orijinal Wordle Mantığı: Her oyuncunun kendi yerel saat diliminde gece yarısı 00:00 olduğunda
 * (Türkiye'de 00:00, Fransa'da kendi 00:00'ında, Amerika'da kendi 00:00'ında) yeni günün bulmacası yüklenir.
 */
const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Tarihe göre bugünün özel bulmacasını seçen deterministik fonksiyon.
 * Her gün 00:00'da tüm kullanıcılara aynı günlük bulmaca sunulur.
 */
const getDailyPuzzleForDate = (dateStr: string): SentenceChallenge => {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SAMPLE_CHALLENGES.length;
  return SAMPLE_CHALLENGES[index];
};

export function App() {
  // Ekran Görünümü Durumu: 'welcome' (Karşılama Ekranı) veya 'game' (Oyun Alanı)
  const [view, setView] = useState<"welcome" | "game">("welcome");

  const todayStr = getTodayDateString();
  
  // Aktif Bulmaca, Oyun Modu ve Oyun Durumları (Game State)
  const [gameMode, setGameMode] = useState<GameMode>("daily");
  const [challenge, setChallenge] = useState<SentenceChallenge>(() => getDailyPuzzleForDate(todayStr));
  const [currentAttemptWords, setCurrentAttemptWords] = useState<string[]>([]);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);
  const [pastAttempts, setPastAttempts] = useState<SentenceAttempt[]>([]);
  const [usedLetters, setUsedLetters] = useState<{ [key: string]: "correct" | "present" | "absent" }>({});
  
  // Oyun Sonu & Skor Durumları
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [scoreEarned, setScoreEarned] = useState<number>(0);
  const [showImageZoom, setShowImageZoom] = useState<boolean>(false);
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resetNotification, setResetNotification] = useState<string>("");

  // Arka Planda Ön-Yükleme (Prefetch): Sınırsız modda oyuncu mevcut bulmacayı
  // çözerken bir sonraki bulmaca sessizce arka planda üretilir. "Sonraki" butonuna
  // basıldığında görsel zaten hazırsa oyuncu HİÇ beklemez.
  const [prefetchedChallenge, setPrefetchedChallenge] = useState<SentenceChallenge | null>(null);
  const prefetchInFlight = useRef(false);

  const prefetchNextChallenge = async () => {
    if (prefetchInFlight.current || prefetchedChallenge) return;
    prefetchInFlight.current = true;
    try {
      const storedKey = localStorage.getItem("picsay_openai_key") || "";
      const response = await fetch("/api/generate-sentence-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openaiKey: storedKey }),
      });
      if (!response.ok) throw new Error("AI service unavailable");
      const data = await response.json();
      if (data && data.targetSentence) {
        setPrefetchedChallenge(data);
      }
    } catch (err) {
      console.warn("Arka plan ön-yükleme başarısız oldu (sorun değil, bir sonraki istekte tekrar denenecek):", err);
    } finally {
      prefetchInFlight.current = false;
    }
  };

  // Sayfa yüklendiğinde Firestore veritabanından bugünün güncel bulmacasını çek
  useEffect(() => {
    let isMounted = true;
    fetchDailyPuzzleForDate(todayStr).then((puzzle) => {
      if (isMounted && puzzle) {
        setChallenge(puzzle);
      }
    });
    return () => { isMounted = false; };
  }, [todayStr]);

  // Kalıcı Oyuncu İstatistikleri (LocalStorage İle Saklanır)
  const [stats, setStats] = useState<GameStats>(() => {
    let baseStats: GameStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      totalScore: 0,
      dailyScore: 0,
      lastResetDate: todayStr,
      dailyCompleted: false
    };

    try {
      const saved = localStorage.getItem("picsay_stats") || localStorage.getItem("picsentence_stats");
      if (saved) {
        const parsed = JSON.parse(saved);
        baseStats = { ...baseStats, ...parsed };
      }
    } catch (e) {
      console.error("LocalStorage okuma hatası:", e);
    }

    // Gece yarısı 00:00 geçmişse günlük skorları ve günlük tamamlama durumunu sıfırla!
    if (baseStats.lastResetDate !== todayStr) {
      baseStats.dailyScore = 0;
      baseStats.dailyCompleted = false;
      baseStats.lastResetDate = todayStr;
    }

    return baseStats;
  });

  // İstatistikler her güncellendiğinde LocalStorage'a kaydet (Side Effect)
  useEffect(() => {
    try {
      localStorage.setItem("picsay_stats", JSON.stringify(stats));
    } catch (e) {
      console.error("LocalStorage kaydetme hatası:", e);
    }
  }, [stats]);

  // Arka Planda Gece Yarısı (00:00) Takip Mantığı (Ekranda sayaç gösterilmeden sessizce çalışır)
  useEffect(() => {
    const checkMidnightReset = () => {
      const currentTodayStr = getTodayDateString();
      if (stats.lastResetDate !== currentTodayStr) {
        // Gece yarısı 00:00 olunca günlük skoru ve günlük tamamlama durumunu arka planda sıfırla
        setStats((prev) => ({
          ...prev,
          dailyScore: 0,
          dailyCompleted: false,
          lastResetDate: currentTodayStr
        }));

        // Günlük bulmacayı yeni güne özel güncelle
        const newDailyPuzzle = getDailyPuzzleForDate(currentTodayStr);
        setChallenge(newDailyPuzzle);

        setResetNotification("🌅 GECE YARISI (00:00): Günlük skorlar arka planda sıfırlandı!");
        setTimeout(() => setResetNotification(""), 6000);
      }
    };

    // Her 5 saniyede bir arka planda tarih değişimini kontrol et
    const interval = setInterval(checkMidnightReset, 5000);
    return () => clearInterval(interval);
  }, [stats.lastResetDate]);

  // Ekran görünümü veya bulmaca değiştiğinde sayfanın en üstüne otomatik kaydır (Resmin ilk görünmesi için)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [view, challenge.id]);

  // Yeni bir oyun başlatma fonksiyonu ('daily' veya 'unlimited')
  const handleStartGame = async (mode: GameMode = "daily") => {
    if (mode === "daily") {
      if (stats.dailyCompleted) {
        setResetNotification("🌅 TODAY'S PUZZLE COMPLETED: See you tomorrow at 00:00 midnight!");
        setTimeout(() => setResetNotification(""), 4000);
        return;
      }
      setIsGeneratingAI(true);
      try {
        const dailyPuzzle = await fetchDailyPuzzleForDate(getTodayDateString());
        initChallenge(dailyPuzzle, "daily");
      } catch (err) {
        const fallback = getDailyPuzzleForDate(getTodayDateString());
        initChallenge(fallback, "daily");
      } finally {
        setIsGeneratingAI(false);
      }
    } else {
      // Sınırsız Mod: Gemini + Imagen ile anında yepyeni AI bulmacası ve resmi üret!
      await fetchNewAIChallenge("unlimited");
    }
  };

  // Sıradaki Sınırsız Bulmacayı Başlat (GameOverModal veya Oyun içi geçiş için)
  const handleStartNextUnlimited = async () => {
    await fetchNewAIChallenge("unlimited");
  };

  // Seçilen bulmacayı ve modu sıfırlayarak hazırlar
  const initChallenge = (selectedChallenge: SentenceChallenge, mode: GameMode = "daily") => {
    setGameMode(mode);
    setChallenge(selectedChallenge);
    setCurrentAttemptWords(new Array(selectedChallenge.targetWords.length).fill(""));
    setActiveWordIndex(0);
    setActiveCharIndex(0);
    setPastAttempts([]);
    setUsedLetters({});
    setIsGameOver(false);
    setIsWon(false);
    setScoreEarned(0);
    setErrorMessage("");
    setView("game");
    if (localStorage.getItem("picsay_hide_formula") !== "true") {
      setShowFormulaModal(true);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  // Express backend API (/api/generate-sentence-challenge) üzerinden dinamik AI bulmacası çeker
  const fetchNewAIChallenge = async (mode: GameMode = "unlimited") => {
    // Arka planda hazırlanmış bir bulmaca varsa, oyuncu HİÇ beklemeden anında oynamaya başlar
    if (prefetchedChallenge) {
      const ready = prefetchedChallenge;
      setPrefetchedChallenge(null);
      initChallenge(ready, mode);
      prefetchNextChallenge(); // bir sonrakini hemen arka planda üretmeye başla
      return;
    }

    setIsGeneratingAI(true);
    setErrorMessage("");

    try {
      const storedKey = localStorage.getItem("picsay_openai_key") || "";
      const response = await fetch("/api/generate-sentence-challenge", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-openai-key": storedKey
        },
        body: JSON.stringify({ openaiKey: storedKey })
      });

      if (!response.ok) throw new Error("AI service unavailable");

      const data = await response.json();
      if (data && data.targetSentence) {
        initChallenge(data, mode);
        prefetchNextChallenge(); // artık her zaman bir adım önde kalmaya çalış
      } else {
        throw new Error("Invalid AI output");
      }
    } catch (err) {
      console.error("AI challenge error:", err);
      // Hata durumunda yerel veri setindeki bir bulmacaya düşer (Fallback)
      const fallback = SAMPLE_CHALLENGES[Math.floor(Math.random() * SAMPLE_CHALLENGES.length)];
      initChallenge(fallback, mode);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Sanal / Fiziksel Klavye karakter girme fonksiyonu
  const handleCharKey = (char: string) => {
    if (isGameOver) return;

    const uppercaseChar = char.toUpperCase();
    const currentWordLen = challenge.targetWords[activeWordIndex].length;

    setCurrentAttemptWords((prev) => {
      const next = [...prev];
      const wordChars = (next[activeWordIndex] || "").split("");
      wordChars[activeCharIndex] = uppercaseChar;
      next[activeWordIndex] = wordChars.join("");
      return next;
    });

    // İmleci bir sonraki kutucuğa ilerlet
    if (activeCharIndex < currentWordLen - 1) {
      setActiveCharIndex(activeCharIndex + 1);
    } else if (activeWordIndex < challenge.targetWords.length - 1) {
      // Bir sonraki kelimenin ilk kutucuğuna geç
      setActiveWordIndex(activeWordIndex + 1);
      setActiveCharIndex(0);
    }
  };

  // Silme (Backspace) fonksiyonu
  const handleBackspace = () => {
    if (isGameOver) return;

    const currentWordVal = currentAttemptWords[activeWordIndex] || "";

    if (currentWordVal[activeCharIndex]) {
      // Aktif indeksteki harfi sil
      setCurrentAttemptWords((prev) => {
        const next = [...prev];
        const chars = next[activeWordIndex].split("");
        chars[activeCharIndex] = "";
        next[activeWordIndex] = chars.join("");
        return next;
      });
    } else {
      // İmleci bir geriye çek
      if (activeCharIndex > 0) {
        const newCharIdx = activeCharIndex - 1;
        setActiveCharIndex(newCharIdx);
        setCurrentAttemptWords((prev) => {
          const next = [...prev];
          const chars = next[activeWordIndex].split("");
          chars[newCharIdx] = "";
          next[activeWordIndex] = chars.join("");
          return next;
        });
      } else if (activeWordIndex > 0) {
        const prevWordIdx = activeWordIndex - 1;
        const prevWordLen = challenge.targetWords[prevWordIdx].length;
        const lastCharIdx = prevWordLen - 1;

        setActiveWordIndex(prevWordIdx);
        setActiveCharIndex(lastCharIdx);

        setCurrentAttemptWords((prev) => {
          const next = [...prev];
          const chars = (next[prevWordIdx] || "").split("");
          chars[lastCharIdx] = "";
          next[prevWordIdx] = chars.join("");
          return next;
        });
      }
    }
  };

  // Fiziksel Klavye tuş basımı dinleyicisi
  const handleKeyDown = (e: React.KeyboardEvent, wordIdx: number, charIdx: number) => {
    if (isGameOver) return;

    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitAttempt();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      handleBackspace();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const currentWordLen = challenge.targetWords[wordIdx].length;
      if (charIdx < currentWordLen - 1) {
        setActiveCharIndex(charIdx + 1);
      } else if (wordIdx < challenge.targetWords.length - 1) {
        setActiveWordIndex(wordIdx + 1);
        setActiveCharIndex(0);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (charIdx > 0) {
        setActiveCharIndex(charIdx - 1);
      } else if (wordIdx > 0) {
        const prevWordIdx = wordIdx - 1;
        setActiveWordIndex(prevWordIdx);
        setActiveCharIndex(challenge.targetWords[prevWordIdx].length - 1);
      }
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      handleCharKey(e.key);
    }
  };

  // Tahmin Gönderme (GUESS / Enter) Mantığı
  const handleSubmitAttempt = () => {
    if (isGameOver) return;

    // Bütün kelimelerin tam doldurulup doldurulmadığını denetle
    for (let i = 0; i < challenge.targetWords.length; i++) {
      const expectedLen = challenge.targetWords[i].length;
      const actualLen = (currentAttemptWords[i] || "").length;
      if (actualLen < expectedLen) {
        setErrorMessage(`Lütfen #${i + 1}. kelimeyi tamamlayın (${expectedLen} harf olmalı).`);
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
    }

    setErrorMessage("");

    const attemptNumber = pastAttempts.length + 1;
    const result = evaluateSentenceAttempt(challenge.targetWords, currentAttemptWords, attemptNumber);

    // Sanal klavye tuş renklerini güncelle
    const newUsedLetters = { ...usedLetters };
    result.wordAttempts.forEach((wordAttempt) => {
      wordAttempt.letters.forEach((letter) => {
        const char = letter.char.toUpperCase();
        const current = newUsedLetters[char];

        if (letter.status === "correct") {
          newUsedLetters[char] = "correct";
        } else if (letter.status === "present" && current !== "correct") {
          newUsedLetters[char] = "present";
        } else if (letter.status === "absent" && !current) {
          newUsedLetters[char] = "absent";
        }
      });
    });

    setUsedLetters(newUsedLetters);
    const updatedPastAttempts = [...pastAttempts, result];
    setPastAttempts(updatedPastAttempts);

    // Girdi satırını sıfırla
    setCurrentAttemptWords(new Array(challenge.targetWords.length).fill(""));
    setActiveWordIndex(0);
    setActiveCharIndex(0);

    if (result.isCorrect) {
      setIsGameOver(true);
      setIsWon(true);
      setScoreEarned(result.score);
      if (gameMode === "unlimited") prefetchNextChallenge(); // güvenlik ağı: prefetch daha önce başarısız olduysa şimdi tekrar dene

      // İstatistikleri ve Günlük Skoru (Daily Score) Güncelle
      setStats((prev) => {
        const newWon = prev.gamesWon + 1;
        const newStreak = prev.currentStreak + 1;
        return {
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          gamesWon: newWon,
          currentStreak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak),
          totalScore: prev.totalScore + result.score,
          dailyScore: gameMode === "daily" ? prev.dailyScore + result.score : prev.dailyScore,
          dailyCompleted: gameMode === "daily" ? true : prev.dailyCompleted
        };
      });
    } else if (updatedPastAttempts.length >= 5) {
      setIsGameOver(true);
      setIsWon(false);
      setScoreEarned(0);
      if (gameMode === "unlimited") prefetchNextChallenge(); // güvenlik ağı

      setStats((prev) => ({
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        currentStreak: 0,
        dailyCompleted: gameMode === "daily" ? true : prev.dailyCompleted
      }));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-amber-400 selection:text-zinc-950">
      {/* Arka Plan Işık Efektleri */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-rose-500/5 blur-[120px] pointer-events-none" />

      {/* Gece Yarısı 00:00 Sıfırlama Bildirimi Toast */}
      <AnimatePresence>
        {resetNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 text-zinc-950 font-black text-xs sm:text-sm font-mono shadow-2xl flex items-center gap-2 border border-amber-300"
          >
            <Sparkles className="w-5 h-5 text-zinc-950 animate-bounce" />
            <span>{resetNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ana Uygulama İçeriği */}
      <main className="flex-1 flex flex-col items-center justify-between p-4 md:p-6 w-full max-w-5xl mx-auto z-10">
        {view === "welcome" ? (
          <WelcomeScreen
            onStartGame={handleStartGame}
            stats={stats}
          />
        ) : (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-2.5 sm:gap-3.5 items-center">
            {/* Üst Bar Kontrolleri - İki İnce Yüzen Bar */}
            <GameHeader
              challenge={challenge}
              stats={stats}
              gameMode={gameMode}
              onBackToWelcome={() => {
                setIsGameOver(false);
                setView("welcome");
              }}
              onOpenFormula={() => setShowFormulaModal(true)}
            />

            {/* Hata Mesajı Bildirimi */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold font-mono flex items-center gap-2 shadow-lg"
              >
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Sahne Görsel Kartı - Üstte, Kompakt ve Yukarı Çekilmiş */}
            <div className="w-full max-w-md flex flex-col items-center">
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl bg-zinc-900 group">
                <img
                  src={challenge.imageUrl}
                  alt="Visual challenge scene"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("picsum.photos")) {
                      target.src = `https://picsum.photos/seed/${encodeURIComponent(challenge.targetSentence || "puzzle")}/800/800`;
                    }
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent pointer-events-none" />

                <button
                  onClick={() => setShowImageZoom(true)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 text-amber-300 transition-all cursor-pointer shadow-lg backdrop-blur-md"
                  title="Zoom Image"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-2.5 left-2.5">
                  <span className="inline-block px-2.5 py-1 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider backdrop-blur-sm">
                    VISUAL SCENE
                  </span>
                </div>
              </div>
            </div>

            {/* İnteraktif Cümle Wordle Matrisi & Denemeler - Altta ve Geniş */}
            <div className="w-full max-w-xl sm:max-w-2xl flex flex-col items-center">
              <SentenceWordleGrid
                challenge={challenge}
                currentAttemptWords={currentAttemptWords}
                pastAttempts={pastAttempts}
                activeWordIndex={activeWordIndex}
                activeCharIndex={activeCharIndex}
                onInputChange={(wordIdx, val) => {
                  const char = val.slice(-1).toUpperCase();
                  if (/^[A-Z]$/.test(char) || val === "") {
                    if (val === "") {
                      handleBackspace();
                    } else {
                      handleCharKey(char);
                    }
                  }
                }}
                onKeyDown={handleKeyDown}
                onBoxClick={(wIdx, cIdx) => {
                  setActiveWordIndex(wIdx);
                  setActiveCharIndex(cIdx);
                }}
                onSubmit={handleSubmitAttempt}
                isGameOver={isGameOver}
              />
            </div>
          </div>
        )}
      </main>

      {/* PicSay Formül Modalı */}
      <FormulaModal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
      />

      {/* Görsel Büyütme Modalı */}
      <AnimatePresence>
        {showImageZoom && (
          <div
            onClick={() => setShowImageZoom(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl bg-zinc-900"
            >
              <img
                src={challenge.imageUrl}
                alt="Zoomed scene"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("picsum.photos")) {
                    target.src = `https://picsum.photos/seed/${encodeURIComponent(challenge.targetSentence || "puzzle")}/800/800`;
                  }
                }}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="p-4 bg-zinc-950 text-center">
                <span className="text-xs text-zinc-400 font-mono font-bold">
                  Click anywhere to close.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Yapay Zeka Cümle & Görsel Üretim Yükleniyor Modalı */}
      <AnimatePresence>
        {isGeneratingAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-4 text-center max-w-sm p-8 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 animate-pulse" />
              
              <div className="relative flex items-center justify-center my-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-500 animate-spin blur-sm opacity-70" />
                <div className="absolute w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-black font-mono text-white tracking-wide">
                  Generating AI Scene...
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
                  Generating new English puzzle sentence & 3D Pixar scene...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Oyun Sonu Tebrik Modalı */}
      <GameOverModal
        isOpen={isGameOver}
        isWon={isWon}
        score={scoreEarned}
        challenge={challenge}
        attemptsCount={pastAttempts.length}
        gameMode={gameMode}
        onReturnHome={() => {
          setIsGameOver(false);
          setView("welcome");
        }}
        onPlayNextUnlimited={handleStartNextUnlimited}
        onClose={() => setIsGameOver(false)}
      />
    </div>
  );
}

export default App;
