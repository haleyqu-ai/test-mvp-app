
export enum NavTab {
  EXPLORE = 'explore',
  ASSETS = 'assets',
  CREATE = 'create',
  SUBSCRIBE = 'subscribe',
  ME = 'me'
}

export type UserTier = 'free' | 'pro' | 'studio';

export interface Model {
  id: string;
  title: string;
  thumbnail: string;
  modelUrl?: string;
  author: {
    name: string;
    avatar: string;
  };
  stats: {
    likes: number;
    downloads: number;
  };
  tags: string[];
  createdAt: string;
  size: string;
  status?: 'ready' | 'generating' | 'failed';
  specs: {
    topology: string;
    faces: number;
    vertices: number;
  };
  prompt?: string;
  retriesUsed?: number;
}

export enum RenderMode {
  PBR = 'PBR',
  BASE_COLOR = 'Base Color',
  SOLID = 'Solid Mode',
  WIREFRAME = 'Wireframe Mode'
}

export interface GenerationTask {
  id: string;
  type: 'Model' | 'Image';
  status: 'processing' | 'completed';
  progress: number;
  thumbnail: string;
  title: string;
  createdAt?: string;
}
