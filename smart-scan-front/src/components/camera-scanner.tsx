import { useEffect, useRef, useState, useCallback } from 'react';

interface CameraScannerProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

// Tipagem para OpenCV Mat
interface CVMat {
    delete: () => void;
    roi: (rect: CVRect) => CVMat;
    rows: number;
    cols: number;
    clone: () => CVMat;
}

type CVRect = unknown;
type CVSize = unknown;

// Adicionar tipagem para o window
declare global {
    interface Window {
        cv: {
            Mat: new () => CVMat;
            imread: (canvas: HTMLCanvasElement) => CVMat;
            cvtColor: (src: CVMat, dst: CVMat, code: number) => void;
            GaussianBlur: (src: CVMat, dst: CVMat, size: CVSize, sigma: number) => void;
            absdiff: (src1: CVMat, src2: CVMat, dst: CVMat) => void;
            threshold: (src: CVMat, dst: CVMat, thresh: number, maxval: number, type: number) => void;
            countNonZero: (src: CVMat) => number;
            Canny: (src: CVMat, dst: CVMat, threshold1: number, threshold2: number) => void;
            imshow: (canvas: HTMLCanvasElement | null, mat: CVMat) => void;
            Rect: new (x: number, y: number, width: number, height: number) => CVRect;
            Size: new (width: number, height: number) => CVSize;
            COLOR_RGBA2GRAY: number;
            THRESH_BINARY: number;
        };
    }
}

