export interface Network {
  "db/id": number;
  "network/squuid": string;
  "network/title"?: string;
  "network/name"?: string;
}

export interface SavedLtiFields {
  "https://purl.imsglobal.org/spec/lti/claim/context/id": string;
  "https://purl.imsglobal.org/spec/lti/claim/context/label": string;
  "https://purl.imsglobal.org/spec/lti/claim/context/title": string;
  "https://purl.imsglobal.org/spec/lti/claim/custom/canvas_course_id": string;
}

export interface Community {
  "db/id": number;
  "community/squuid": string;
  "community/title": string;
  "community/created-at": string;
  "community/canvas-course-id": number;
  "community/network": Network;
  "community/saved-lti-3-fields"?: SavedLtiFields;
  "community/saved-lti-fields"?: string;
}

export interface User {
  "db/id": number;
  "user/squuid": string;
  "user/username": string;
  "user/firstname": string;
  "user/lastname": string;
  "user/primary-email": {
    "email/text": string;
  };
  "user/community-role": string;
  "user/sis-ids": string[];
}

export interface PostParent {
  "db/id": number;
  "event/squuid": string;
}

export interface Event {
  "db/id": number;
  "event/squuid": string;
  "event/type": string;
  "event/network": Network;
  "event/community": Community;
  "event/actor": User;
  "event/receiver"?: User;
  "system/created-at": number;
  "date/iso": string;
  "post/parent"?: PostParent;
  "post/body-text"?: string;
  "post/word-count"?: number;
  "post/status"?: string;
  "post/visibility"?: string;
}

// API Response types
export interface CommunityApiResponse {
  data: Community[];
  limit: number;
  offset: number;
  "record-count": number;
  "at-end": boolean;
  cursor: string;
}

export interface EventApiResponse {
  data: Event[];
  limit: number;
  offset: number;
  "record-count": number;
  "at-end": boolean;
  cursor: string;
}
