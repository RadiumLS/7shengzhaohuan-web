import { CSSProperties } from 'react';

interface CardOption {
  id: string,
  style?: CSSProperties,
  size?: 'big' | 'small',
  className?: string,
}

interface CardSimpleInfo {
  id: number
}
interface CardInfo extends CardSimpleInfo {
  name: string,
  nickName?: string[],
  icon?: string,
  life?: number,
  energy?: number,
  element?: string,
  weapon?: string,
  camp?: string,
  title?: string,
  story?: string,
}

interface MiyousheDeck {
  deckId?: number | string,
  ext: string | any,
  title: string,
  summary: string,
  icon: string,
  content_id?: string,
}