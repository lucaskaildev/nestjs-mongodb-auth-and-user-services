
export interface HttpExceptionResponse {
    statusCode: number;
    error: string;  
}

export interface HttpExceptionResponseExtended {
    statusCode: number;
    error: string;
    path?: string;
    method?: string;
    timeStamp?: Date;   
}