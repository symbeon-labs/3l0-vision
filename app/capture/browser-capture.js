export class BrowserCaptureAdapter {
  constructor({ videoElement, onStatus = () => {} } = {}) {
    if (!videoElement) throw new Error("videoElement is required");
    this.video = videoElement;
    this.onStatus = onStatus;
    this.stream = null;
    this.scanner = null;
    this.scanFrame = null;
    this.photoUrl = null;
  }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("camera_unavailable");
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false
    });

    this.video.srcObject = this.stream;
    await this.video.play();
    this.onStatus({ type: "camera_ready" });
    this.startBarcodeScanner();
  }

  async captureFrame() {
    if (!this.stream || !this.video.videoWidth || !this.video.videoHeight) {
      throw new Error("camera_frame_unavailable");
    }

    const canvas = document.createElement("canvas");
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("camera_canvas_unavailable");
    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((value) => {
        if (value) resolve(value);
        else reject(new Error("camera_frame_encoding_failed"));
      }, "image/jpeg", 0.88);
    });

    if (this.photoUrl) URL.revokeObjectURL(this.photoUrl);
    this.photoUrl = URL.createObjectURL(blob);

    return {
      blob,
      previewUrl: this.photoUrl,
      mimeType: blob.type || "image/jpeg",
      sizeBytes: blob.size,
      width: canvas.width,
      height: canvas.height,
      capturedAt: new Date().toISOString(),
      source: "browser-camera"
    };
  }

  startBarcodeScanner() {
    if (!("BarcodeDetector" in window)) {
      this.onStatus({ type: "barcode_unavailable" });
      return;
    }

    this.scanner = new BarcodeDetector({
      formats: ["ean_13", "ean_8", "qr_code", "code_128"]
    });

    const scan = async () => {
      if (!this.stream) return;

      try {
        const codes = await this.scanner.detect(this.video);
        if (codes.length > 0) {
          const code = codes[0];
          this.onStatus({
            type: "barcode_detected",
            value: code.rawValue,
            format: code.format
          });
          return;
        }
      } catch {
        this.onStatus({ type: "barcode_scan_error" });
      }

      if (this.stream) this.scanFrame = requestAnimationFrame(scan);
    };

    this.scanFrame = requestAnimationFrame(scan);
  }

  async capture(input = {}) {
    if (input.code) {
      return {
        source: "manual-code",
        modality: "identifier",
        identifiers: [{ scheme: input.scheme ?? "ean", value: input.code }],
        context: { capture_method: "manual" }
      };
    }

    throw new Error("capture_requires_identifier");
  }

  stop() {
    if (this.scanFrame !== null) cancelAnimationFrame(this.scanFrame);
    this.scanFrame = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.video.srcObject = null;
    if (this.photoUrl) URL.revokeObjectURL(this.photoUrl);
    this.photoUrl = null;
  }
}
