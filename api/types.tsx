export interface Activity {
    id: number;
    title: string;
    description: string;
    location: string;
    duration: string;
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
