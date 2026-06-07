import { useEffect } from "react";

function useKeyboard(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      shortcuts.forEach(({ key, action }) => {
        if (e.key === key) action();
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export default useKeyboard;