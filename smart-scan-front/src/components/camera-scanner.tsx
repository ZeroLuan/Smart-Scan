import { useEffect, useRef, useState } from 'react';

interface CameraScannerProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

// Adicionar tipagem para o window
declare global {
    interface Window {
        cv: any;
    }
}

export const CameraScanner = ({ onCapture, onClose }: CameraScannerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isOpenCvReady, setIsOpenCvReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // 1. EFEITO PARA CARREGAR O OPENCV DINAMICAMENTE
    useEffect(() => {
        // Se já estiver carregado, apenas seta como pronto
        if (window.cv && window.cv.Mat) {
            setIsOpenCvReady(true);
            return;
        }

        // Se a tag script não existe, cria ela
        if (!document.getElementById('opencv-script')) {
            const script = document.createElement('script');
            script.id = 'opencv-script';
            script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
            script.async = true;
            script.type = 'text/javascript';
            document.body.appendChild(script);
        }

        // Polling para verificar quando o OpenCV terminou de inicializar a memória (WASM)
        const interval = setInterval(() => {
            if (window.cv && window.cv.Mat) {
                setIsOpenCvReady(true);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // 2. EFEITO PARA INICIAR A CÂMERA (Só roda quando OpenCV estiver pronto)
    useEffect(() => {
        if (!isOpenCvReady) return;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                }
            } catch (err) {
                setError('Não foi possível acessar a câmera. Verifique se você deu permissão.');
                console.error(err);
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpenCvReady]);

    const captureImage = () => {
        if (!videoRef.current || !window.cv || !isOpenCvReady) return;

        const video = videoRef.current;
        const cv = window.cv;

        // Criar canvas temporário
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        try {
            // Processamento OpenCV
            let src = cv.imread(tempCanvas);

            // Define o quadrado de corte (60% da menor dimensão)
            const size = Math.min(video.videoWidth, video.videoHeight) * 0.6;
            const x = (video.videoWidth - size) / 2;
            const y = (video.videoHeight - size) / 2;

            let rect = new cv.Rect(x, y, size, size);
            let dst = src.roi(rect);

            // Mostra no canvas de referência (invisível) e exporta
            cv.imshow(canvasRef.current, dst);

            canvasRef.current?.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                    onCapture(file);
                }

                // IMPORTANTE: Limpar memória do C++ (OpenCV)
                src.delete();
                dst.delete();
                // Não deletar rect se não for ponteiro, mas no JS wrapper o GC cuida de objetos simples,
                // porém Mat (src, dst) devem ser deletados.
            }, 'image/jpeg', 0.9);

        } catch (e) {
            console.error("Erro no processamento OpenCV:", e);
        }
    };

    if (!isOpenCvReady) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white animate-fade-in">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Carregando módulo de visão...</p>
                    <p className="text-xs text-gray-400 mt-2">Isso acontece apenas na primeira vez</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 w-full z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
                <h3 className="text-white font-medium text-shadow">Posicione o produto no centro</h3>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Viewport */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-gray-900">
                {error ? (
                    <div className="text-white text-center px-4 bg-red-500/20 p-4 rounded-lg">
                        <p className="mb-2 text-2xl">📸🚫</p>
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute w-full h-full object-cover"
                        />

                        {/* Overlay escuro com 'buraco' */}
                        <div className="absolute inset-0 border-[50vh] border-black/60 box-content pointer-events-none flex items-center justify-center">
                        </div>

                        {/* Quadrado de foco (UI) */}
                        <div className="relative w-64 h-64 border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-0">
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>

                            <div className="absolute w-full h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                        </div>
                    </>
                )}
            </div>

            {/* Botão de Captura */}
            <div className="absolute bottom-0 w-full p-8 flex justify-center bg-gradient-to-t from-black/80 to-transparent">
                <button
                    onClick={captureImage}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-primary/50"
                    aria-label="Tirar foto"
                >
                    <div className="w-16 h-16 bg-white rounded-full"></div>
                </button>
            </div>

            {/* Canvas oculto para processamento */}
            <canvas ref={canvasRef} className="hidden" />

            <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
        </div>
    );
};