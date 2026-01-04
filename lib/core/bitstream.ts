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

  writeByte(byte: number) {
      this.bytes.push(byte & 0xFF);
  }

  finish() {
    if (this.bitPos > 0) {
      this.bytes.push(this.current);
    }
    return new Uint8Array(this.bytes);
  }
}

export class BitReader {
  private bytes: Uint8Array;
  private bytePtr = 0;
  private bitPtr = 0;

  constructor(data: Uint8Array) {
    this.bytes = data;
  }

  readBit(): number | null {
    if (this.bytePtr >= this.bytes.length) return null;

    const bit = (this.bytes[this.bytePtr] >>> this.bitPtr) & 1;
    this.bitPtr++;

    if (this.bitPtr === 8) {
      this.bitPtr = 0;
      this.bytePtr++;
    }
    return bit;
  }

  readByte(): number | null {
    if (this.bytePtr >= this.bytes.length) return null;
    this.bitPtr = 0; 
    const val = this.bytes[this.bytePtr];
    this.bytePtr++;
    return val;
  }
  
  seek(pos: number) {
      this.bytePtr = pos;
      this.bitPtr = 0;
  }
}