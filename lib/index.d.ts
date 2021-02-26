import Keyv from 'keyv';
import { QueryRunner } from 'typeorm';
import { QueryResultCache } from 'typeorm/cache/QueryResultCache';
import { QueryResultCacheOptions } from 'typeorm/cache/QueryResultCacheOptions';
export declare class KeyvCacheProvider implements QueryResultCache {
    cache: Keyv;
    constructor(opts?: Keyv.Options<any>);
    private generateIdentifier;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    synchronize(queryRunner?: QueryRunner): Promise<void>;
    getFromCache(options: QueryResultCacheOptions, queryRunner?: QueryRunner): Promise<QueryResultCacheOptions | undefined>;
    storeInCache(options: QueryResultCacheOptions, savedCache: QueryResultCacheOptions | undefined, queryRunner?: QueryRunner): Promise<void>;
    isExpired(savedCache: QueryResultCacheOptions): boolean;
    clear(queryRunner?: QueryRunner): Promise<void>;
    remove(identifiers: string[], queryRunner?: QueryRunner): Promise<void>;
}
