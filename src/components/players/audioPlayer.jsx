import { useEffect, useRef, useState } from "react";
import { PlayerButton } from "../individuals/playerButton";

export function AudioPlayer({ src }) {
    const audioRef = useRef();
    const seekerRef = useRef();
    const volumeRef = useRef();
    const controlsRef = useRef();
    const intervalRef = useRef();

    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [current, setCurrent] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [source, setSource] = useState(src[0]);
 
    function play() {
        if(audioRef.current.paused) {
            audioRef.current.play();
            setPlaying(true);
            setDuration(audioRef.current.duration);
            intervalRef.current = setInterval(() => {
                updateTime();
            }, 150);
        } else {
            audioRef.current.pause();
            setPlaying(false);
            clearInterval(intervalRef.current);
        };
    };

    function updateTime() {
        seekerRef.current.value = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setCurrent(audioRef.current.currentTime);
    };

    function seek() {
        audioRef.current.currentTime = audioRef.current.duration * (seekerRef.current.value / 100);
        setCurrent(audioRef.current.currentTime);
    };

    function changeAudio() {
        audioRef.current.volume = volumeRef.current.value;
        audioRef.current.muted = false;
        setIsMuted(false);
    };

    function mute() {
        if(isMuted) {
            audioRef.current.muted = false;
            setIsMuted(false);
        } else {
            audioRef.current.muted = true;
            setIsMuted(true);
        };
    };

    function next() {
        clearInterval(intervalRef.current);
        setPlaying(false);

        if((src[1].indexOf(source) + 1) < src[1].length) {
            setSource(src[1][src[1].indexOf(source) + 1]);
            seekerRef.current.value = 0;
            setCurrent(0);
        };
    };

    function prev() {
        clearInterval(intervalRef.current);
        setPlaying(false);

        if((src[1].indexOf(source) - 1) >= 0) {
            setSource(src[1][src[1].indexOf(source) - 1]);
            seekerRef.current.value = 0;
            setCurrent(0);
        };
    };

    useEffect(() => {
        seekerRef.current.value = 0;
        volumeRef.current.value = 0.5;
        return () => clearInterval(intervalRef.current);
    }, []);
    
    return (
        <section className="h-screen w-full flex flex-col items-center justify-center p-8">
            <div className="max-h-[90%] relative flex flex-col items-center justify-center max-w-[80%] w-full">
                <audio ref={audioRef} onEnded={() => {clearInterval(intervalRef.current); setPlaying(false)}} onClick={play} src={".././devTemp/audio/" + source} className="max-h-full"/>
                <div className="flex flex-col w-full border-4 border-red-400 bg-gray-900" ref={controlsRef}>
                    <div className="text-white text-2xl font-bold p-2 max-w-[95%] overflow-x-auto whitespace-nowrap">{source}</div>
                    <input type="range" ref={seekerRef} step={1} min={0} max={100} onChange={seek} id="videoSlider"/>
                    <div className="flex w-full bg-gray-900">
                        <PlayerButton text={<img className="h-[24px]" src="../src/assets/playerAssets/prev.png"/>} onclick={prev}/>
                        <PlayerButton text={<img className="h-[24px]" src={playing ? "../src/assets/playerAssets/pause.png" : "../src/assets/playerAssets/play.png"}/>} onclick={play}/>
                        <PlayerButton text={<img className="h-[24px]" src="../src/assets/playerAssets/next.png"/>} onclick={next}/>
                        <div className="flex items-center justify-center text-white py-1 max-w-24 w-full bg-gray-900 font-bold">
                            <div>{Math.floor(current / 60) + ":" + ("0" + Math.floor(current % 60)).slice(-2)}</div>
                            <div>/{Math.floor(duration / 60) + ":" + ("0" + Math.floor(duration % 60)).slice(-2)}</div>
                        </div>
                        <div className="flex items-center justify-center">
                            <PlayerButton text={<img className="h-[24px]" src={isMuted ? "../src/assets/playerAssets/muted.png" : "../src/assets/playerAssets/volume.png"}/>} onclick={mute}/>
                            <input type="range" ref={volumeRef} step={0.01} min={0} max={1} onChange={changeAudio} id="audioSlider"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};