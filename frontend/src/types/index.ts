export type Role = 'ARTIST' | 'VISITOR' | 'ADMIN';

export type AccountStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export type ArtworkStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';

export type EnquiryStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export type ExhibitionStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'ARCHIVED';

export interface User {
  id: string;
  email: string;
  role: Role;
  status: AccountStatus;
  createdAt: string;
  artistProfile?: ArtistProfile;
  visitorProfile?: VisitorProfile;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  name: string;
  slug: string;
  bio?: string;
  statement?: string;
  speciality: string;
  disciplines?: string;
  location?: string;
  yearsOfExperience?: number;
  profileImage?: string;
  coverImage?: string;
  website?: string;
  instagram?: string;
  featured: boolean;
  artworks?: Artwork[];
  _count?: {
    artworks: number;
    followers: number;
  };
}

export interface VisitorProfile {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
}

export interface ArtworkImage {
  id: string;
  artworkId: string;
  url: string;
  publicId?: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
  width?: number;
  height?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  _count?: {
    artworks: number;
  };
}

export interface Medium {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    artworks: number;
  };
}

export interface Artwork {
  id: string;
  artistId: string;
  artist: ArtistProfile;
  categoryId: string;
  category: Category;
  mediumId?: string;
  medium?: Medium;
  title: string;
  slug: string;
  description: string;
  dimensions: string;
  creationYear: number;
  price?: number;
  isForSale: boolean;
  isEnquiryOnly: boolean;
  status: ArtworkStatus;
  rejectionReason?: string;
  isFeatured: boolean;
  viewsCount: number;
  favoritesCount: number;
  primaryImageUrl: string;
  frameStyle?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  images?: ArtworkImage[];
  isFavourited?: boolean;
  relatedArtworks?: Artwork[];
}

export interface Exhibition {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  curatorStatement: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  status: ExhibitionStatus;
  featured: boolean;
  artworks?: Array<{
    id: string;
    artwork: Artwork;
    curatorNotes?: string;
  }>;
  _count?: {
    artworks: number;
  };
}

export interface Collection {
  id: string;
  visitorId?: string;
  artistId?: string;
  visitor?: VisitorProfile;
  artist?: ArtistProfile;
  title: string;
  slug: string;
  description?: string;
  isPublic: boolean;
  coverImage?: string;
  artworks?: Array<{
    id: string;
    artwork: Artwork;
    order: number;
  }>;
  _count?: {
    artworks: number;
  };
}

export interface Enquiry {
  id: string;
  visitorId?: string;
  artistId: string;
  artworkId?: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  artistResponse?: string;
  respondedAt?: string;
  createdAt: string;
  artwork?: Artwork;
  artist: ArtistProfile;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
  errors?: any;
}

