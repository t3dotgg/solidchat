import tmi from "tmi.js";
import { createSignal, For, onMount } from "solid-js";

const client = new tmi.Client({
  channels: ["#xqc"],
});

client.connect();

type Message = {
  user: tmi.ChatUserstate;
  body: string;
};

const [signal, setSignal] = createSignal<Message[]>([]);

client.on("message", (channel, userstate, message) =>
  setSignal((prev) => [...prev, { user: userstate, body: message }])
);

export default function Chat() {
  return (
    <div class="h-screen overflow-y-scroll">
      <div class="flex flex-col w-96 bg-gray-200">
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
    <div id={message.user.id}>
      <span
        class="font-bold"
        style={{ color: message.user.color ?? "#000000" }}
      >
        {message.user["display-name"]}:{" "}
      </span>
      {message.body}
    </div>
  );
};
