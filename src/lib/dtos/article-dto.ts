import type { CommentDTO } from "./comment-dto";
import type { RatingDTO } from "./rating-dto";

export interface ArticleDTO {
    id: number | null;
    title: string;
    content: string;
    author: string;
    creationDate: string;
    rating: RatingDTO | null;
    edited: boolean;
    lastEditDate: string | null;
    comments: CommentDTO[];
    tags: string[];
    category: number;
    isPublic: boolean;
}
