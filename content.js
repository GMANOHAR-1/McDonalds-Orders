(async () => {
 
    const jwtToken = localStorage.getItem("CapacitorStorage.token");
  
    if (!jwtToken) {
      console.warn("JWT token not found in local storage.");
      chrome.runtime.sendMessage({ type: "NO_AUTH_TOKEN" });
      return;
    }
  
    const sanitizedToken =
      jwtToken.startsWith('"') && jwtToken.endsWith('"')
        ? jwtToken.slice(1, -1)
        : jwtToken;
  
  
    chrome.runtime.sendMessage({
      type: "AUTH_TOKEN",
      token: sanitizedToken,
    });
  })();
  