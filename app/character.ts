type character = {
  kind: "character";
  data: characterData;
};

type characterData = {
  name: string;
  commands: string;
  externalUrl: string;
  iconUrl?: string;
  params: parameter[];
  status: status[];
  memo?: string;
};

type parameter = {
  label: string;
  /** numeric-string */
  value: string;
};

type status = {
  label: string;
  value: number;
  max: number;
};

type skill = {
  label: string;
  value: string;
};

function isCharacter(obj: any): obj is character {
  return obj && typeof obj === "object" && obj.kind === "character";
}

function parseCharacter(json: string): character {
  const parsed = JSON.parse(json.replaceAll("\n", "\\n"));
  if (!isCharacter(parsed)) {
    throw new Error("不正なキャラクターシートデータです");
  }

  return parsed;
}

type skillParser = (command: string, character: character) => skill | null;

const skillParsers: Record<string, skillParser> = {
  coc: (command, character) => {
    const match = command.match(/^CCB?<=(\d+).+【(.+)】/);
    if (!match) {
      return null;
    }
    return {
      label: match[2],
      value: match[1],
    };
  },
  emoklore: (command, character) => {
    const match = command.match(/^(\dDM<=\d) 〈(.+)〉/);
    if (!match) {
      return null;
    }
    return {
      label: match[2],
      value: match[1],
    };
  },
  gaiacare_da: (command, character) => {
    const match = command.match(/^(\d)DA{(.+)} 〈(.+)〉/);
    if (!match) {
      console.log(command);
      return null;
    }

    console.log(match);

    // xDAy を xDM<=(x+y) に変換
    const parameter = Number.parseInt(
      character.data.params.find((p) => p.label === match[2])?.value ?? "0",
    );
    const dice = Number.parseInt(match[1]);
    const value = `${dice}DM<=${dice + parameter}`;

    return {
      label: match[3],
      value: value,
    };
  },
  gaiacare_dm: (command, character) => {
    const match = command.match(/^(\d)DM<={(.+)} 〈(.+)〉/);
    if (!match) {
      return null;
    }

    const parameter = Number.parseInt(
      character.data.params.find((p) => p.label === match[2])?.value ?? "0",
    );
    const dice = Number.parseInt(match[1]);
    const value = `${dice}DM<=${parameter}`;

    return {
      label: match[3],
      value: value,
    };
  },
};

function parseCommands(character: character): skill[] {
  const skills: skill[] = [];
  const lines = character.data.commands.split("\n");

  for (const line of lines) {
    let result: skill | null = null;
    for (const parser of Object.values(skillParsers)) {
      result = parser(line, character);
      if (result !== null) {
        break;
      }
    }

    if (result === null) {
      continue;
    }

    skills.push({
      label: result.label,
      value: result.value,
    });
  }

  return skills;
}

export { parseCharacter, character, parseCommands };
