import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, HelpCircle, CheckSquare, Square } from "lucide-react";

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem("picsay_hide_formula", "true");
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm cursor-pointer"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-sm w-full p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col gap-4 text-center cursor-default"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold font-mono text-white tracking-wide">
              PICSAY FORMULA
            </h3>
            <p className="text-xs text-zinc-400 font-medium">
              Every sentence in PicSay follows a 5-part rule:
            </p>
          </div>

          {/* Formula Diagram - Clean & Simple */}
          <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-center gap-1 text-xs font-mono font-bold text-zinc-200">
              <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200">Subject</span>
              <span className="text-zinc-500">+</span>
              <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200">Verb</span>
              <span className="text-zinc-500">+</span>
              <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200">Object</span>
              <span className="text-zinc-500">+</span>
              <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200">Prep</span>
              <span className="text-zinc-500">+</span>
              <span className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200">Place</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Letter feedback (<span className="text-emerald-400 font-bold">Green</span> / <span className="text-amber-400 font-bold">Yellow</span> / <span className="text-zinc-400 font-bold">Gray</span>) is evaluated <b className="text-amber-300 font-semibold">word-by-word</b>.
            </p>
          </div>

          {/* Footer controls */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              onClick={handleClose}
              className="w-full h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-98"
            >
              <span>GOT IT, LET'S PLAY!</span>
            </button>

            {/* Don't show again option */}
            <div
              onClick={() => setDontShowAgain(!dontShowAgain)}
              className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 hover:text-zinc-200 cursor-pointer select-none transition-colors"
            >
              {dontShowAgain ? (
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Square className="w-3.5 h-3.5 text-zinc-600" />
              )}
              <span>Don't show this formula again</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

