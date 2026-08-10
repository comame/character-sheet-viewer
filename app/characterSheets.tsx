import { useEffect, useRef, useState } from "react";
import { CharacterSheet, CharacterSheetErrorBoundary } from "./characterSheet";
import { character } from "./character";

export function CharacterSheets({
  characters,
  setCharacters,
}: {
  characters: character[];
  setCharacters: (characters: character[]) => void;
}) {
  const [isLeftDroppable, setIsLeftDroppable] = useState(false);
  const [rightDroppableIndex, setRightDroppableIndex] = useState(-1);
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);

  const selfRef = useRef<HTMLDivElement>(null);

  const onDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDragging) {
      // 想定外のもの (リンクとか) がドラッグされてきた場合は無視する
      return;
    }
    e.preventDefault();

    const em = () => {
      const style = getComputedStyle(document.documentElement);
      return parseFloat(style.fontSize);
    };

    const rect = selfRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left + selfRef.current!.scrollLeft;

    const gap = em();
    const sheetWidth = 280;

    if (x <= gap + sheetWidth / 2) {
      setIsLeftDroppable(true);
      setRightDroppableIndex(-1);
    } else {
      const n = Math.floor((x - gap - sheetWidth / 2) / (sheetWidth + gap));
      setIsLeftDroppable(false);
      setRightDroppableIndex(n);
    }
  };

  const onDrop = () => {
    const dragging = characters[draggingIndex];

    let updated = [...characters];
    if (isLeftDroppable) {
      updated.splice(draggingIndex, 1); // 元の要素を消して
      updated.unshift(dragging); // 先頭に追加
      setCharacters(updated);
    } else {
      updated.splice(rightDroppableIndex + 1, 0, dragging); // 先に追加して
      if (draggingIndex > rightDroppableIndex) {
        // 右から左
        updated.splice(draggingIndex + 1, 1); // 元の要素を消す
      } else {
        // 左から右
        updated.splice(draggingIndex, 1); // 元の要素を消す
      }
      setCharacters(updated);
    }

    setIsDragging(false);
    setIsLeftDroppable(false);
    setRightDroppableIndex(-1);
    setDraggingIndex(-1);
  };

  useEffect(() => {
    const onDocumentDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).classList.contains("drag")) {
        setIsDragging(true);
      }
    };

    document.addEventListener("dragstart", onDocumentDragStart);
    return () => {
      document.removeEventListener("dragstart", onDocumentDragStart);
    };
  }, []);

  const removeSheet = (index: number) => {
    if (!confirm("本当に削除しますか？")) return;
    const updated = [...characters];
    updated.splice(index, 1);
    setCharacters(updated);
  };

  const onMemoChange = (index: number, memo: string) => {
    const updated = [...characters];
    updated[index].data.memo = memo;
    setCharacters(updated);
  };

  return (
    <div
      className="CharacterSheets"
      onDragOver={onDragOver}
      onDrop={onDrop}
      ref={selfRef}
    >
      {characters.map((c, i) => (
        <CharacterSheetErrorBoundary
          key={c.data.name}
          index={i}
          isDroppableLeft={i === 0 && isLeftDroppable}
          isDroppableRight={rightDroppableIndex === i}
          onRemove={() => removeSheet(i)}
          onDragStart={onDragStart}
          onMemoChange={(memo) => onMemoChange(i, memo)}
        >
          <CharacterSheet
            character={c}
            index={i}
            isDroppableLeft={i === 0 && isLeftDroppable}
            isDroppableRight={rightDroppableIndex === i}
            onRemove={() => removeSheet(i)}
            onDragStart={onDragStart}
            onMemoChange={(memo) => onMemoChange(i, memo)}
          />
        </CharacterSheetErrorBoundary>
      ))}
    </div>
  );
}
