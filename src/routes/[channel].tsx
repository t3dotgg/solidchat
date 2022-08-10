import type { ChatUserstate } from "tmi.js";
import { createSignal, For, onMount } from "solid-js";
import { useParams } from "solid-start";

type Message = {
  user: ChatUserstate;
  body: string;
};

const [signal, setSignal] = createSignal<Message[]>([]);

const startChat = async (channel: string) => {
  const tmi = await import("tmi.js");
  if (typeof window !== undefined) {
    const client = new tmi.Client({
      channels: [`#${channel}`],
    });

    client.connect();

    client.on("message", (channel, userstate, message) => {
      console.log("state", userstate);
      setSignal((prev) => [...prev, { user: userstate, body: message }]);
    });
  }
};

function getMessageHTML(message: string, user: ChatUserstate) {
  const { emotes } = user;
  if (!emotes) return message;

  // store all emote keywords
  // ! you have to first scan through
  // the message string and replace later
  const stringReplacements = [];

  // iterate of emotes to access ids and positions
  Object.entries(emotes).forEach(([id, positions]) => {
    // use only the first position to find out the emote key word
    const position = positions[0];
    const [start, end] = position.split("-");
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    stringReplacements.push({
      stringToReplace: stringToReplace,
      replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0" style="height: 1.2rem; display: inline;" />`,
    });
  });

  // generate HTML and replace all emote keywords with image elements
  const messageHTML = stringReplacements.reduce(
    (acc, { stringToReplace, replacement }) => {
      // obs browser doesn't seam to know about replaceAll
      return acc.split(stringToReplace).join(replacement);
    },
    message
  );

  return messageHTML;
}

export default function Chat() {
  const params = useParams();
  console.log("params?", params);
  onMount(() => startChat(params.channel));
  return (
    <div class="h-screen overflow-y-scroll">
      <div class="flex flex-col w-96 bg-gray-200 text-lg p-4">
        <For each={signal()} fallback={<div />}>
          {(item) => <Message message={item} />}
        </For>
      </div>
    </div>
  );
}

const Message = ({ message }: { message: Message }) => {
  onMount(() => document.getElementById(message.user.id)?.scrollIntoView());
  return (
    <div class="animate-fade-in" id={message.user.id}>
      <span
        class="font-bold"
        style={{ color: message.user.color ?? "#000000" }}
      >
        {message.user["display-name"]}:{" "}
      </span>
      <span innerHTML={getMessageHTML(message.body, message.user)} />
    </div>
  );
};
