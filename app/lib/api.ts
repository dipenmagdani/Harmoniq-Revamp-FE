import {
  Song,
  Album,
  Playlist,
  SearchResponse,
  HomeResponse,
  Artist,
  Image,
} from "@/types";

const API_BASE = "https://api.mjolnircloud.workers.dev";

export const api = {
  getHome: async (lang: string = "hindi"): Promise<HomeResponse> => {
    const res = await fetch(`${API_BASE}/modules?lang=${lang}`, {
      cache: "no-store",
    });
    return res.json();
  },

  getAlbum: async (id: string): Promise<{ data: Album }> => {
    const res = await fetch(`${API_BASE}/album?id=${id}`, {
      cache: "no-store",
    });
    return res.json();
  },

  getPlaylist: async (id: string): Promise<{ data: Playlist }> => {
    const res = await fetch(`${API_BASE}/playlist?id=${id}`, {
      cache: "no-store",
    });
    return res.json();
  },

  getArtist: async (id: string): Promise<{ data: Artist }> => {
    const res = await fetch(`${API_BASE}/artist?id=${id}`, {
      cache: "no-store",
    });
    return res.json();
  },

  getSong: async (id: string): Promise<{ data: { songs: Song[] } }> => {
    const res = await fetch(`${API_BASE}/song?id=${id}`, {
      cache: "no-store",
    });
    return res.json();
  },

  // Search
  searchTop: async (query: string): Promise<SearchResponse> => {
    const res = await fetch(
      `${API_BASE}/search/top?q=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    return res.json();
  },

  searchAll: async (query: string): Promise<SearchResponse> => {
    const res = await fetch(
      `${API_BASE}/search?q=${encodeURIComponent(query)}&n=20&page=1`,
      { cache: "no-store" }
    );
    return res.json();
  },

  searchSongs: async (query: string): Promise<SearchResponse> => {
    const res = await fetch(
      `${API_BASE}/search/songs?q=${encodeURIComponent(query)}&n=20&page=1`,
      { cache: "no-store" }
    );
    return res.json();
  },

  searchAlbums: async (query: string): Promise<SearchResponse> => {
    const res = await fetch(
      `${API_BASE}/search/albums?q=${encodeURIComponent(query)}&n=20&page=1`,
      { cache: "no-store" }
    );
    return res.json();
  },

  searchPlaylists: async (query: string): Promise<SearchResponse> => {
    const res = await fetch(
      `${API_BASE}/search/playlists?q=${encodeURIComponent(query)}&n=20&page=1`,
      { cache: "no-store" }
    );
    return res.json();
  },

  searchArtists: async (query: string): Promise<SearchResponse> => {
    const res = await fetch(
      `${API_BASE}/search/artists?q=${encodeURIComponent(query)}&n=20&page=1`,
      { cache: "no-store" }
    );
    return res.json();
  },

  // Recommendations helper
  getRecommendations: async (songId: string, lang: string = "hindi") => {
    const res = await fetch(
      `${API_BASE}/song/recommend?id=${songId}&lang=${lang}`,
      { cache: "no-store" }
    );
    return res.json();
  },
};

export const getImageUrl = (images: Image[] | string | undefined): string => {
  if (!images)
    return "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop";
  if (typeof images === "string") return images;
  if (Array.isArray(images) && images.length > 0) {
    // Prefer 500x500 or highest quality
    const highQuality =
      images.find((img) => img.quality === "500x500") ||
      images[images.length - 1];
    return highQuality.link;
  }
  return "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop";
};

export const getArtistNames = (item: any): string => {
  if (!item) return "";

  if (item.artist_map?.artists?.length > 0) {
    return item.artist_map.artists.map((a: any) => a.name).join(", ");
  }
  if (item.artist_map?.primary_artists?.length > 0) {
    return item.artist_map.primary_artists.map((a: any) => a.name).join(", ");
  }
  if (Array.isArray(item.primaryArtists)) {
    return item.primaryArtists.map((a: any) => a.name).join(", ");
  }
  if (typeof item.primaryArtists === "string") return item.primaryArtists;
  if (item.artists && Array.isArray(item.artists)) {
    return item.artists.map((a: any) => a.name).join(", ");
  }

  return "Unknown Artist";
};

export const getAudioUrl = (song: Song): string => {
  if (!song.download_url || song.download_url.length === 0) return "";
  // Return highest quality (usually last)
  return song.download_url[song.download_url.length - 1].link;
};
