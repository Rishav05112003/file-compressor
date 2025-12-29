export class BitWriter {
  private bytes: number[] = [];
  private current = 0;
  private bitPos = 0;

  writeBits(bits: string) {
    for (const bit of bits) {
      if (bit === "1") {
        this.current |= (1 << this.bitPos);
      }
      this.bitPos++;

      if (this.bitPos === 8) {
        this.bytes.push(this.current);
        this.current = 0;
        this.bitPos = 0;
      }
    }
  }

  finish() {
    if (this.bitPos > 0) {
      this.bytes.push(this.current);
    }
    return new Uint8Array(this.bytes);
  }
}
