import { http } from '@tauri-apps/api';
// import axios from "axios-fetch-mini";
import * as cheerio from 'cheerio';

export enum ResponseType {
  JSON = 1,
  Text,
  Binary
}

// @ts-ignore
// window.fetch = http.fetch;
export async function getPackageInfo(packageName: string) {
  const result = await http.fetch<string>(`https://sj.qq.com/appdetail/${packageName}`, { method: 'GET', responseType: ResponseType.Text });
  // console.log(result);
  const $ = cheerio.load(result.data);
  const main = $('main');
  const iconUrl = ($(main).find('img')[0] || { attribs: {} }).attribs['src'];
  const name = $(main).find('h1').text();
  const description = $(main).find('p').text();
  const packageInfo: {
    /** 应用包名 */
    packageName: string;
    /** 应用名称 */
    name: string;
    /** 图标地址 */
    iconUrl: string;
    /** 描述信息 */
    description: string;
  } = {
    packageName,
    name,
    iconUrl,
    description
  }
  return packageInfo;
}