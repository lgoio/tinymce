/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Option, Options } from '@ephox/katamari';
import { getAll as getAllOxide } from '@tinymce/oxide-icons-default';
import I18n from 'tinymce/core/api/util/I18n';

export type IconProvider = () => Record<string, string>;

const defaultIcons = getAllOxide();
const defaultIcon = Option.from(defaultIcons['temporary-placeholder']).getOr('!not found!');

const getDefault = (name: string): string => {
  const translationName = name + '_icon';
  const translatedIcon = I18n.translate(translationName);
  if (translatedIcon === translationName) {
    return Option.from(defaultIcons[name]).getOr(defaultIcon);
  } else {
    return Option.from(translatedIcon).getOr(defaultIcon);
  }
};

const getDefaultOr = (name: string, fallback: Option<string>): string => {
  const translationName = name + '_icon';
  const translatedIcon = I18n.translate(translationName);
  if (translatedIcon === translationName) {
    return Option.from(defaultIcons[name]).getOrThunk(() => fallback.getOr(defaultIcon));
  } else {
    return Option.from(translatedIcon).getOrThunk(() => fallback.getOr(defaultIcon));
  }
};

const get = (name: string, icons: IconProvider): string => {
  return Option.from(icons()[name]).getOrThunk(() => getDefault(name));
};

const getOr = (name: string, icons: IconProvider, fallback: Option<string>): string => {
  return Option.from(icons()[name]).getOrThunk(() => getDefaultOr(name, fallback));
};

const getDefaultFirst = (names: string[]): string => {
  return Options.findMap(names, (name) => {
    const translationName = name + '_icon';
    const translatedIcon = I18n.translate(translationName);
    if (translatedIcon === translationName) {
     return Option.from(defaultIcons[name]);
    } else {
     return Option.from(translatedIcon);
    }
  }).getOr(defaultIcon);
};

const getFirst = (names: string[], icons: IconProvider): string => {
  return Options.findMap(names, (name) => Option.from(icons()[name])).getOrThunk(() => getDefaultFirst(names));
};

export {
  getFirst,
  getOr,
  get
};