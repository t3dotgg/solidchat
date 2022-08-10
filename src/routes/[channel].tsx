import { For, onMount, onCleanup } from "solid-js";
import { useParams } from "solid-start";
import {
  chatMessagesSignal,
  startChat,
  TwitchChatMessage,
} from "~/features/chat/utils";

import autoAnimate from "@formkit/auto-animate";

export default function Chat() {
  const params = useParams();
  onMount(() => {
    const clientPromise = startChat(params.channel);
    autoAnimate(document.getElementById("chat-list"));

    onCleanup(() => {
      console.log("cleanup?");
      clientPromise.then((client) => {
        client.disconnect();
        client.removeAllListeners();
      });
    });
  });
  return (
    <div class="h-screen overflow-y-scroll">
      <div
        class="flex h-full w-96 flex-col justify-end bg-gray-200 p-4 text-lg"
        id="chat-list"
      >
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
    <div id={message.user.id}>
      <span
        class="font-bold"
        style={{ color: message.user.color ?? "#000000" }}
      >
        {message.user["display-name"]}:{" "}
      </span>
      <span innerHTML={message.html} class="break-words" />
    </div>
  );
};
