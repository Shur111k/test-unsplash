export interface Photo {
  id: string;
  width: number;
  height: number;
  alt: string;
  description: string | null;
  color: string | null;
  blurHash: string | null;
  likes: number | null;
  tags: string[];
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  photoUrl: string;
  author: {
    name: string;
    username: string;
    profileUrl: string;
    avatarUrl: string | null;
  };
}

export interface PhotoPage {
  photos: Photo[];
  page: number;
  perPage: number;
  total: number | null;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  rateLimitRemaining: number | null;
}
