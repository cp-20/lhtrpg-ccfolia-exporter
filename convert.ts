import { fetchLhtrpgData } from "./lhtrpg";

type CharacterClipboardData = {
  kind: "character";
  data: Partial<Character>;
};

type Status = {
  label: string;
  value: number;
  max: number;
};

type Param = {
  label: string;
  value: string;
};

type Character = {
  name: string;
  memo: string;
  initiative: number;
  externalUrl: string;
  status: Status[];
  params: Param[];
  angle: number;
  width: number;
  height: number;
  secret: boolean;
  invisible: boolean;
  hideStatus: boolean;
  color: string;
  commands: string;
  owner: string | null;
};

// 2D+6 -> 2LH+6
const diceToBCDice = (diceStr: string) => {
  const match = diceStr.match(/^(\d+)D\+(\d+)$/i);
  if (match === null) return diceStr;

  return `${match[1]}LH+${match[2]}`;
};

export const convert = async (id: string): Promise<string> => {
  const character = await fetchLhtrpgData(id);

  const equipments = [
    character.hand1 ? `手：${character.hand1.name}` : null,
    character.hand2 ? `手：${character.hand2.name}` : null,
    character.armor ? `防具：${character.armor.name}` : null,
    character.support_item1
      ? `補助装備：${character.support_item1.name}`
      : null,
    character.support_item2
      ? `補助装備：${character.support_item2.name}`
      : null,
    character.support_item3
      ? `補助装備：${character.support_item3.name}`
      : null,
    character.bag ? `鞄：${character.bag.name}` : null,
  ].filter((e) => e !== null).join("\n");

  const items = character.items.filter((item) => item !== null).map((item) =>
    item.name
  ).join("\n");

  const memo = `
${character.name} (Lv.${character.level}) CR${character.character_rank}
${character.race} ー ${character.main_job} / ${character.sub_job}

〇装備アイテム
${equipments}

〇所持アイテム
${items}
`.split("\n").slice(1, -1).join("\n");

  const status: Status[] = [
    { label: "HP", value: character.max_hitpoint, max: character.max_hitpoint },
    { label: "因果力", value: character.effect, max: character.effect },
    { label: "疲労", value: 0, max: 0 },
    { label: "ヘイト", value: 0, max: 0 },
    { label: "物防", value: character.physical_defense, max: 0 },
    { label: "魔防", value: character.magic_defense, max: 0 },
  ];

  const params: Param[] = [
    { label: "攻撃力", value: `${character.physical_attack}` },
    { label: "魔力", value: `${character.magic_attack}` },
    { label: "回復力", value: `${character.heal_power}` },
    { label: "移動力", value: `${character.move}` },
    { label: "STR", value: `${character.str_value}` },
    { label: "STR基本値", value: `${character.str_basic_value}` },
    { label: "DEX", value: `${character.dex_value}` },
    { label: "DEX基本値", value: `${character.dex_basic_value}` },
    { label: "POW", value: `${character.pow_value}` },
    { label: "POW基本値", value: `${character.pow_basic_value}` },
    { label: "INT", value: `${character.int_value}` },
    { label: "INT基本値", value: `${character.int_basic_value}` },
  ];

  const commands = `
${diceToBCDice(character.abl_motion)} 〈運動〉
${diceToBCDice(character.abl_durability)} 〈耐久〉
${diceToBCDice(character.abl_dismantle)} 〈解除〉
${diceToBCDice(character.abl_operate)} 〈操作〉
${diceToBCDice(character.abl_sense)} 〈知覚〉
${diceToBCDice(character.abl_negotiate)} 〈交渉〉
${diceToBCDice(character.abl_knowledge)} 〈知識〉
${diceToBCDice(character.abl_analyze)} 〈解析〉
${diceToBCDice(character.abl_avoid)} 〈回避〉
${diceToBCDice(character.abl_resist)} 〈抵抗〉
${diceToBCDice(character.abl_hit)} 〈命中〉
`.split("\n").slice(1, -1).join("\n");

  const exportData: CharacterClipboardData = {
    kind: "character",
    data: {
      name: character.name,
      memo,
      initiative: character.action + 0.1,
      width: 4,
      height: 4,
      externalUrl: character.sheet_url,
      status,
      params,
      commands,
    },
  };

  return JSON.stringify(exportData);
};
