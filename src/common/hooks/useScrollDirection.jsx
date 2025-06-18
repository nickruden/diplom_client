import { useEffect, useState } from "react";

const useScrollDirection = (scrollContainerRef) => {
  const [scrollDirection, setScrollDirection] = useState("up");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    if (!scrollContainerRef?.current) return;

    let lastScrollTop = scrollContainerRef.current.scrollTop;

    const updateScrollDirection = () => {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const direction = scrollTop > lastScrollTop ? "down" : "up";

      if (Math.abs(scrollTop - lastScrollTop) > 10) {
        setScrollDirection(direction);
      }

      // Здесь проверяем, насколько близко к верху
      setIsAtTop(scrollTop < 100);

      lastScrollTop = scrollTop;
    };

    const container = scrollContainerRef.current;

    container.addEventListener("scroll", updateScrollDirection);
    return () => container.removeEventListener("scroll", updateScrollDirection);
  }, [scrollContainerRef]);

  return { scrollDirection, isAtTop };
};

export default useScrollDirection;
