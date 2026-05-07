import type { CSSProperties } from "react";
import bgImage from "@/assets/akrecruit/bg.webp";
import headhuntingContractIconImage from "@/assets/akrecruit/headhuntingContractIcon.webp";
import newTagImage from "@/assets/akrecruit/NewTag.webp";
import seniorVoucherIconImage from "@/assets/akrecruit/seniorVoucherIcon.webp";
import starImage from "@/assets/akrecruit/star.svg";
import aegirImage from "@/assets/akrecruit/AEGIR.webp";
import abyssalHuntersImage from "@/assets/akrecruit/Abyssal_Hunters.webp";
import babelImage from "@/assets/akrecruit/Babel_re.webp";
import bolivarImage from "@/assets/akrecruit/BOLIVAR.webp";
import blackSteelImage from "@/assets/akrecruit/Black_Steel.webp";
import columbiaImage from "@/assets/akrecruit/Columbian_Union.webp";
import followersImage from "@/assets/akrecruit/Followers.webp";
import glasgowImage from "@/assets/akrecruit/GLASGOW.webp";
import leithaniaImage from "@/assets/akrecruit/Leithania.webp";
import higashiImage from "@/assets/akrecruit/Higashi.webp";
import iberiaImage from "@/assets/akrecruit/IBERIA.webp";
import kazdelImage from "@/assets/akrecruit/KAZDEL.webp";
import kazimierzImage from "@/assets/akrecruit/Kazimierz.webp";
import kjeragImage from "@/assets/akrecruit/Kjerag.webp";
import lateranoImage from "@/assets/akrecruit/Laterano.webp";
import lungmenImage from "@/assets/akrecruit/lungmen.webp";
import minosImage from "@/assets/akrecruit/MINOS.webp";
import penguinLogisticsImage from "@/assets/akrecruit/Penguin_Logistics.webp";
import rimBillitonImage from "@/assets/akrecruit/RIM_Billiton.webp";
import reunionMovementImage from "@/assets/akrecruit/Reunion_Movement.webp";
import rhineImage from "@/assets/akrecruit/Rhine_Lab.webp";
import rhodesIslandImage from "@/assets/akrecruit/Rhodes_Island.webp";
import samiImage from "@/assets/akrecruit/Sami.webp";
import sargonImage from "@/assets/akrecruit/Sargon.webp";
import siracusaImage from "@/assets/akrecruit/Siracusa.webp";
import suiImage from "@/assets/akrecruit/Sui.webp";
import ursusStudentSelfGovernmentGroupImage from "@/assets/akrecruit/URSUS_student_self-government_group.webp";
import ursusImage from "@/assets/akrecruit/Ursus.webp";
import victoriaImage from "@/assets/akrecruit/Victoria.webp";
import casterImage from "@/assets/akrecruit/Caster.webp";
import defenderImage from "@/assets/akrecruit/Defender.webp";
import guardImage from "@/assets/akrecruit/guard.webp";
import medicImage from "@/assets/akrecruit/Medic.webp";
import raytheanImage from "@/assets/akrecruit/raythean.webp";
import sniperImage from "@/assets/akrecruit/Sniper.webp";
import specialistImage from "@/assets/akrecruit/Specialist.webp";
import supporterImage from "@/assets/akrecruit/Supporter.webp";
import vanguardImage from "@/assets/akrecruit/Vanguard.webp";
import yenImage from "@/assets/akrecruit/Yen.webp";

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_ORGANIZATION_LOGO_FILE_SIZE_MB = 5;
export const MAX_ORGANIZATION_LOGO_FILE_SIZE =
  MAX_ORGANIZATION_LOGO_FILE_SIZE_MB * 1024 * 1024;

export const akRecruitTemplateSpec = {
  nameFontSize: 120,
  nameFontWeight: 900,
  nameLineHeight: 1,
  exportNameOffsetY: 12,
  enNameFontSize: 48,
  enNameLineHeight: 1,
  enNameUppercase: true,
  exportEnNameOffsetY: 12,
  introFontSize: 36,
  introTextAlign: "left" as const,
  textStrokeWidth: 3,
  textStrokeColor: "rgba(0, 0, 0, 0.9)",
  textColor: "#ffffff",
  organizationLeft: 342,
  organizationTop: 190,
  organizationWidth: 500,
  starSize: 152,
  starOverlap: 35,
  starLeftPadding: 52,
  infoTop: 586,
  infoGap: -24,
  professionWidth: 260,
  professionGap: 4,
  professionTopOffset: 10,
  newTagWidth: 150,
  newTagLeft: 663,
  newTagTop: 840,
  rightBadgeTop: 470,
  rightBadgeRight: 0,
  rightBadgeWidth: 338,
  rightBadgeHeight: 189,
  enNameTopOffset: 120,
  introWidth: 1280,
  introLineHeight: 48,
  introBottom: 36,
  gradientTop: CANVAS_HEIGHT * 0.74,
  gradientHeight: CANVAS_HEIGHT * 0.26,
  gradientStartY: CANVAS_HEIGHT * 0.95,
  gradientEndY: CANVAS_HEIGHT * 0.78,
} as const;

