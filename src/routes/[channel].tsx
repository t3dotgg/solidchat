import tmi from "tmi.js";
import { createSignal, For, onMount } from "solid-js";
import { useParams } from "solid-start";

type Message = {
  user: tmi.ChatUserstate;
  body: string;
};

const [signal, setSignal] = createSignal<Message[]>([]);

const startChat = (channel: string) => {
  if (typeof window !== undefined) {
    const client = new tmi.Client({
      channels: [`#${channel}`],
    });

    client.connect();

    client.on("message", (channel, userstate, message) =>
      setSignal((prev) => [...prev, { user: userstate, body: message }])
    );
  }
};

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
      {message.body}
    </div>
  );
};
