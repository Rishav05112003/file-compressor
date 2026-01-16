# 🚀 Deflate.io — High-Speed File Compression

<p align="center">
  <img src="public/favicon.svg" width="90" />
</p>

<p align="center">
  A blazing-fast, browser-based file compressor using the <b>DEFLATE</b> algorithm.
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" /></a>
  <img src="https://img.shields.io/badge/Compression-DEFLATE-purple" />
  <img src="https://img.shields.io/badge/Frontend-Next.js-black" />
  <img src="https://img.shields.io/badge/Algorithm-LZ77%20%2B%20Huffman-green" />
</p>

---

## ✨ About

**Deflate.io** is a modern file compression tool built using the **DEFLATE algorithm**, combining:

- **LZ77** (sliding-window dictionary compression)
- **Huffman Coding** (optimal prefix encoding)

It compresses text files into compact binary representations and restores them without any data loss.

> All compression is lossless and reversible.

---

## ⚡ Features

<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px">

<div style="padding:16px; border-radius:10px; background:#0f172a">
<b>🔐 Secure Processing</b><br/>
All compression runs locally in your browser. No data is uploaded to any server.
</div>

<div style="padding:16px; border-radius:10px; background:#0f172a">
<b>🚀 Blazing Fast</b><br/>
Optimized implementation ensures instant compression, even for large text files.
</div>

<div style="padding:16px; border-radius:10px; background:#0f172a">
<b>📦 Standard DEFLATE</b><br/>
Uses RFC 1951-compliant DEFLATE format for maximum compatibility.
</div>

</div>

---

## 🧠 How DEFLATE Works

DEFLATE is a hybrid compression algorithm consisting of two stages:

---

### 1️⃣ LZ77 Compression

LZ77 replaces repeated patterns with backward references.

Example:

ABABABAB → (offset=2, length=6)


This removes redundancy by exploiting repeated substrings.

---

### 2️⃣ Huffman Encoding

Huffman assigns **shorter binary codes** to frequent symbols and **longer codes** to rare ones.

Example:

| Character | Frequency | Code |
|----------|------------|------|
| a        | 45         | 0    |
| b        | 13         | 101  |
| c        | 12         | 100  |

This minimizes the total number of bits.

---

### Combined = DEFLATE

Input → LZ77 → Huffman → Compressed Output


---

## 🛠️ Tech Stack

| Layer       | Technology |
|------------|------------|
| Frontend   | Next.js 14 |
| Styling    | Tailwind CSS |
| Compression| DEFLATE (LZ77 + Huffman) |
| Language   | TypeScript |
| Runtime    | Browser |
| Hosting    | Vercel |

---


---

## 🧪 Usage

### Compress a file

1. Upload a `.txt` file
2. Click **Compress Now**
3. Download the compressed output

---

### Decompress a file

1. Upload the compressed file
2. Click **Restore File**
3. Get the original file back

---

## 📄 Compression File Format

Your compressed file structure:

| Section | Description |
|--------|-------------|
| Header | Huffman table |
| Body   | LZ77-compressed bitstream |
| Footer | Padding info |

---

### Example

Original text:
aabcbaab


Compressed:
Header: { a=1, b=01, c=00 }
Data: 11010011101


---

## 🧩 Internals

### Compression Pipeline

1. Read input
2. Apply LZ77 sliding window compression
3. Build Huffman frequency table
4. Generate prefix tree
5. Encode stream
6. Write metadata + binary output

---

### Decompression Pipeline

1. Parse metadata
2. Rebuild Huffman tree
3. Decode bitstream
4. Apply LZ77 expansion
5. Restore original file

---

## 📈 Why DEFLATE?

| Feature | DEFLATE | ZIP | GZIP |
|--------|---------|-----|------|
Lossless | ✅ | ✅ | ✅ |
Fast     | ✅ | ⚠️ | ⚠️ |
Standard | ✅ | ✅ | ✅ |
Browser-friendly | ✅ | ❌ | ❌ |

---

## 🔮 Roadmap

- [ ] Binary file support (PNG, MP3, PDF)
- [ ] Streaming compression
- [ ] Progress tracking
- [ ] WASM optimization
- [ ] Unicode support
- [ ] Batch uploads
- [ ] PWA support

---

## 🤝 Contributing

Pull requests are welcome!

If you find a bug or have an improvement idea:

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a PR

---

## 📜 License

This project is licensed under the **MIT License**.

> You are free to use, modify, distribute, and sell this software.

---

## 👨‍💻 Author

**Rishavdeep Maity**  
Final Year @ NIT Durgapur  
Full-stack Developer  

---

<p align="center">
  Built with ❤️ using modern web tech.
</p>