export const organizationOptionGroups = [
  {
    label: "团体 / 组织 / 公司",
    options: [
      { label: "罗德岛", value: "rhodes_island" },
      { label: "整合运动", value: "reunion_movement" },
      { label: "企鹅物流", value: "penguin_logistics" },
      { label: "莱茵生命", value: "rhine" },
      { label: "黑钢国际", value: "black_steel" },
      { label: "格拉斯哥帮", value: "glasgow" },
      { label: "使徒", value: "followers" },
      { label: "深海猎人", value: "abyssal_hunters" },
      { label: "巴别塔", value: "babel" },
      { label: "乌萨斯学生自治团", value: "ursus_student_self_government_group" },
      { label: "雷神工业", value: "raythean" },
      { label: "岁", value: "sui" },
    ],
  },
  {
    label: "国家",
    options: [
      { label: "维多利亚", value: "victoria" },
      { label: "乌萨斯", value: "ursus" },
      { label: "谢拉格", value: "kjerag" },
      { label: "卡西米尔", value: "kazimierz" },
      { label: "拉特兰", value: "laterano" },
      { label: "炎国", value: "yen" },
      { label: "东国", value: "higashi" },
      { label: "哥伦比亚", value: "columbia" },
      { label: "玻利瓦尔", value: "bolivar" },
      { label: "雷姆必拓", value: "rim_billiton" },
      { label: "莱塔尼亚", value: "leithania" },
      { label: "卡兹戴尔", value: "kazdel" },
      { label: "萨尔贡", value: "sargon" },
      { label: "萨米", value: "sami" },
      { label: "叙拉古", value: "siracusa" },
      { label: "米诺斯", value: "minos" },
      { label: "伊比利亚", value: "iberia" },
      { label: "阿戈尔", value: "aegir" },
    ],
  },
  {
    label: "城市 / 城邦",
    options: [{ label: "龙门", value: "lungmen" }],
  },
] as const;

export const professionOptions = [
  { label: "先锋", value: "vanguard" },
  { label: "近卫", value: "guard" },
  { label: "重装", value: "defender" },
  { label: "狙击", value: "sniper" },
  { label: "术师", value: "caster" },
  { label: "医疗", value: "medic" },
  { label: "辅助", value: "supporter" },
  { label: "特种", value: "specialist" },
] as const;

export type OrganizationValue =
  (typeof organizationOptionGroups)[number]["options"][number]["value"];
export type ProfessionValue = (typeof professionOptions)[number]["value"];

export type RecruitFormState = {
  imageFile: File | null;
  imageUrl: string | null;
  imageScale: number;
  imageOffsetX: number;
  imageOffsetY: number;
  customOrganizationLogoFile: File | null;
  customOrganizationLogoUrl: string | null;
  organization: OrganizationValue;
  profession: ProfessionValue | "";
  isNewOperator: boolean;
  showSeniorVoucher: boolean;
  showHeadhuntingContract: boolean;
  rarity: number;
  name: string;
  enName: string;
  intro: string;
};

export type ImageSize = {
  width: number;
  height: number;
};

export const organizationAssetMap: Record<OrganizationValue, string> = {
  aegir: aegirImage,
  bolivar: bolivarImage,
  babel: babelImage,
  columbia: columbiaImage,
  followers: followersImage,
  glasgow: glasgowImage,
  iberia: iberiaImage,
  kazdel: kazdelImage,
  kazimierz: kazimierzImage,
  kjerag: kjeragImage,
  laterano: lateranoImage,
  rhodes_island: rhodesIslandImage,
  rhine: rhineImage,
  lungmen: lungmenImage,
  minos: minosImage,
  reunion_movement: reunionMovementImage,
  rim_billiton: rimBillitonImage,
  raythean: raytheanImage,
  abyssal_hunters: abyssalHuntersImage,
  penguin_logistics: penguinLogisticsImage,
  black_steel: blackSteelImage,
  leithania: leithaniaImage,
  higashi: higashiImage,
  sami: samiImage,
  sargon: sargonImage,
  siracusa: siracusaImage,
  sui: suiImage,
  ursus: ursusImage,
  ursus_student_self_government_group: ursusStudentSelfGovernmentGroupImage,
  victoria: victoriaImage,
  yen: yenImage,
};

export function getRecruitOrganizationLogoSrc(form: RecruitFormState) {
  return form.customOrganizationLogoUrl || organizationAssetMap[form.organization];
}

export const professionAssetMap: Record<ProfessionValue, string> = {
  vanguard: vanguardImage,
  guard: guardImage,
  defender: defenderImage,
  sniper: sniperImage,
  caster: casterImage,
  medic: medicImage,
  supporter: supporterImage,
  specialist: specialistImage,
};

export const initialFormState: RecruitFormState = {
  imageFile: null,
  imageUrl: null,
  imageScale: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  customOrganizationLogoFile: null,
  customOrganizationLogoUrl: null,
  organization: "rhodes_island",
  profession: "vanguard",
  isNewOperator: true,
  showSeniorVoucher: true,
  showHeadhuntingContract: true,
  rarity: 6,
  name: "中文名称",
  enName: "English Name",
  intro: "博士，好久不见。我知道罗德岛当前状况不容乐观，我会回来提供一份助力。也以防你忘记，我依然是罗德岛的一员。",
};

export const posterNameStyle: CSSProperties = {
  fontFamily: '"Source Han Serif CN", serif',
  WebkitTextStroke: `${akRecruitTemplateSpec.textStrokeWidth}px ${akRecruitTemplateSpec.textStrokeColor}`,
  paintOrder: "stroke fill",
};

export const posterEnNameStyle: CSSProperties = {
  fontFamily: '"Novecento Wide", sans-serif',
  WebkitTextStroke: `${akRecruitTemplateSpec.textStrokeWidth}px ${akRecruitTemplateSpec.textStrokeColor}`,
  paintOrder: "stroke fill",
};

export const posterIntroStyle: CSSProperties = {
  fontFamily: '"Source Han Sans SC", "Microsoft YaHei", sans-serif',
};

export const akRecruitAssets = {
  bgImage,
  headhuntingContractIconImage,
  newTagImage,
  seniorVoucherIconImage,
  starImage,
};
