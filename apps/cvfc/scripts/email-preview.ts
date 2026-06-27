import { writeFileSync } from "node:fs";
import {
  parentThankYouEmail,
  coachNotificationEmail,
} from "@/lib/email/templates";

const parent = parentThankYouEmail({
  parentName: "Morgan Segura",
  playerFirstName: "Adrian",
});
const coach = coachNotificationEmail({
  coachName: "Hector Ramirez",
  playerName: "Adrian Segura",
  birthYear: 2010,
  birthMonth: "September",
  gender: "Boys",
  goalkeeper: "—",
  priorLeagueLevel: "MLS NEXT",
  parentName: "Morgan Segura",
  parentEmail: "morgansegura@gmail.com",
  parentPhone: "+1 619 402 0980",
});

writeFileSync("/tmp/cvfc-parent-email.html", parent.html);
writeFileSync("/tmp/cvfc-coach-email.html", coach.html);
console.log("Wrote /tmp/cvfc-parent-email.html and /tmp/cvfc-coach-email.html");
