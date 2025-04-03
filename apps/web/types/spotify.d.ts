export {};
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
  }
}

export interface SpotifyPlayer {
  connect: () => boolean;
  disconnect: () => void;
  addListener: (event: string, callback: (data: any) => void) => void;
}
