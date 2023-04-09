import TextToSpeech from "@/components/TextToSpeech";
import ChatBotCanvas from "@/components/ChatBotCanvas";
import IsSpeakingContext from "./context/IsSpeakingContext";

export default function Home() {
  return (
    <main className="h-screen">
      <IsSpeakingContext>
        <TextToSpeech />
        <ChatBotCanvas />
      </IsSpeakingContext>
    </main>
  )
}
