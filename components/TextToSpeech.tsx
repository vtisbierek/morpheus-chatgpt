"use client";

import React, {useState, FormEvent, useContext} from "react";
import axios from "axios";
import { AppContext } from "@/app/context/IsSpeakingContext";
import TextareaAutosize from 'react-textarea-autosize';

export default function TextToSpeech(){
    const [userText, setUserText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {isSpeaking, setIsSpeaking} = useContext(AppContext);
    const [answer, setAnswer] = useState("");

    const synth = typeof window !== "undefined" ? window.speechSynthesis : null; //se estiver no lado do servidor, n existe window, então synth assume null, se estiver no lado do cliente, aí existe janela, e ele inicializa como window.speechSynthesis
    const voices = synth?.getVoices(); //o ponto de interrogação é pra dizer que é opcional, pois pode acontecer de synth ter recebido null
    
    //Microsoft Maria - Portuguese (Brazil)
    //Microsoft Daniel - Portuguese (Brazil)
    //Microsoft Mark - English (United States)
    //Microsoft Heami - Korean (Korean) pra depois kkk
    const selectedVoices = voices?.find(voice => voice.name === "Microsoft Daniel - Portuguese (Brazil)");
    
    function speak(textToSpeak: string){
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.voice = selectedVoices!; //incluir o ! aqui significa que eu só aceito essa alinha se o tipo de selectedVoices for mesmo do tipo SpeechSynthesisVoice, e não null (porque poderia vir nulo se fosse pelo lado do servidor)
        utterance.rate = 1.4; //1 é 100%, menos que isso a fala fica mais lenta, e mais que isso ela fica mais rápida
        synth?.speak(utterance);
        setIsSpeaking(true); //quando a voz começar a falar, vou indicar que a fala tá em andamento e usar esse state pra bloquear o botão de Ask e não deixar o usuário ficar spammando o botão
        utterance.onend = () => { //um jeito alternativo de chamar uma função, pq se chamar do jeito normal e o objeto utterance for null, vai dar erro
            setIsSpeaking(false);
        };
    }

    async function handleUserText(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        setIsLoading(true); //durante essa comunicação com a API, quero desabilitar o botão pro usuário não poder spammar e gerar um monte de requisições simultâneas
        try {
            const response = await axios.post("http://localhost:3000/api/openai", {
                userText: userText
            });
            const {message} = response.data;
            const fullAnswer = "P: " + userText + "\n\n" + "R: " + message;
            setAnswer(fullAnswer);
            console.log(message);
            speak(message);
        } catch (error) {
            if(error instanceof Error){ //se o error que for recebido no catch for realmente uma instância do objeto de erro padrão Error, aí sim o typescript me deixa passar a propriedade error.message pra minha variável, se eu tentar passar ela direto sem verificar nesse if antes, o typescript não vai deixar passar pq ele n tem certeza se o error recebido no catch é mesmo um objeto Error, e se não fosse a propriedade error.message não existiria
                console.log(error.message);
            }
        } finally{
            setIsLoading(false); //ao final do processo, não importa se falhou ou se deu certo, volto a habilitar o botão para o usuário continuar usando
            setUserText(""); //reset no campo de entrada do usuário
        }
    }

    return (
        <div className="relative top-0 z-50 flex flex-col">
            <form
                onSubmit={handleUserText}
                className="absolute top-[800px] left-[30px] space-x-2 pt-2"
            >
                <input
                    value={userText}
                    onChange={event => setUserText(event.target.value)}
                    type="text"
                    placeholder="Pergunte-me o que quiser, pois eu sei tudo!"
                    className="bg-transparent w-[510px] border border-[#b00c3f]/80 outline-none rounded-lg placeholder:text-[#b00c3f] p-2 text-[#b00c3f]"
                />
                <button
                    disabled={isLoading}
                    className="text-[#b00c3f] p-2 border border-[#b00c3f] rounded-lg disabled:text-blue-100 disabled:cursor-not-allowed disabled:bg-gray-500 hover:scale-110 hover:text-black hover:bg-[#b00c3f] duration-300 transition-all"
                >
                    {isLoading ? "Pensando..." : "Perguntar"}
                </button>
            </form>
            <TextareaAutosize
                value={answer}
                minRows={1}
                disabled
                className={"absolute top-[800px] right-[30px] space-x-2 pt-2 bg-transparent w-[510px] border border-[#b00c3f]/80 outline-none rounded-lg resize-none p-2 text-[#b00c3f]"}
            />
        </div>
    );
}