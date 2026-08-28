export declare class BulkMealEntryDto {
    date: string;
    lunchUserIds?: string[];
    dinnerUserIds?: string[];
}
export declare class SingleMealEntryDto {
    date: string;
    mealType: "lunch" | "dinner";
    userIds: string[];
}
