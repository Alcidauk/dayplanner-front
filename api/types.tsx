export interface RegisterPayload {
    name: string;
    surname: string;
    email: string;
    password: string;
}

export interface TokenData {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface Activity {
    id: number;
    title: string;
    description: string;
    location: string;
    duration: string;
    source: "google" | "local" | "user";
}

export interface ActivityListResponse {
    activities: Activity[];
}

export interface CalendarEvent {
    id: number;
    summary: string;
    description: string;
    start: string;
    end: string;
    location?: string;
    source: "google" | "local" | "user";
}

export interface UserCreate {
    name: string;
    surname: string;
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    name: string;
    surname: string;
    email: string;
    google_account_id: string | null;
}

export interface UserInfoCreate {
    place: string;
    interests: string[];
}

export interface UserInfoResponse {
    id: number;
    place: string;
    interests: string[];
}
