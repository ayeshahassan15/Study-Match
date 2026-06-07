import { useEffect } from "react";

function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | Study Match`;
    return () => {
      document.title = "Study Match";
    };
  }, [title]);
}

export default usePageTitle;