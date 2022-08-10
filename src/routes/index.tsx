export default function Chat() {
  return (
    <div class="h-screen overflow-y-scroll">
      <div class="flex flex-col w-96 bg-gray-200 text-lg p-4">
        Chat app - add channel name after the / i.e.{" "}
        <a href="/theo">{`${
          typeof window !== undefined ? window.location.href : ""
        }theo`}</a>
      </div>
    </div>
  );
}
