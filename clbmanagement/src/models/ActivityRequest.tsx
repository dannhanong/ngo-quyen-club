export interface ActivityRequest {
    clubId: number;
    title: string;
    description: string;
    startTime: string | Date;
    location: string;
    image: File | null;
}