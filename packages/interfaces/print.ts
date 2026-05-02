export interface PrintOptions {
  barcodes: string[];
  dozenBarcodes: string[];
  paper: {
    width: number;
    height: number;
  };
}