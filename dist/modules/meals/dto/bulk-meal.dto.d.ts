export declare class BulkMealEntryDto {
    date: string;
    morningUserIds?: string[];
    lunchUserIds?: string[];
    dinnerUserIds?: string[];
}
export declare class SingleMealEntryDto {
    date: string;
    mealType: "morning" | "lunch" | "dinner";
    userIds: string[];
}
