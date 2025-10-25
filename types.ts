
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets: {
        uri: string;
        title: string;
        text: string;
      }[];
    }[];
  };
}

export interface GeminiResponse {
  text: string;
  sources: GroundingChunk[];
}
