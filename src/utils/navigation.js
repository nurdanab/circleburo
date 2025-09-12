// Utility for smooth navigation with lazy loading support

export const scrollToElement = (elementId, options = {}) => {
  const {
    maxAttempts = 20,
    delay = 200,
    offset = 0,
    behavior = 'smooth',
    block = 'start'
  } = options;

  const attemptScroll = (attempts = 0) => {
    const element = document.getElementById(elementId);
    
    if (element) {
      if (import.meta.env.DEV) {
        console.log(`Found element "${elementId}" on attempt ${attempts + 1}, scrolling...`);
      }
      
      // Calculate position with offset
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      
      // Scroll to position
      if (behavior === 'smooth') {
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo(0, elementPosition);
      }
      
      return true; // Success
    } else if (attempts < maxAttempts) {
      // Element not found, retry after delay
      if (import.meta.env.DEV) {
        console.log(`Element "${elementId}" not found, attempt ${attempts + 1}/${maxAttempts}, retrying...`);
      }
      setTimeout(() => attemptScroll(attempts + 1), delay);
      return false; // Still trying
    } else {
      console.error(`Element with id "${elementId}" not found after ${maxAttempts} attempts`);
      
      // Fallback: list all elements with IDs for debugging
      if (import.meta.env.DEV) {
        const allElementsWithId = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        console.log('Available elements with IDs:', allElementsWithId);
      }
      
      return false; // Failed
    }
  };

  return attemptScroll();
};

export const navigateToSection = (navigate, currentPath, targetPath, sectionId, options = {}) => {
  if (currentPath !== targetPath) {
    if (import.meta.env.DEV) {
      console.log(`Navigating from ${currentPath} to ${targetPath} with section: ${sectionId}`);
    }
    
    // Store scroll target in sessionStorage as backup
    sessionStorage.setItem('scrollToSection', sectionId);
    
    // Navigate to target page with scroll state
    navigate(targetPath, { state: { scrollTo: sectionId } });
  } else {
    // Already on target page, just scroll
    if (import.meta.env.DEV) {
      console.log(`Already on ${currentPath}, scrolling to: ${sectionId}`);
    }
    scrollToElement(sectionId, options);
  }
};

// Check if an element exists in DOM
export const elementExists = (elementId) => {
  return document.getElementById(elementId) !== null;
};

// Wait for element to appear in DOM
export const waitForElement = (elementId, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    if (elementExists(elementId)) {
      resolve(document.getElementById(elementId));
      return;
    }

    const observer = new MutationObserver((mutations) => {
      if (elementExists(elementId)) {
        observer.disconnect();
        resolve(document.getElementById(elementId));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Timeout fallback
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${elementId} not found within timeout`));
    }, timeout);
  });
};