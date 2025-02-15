import { Expose, Type } from 'class-transformer';

export class ResponseDocumentDTO {
   
    @Expose()
    url: string;
    @Expose()
    src: string;
    @Expose()
    description: string;
    @Expose()
    title: string;
    @Expose()
    createdAt: Date;

    constructor(partial: Partial<ResponseDocumentDTO>) {
        Object.assign(this, partial);
    }
}
