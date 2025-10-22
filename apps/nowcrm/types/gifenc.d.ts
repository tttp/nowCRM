// types/gifenc.d.ts
declare module "gifenc" {
  export function GIFEncoder(): {
    writeFrame(
      indexedPixels: Uint8Array,
      width: number,
      height: number,
      opts: { palette: Uint8Array; delay?: number }
    ): void;
    finish(): void;
    bytesView(): Uint8Array;
  };
  export function quantize(pixels: Uint8Array | Uint8ClampedArray, maxColors?: number): Uint8Array;
  export function applyPalette(pixels: Uint8Array | Uint8ClampedArray, palette: Uint8Array): Uint8Array;
}

declare module "gifenc/dist/gifenc.js" {
  export * from "gifenc";
}
