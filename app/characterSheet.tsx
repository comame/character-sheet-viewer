import { useRef } from "react";
import { Button } from "./button";
import { parseCommands, character } from "./character";
import { DragIndicatorSVG } from "./icons";

export function CharacterSheet({
  character,
  index,
  isDroppableRight = false,
  isDroppableLeft = false,
  onDragStart,
  onRemove,
}: {
  character: character;
  index: number;
  /** 右側にドロップ可能かどうか (常に利用可能) */
  isDroppableRight?: boolean;
  /** 左側にドロップ可能かどうか (1番目の項目のみ利用可能。他はisDroppableRightを利用せよ) */
  isDroppableLeft?: boolean;
  onRemove: () => void;
  onDragStart: (index: number) => void;
}) {
  const data = character.data;
  const skills = parseCommands(data.commands);

  const dragImageRef = useRef<HTMLDivElement>(null);
  const onDragStartSelf = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setDragImage(dragImageRef.current!, 0, 0);
    onDragStart(index);
  };

  return (
    <div className="CharacterSheet">
      <div className="drag" draggable onDragStart={onDragStartSelf}>
        <DragIndicatorSVG />
      </div>
      {isDroppableRight && (
        <div className="drop-indicator drop-indicator-right" />
      )}
      {isDroppableLeft && (
        <div className="drop-indicator drop-indicator-left" />
      )}

      <div className="name" ref={dragImageRef}>
        <img src={data.iconUrl}></img>
        <h2>{data.name}</h2>
      </div>

      {/* TODO: ここになんかメモできたらいいよね */}
      {/* TODO: キャラシにジャンプするボタン */}

      <div className="parameters">
        {data.params.map((p) => (
          <div key={p.label} className="row parameter">
            <span className="label typography-weak">{p.label}</span>
            <span className="value">{p.value}</span>
          </div>
        ))}
        {data.status.map((s) => (
          <div key={s.label} className="row status">
            <span className="label typography-weak">{s.label}</span>
            <span className="value">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="skills">
        {skills.map((s) => (
          <div key={s.label} className="skill row">
            <span className="label typography-weak">{s.label}</span>
            <span className="value">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="actions">
        <Button kind="Default" onClick={onRemove} small>
          削除
        </Button>
      </div>
    </div>
  );
}
