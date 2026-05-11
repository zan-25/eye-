import sys
import os
from PySide6.QtCore import QUrl, Qt, QObject, Slot, Signal, QSize
from PySide6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWebChannel import QWebChannel

class SurgicalBridge(QObject):
    """
    Bidirectional bridge between Python and React UI.
    Handles system-level commands, hardware simulation, and telemetry.
    """
    telemetryUpdated = Signal(dict)
    alertTriggered = Signal(str)

    @Slot(str)
    def log(self, message):
        print(f"[UI_LOG] {message}")

    @Slot(result=dict)
    def get_system_status(self):
        return {
            "hwid": "7722-X9-FF0",
            "cpu_load": 34,
            "latency": "12ms",
            "temp": "31C",
            "status": "NOMINAL"
        }

    @Slot()
    def close_app(self):
        QApplication.quit()

    @Slot()
    def toggle_fullscreen(self):
        if window.isFullScreen():
            window.showNormal()
        else:
            window.showFullScreen()

class CentrationWorkstation(QMainWindow):
    def __init__(self):
        super().__init__()
        
        # 1. Window Configuration
        self.setWindowTitle("Centration Surgical Assist - Workstation v2.5")
        self.setMinimumSize(QSize(1280, 800))
        
        # Professional Workstation: Frameless or Native depending on preference
        # We'll use a standard styled window for better OS integration but can be made frameless
        # self.setWindowFlags(Qt.WindowType.FramelessWindowHint)
        
        self.setStyleSheet("background-color: #020304;")

        # 2. WebEngine Setup
        self.browser = QWebEngineView()
        self.browser.setContextMenuPolicy(Qt.ContextMenuPolicy.NoContextMenu)
        
        # 3. Setup Bridge / WebChannel
        self.channel = QWebChannel()
        self.bridge = SurgicalBridge()
        self.channel.registerObject("pyBridge", self.bridge)
        self.browser.page().setWebChannel(self.channel)

        # 4. Layout
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(self.browser)
        
        central_widget = QWidget()
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)

        # 5. Load Application
        # In production: load build/index.html
        # In dev: load the Vite dev server URL
        app_url = os.environ.get("APP_URL", "http://localhost:3000")
        self.browser.setUrl(QUrl(app_url))

if __name__ == "__main__":
    # Create the app
    app = QApplication(sys.argv)
    
    # Global visual style
    app.setStyle("Fusion")
    
    window = CentrationWorkstation()
    window.showMaximized()
    
    sys.exit(app.exec())
