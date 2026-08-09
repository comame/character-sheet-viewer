type character = {
  kind: "character";
  data: characterData;
};

type characterData = {
  name: string;
  commands: string;
  externalUrl: string;
  iconUrl: string;
  params: parameter[];
  status: status[];
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
  value: number;
};

function isStatus(obj: any): obj is status {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.label === "string" &&
    typeof obj.value === "number" &&
    typeof obj.max === "number"
  );
}

function isParameter(obj: any): obj is parameter {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.label === "string" &&
    typeof obj.value === "string"
  );
}

function isCharacterData(obj: any): obj is characterData {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.name === "string" &&
    typeof obj.commands === "string" &&
    typeof obj.externalUrl === "string" &&
    typeof obj.iconUrl === "string" &&
    Array.isArray(obj.params) &&
    obj.params.every(isParameter) &&
    Array.isArray(obj.status) &&
    obj.status.every(isStatus)
  );
}

function isCharacter(obj: any): obj is character {
  return (
    obj &&
    typeof obj === "object" &&
    obj.kind === "character" &&
    isCharacterData(obj.data)
  );
}

function parseCharacter(json: string): character {
  const parsed = JSON.parse(json.replaceAll("\n", "\\n"));
  if (!isCharacter(parsed)) {
    throw new Error("不正なキャラクターシートデータです");
  }

  return parsed;
}

function parseCommands(commands: string): skill[] {
  const skills: skill[] = [];
  const lines = commands.split("\n");

  for (const line of lines) {
    const match = line.match(/^CCB?<=(\d+).+【(.+)】/);
    if (match === null || match.length < 3) {
      continue;
    }

    skills.push({
      label: match[2],
      value: parseInt(match[1]),
    });
  }

  return skills;
}

export { parseCharacter, character, parseCommands };
