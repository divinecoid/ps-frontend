export interface Barcodes {
  code: string
  count: number
  serial_number: string;
  cutting: string;
  sizes: string;
}

export interface PrintOptions {
  barcodes: Barcodes[];
  dozenBarcodes?: Barcodes[];
  paper: {
    width: number;
    height: number;
  };
}