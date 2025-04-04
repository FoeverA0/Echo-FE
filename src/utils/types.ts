export type Aptogotchi = {
  name: string;
  address: string;
  description: string;
  documents: DocumentInfo[];
  change_log: ChangeLog[];
  whitelist: string[];
  coin_type: string;
  owner: string;
  per_search_fee: number;
};

export type AptogotchiTraits = {
  body: number;
  ear: number;
  face: number;
};

export type Listing = {
  listing_object_address: string;
  price: number;
  seller_address: string;
};

export type DocumentInfo = {
  name: string;
  hash: string;
  size: number;
}

export type ChangeLog = {
  action: number;
  doc_info: DocumentInfo;
  timestamp: number;
}

export type AptogotchiWithTraits = Aptogotchi & AptogotchiTraits;
export type ListedAptogotchiWithTraits = Aptogotchi &
  AptogotchiTraits &
  Listing;
