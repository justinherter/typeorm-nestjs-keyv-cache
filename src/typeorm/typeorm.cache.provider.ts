import { createHash } from 'crypto';
import Keyv from 'keyv';
import { QueryRunner } from 'typeorm';
import { QueryResultCache } from 'typeorm/cache/QueryResultCache';
import { QueryResultCacheOptions } from 'typeorm/cache/QueryResultCacheOptions';
import { Injectable } from '@nestjs/common';
import { AbstractCacheProvider } from '../cache/abstract.provider';

@Injectable()
export class TypeOrmCacheProvider extends AbstractCacheProvider implements QueryResultCache {
  constructor(options?: Keyv.Options<any>) {
    super({ ...options, namespace: options?.namespace || 'typeorm:cache:' });
  }

  private generateIdentifier(query: string) {
    return query && `${createHash('md5').update(query).digest('hex')}`;
  }

  /**
   * Creates a connection with given cache provider.
   */
  async connect() {}

  /**
   * Closes a connection with given cache provider.
   */
  async disconnect() {}

  /**
   * Performs operations needs to be created during schema synchronization.
   */
  async synchronize(queryRunner?: QueryRunner) {}

  /**
   * Caches given query result.
   */
  async getFromCache(options: QueryResultCacheOptions, queryRunner?: QueryRunner): Promise<QueryResultCacheOptions | undefined> {
    const { identifier, query, duration } = options;
    const key = `${this.prefix}${identifier || this.generateIdentifier(query || '')}`;
    const result = await this.cache.get(key);
    return (
      result && {
        identifier: key,
        duration,
        query,
        result,
      }
    );
  }

  /**
   * Stores given query result in the cache.
   */
  async setInCache(options: QueryResultCacheOptions, savedCache: QueryResultCacheOptions | undefined, queryRunner?: QueryRunner) {
    const { identifier, query, duration, result } = options;
    const key = `${this.prefix}${identifier || this.generateIdentifier(query || '')}`;
    await this.cache.set(key, result, duration);
  }

  /**
   * Checks if cache is expired or not.
   */
  isExpired(savedCache: QueryResultCacheOptions): boolean {
    return false;
  }

  /**
   * Clears everything stored in the cache.
   */
  async clear(queryRunner?: QueryRunner) {
    await this.cache.clear();
  }

  /**
   * Removes all cached results by given identifiers from cache.
   */
  async remove(identifiers: string[], queryRunner?: QueryRunner) {
    for (const key of identifiers) {
      const prefixedKey: string = `${this.prefix}${key}`;
      await this.cache.delete(prefixedKey);
    }
  }
}
