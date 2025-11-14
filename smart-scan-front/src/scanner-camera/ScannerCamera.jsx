import React, { useEffect, useRef, useState } from "react";

export default function ScannerCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [photo, setPhoto] = useState(null);

  const SCAN_BOX = { x: 0.15, y: 0.30, w: 0.70, h: 0.40 }; // posição da área de scan

  // Ativar câmera quando usuário clicar
  const startCamera = async () => {
    setPhoto(null);
    setCameraEnabled(true);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });

    videoRef.current.srcObject = stream;
  };

  useEffect(() => {
    if (!cameraEnabled) return;

    let interval;

    interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // desenha frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // recorta apenas área do scanner
      const sx = canvas.width * SCAN_BOX.x;
      const sy = canvas.height * SCAN_BOX.y;
      const sw = canvas.width * SCAN_BOX.w;
      const sh = canvas.height * SCAN_BOX.h;

      const scanData = ctx.getImageData(sx, sy, sw, sh);

      detectStableObject(scanData);
    }, 200);

    return () => clearInterval(interval);
  }, [cameraEnabled]);

  // movimento anterior
  let lastScan = null;
  let stableCounter = 0;

  function detectStableObject(frame) {
    if (!lastScan) {
      lastScan = frame;
      return;
    }

    let diff = 0;
    for (let i = 0; i < frame.data.length; i += 4) {
      diff += Math.abs(frame.data[i] - lastScan.data[i]);
    }

    // pouca mudança = área estabilizada
    if (diff < 500000) {
      stableCounter++;
    } else {
      stableCounter = 0;
    }

    lastScan = frame;

    // 5 leituras estáveis (~1s) → tira foto
    if (stableCounter >= 5) {
      takePhoto();
      stableCounter = 0;
    }
  }

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/png");
    setPhoto(img);

    // opcional: desativar câmera após foto
    stopCamera();
  };

  const stopCamera = () => {
    setCameraEnabled(false);
    const stream = videoRef.current?.srcObject;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div>
      {!cameraEnabled && (
        <button
          onClick={startCamera}
          style={{
            padding: "12px 20px",
            marginTop: "20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Abrir câmera
        </button>
      )}

      {cameraEnabled && (
        <div style={{ position: "relative", marginTop: 20 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%" }}
          />

          {/* Área de enquadramento */}
          <div
            style={{
              position: "absolute",
              top: ${SCAN_BOX.y * 100}%,
              left: ${SCAN_BOX.x * 100}%,
              width: ${SCAN_BOX.w * 100}%,
              height: ${SCAN_BOX.h * 100}%,
              border: "3px solid #00ff99",
              borderRadius: "12px",
              boxShadow: "0 0 12px #00ff99",
            }}
          />

          <button
            onClick={stopCamera}
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 20px",
              background: "#ff5555",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Fechar câmera
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {photo && (
        <div style={{ marginTop: 20 }}>
          <h3>Foto capturada:</h3>
          <img src={photo} alt="captured" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}