/**
 * PicSay Veri Tipleri (TypeScript Type Definitions)
 * Staj Proje Notu: Strong typing ve nesne yönelimli mimari için TypeScript arayüzleri.
 */

// Oyun Modu Tipi: 'daily' (Günlük 00:00 Sıfırlamalı) veya 'unlimited' (Sınırsız Pratik Modu)
export type GameMode = 'daily' | 'unlimited';

// Tek bir harfin Wordle renk durumunu ifade eder
export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

// Cümledeki kelimelerin gramer rollerini ifade eden tip
export type GrammarRole = 'Subject' | 'Verb' | 'Object' | 'Preposition' | 'Place' | 'Article/Modifier';

// Harf seviyesinde renk geri bildirim nesnesi
export interface LetterFeedback {
  char: string; // Girilen harf (Örn: 'A')
  status: 'correct' | 'present' | 'absent'; // 'correct' = Yeşil, 'present' = Sarı, 'absent' = Gri
}

// Cümle içindeki tek bir kelimenin tahmin değerlendirme sonucu
export interface WordAttempt {
  targetWordLength: number; // Hedef kelimenin harf sayısı
  wordGuess: string; // Oyuncunun girdiği kelime
  letters: LetterFeedback[]; // Harf harf değerlendirme dizisi
  isWordExactMatch: boolean; // Kelime tam doğru mu?
}

// Cümlenin tamamı için yapılmış bir denemenin sonuç modeli
export interface SentenceAttempt {
  attemptNumber: number; // Deneme sırası (1 ile 5 arası)
  wordAttempts: WordAttempt[]; // Cümledeki her kelime için tahminler
  fullSentenceGuess: string; // Cümlenin tamamının birleşmiş metni
  isCorrect: boolean; // Tüm cümle doğru tahmin edildi mi?
  score: number; // Kazanılan puan
}

// Görsel Cümle Bulmaca Modeli
export interface SentenceChallenge {
  id: string; // Benzersiz bulmaca kimliği
  targetSentence: string; // Hedef İngilizce cümle (Örn: "ROBOT CARRIES BALLOONS ACROSS DESERT")
  targetWords: string[]; // Kelimelerine ayrılmış dizi (Örn: ["ROBOT", "CARRIES", "BALLOONS", "ACROSS", "DESERT"])
  imageUrl: string; // Sahneye ait görsel bağlantısı veya base64 verisi
  visualPrompt: string; // Görseli oluşturan İngilizce sahne açıklaması
  imageProvider?: string; // Görseli üreten motor (Örn: OpenAI DALL-E 3)
  imageError?: string; // Hata durumunda mesaj
}

// Oyuncu İstatistikleri (LocalStorage üzerinde saklanır ve 00:00'da sıfırlanır)
export interface GameStats {
  gamesPlayed: number; // Toplam oynanan oyun sayısı
  gamesWon: number; // Kazanılan oyun sayısı
  currentStreak: number; // Mevcut galibiyet serisi
  maxStreak: number; // Rekor galibiyet serisi
  totalScore: number; // Tüm zamanların toplam puanı
  dailyScore: number; // Bugün kazanılan günlük puan (Gece yarısı 00:00'da otomatik sıfırlanır)
  lastResetDate: string; // En son sıfırlamanın yapıldığı tarih (Örn: "2026-07-29")
  dailyCompleted: boolean; // Bugünkü günlük bulmaca tamamlandı mı?
}
