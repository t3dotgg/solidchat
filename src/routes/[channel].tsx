import { For, onMount } from "solid-js";
import { useParams } from "solid-start";
import {
  chatMessagesSignal,
  startChat,
  TwitchChatMessage,
} from "~/features/chat/utils";

export default function Chat() {
  const params = useParams();
  console.log("params?", params);
  onMount(() => startChat(params.channel));
  return (
    <div class="h-screen overflow-y-scroll">
      <div class="flex flex-col w-96 bg-gray-200 text-lg p-4">
        <For each={chatMessagesSignal()} fallback={<div />}>
          {(item) => <Message message={item} />}
        </For>
      </div>
    </div>
  );
}

const Message = ({ message }: { message: TwitchChatMessage }) => {
  onMount(() => document.getElementById(message.user.id)?.scrollIntoView());
  return (
    <div class="animate-fade-in" id={message.user.id}>
      <span
        class="font-bold"
        style={{ color: message.user.color ?? "#000000" }}
      >
        {message.user["display-name"]}:{" "}
      </span>
      <span innerHTML={message.html} />
    </div>
  );
};
