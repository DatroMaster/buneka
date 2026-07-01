export type BarcodeInputSource = "camera" | "manual" | "usb_reader";

export type BarcodeLookupRequest = {
  barcode: string;
  source: BarcodeInputSource;
};
