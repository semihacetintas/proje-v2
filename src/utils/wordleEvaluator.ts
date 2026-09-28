/**
 * Wordle Algoritması Değerlendirme Modülü (Staj Eğitim Notları):
 * 
 * Bu dosya, kelime bazlı Wordle renk geri bildirimlerini (Yeşil / Sarı / Gri) hesaplar.
 * Klasik Wordle kurallarına göre iki aşamalı (Two-pass) harf kontrol algoritması kullanır.
 */

import { LetterFeedback, WordAttempt, SentenceAttempt } from "../types";

/**
 * Tek bir kelimenin Wordle standartlarında harf harf doğruluğunu kontrol eder.
 * 
 * @param targetWord - Doğru kabul edilen hedef kelime (Örn: "DRINKS")
 * @param userWordGuess - Oyuncunun girdiği kelime tahmini (Örn: "DRIVES")
 * @returns WordAttempt nesnesi (Her harfin status bilgisi: 'correct', 'present', 'absent')
 */
export function evaluateWordleWord(targetWord: string, userWordGuess: string): WordAttempt {
  // Harf büyüklüğü duyarlılığını kaldırmak için büyük harfe çeviriyoruz
  const cleanTarget = targetWord.trim().toUpperCase();
  const cleanGuess = userWordGuess.trim().toUpperCase();

  const letters: LetterFeedback[] = [];
  const targetChars = cleanTarget.split("");
  const guessChars = cleanGuess.split("");

  // Hedef kelimedeki harflerin eşleşip eşleşmediğini takip eden dizi (Çift sayımı önler)
  const consumed = new Array(targetChars.length).fill(false);
  const statusArray: ('correct' | 'present' | 'absent')[] = new Array(guessChars.length).fill('absent');

  // 1. AŞAMA (First Pass): Tam Konum Eşleşmeleri (YEŞİL / Correct)
  // Harf hem kelimede var hem de tam doğru indeksteyse YEŞİL yapılır.
  for (let i = 0; i < guessChars.length; i++) {
    if (i < targetChars.length && guessChars[i] === targetChars[i]) {
      statusArray[i] = 'correct';
      consumed[i] = true; // Bu harf eşleşti olarak işaretlenir
    }
  }

  // 2. AŞAMA (Second Pass): Yanlış Konumdaki Harfler (SARI / Present) ve Olmayanlar (GRİ / Absent)
  // Yeşil olmayan harfler kontrol edilir, kelimede başka bir indekste varsa SARI yapılır.
  for (let i = 0; i < guessChars.length; i++) {
    if (statusArray[i] === 'correct') continue;

    const char = guessChars[i];
    let foundIndex = -1;

    for (let j = 0; j < targetChars.length; j++) {
      if (!consumed[j] && targetChars[j] === char) {
        foundIndex = j;
        break;
      }
    }

    if (foundIndex !== -1) {
      statusArray[i] = 'present'; // Kelimede var ama yeri yanlış
      consumed[foundIndex] = true;
    } else {
      statusArray[i] = 'absent'; // Kelimede bu harf yok
    }
  }

  // Elde edilen sonuçlar liste yapısına aktarılır
  for (let i = 0; i < guessChars.length; i++) {
    letters.push({
      char: guessChars[i] || "",
      status: statusArray[i]
    });
  }

  const isWordExactMatch = cleanGuess === cleanTarget;

  return {
    targetWordLength: cleanTarget.length,
    wordGuess: cleanGuess,
    letters,
    isWordExactMatch
  };
}

/**
 * Cümlenin tamamı için tahmin denemesini değerlendirir.
 * 
 * @param targetWords - Hedef cümlenin kelimeleri (Örn: ["A", "CAT", "DRINKS", "MILK", "ON", "THE", "CHAIR"])
 * @param userWordGuesses - Oyuncunun girdiği kelimeler dizisi
 * @param attemptNumber - Kaçıncı deneme olduğu (1-5)
 * @returns SentenceAttempt nesnesi (Puan ve genel doğruluk durumu)
 */
export function evaluateSentenceAttempt(
  targetWords: string[],
  userWordGuesses: string[],
  attemptNumber: number
): SentenceAttempt {
  const wordAttempts: WordAttempt[] = [];
  let allExact = true;

  // Cümledeki her kelimeyi sırayla değerlendiriyoruz
  for (let i = 0; i < targetWords.length; i++) {
    const targetWord = targetWords[i];
    const userWord = userWordGuesses[i] || "";
    const evalResult = evaluateWordleWord(targetWord, userWord);
    wordAttempts.push(evalResult);

    if (!evalResult.isWordExactMatch) {
      allExact = false;
    }
  }

  const fullSentenceGuess = userWordGuesses.join(" ");

  // Puanlama Mantığı:
  // 1. Deneme: 100 Puan
  // 2. Deneme: 80 Puan
  // 3. Deneme: 60 Puan
  // 4. Deneme: 40 Puan
  // 5. Deneme: 20 Puan
  const score = allExact ? Math.max(20, 100 - (attemptNumber - 1) * 20) : 0;

  return {
    attemptNumber,
    wordAttempts,
    fullSentenceGuess,
    isCorrect: allExact,
    score
  };
}
