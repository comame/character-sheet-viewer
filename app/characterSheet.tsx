import {
  Component,
  ComponentProps,
  ErrorInfo,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { Button } from "./button";
import { parseCommands, character } from "./character";
import { DragIndicatorSVG, OpenInNewSVG } from "./icons";

export function CharacterSheet({
  character,
  index,
  isDroppableRight = false,
  isDroppableLeft = false,
  onDragStart,
  onRemove,
  onMemoChange,
}: {
  character: character;
  index: number;
  /** 右側にドロップ可能かどうか (常に利用可能) */
  isDroppableRight?: boolean;
  /** 左側にドロップ可能かどうか (1番目の項目のみ利用可能。他はisDroppableRightを利用せよ) */
  isDroppableLeft?: boolean;
  onRemove: () => void;
  onDragStart: (index: number) => void;
  onMemoChange: (memo: string) => void;
}) {
  if (character.hasError) {
    character = {
      kind: "character",
      data: {
        name: "！読み込みエラー！",
        commands: "",
        externalUrl: "",
        memo: `名前: ${character.data?.name}`,
        params: [],
        status: [],
      },
      hasError: true,
    };
  }

  const data = character.data;
  const skills = parseCommands(character);

  const dragImageRef = useRef<HTMLDivElement>(null);
  const onDragStartSelf = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setDragImage(dragImageRef.current!, 0, 0);
    onDragStart(index);
  };

  return (
    <div className="CharacterSheet">
      <div className="right-top">
        <div className="drag" draggable onDragStart={onDragStartSelf}>
          <DragIndicatorSVG />
        </div>
      </div>
      {isDroppableRight && (
        <div className="drop-indicator drop-indicator-right" />
      )}
      {isDroppableLeft && (
        <div className="drop-indicator drop-indicator-left" />
      )}

      <div className="name" ref={dragImageRef}>
        <a href={data.externalUrl} target="_blank" rel="noopener noreferrer">
          <img src={data.iconUrl === "" ? undefined : data.iconUrl}></img>
        </a>
        <a href={data.externalUrl} target="_blank" rel="noopener noreferrer">
          <h2>{data.name}</h2>
        </a>
      </div>

      <textarea
        className="memo typography-weak"
        defaultValue={data.memo}
        onChange={(e) => onMemoChange(e.currentTarget.value)}
      />

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

export class CharacterSheetErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean; raised: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, raised: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError();
    this.setState({ raised: true });
  }

  render(): ReactNode {
    if (this.state.hasError && !this.state.raised) {
      console.log("error render");
      return <div>ERROR</div>;
    }

    return this.props.children;
  }
}
