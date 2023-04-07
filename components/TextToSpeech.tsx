"use client";

import {useState, FormEvent} from "react";

export default function TextToSpeech(){
    const [userText, setUserText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const synth = typeof window !== "undefined" ? window.speechSynthesis : null; //se estiver no lado do servidor, n existe window, então synth assume null, se estiver no lado do cliente, aí existe janela, e ele inicializa como window.speechSynthesis
    const voices = synth?.getVoices(); //o ponto de interrogação é pra dizer que é opcional, pois pode acontecer de synth ter recebido null
    
    //Microsoft Daniel - Portuguese (Brazil)
    //Microsoft Mark - English (United States)
    //Microsoft Heami - Korean (Korean) pra depois kkk
    const selectedVoices = voices?.find(voice => voice.name === "Microsoft Daniel - Portuguese (Brazil)");
    
    function speak(textToSpeak: string){
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.voice = selectedVoices!; //incluir o ! aqui significa que eu só aceito essa alinha se o tipo de selectedVoices for mesmo do tipo SpeechSynthesisVoice, e não null (porque poderia vir nulo se fosse pelo lado do servidor)
        utterance.rate = 1; //1 é 100%, menos que isso a fala fica mais lenta, e mais que isso ela fica mais rápida
        synth?.speak(utterance);
        setIsLoading(true); //quando a voz começar a falar, vou indicar que a fala tá em andamento e usar esse state pra bloquear o botão de Ask e não deixar o usuário ficar spammando o botão
        utterance.onend = () => { //um jeito alternativo de chamar uma função, pq se chamar do jeito normal e o objeto utterance for null, vai dar erro
            setIsLoading(false);
        };
    }

    function handleUserText(event:FormEvent<HTMLFormElement>){
        event.preventDefault();

        speak(userText);
    }

    return (
        <div className="relative top-0 z-50">
            <form
                onSubmit={handleUserText}
                className="absolute top-[800px] left-[30px] space-x-2 pt-2"
            >
                <input
                    value={userText}
                    onChange={event => setUserText(event.target.value)}
                    type="text"
                    placeholder="Ask me ANYTHING... for I know EVERYTHING"
                    className="bg-transparent w-[510px] border border-[#b00c3f]/80 outline-none rounded-lg placeholder:text-[#b00c3f] p-2 text-[#b00c3f]"
                />
                <button
                    disabled={isLoading}
                    className="text-[#b00c3f] p-2 border border-[#b00c3f] rounded-lg disabled:text-blue-100 disabled:cursor-not-allowed disabled:bg-gray-500 hover:scale-110 hover:text-black hover:bg-[#b00c3f] duration-300 transition-all"
                >
                    {isLoading ? "Thinking..." : "Ask"}
                </button>
            </form>
        </div>
    );
}