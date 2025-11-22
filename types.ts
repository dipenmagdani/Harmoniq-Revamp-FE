export interface Image {
  quality: string;
  link: string;
}

export interface DownloadUrl {
  quality: string;
  link: string;
}

export interface Artist {
  id: string;
  name: string;
  role?: string;
  image?: Image[] | string; // API sometimes returns string or empty
  type: string;
  url: string;
}

export interface ArtistMap {
  primary_artists: Artist[];
  featured_artists: Artist[];
  artists: Artist[];
}

export interface Song {
  id: string;
  name: string;
  title?: string;
  subtitle?: string;
  type: string; // 'song'
  album?: string;
  album_id?: string;
  album_url?: string;
  year?: string | number;
  release_date?: string;
  duration?: string | number;
  label?: string;
  primaryArtists?: string | Artist[];
  featuredArtists?: string | Artist[];
  artists?: Artist[]; 
  explicit?: boolean;
  play_count?: string | number;
  language?: string;
  has_lyrics?: boolean;
  url?: string;
  copyright_text?: string;
  image: Image[];
  download_url?: DownloadUrl[]; // Updated from downloadUrl
  artist_map?: ArtistMap;
}

export interface Album {
  id: string;
  name: string;
  title?: string;
  description?: string;
  subtitle?: string;
  header_desc?: string;
  type: string; // 'album'
  year?: string | number;
  play_count?: string | number;
  language?: string;
  explicit?: boolean;
  song_count?: string | number;
  url?: string;
  artist_map?: ArtistMap;
  image: Image[];
  songs?: Song[];
  modules?: any;
}

export interface Playlist {
  id: string;
  userId?: string;
  title: string;
  name?: string;
  subtitle?: string;
  type: string; // 'playlist'
  image: Image[];
  url?: string;
  song_count?: string | number;
  firstname?: string;
  follower_count?: string | number;
  last_updated?: string;
  explicit_content?: string;
  songs?: Song[];
}

export interface SearchResponse {
  status: string;
  message: string | null;
  data: {
    topQuery: {
      results: any[];
      position: number;
    };
    songs: {
      results: Song[];
      position: number;
    };
    albums: {
      results: Album[];
      position: number;
    };
    playlists: {
      results: Playlist[];
      position: number;
    };
    artists: {
      results: Artist[];
      position: number;
    };
  };
}

export interface HomeResponse {
  status: string;
  message: string;
  data: {
    [key: string]: any; // Allow dynamic keys like 'trending', 'charts' etc
  };
}
