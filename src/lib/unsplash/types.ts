export interface UnsplashPhotoPayload {
  id: string;
  width: number;
  height: number;
  alt_description: string | null;
  description: string | null;
  color: string | null;
  blur_hash: string | null;
  likes: number;
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  links: {
    html: string;
  };
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
    profile_image?: {
      small?: string;
    };
  };
  tags?: Array<{ title: string }>;
}

export interface UnsplashSearchPayload {
  total: number;
  total_pages: number;
  results: UnsplashPhotoPayload[];
}