export const CameraScanner = ({ onCapture, onClose }: CameraScannerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isOpenCvReady, setIsOpenCvReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const detectionIntervalRef = useRef<number | null>(null);
    const previousFrameRef = useRef<CVMat | null>(null);
    const stableFramesRef = useRef(0);

    // 1. EFEITO PARA CARREGAR O OPENCV DINAMICAMENTE
    useEffect(() => {
        // Se já estiver carregado, apenas seta como pronto
        if (window.cv && typeof window.cv.Mat === 'function') {
            setTimeout(() => setIsOpenCvReady(true), 0);
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
            if (window.cv && typeof window.cv.Mat === 'function') {
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
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
            }
            if (previousFrameRef.current) {
                previousFrameRef.current.delete();
            }
        };
    }, [isOpenCvReady]);

    const captureImage = useCallback(() => {
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
            const src = cv.imread(tempCanvas);

            // Define o quadrado de corte (60% da menor dimensão)
            const size = Math.min(video.videoWidth, video.videoHeight) * 0.6;
            const x = (video.videoWidth - size) / 2;
            const y = (video.videoHeight - size) / 2;

            const rect = new cv.Rect(x, y, size, size);
            const dst = src.roi(rect);

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
            }, 'image/jpeg', 0.9);

        } catch (e) {
            console.error("Erro no processamento OpenCV:", e);
        }
    }, [isOpenCvReady, onCapture]);

    // Reduz a sensibilidade e inicia a contagem regressiva para captura
    const startCountdown = useCallback(() => {
        setCountdown(1);
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(countdownInterval);
                    setTimeout(() => {
                        captureImage();
                        setCountdown(null);
                    }, 100);
                    return null;
                }
                return prev - 1;
            });
        }, 1000);
    }, [captureImage]);

    // 3. EFEITO PARA DETECÇÃO AUTOMÁTICA DE OBJETOS
    useEffect(() => {
        if (!isOpenCvReady || !videoRef.current) return;

        const detectObject = () => {
            if (!videoRef.current || !window.cv || countdown !== null) return;

            const video = videoRef.current;
            const cv = window.cv;

            // Criar canvas temporário para análise
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = video.videoWidth;
            tempCanvas.height = video.videoHeight;
            const ctx = tempCanvas.getContext('2d');
            if (!ctx) return;

            ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

            try {
                const src = cv.imread(tempCanvas);

                // Define a área de interesse (ROI) - quadrado de foco
                const size = Math.min(video.videoWidth, video.videoHeight) * 0.6;
                const x = (video.videoWidth - size) / 2;
                const y = (video.videoHeight - size) / 2;
                const rect = new cv.Rect(x, y, size, size);
                const roi = src.roi(rect);

                // Converter para escala de cinza
                const gray = new cv.Mat();
                cv.cvtColor(roi, gray, cv.COLOR_RGBA2GRAY);

                // Aplicar blur para reduzir ruído
                cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);

                if (previousFrameRef.current) {
                    // Calcular diferença entre frames
                    const diff = new cv.Mat();
                    cv.absdiff(gray, previousFrameRef.current, diff);

                    // Aplicar threshold para binarizar a diferença
                    cv.threshold(diff, diff, 25, 255, cv.THRESH_BINARY);

                    // Contar pixels diferentes (movimento)
                    const movement = cv.countNonZero(diff);
                    const totalPixels = diff.rows * diff.cols;
                    const movementPercentage = (movement / totalPixels) * 100;

                    // Se houver pouco movimento (objeto estável) e algo presente
                    if (movementPercentage < 3 && movementPercentage > 0.05) {
                        stableFramesRef.current += 1;

                        // Se o objeto está estável por pelo menos 2 frames (~60ms)
                        if (stableFramesRef.current >= 2) {
                            // Verificar se há conteúdo suficiente na ROI
                            const edges = new cv.Mat();
                            cv.Canny(gray, edges, 50, 150);
                            const edgeCount = cv.countNonZero(edges);
                            const edgePercentage = (edgeCount / totalPixels) * 100;

                            // Se há bordas suficientes (indica presença de objeto)
                            if (edgePercentage > 2) {
                                stableFramesRef.current = 0;
                                startCountdown();
                            }

                            edges.delete();
                        }
                    } else {
                        stableFramesRef.current = 0;
                    }

                    diff.delete();
                }

                // Atualizar frame anterior
                if (previousFrameRef.current) {
                    previousFrameRef.current.delete();
                }
                previousFrameRef.current = gray.clone();

                // Limpar memória
                src.delete();
                roi.delete();
                gray.delete();

            } catch (e) {
                console.error("Erro na detecção:", e);
            }
        };

        // Iniciar detecção a cada 30ms (ultra rápido)
        detectionIntervalRef.current = setInterval(detectObject, 30);

        return () => {
            if (detectionIntervalRef.current) {
                clearInterval(detectionIntervalRef.current);
            }
        };
    }, [isOpenCvReady, countdown, startCountdown]);

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
                <div>
                    <h3 className="text-white font-medium text-shadow">
                        {countdown !== null ? 'Capturando em...' : 'Posicione o produto no centro'}
                    </h3>
                    {countdown !== null && (
                        <p className="text-primary text-sm font-bold text-shadow animate-pulse">{countdown}</p>
                    )}
                </div>
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
                        <div className={`relative w-64 h-64 border-2 ${countdown !== null ? 'border-green-500' : 'border-primary'} shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-0 transition-colors`}>
                            <div className={`absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 ${countdown !== null ? 'border-green-500' : 'border-primary'} -mt-1 -ml-1`}></div>
                            <div className={`absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 ${countdown !== null ? 'border-green-500' : 'border-primary'} -mt-1 -mr-1`}></div>
                            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 ${countdown !== null ? 'border-green-500' : 'border-primary'} -mb-1 -ml-1`}></div>
                            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 ${countdown !== null ? 'border-green-500' : 'border-primary'} -mb-1 -mr-1`}></div>

                            <div className={`absolute w-full h-0.5 ${countdown !== null ? 'bg-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.8)]' : 'bg-primary/80 shadow-[0_0_15px_rgba(59,130,246,0.8)]'} animate-[scan_2s_ease-in-out_infinite]`}></div>
                            
                            {countdown !== null && countdown > 1 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-white text-6xl font-bold text-shadow animate-bounce">
                                        {countdown}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Botão manual opcional (caso queira capturar manualmente) */}
            <div className="absolute bottom-0 w-full p-8 flex justify-center items-center flex-col bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm mb-4 text-shadow">Detecção automática ativada</p>
                <button
                    onClick={captureImage}
                    className="w-16 h-16 rounded-full border-4 border-white/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-primary/50 opacity-50 hover:opacity-100"
                    aria-label="Tirar foto manualmente"
                    title="Capturar manualmente"
                >
                    <div className="w-12 h-12 bg-white rounded-full"></div>
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