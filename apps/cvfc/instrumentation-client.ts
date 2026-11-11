import { initBotId } from "botid/client/core";

// Vercel BotID: an invisible check that the tryout form is sent by a person.
// The server action on /tryouts asks checkBotId() before saving or emailing.
initBotId({
  protect: [{ path: "/tryouts", method: "POST" }],
});
