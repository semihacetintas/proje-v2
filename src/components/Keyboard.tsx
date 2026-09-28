/**
 * Keyboard Bileşeni (Sanal Klavye)
 * Staj Eğitim Notu: Ekran klavyesi, oyuncunun daha önce tahmin ettiği harflerin
 * Wordle durumlarına (Yeşil / Sarı / Gri) göre dinamik renklendirilir.
 */

import React from "react";
import { Delete, CornerDownLeft } from "lucide-react";

interface KeyboardProps {
  onCharKey: (char: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  usedLetters: { [key: string]: "correct" | "present" | "absent" };
  disabled?: boolean;
}

export const Keyboard: React.FC<KeyboardProps> = ({
  onCharKey,
  onBackspace,
  onSubmit,
  usedLetters,
  disabled = false
}) => {
  // İngilizce klavye tuş düzeni
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  // Harfin durumuna göre tuşun arkaplan ve yazı rengini belirleyen fonksiyon
  const getKeyBg = (char: string) => {
    const status = usedLetters[char];
    if (status === "correct") return "bg-emerald-500 text-zinc-950 font-bold border-emerald-400"; // Doğru yer (Yeşil)
    if (status === "present") return "bg-amber-400 text-zinc-950 font-bold border-amber-300"; // Var ama yeri yanlış (Sarı)
    if (status === "absent") return "bg-zinc-800 text-zinc-500 border-zinc-800 opacity-60"; // Kelimede yok (Gri)
    return "bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 border-zinc-700"; // Henüz denenmedi
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-1.5 p-2 bg-zinc-900/60 border border-zinc-800 rounded-3xl backdrop-blur-md">
      {/* Satır 1 */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        {row1.map((char) => (
          <button
            key={char}
            disabled={disabled}
            onClick={() => onCharKey(char)}
            className={`h-11 sm:h-12 min-w-[32px] sm:min-w-[42px] px-1 rounded-xl text-sm sm:text-base font-bold font-mono border transition-all cursor-pointer active:scale-95 ${getKeyBg(
              char
            )}`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Satır 2 */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        {row2.map((char) => (
          <button
            key={char}
            disabled={disabled}
            onClick={() => onCharKey(char)}
            className={`h-11 sm:h-12 min-w-[32px] sm:min-w-[42px] px-1 rounded-xl text-sm sm:text-base font-bold font-mono border transition-all cursor-pointer active:scale-95 ${getKeyBg(
              char
            )}`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Satır 3 ve Enter / Silme Tuşları */}
      <div className="flex justify-center gap-1 sm:gap-1.5">
        <button
          disabled={disabled}
          onClick={onSubmit}
          className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 hover:brightness-110 transition-all cursor-pointer flex items-center gap-1 shadow-md"
        >
          <span>GUESS</span>
          <CornerDownLeft className="w-4 h-4" />
        </button>

        {row3.map((char) => (
          <button
            key={char}
            disabled={disabled}
            onClick={() => onCharKey(char)}
            className={`h-11 sm:h-12 min-w-[32px] sm:min-w-[42px] px-1 rounded-xl text-sm sm:text-base font-bold font-mono border transition-all cursor-pointer active:scale-95 ${getKeyBg(
              char
            )}`}
          >
            {char}
          </button>
        ))}

        <button
          disabled={disabled}
          onClick={onBackspace}
          className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl text-xs font-bold font-mono bg-zinc-800 hover:bg-zinc-700 text-rose-400 border border-zinc-700 transition-all cursor-pointer flex items-center justify-center active:scale-95"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
