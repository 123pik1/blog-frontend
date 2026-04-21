export interface CommentDTO {
    id: number;
    author: string;
    content: string;
    creationDate: string;
    edited: boolean;
    lastEdtitionDate: string;
    parentPostId: number;
}
