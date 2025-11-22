let cachedVersion: string | null = null;

export const getCurrentPatch = async (): Promise<string> => {
  if (cachedVersion) return cachedVersion;

  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    if (!response.ok) throw new Error('Failed to fetch patch versions');
    
    const versions = await response.json();
    // The first item is the latest version
    cachedVersion = versions[0];
    return cachedVersion || '15.1.1'; // Fallback if empty
  } catch (error) {
    console.warn("Failed to fetch latest patch, defaulting to fallback.", error);
    return '15.1.1'; // Fallback to a recent Season 15 patch
  }
};
