import React, {useState} from 'react';
import {AlertCircle, Check, Sparkles, X} from 'lucide-react';
import {
  playErrorTone,
  playKeyTap,
  playRoundSuccessTone,
} from '../utils/audioEngine';

interface SimpleCipherPuzzleProps {
  onFirstInteract: () => void;
  onSolved: () => void;
}

interface QuizOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect: boolean;
}

const QUIZ_OPTIONS: QuizOption[] = [
  {label: 'A', text: 'Ngày 19/11', isCorrect: false},
  {label: 'B', text: 'Ngày 3/12', isCorrect: true},
  {label: 'C', text: 'Ngày 14/02', isCorrect: false},
  {label: 'D', text: 'Ngày 20/10', isCorrect: false},
];

export const SimpleCipherPuzzle: React.FC<SimpleCipherPuzzleProps> = ({
  onFirstInteract,
  onSolved,
}) => {
  const [wrongLabels, setWrongLabels] = useState<Record<string, boolean>>({});
  const [shakingLabel, setShakingLabel] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const handleSelectOption = (option: QuizOption) => {
    if (isSolved) return;
    onFirstInteract();

    if (option.isCorrect) {
      playRoundSuccessTone();
      setIsSolved(true);
      setTimeout(() => {
        onSolved();
      }, 650);
    } else {
      playKeyTap();
      playErrorTone();
      setWrongLabels((prev) => ({...prev, [option.label]: true}));
      setShakingLabel(option.label);
      setTimeout(() => {
        setShakingLabel((curr) => (curr === option.label ? null : curr));
      }, 420);
    }
  };

  const hasAnyWrong = Object.keys(wrongLabels).length > 0;

  return (
    <main className="min-h-dvh w-full text-[#4A3525] flex flex-col items-center justify-center px-4 pt-12 pb-28 sm:pb-32 relative z-10">
      {/* Chibi / Kawaii Question Card: white-pink surface, 24px radius, 2.5px #4A3525 border, 4px hard shadow */}
      <div className="w-full max-w-lg bg-gradient-to-b from-[#FFFFFF] to-[#FFF2F6] border-[2.5px] border-[#4A3525] rounded-[24px] p-6 sm:p-8 shadow-[4px_4px_0px_#4A3525] animate-gentle-appear relative">
        {/* Clean Unboxed Metadata */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#8A6A52] tracking-wide mb-3">
          <span>Câu hỏi mở khoá</span>
          <span aria-hidden="true">·</span>
          <span>19/11</span>
        </div>

        {/* Question Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-[#4A3525] tracking-tight mb-6">
          Ngày đầu tiên gặp là ngày nào?
        </h1>

        {/* Softly Rounded Kawaii A B C D Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          {QUIZ_OPTIONS.map((opt) => {
            const isWrong = Boolean(wrongLabels[opt.label]);
            const isCorrectPicked = isSolved && opt.isCorrect;
            const isShaking = shakingLabel === opt.label;

            return (
              <button
                key={opt.label}
                type="button"
                disabled={isSolved}
                onClick={() => handleSelectOption(opt)}
                className={`group relative h-14 px-4 rounded-2xl border-[2px] border-[#4A3525] text-left flex items-center justify-between gap-3 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A3525] cursor-pointer ${
                  isShaking ? 'animate-shake' : ''
                } ${
                  isCorrectPicked
                    ? 'bg-[#C8F7DC] text-[#264D36] shadow-[3px_3px_0px_#4A3525] animate-kawaii-pop'
                    : isWrong
                      ? 'bg-[#FFE4E8] text-[#9E2A3B] shadow-[2px_2px_0px_#4A3525]'
                      : 'bg-[#FFFFFF] hover:bg-[#FFF0F5] hover:-translate-y-[2px] active:translate-y-[1px] shadow-[3px_3px_0px_#4A3525] hover:shadow-[4px_5px_0px_#4A3525] active:shadow-[1px_1px_0px_#4A3525] text-[#4A3525]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-xl border-[2px] border-[#4A3525] font-mono text-sm font-bold flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                      isCorrectPicked
                        ? 'bg-[#58CC88] text-white'
                        : isWrong
                          ? 'bg-[#F05D72] text-white'
                          : 'bg-[#FFD1DC] text-[#4A3525]'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={`font-bold text-sm sm:text-base truncate ${
                      isWrong ? 'line-through decoration-[#F05D72]' : ''
                    }`}
                  >
                    {opt.text}
                  </span>
                </div>

                {/* Clear X mark on wrong answer, sparkling check on correct */}
                {isWrong && (
                  <span
                    aria-label="Đáp án sai"
                    className="w-7 h-7 rounded-full bg-[#F05D72] border-[1.5px] border-[#4A3525] text-white flex items-center justify-center shrink-0"
                  >
                    <X className="w-4 h-4 stroke-[2.8]" aria-hidden="true" />
                  </span>
                )}

                {isCorrectPicked && (
                  <span
                    aria-label="Đáp án đúng"
                    className="w-7 h-7 rounded-full bg-[#58CC88] border-[1.5px] border-[#4A3525] text-white flex items-center justify-center shrink-0"
                  >
                    <Check className="w-4 h-4 stroke-[2.8]" aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Feedback */}
        <div className="min-h-6 flex items-center justify-center">
          {isSolved ? (
            <p className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2D7A4D] animate-kawaii-pop">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Chính xác rồi! Đang mở cánh cửa kỉ niệm...</span>
            </p>
          ) : hasAnyWrong ? (
            <p
              role="alert"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C93B51]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Ủa sai mất rồi, chọn lại đáp án khác nhé!</span>
            </p>
          ) : (
            <p className="text-xs font-semibold text-[#8A6A52]">
              Chọn đúng đáp án để mở khoá cánh cửa dễ thương phía trước.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};
