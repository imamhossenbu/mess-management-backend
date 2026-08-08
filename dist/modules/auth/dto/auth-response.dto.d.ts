export declare class AuthResponseDto {
    accessToken: string;
    user: {
        id: string;
        name: string;
        phone: string;
        email?: string;
        role: string;
        roomNumber?: string;
        profileImage?: string;
    };
}
