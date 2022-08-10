import type { ChatUserstate } from "tmi.js";
import { createSignal } from "solid-js";
import { mockMessage } from "./mock";

export interface EmoteOptions {
  format?: "static" | "animated" | "default";
  themeMode: "light" | "dark";
  scale: "1.0" | "2.0" | "3.0";
}

/**
 * Return the image element for the provided emote id and options
 *
 * @param id Emote ID
 * @param options  Emote Options
 * @returns Emote image HTML
 */
const idToImage = (id: string, options?: EmoteOptions) => {
  return `<img src ='https://static-cdn.jtvnw.net/emoticons/v2/${id}/${
    options?.format || "default"
  }/${options?.themeMode || "light"}/${
    options?.scale || "1.0"
  }' class='twitch-emote'/>`;
};

function sanitizeString(str: string) {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim();
}

/**
 *
 * Converts tmi message + emotes into HTML with emojis embedded
 *
 * @param message Message to parse
 * @param user tmi chat user state
 * @returns
 */
function getMessageHTML(message: string, user: ChatUserstate) {
  const { emotes } = user;
  if (!emotes) return message;

  // iterate of emotes to access ids and positions
  const stringReplacements = Object.entries(emotes).map(([id, positions]) => {
    // use only the first position to find out the emote key word
    const position = positions[0];
    const [start, end] = position.split("-");
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    return {
      stringToReplace: stringToReplace,
      replacement: idToImage(id),
    };
  });

  // Sanitize ahead of time
  let clean = sanitizeString(message);

  // generate HTML and replace all emote keywords with image elements
  const messageHTML = stringReplacements.reduce(
    (acc, { stringToReplace, replacement }) => {
      // obs browser doesn't seam to know about replaceAll
      return acc.split(stringToReplace).join(replacement);
    },
    clean
  );

  return messageHTML;
}

export type TwitchChatMessage = {
  user: ChatUserstate;
  body: string;
  html: string;
};

const [signal, setSignal] = createSignal<TwitchChatMessage[]>([
  // { ...mockMessage, html: getMessageHTML(mockMessage.body, mockMessage.user) },
]);

/**
 * Signal of all chat messages
 */
export const chatMessagesSignal = signal;

/**
 * Actually start chat
 */
export const startChat = async (channel: string) => {
  const tmi = await import("tmi.js");
  const client = new tmi.Client({
    channels: [`#${channel}`],
  });

  client.connect();

  client.on("message", (channel, userstate, message) => {
    setSignal((prev) => [
      ...prev.slice(-100),
      {
        user: userstate,
        body: message,
        html: getMessageHTML(message, userstate),
      },
    ]);
  });

  return client;
};
