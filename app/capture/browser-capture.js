export class BrowserCaptureAdapter {
  constructor({ videoElement, onStatus = () => {} } = {}) {
    if (!videoElement) throw new Error("videoElement is required");
    this.video = videoElement;
    this.onStatus = onStatus;
    this.stream = null;
    this.scanner = null;
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

      requestAnimationFrame(scan);
    };

    requestAnimationFrame(scan);
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
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.video.srcObject = null;
  }
}
