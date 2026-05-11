import webbrowser
import os
import sys

def main():
    """
    Centration Surgical Assist - Desktop Launcher
    This script launches the production web app in a dedicated windowed mode.
    """
    # In production, this would be your hosted URL
    # In development (AI Studio), it's the development URL
    app_url = os.environ.get("APP_URL", "http://localhost:3000")
    
    print("="*60)
    print("CENTRATON SURGICAL ASSIST - DESKTOP BRIDGE")
    print("="*60)
    print(f"Launching technical workstation at: {app_url}")
    print("Close the browser window to exit the application.")
    
    # Try to launch in 'app' mode for a cleaner desktop feel (supported by Chrome/Edge)
    if sys.platform.startswith('win'):
        # Windows Chrome app mode
        chrome_cmd = f"start chrome --app={app_url}"
        os.system(chrome_cmd)
    elif sys.platform.startswith('darwin'):
        # macOS Chrome app mode
        chrome_cmd = f"/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --app={app_url}"
        os.system(chrome_cmd)
    else:
        # Fallback to standard browser launch
        webbrowser.open(app_url)

if __name__ == "__main__":
    main()
