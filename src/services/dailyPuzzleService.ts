import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { SentenceChallenge } from "../types";

export interface DailyPuzzleDoc {
  date: string; // YYYY-MM-DD
  targetSentence: string;
  targetWords: string[];
  imageUrl: string;
  visualPrompt: string;
  createdAt: string;
}

/**
  * Veritabanından belirli bir tarihin günlük bulmacasını getirir.
  * Eğer o gün için veritabanında hazır bulmaca yoksa, Yapay Zeka (Gemini + Görsel)
  * üzerinden anında üretip Firestore veritabanına kaydeder.
  */
export async function fetchDailyPuzzleForDate(dateStr: string): Promise<SentenceChallenge> {
  try {
    const docRef = doc(db, "daily_puzzles", dateStr);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data() as DailyPuzzleDoc;
      return {
        id: `daily-${dateStr}`,
        targetSentence: data.targetSentence,
        targetWords: data.targetWords,
        imageUrl: data.imageUrl,
        visualPrompt: data.visualPrompt || data.targetSentence
      };
    }
  } catch (err) {
    console.warn("Firestore okuma hatası, AI servisine yönlendiriliyor:", err);
  }

  // Veritabanında yoksa AI ile üret ve veritabanına kaydet
  return await generateAndSaveDailyPuzzle(dateStr);
}

/**
  * Belirtilen bir gün (Örn: yarın, haftaya) için Gemini AI ile bulmaca üretip veritabanına kaydeder.
  */
export async function generateAndSaveDailyPuzzle(dateStr: string): Promise<SentenceChallenge> {
  try {
    const response = await fetch("/api/generate-sentence-challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateStr })
    });

    if (!response.ok) {
      throw new Error("API sunucu hatası");
    }

    const data = await response.json();
    const challenge: SentenceChallenge = {
      id: `daily-${dateStr}`,
      targetSentence: data.targetSentence,
      targetWords: data.targetWords,
      imageUrl: data.imageUrl,
      visualPrompt: data.visualPrompt || data.targetSentence
    };

    // Firestore veritabanına kaydet
    try {
      const docRef = doc(db, "daily_puzzles", dateStr);
      await setDoc(docRef, {
        date: dateStr,
        targetSentence: challenge.targetSentence,
        targetWords: challenge.targetWords,
        imageUrl: challenge.imageUrl,
        visualPrompt: challenge.visualPrompt,
        createdAt: new Date().toISOString()
      });
      console.log(`[Firestore] ${dateStr} günlük bulmacası veritabanına başarıyla kaydedildi!`);
    } catch (saveErr) {
      console.error("Firestore yazma hatası:", saveErr);
    }

    return challenge;
  } catch (error) {
    console.error("Günlük bulmaca üretme hatası:", error);
    // Fallback varsayılan bulmaca
    return {
      id: `daily-${dateStr}`,
      targetSentence: "ROBOT CARRIES BALLOONS ACROSS DESERT",
      targetWords: ["ROBOT", "CARRIES", "BALLOONS", "ACROSS", "DESERT"],
      imageUrl: "https://image.pollinations.ai/prompt/a%20friendly%20silver%20robot%20carrying%20bright%20colorful%20balloons%20walking%20across%20a%20sunny%20sandy%20desert,%20vibrant%20digital%20vector%20art%20illustration?width=800&height=800&seed=101&nologo=true",
      visualPrompt: "ROBOT CARRIES BALLOONS ACROSS DESERT"
    };
  }
}

/**
  * Manuel olarak belirtilen tarihin cümlesini ve resim URL'sini Firestore veritabanına kaydeder/günceller.
  */
export async function saveManualDailyPuzzle(
  dateStr: string,
  targetSentence: string,
  imageUrl: string,
  visualPrompt?: string
): Promise<SentenceChallenge> {
  const upperSentence = targetSentence.trim().toUpperCase();
  const words = upperSentence.split(/\s+/).filter(w => w.length > 0);

  const docData: DailyPuzzleDoc = {
    date: dateStr,
    targetSentence: upperSentence,
    targetWords: words,
    imageUrl: imageUrl.trim(),
    visualPrompt: visualPrompt || upperSentence,
    createdAt: new Date().toISOString()
  };

  const docRef = doc(db, "daily_puzzles", dateStr);
  await setDoc(docRef, docData);

  return {
    id: `daily-${dateStr}`,
    targetSentence: upperSentence,
    targetWords: words,
    imageUrl: imageUrl.trim(),
    visualPrompt: visualPrompt || upperSentence
  };
}

/**
  * Veritabanında kayıtlı tüm günlük bulmacaları getirir (Admin Paneli için)
  */
export async function fetchAllSavedDailyPuzzles(): Promise<DailyPuzzleDoc[]> {
  try {
    const colRef = collection(db, "daily_puzzles");
    const snap = await getDocs(colRef);
    const results: DailyPuzzleDoc[] = [];
    snap.forEach((d) => {
      results.push(d.data() as DailyPuzzleDoc);
    });
    // Tarihe göre sırala (en yeniden eskiye)
    results.sort((a, b) => b.date.localeCompare(a.date));
    return results;
  } catch (err) {
    console.error("Tüm bulmacaları okuma hatası:", err);
    return [];
  }
}
