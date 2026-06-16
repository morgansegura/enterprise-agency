import { IconComponent } from "./registry";
import { IconBullseye } from "./bullseye";
import { IconBicycle } from "./bicycle";
import { IconWhistle } from "./whistle";
import { IconWeights } from "./weights";
import { IconWaterBottle } from "./water-bottle";
import { IconCalendar } from "./calendar";
import { IconCleats } from "./cleats";
import { IconDumbBells } from "./dumbells";
import { IconDumbBells2 } from "./dumbells2";
import { IconFirstAid } from "./first-aid";
import { IconHealthWatch } from "./health-watch";
import { IconHealth } from "./health";
import { IconHeavyBag } from "./heavy-bag";
import { IconHomework } from "./homework";
import { IconLocationMarker } from "./location-marker";
import { IconLockers } from "./lockers";
import { IconLockers2 } from "./lockers2";
import { IconMedal } from "./medal";
import { IconMedal2 } from "./medal2";
import { IconMountainPeak } from "./mountain-peak";
import { IconPhone } from "./phone";
import { IconPodiumAwards } from "./podium-awards";
import { IconPoolLadder } from "./pool-ladder";
import { IconRacingFlags } from "./racing-flags";
import { IconRook } from "./rook";
import { IconScale } from "./scale";
import { IconSoccerBall } from "./soccer-ball";
import { IconSoccerBall2 } from "./soccer-ball2";
import { IconSoccerDesk } from "./soccer-desk";
import { IconSoccerField2 } from "./soccer-field2";
import { IconSoccerField } from "./soccer-field";
import { IconSpeedBag } from "./speed-bag";
import { IconSpeedBike } from "./speed-bike";
import { IconStopWatch } from "./stop-watch";
import { IconStopWatch2 } from "./stop-watch2";
import { IconSunset } from "./sunset";
import { IconSupplements } from "./supplements";
import { IconTarget } from "./target";
import { IconTelevision } from "./television";
import { IconTickets } from "./tickets";
import { IconTorch } from "./torch";
import { IconTreadmill } from "./treadmill";
import { IconTrophy } from "./trophy";
import { IconTrophy2 } from "./trophy2";
import { IconVolleyNet } from "./volley-net";
import { IconVolleyNet2 } from "./volley-net2";
import { IconWatchFilm } from "./watch-film";

export const CUSTOM_ICONS = {
  bicycle: IconBicycle,
  bullseye: IconBullseye,
  calendar: IconCalendar,
  cleats: IconCleats,
  "dumb-bells": IconDumbBells,
  "dumb-bells2": IconDumbBells2,
  "first-aid": IconFirstAid,
  "headlth-watch": IconHealthWatch,
  health: IconHealth,
  "heavy-bag": IconHeavyBag,
  homework: IconHomework,
  "location-marker": IconLocationMarker,
  lockers: IconLockers,
  lockers2: IconLockers2,
  medal: IconMedal,
  medal2: IconMedal2,
  "mountain-peak": IconMountainPeak,
  phone: IconPhone,
  "podium-awards": IconPodiumAwards,
  "pool-ladder": IconPoolLadder,
  "racing-flags": IconRacingFlags,
  rook: IconRook,
  scale: IconScale,
  "soccer-ball": IconSoccerBall,
  "soccer-ball2": IconSoccerBall2,
  "soccer-desk": IconSoccerDesk,
  "soccer-field": IconSoccerField,
  "soccer-field2": IconSoccerField2,
  "speed-bag": IconSpeedBag,
  "speed-bike": IconSpeedBike,
  "stop-watch": IconStopWatch,
  "stop-watch2": IconStopWatch2,
  sunset: IconSunset,
  supplements: IconSupplements,
  target: IconTarget,
  television: IconTelevision,
  tickets: IconTickets,
  torch: IconTorch,
  treadmill: IconTreadmill,
  trophy: IconTrophy,
  trophy2: IconTrophy2,
  "volley-net": IconVolleyNet,
  "volley-net2": IconVolleyNet2,
  "watch-film": IconWatchFilm,
  "water-bottle": IconWaterBottle,
  weights: IconWeights,
  whistle: IconWhistle,
} as const satisfies Record<string, IconComponent>;
