import type { RawJob } from '@/types/RawJob';

export abstract class JobSourceAdapter {
  protected fetchHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
    Accept: '*/*',
    'Accept-Language': 'ru-RU',
    'Accept-Encoding': 'gzip, deflate, br',
  };

  abstract fetchJobs(): Promise<RawJob[]>;
  abstract normalize(raw: RawJob): any;
}
