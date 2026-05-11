# Centration Surgical Workstation - Desktop Build Instructions

This application is built with a **Hybrid Architecture**:
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend Shell**: Python 3.10+, PySide6 (Qt).

## Prerequisites
1. Python 3.10 or higher
2. Node.js 18+

## Development Setup

1. **Start the Frontend Dev Server**:
   ```bash
   npm install
   npm run dev
   ```

2. **Launch the Desktop Shell**:
   In a separate terminal:
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   python main.py
   ```

## Production Build

1. **Build the Web Assets**:
   ```bash
   npm run build
   ```

2. **Package the Executable**:
   ```bash
   pyinstaller --name CentrationAssist \
               --windowed \
               --onefile \
               --add-data "dist:dist" \
               main.py
   ```

## Bridge Features
The application uses `QtWebChannel` for low-latency bidirectional communication between Python and JavaScript. Access the bridge via `src/lib/desktopBridge.ts`.
