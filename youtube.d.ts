// youtube.d.ts
declare global {
    interface Window {
      onYouTubeIframeAPIReady: () => void;
      YT: typeof YT;
    }
  
    namespace YT {
      class Player {
        constructor(elementId: string, options: {
          height?: string;
          width?: string;
          videoId?: string;
          playerVars?: {
            autoplay?: 0 | 1;
            controls?: 0 | 1;
            rel?: 0 | 1;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
          };
        });
        loadVideoById(videoId: string): void;
        playVideo(): void;
        pauseVideo(): void;
        stopVideo(): void;
      }
  
      enum PlayerState {
        ENDED = 0,
        PLAYING = 1,
        PAUSED = 2,
        BUFFERING = 3,
        CUED = 5,
      }
    }
  }
  
  export {};
  